import { useState, useEffect, useMemo } from "react";
import "./App.css";
import LyricsDisplay from "./components/LyricsDisplay";
import MetroMap from "./components/MetroMap";
import { metroLyrics } from "./data/lyrics";

// Types pour les paroles et les stations
export interface StationMention {
  name: string;
  timestamp: number; // Moment exact où la station est mentionnée
}

export interface LyricLine {
  text: string;
  startTime: number;
  endTime: number;
  stations: StationMention[];
}

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Paroles complètes de la chanson
  const lyrics = useMemo(() => metroLyrics, []);

  // Mise à jour du temps de lecture
  useEffect(() => {
    let interval: number | undefined;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => prev + 0.1);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Calcul des stations en surbrillance selon le temps (animation de 1.5s)
  const highlightedStations = useMemo(() => {
    const ANIMATION_DURATION = 1.5; // durée de l'animation en secondes
    const activeStations: string[] = [];

    lyrics.forEach((line) => {
      line.stations.forEach((station) => {
        const timeSinceStation = currentTime - station.timestamp;
        // La station est visible si elle vient d'être mentionnée (dans les 1.5s)
        if (timeSinceStation >= 0 && timeSinceStation <= ANIMATION_DURATION) {
          activeStations.push(station.name);
        }
      });
    });

    return activeStations;
  }, [currentTime, lyrics]);

  return (
    <div className="app">
      <main className="app-main">
        <section className="lyrics-section">
          <LyricsDisplay lyrics={lyrics} currentTime={currentTime} />
        </section>

        <section className="controls-section">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="play-button"
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={() => setCurrentTime(0)} className="reset-button">
            ⏮ Reset
          </button>
          <div className="time-display">Temps: {currentTime.toFixed(1)}s</div>
        </section>

        <section className="map-section">
          <MetroMap highlightedStations={highlightedStations} />
        </section>
      </main>
    </div>
  );
}

export default App;

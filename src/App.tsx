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

  // Durée totale de la chanson (en secondes)
  const totalDuration =
    lyrics.length > 0 ? lyrics[lyrics.length - 1].endTime : 217;

  // Gestion du changement de position via la barre de progression
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseFloat(e.target.value));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Calcul du pourcentage de progression pour le gradient
  const progressPercentage = (currentTime / totalDuration) * 100;

  // Gestion du plein écran
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="app">
      {/* Bouton Play/Pause flottant en haut à gauche */}
      <button
        onClick={togglePlayPause}
        className="floating-play-button"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>

      {/* Bouton Plein écran en haut à droite */}
      <button
        onClick={toggleFullscreen}
        className="floating-fullscreen-button"
        aria-label="Plein écran"
      >
        ⛶
      </button>

      <main className="app-main">
        <section className="lyrics-section">
          <LyricsDisplay lyrics={lyrics} currentTime={currentTime} />
        </section>

        {/* Barre de progression entre les deux blocs */}
        <div className="progress-divider">
          <input
            type="range"
            min="0"
            max={totalDuration}
            step="0.1"
            value={currentTime}
            onChange={handleProgressChange}
            className="progress-slider"
            style={{
              background: `linear-gradient(to right, #667eea 0%, #764ba2 ${progressPercentage}%, #e0e0e0 ${progressPercentage}%, #e0e0e0 100%)`,
            }}
          />
          <div className="progress-time">{currentTime.toFixed(1)}s</div>
        </div>

        <section className="map-section">
          <MetroMap highlightedStations={highlightedStations} />
        </section>
      </main>
    </div>
  );
}

export default App;

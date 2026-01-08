import { useState, useEffect, useMemo, useRef } from "react";
import "./App.css";
import LyricsDisplay from "./components/LyricsDisplay";
import MetroMap from "./components/MetroMap";
import { metroLyrics } from "./data/lyrics";
import "./utils/adjustTimings"; // Expose les fonctions dans la console

// Types pour les paroles et les stations
export interface StationMention {
  name: string;
  timestamp: number; // Temps relatif (en secondes) par rapport au startTime de la ligne
}

export interface LyricLine {
  text: string;
  startTime: number;
  stations: StationMention[];
}

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Mode édition de timing
  const [timingEditMode, setTimingEditMode] = useState(false);
  const [editedLyrics, setEditedLyrics] = useState<LyricLine[]>(metroLyrics);

  // Paroles complètes de la chanson (édité ou original)
  const lyrics = useMemo(
    () => (timingEditMode ? editedLyrics : metroLyrics),
    [timingEditMode, editedLyrics]
  );

  // Synchronisation avec l'audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Gestion Play/Pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("Erreur lors de la lecture:", error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Gestion de la touche Espace pour Play/Pause et Ctrl+R pour le mode édition
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }

      // Activer/désactiver le mode édition avec Ctrl+R
      if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        setTimingEditMode((prev) => !prev);
        console.log(
          `Mode édition timing: ${!timingEditMode ? "ACTIVÉ" : "DÉSACTIVÉ"}`
        );
      }

      // Exporter les modifications avec Ctrl+Shift+R
      if (e.ctrlKey && e.shiftKey && e.key === "R") {
        e.preventDefault();
        exportTimings();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [timingEditMode]);

  // Fonction pour exporter les timings modifiés
  const exportTimings = () => {
    const output = JSON.stringify(editedLyrics, null, 2);
    console.log("=== TIMINGS MODIFIÉS ===");
    console.log(`export const metroLyrics: LyricLine[] = ${output};`);

    // Copier dans le presse-papier
    navigator.clipboard
      .writeText(`export const metroLyrics: LyricLine[] = ${output};`)
      .then(() => {
        alert("Timings copiés dans le presse-papier !");
      });
  };

  // Fonctions pour ajuster les timings
  const adjustLineStartTime = (lineIndex: number, delta: number) => {
    setEditedLyrics((prev) => {
      const newLyrics = [...prev];
      newLyrics[lineIndex] = {
        ...newLyrics[lineIndex],
        startTime: Math.max(0, newLyrics[lineIndex].startTime + delta),
      };
      return newLyrics;
    });
  };

  const adjustStationTimestamp = (
    lineIndex: number,
    stationIndex: number,
    delta: number
  ) => {
    setEditedLyrics((prev) => {
      const newLyrics = [...prev];
      const newStations = [...newLyrics[lineIndex].stations];
      newStations[stationIndex] = {
        ...newStations[stationIndex],
        timestamp: Math.max(0, newStations[stationIndex].timestamp + delta),
      };
      newLyrics[lineIndex] = {
        ...newLyrics[lineIndex],
        stations: newStations,
      };
      return newLyrics;
    });
  };

  // Décaler toutes les lignes à partir d'un index
  const shiftFromLine = (fromIndex: number, delta: number) => {
    setEditedLyrics((prev) => {
      const newLyrics = [...prev];
      for (let i = fromIndex; i < newLyrics.length; i++) {
        newLyrics[i] = {
          ...newLyrics[i],
          startTime: Math.max(0, newLyrics[i].startTime + delta),
        };
      }
      console.log(
        `✅ Décalé ${newLyrics.length - fromIndex} lignes de ${
          delta > 0 ? "+" : ""
        }${delta}s à partir de l'index ${fromIndex}`
      );
      return newLyrics;
    });
  };

  const handleSeek = (delta: number) => {
    const newTime = Math.max(0, currentTime + delta);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Calcul des stations en surbrillance selon le temps (animation de 1.5s)
  // et accumulation des stations révélées (permanent)
  const { highlightedStations, revealedStations } = useMemo(() => {
    const ANIMATION_DURATION = 1.5; // durée de l'animation en secondes
    const activeStations: string[] = [];
    const allRevealedStations: string[] = [];

    lyrics.forEach((line) => {
      line.stations.forEach((station) => {
        // Calculer le timestamp absolu : startTime de la ligne + timestamp relatif
        const absoluteTimestamp = line.startTime + station.timestamp;
        const timeSinceStation = currentTime - absoluteTimestamp;

        // La station est en animation si elle vient d'être mentionnée (dans les 1.5s)
        if (timeSinceStation >= 0 && timeSinceStation <= ANIMATION_DURATION) {
          activeStations.push(station.name);
        }

        // La station est révélée (carte en couleur) si elle a déjà été mentionnée
        if (timeSinceStation >= 0) {
          allRevealedStations.push(station.name);
        }
      });
    });

    return {
      highlightedStations: activeStations,
      revealedStations: allRevealedStations,
    };
  }, [currentTime, lyrics]);

  // Durée totale de la chanson (en secondes) - on ajoute ~5s après la dernière ligne
  const totalDuration =
    lyrics.length > 0 ? lyrics[lyrics.length - 1].startTime + 5 : 217;

  // Gestion du changement de position via la barre de progression
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
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
      {/* Audio HTML5 invisible */}
      <audio ref={audioRef} src="/JAVA-metro.mp3" preload="auto" />

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

      {/* Indicateur mode édition timing */}
      {timingEditMode && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "120px",
            background: "rgba(102, 126, 234, 0.95)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            zIndex: 2000,
            fontWeight: "bold",
            fontSize: "14px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          ⏱️ MODE ÉDITION TIMING
          <br />
          <small style={{ fontSize: "11px", opacity: 0.95 }}>
            Ctrl+Shift+R pour exporter | Espace pour Play/Pause
          </small>
        </div>
      )}

      <main className="app-main">
        <section className="lyrics-section">
          <LyricsDisplay
            lyrics={lyrics}
            currentTime={currentTime}
            timingEditMode={timingEditMode}
            onAdjustLineStartTime={adjustLineStartTime}
            onAdjustStationTimestamp={adjustStationTimestamp}
            onSeek={handleSeek}
            onShiftFromLine={shiftFromLine}
            isPlaying={isPlaying}
            onTogglePlayPause={togglePlayPause}
          />
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
          <MetroMap
            highlightedStations={highlightedStations}
            revealedStations={revealedStations}
          />
        </section>
      </main>
    </div>
  );
}

export default App;

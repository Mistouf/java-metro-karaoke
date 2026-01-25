import type { LyricLine } from "../App";
import "./LyricsDisplay.css";

interface LyricsDisplayProps {
  lyrics: LyricLine[];
  currentTime: number;
  timingEditMode?: boolean;
  onAdjustLineStartTime?: (lineIndex: number, delta: number) => void;
  onAdjustStationTimestamp?: (
    lineIndex: number,
    stationIndex: number,
    delta: number
  ) => void;
  onSeek?: (delta: number) => void;
  onShiftFromLine?: (lineIndex: number, delta: number) => void;
  onShiftNextToCurrentTime?: (currentLineIndex: number) => void;
  isPlaying?: boolean;
  onTogglePlayPause?: () => void;
}

function LyricsDisplay({
  lyrics,
  currentTime,
  timingEditMode = false,
  onAdjustLineStartTime,
  onAdjustStationTimestamp,
  onSeek,
  onShiftFromLine,
  onShiftNextToCurrentTime,
  isPlaying = false,
  onTogglePlayPause,
}: LyricsDisplayProps) {
  // Trouver la ligne courante en comparant avec le startTime de la ligne suivante
  const currentLineIndex = lyrics.findIndex((line, index) => {
    const nextLine = lyrics[index + 1];
    return (
      currentTime >= line.startTime &&
      (!nextLine || currentTime < nextLine.startTime)
    );
  });

  const currentLine = currentLineIndex >= 0 ? lyrics[currentLineIndex] : null;

  if (!currentLine) {
    return (
      <div className="lyrics-container">
        <div className="lyric-line waiting">
          <p>Prêt à commencer...</p>
        </div>
      </div>
    );
  }

  // Fonction pour surligner les noms de stations dans le texte
  const renderTextWithStations = () => {
    const text = currentLine.text;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Trier les stations par ordre d'apparition dans le texte
    const sortedStations = [...currentLine.stations].sort((a, b) => {
      const indexA = text.indexOf(a.name);
      const indexB = text.indexOf(b.name);
      return indexA - indexB;
    });

    sortedStations.forEach((station, idx) => {
      const stationIndex = text.indexOf(station.name, lastIndex);

      if (stationIndex !== -1) {
        // Ajouter le texte avant la station
        if (stationIndex > lastIndex) {
          parts.push(
            <span key={`text-${idx}`}>
              {text.substring(lastIndex, stationIndex)}
            </span>
          );
        }

        // Ajouter la station avec le style RATP
        parts.push(
          <span key={`station-${idx}`} className="station-inline">
            {station.name}
          </span>
        );

        lastIndex = stationIndex + station.name.length;
      }
    });

    // Ajouter le reste du texte
    if (lastIndex < text.length) {
      parts.push(<span key="text-end">{text.substring(lastIndex)}</span>);
    }

    return parts;
  };

  return (
    <div className="lyrics-container">
      <div className="lyric-line active">
        <p className="lyric-text">{renderTextWithStations()}</p>

        {/* Contrôles d'édition en mode timing */}
        {timingEditMode && onAdjustLineStartTime && (
          <div
            style={{
              marginTop: "12px",
              padding: "12px",
              background: "rgba(102, 126, 234, 0.1)",
              borderRadius: "6px",
              border: "2px solid #667eea",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              {onTogglePlayPause && (
                <button
                  onClick={onTogglePlayPause}
                  style={{
                    padding: "10px 16px",
                    background: isPlaying ? "#764ba2" : "#667eea",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "20px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>
              )}
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#003CA6",
                }}
              >
                ⏱ {currentTime.toFixed(1)}s
              </div>
              {onSeek && (
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => onSeek(-1)}
                    style={{
                      padding: "8px 12px",
                      background: "#d32f2f",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                    title="Reculer de 1 seconde"
                  >
                    ◀◀◀ -1s
                  </button>
                  <button
                    onClick={() => onSeek(-0.5)}
                    style={{
                      padding: "8px 12px",
                      background: "#f57c00",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                    title="Reculer de 0,5 seconde"
                  >
                    ◀◀ -0.5s
                  </button>
                  <button
                    onClick={() => onSeek(-0.2)}
                    style={{
                      padding: "8px 12px",
                      background: "#fbc02d",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                    title="Reculer de 0,2 seconde"
                  >
                    ◀ -0.2s
                  </button>
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <strong style={{ color: "#003CA6", minWidth: "120px" }}>
                Ligne #{currentLineIndex} : {currentLine.startTime.toFixed(1)}s
              </strong>
              <button
                onClick={() => onAdjustLineStartTime(currentLineIndex, -0.1)}
                style={{
                  padding: "6px 12px",
                  background: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                ◀ -0.1s
              </button>
              <button
                onClick={() => onAdjustLineStartTime(currentLineIndex, +0.1)}
                style={{
                  padding: "6px 12px",
                  background: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                +0.1s ▶
              </button>
              <button
                onClick={() => onAdjustLineStartTime(currentLineIndex, -0.5)}
                style={{
                  padding: "6px 12px",
                  background: "#764ba2",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                ◀◀ -0.5s
              </button>
              <button
                onClick={() => onAdjustLineStartTime(currentLineIndex, +0.5)}
                style={{
                  padding: "6px 12px",
                  background: "#764ba2",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                +0.5s ▶▶
              </button>
            </div>

            {/* Boutons pour décaler toutes les lignes suivantes */}
            {onShiftFromLine && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  marginBottom: "12px",
                  paddingTop: "8px",
                  borderTop: "1px solid rgba(102, 126, 234, 0.3)",
                }}
              >
                <strong
                  style={{
                    color: "#c62828",
                    fontSize: "11px",
                    minWidth: "120px",
                  }}
                >
                  Décaler lignes suivantes:
                </strong>
                <button
                  onClick={() => onShiftFromLine(currentLineIndex + 1, -1)}
                  style={{
                    padding: "5px 10px",
                    background: "#c62828",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                  title="Décaler toutes les lignes suivantes de -1s"
                >
                  ⬅⬅⬅ -1s
                </button>
                <button
                  onClick={() => onShiftFromLine(currentLineIndex + 1, -0.5)}
                  style={{
                    padding: "5px 10px",
                    background: "#d32f2f",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                  title="Décaler toutes les lignes suivantes de -0.5s"
                >
                  ⬅⬅ -0.5s
                </button>
                <button
                  onClick={() => onShiftFromLine(currentLineIndex + 1, -0.1)}
                  style={{
                    padding: "5px 10px",
                    background: "#e53935",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                  title="Décaler toutes les lignes suivantes de -0.1s"
                >
                  ⬅ -0.1s
                </button>
                <button
                  onClick={() => onShiftFromLine(currentLineIndex + 1, +0.1)}
                  style={{
                    padding: "5px 10px",
                    background: "#43a047",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                  title="Décaler toutes les lignes suivantes de +0.1s"
                >
                  +0.1s ➡
                </button>
                <button
                  onClick={() => onShiftFromLine(currentLineIndex + 1, +0.5)}
                  style={{
                    padding: "5px 10px",
                    background: "#388e3c",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                  title="Décaler toutes les lignes suivantes de +0.5s"
                >
                  +0.5s ➡➡
                </button>
                <button
                  onClick={() => onShiftFromLine(currentLineIndex + 1, +1)}
                  style={{
                    padding: "5px 10px",
                    background: "#2e7d32",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                  title="Décaler toutes les lignes suivantes de +1s"
                >
                  +1s ➡➡➡
                </button>
              </div>
            )}

            {/* Bouton rapide : aligner prochaines lignes au temps courant */}
            {onShiftNextToCurrentTime && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "12px",
                  paddingTop: "8px",
                  borderTop: "1px solid rgba(102, 126, 234, 0.3)",
                }}
              >
                <button
                  onClick={() => onShiftNextToCurrentTime(currentLineIndex)}
                  style={{
                    padding: "10px 20px",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "bold",
                    boxShadow: "0 3px 10px rgba(102, 126, 234, 0.4)",
                    transition: "all 0.2s",
                  }}
                  title="Décaler les lignes suivantes pour que la prochaine commence au temps actuel"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 5px 15px rgba(102, 126, 234, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 3px 10px rgba(102, 126, 234, 0.4)";
                  }}
                >
                  🎯 ALIGNER PROCHAINE LIGNE AU TEMPS ACTUEL
                </button>
              </div>
            )}

            {/* Contrôles pour chaque station */}
            {currentLine.stations.length > 0 && onAdjustStationTimestamp && (
              <div style={{ marginTop: "8px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    marginBottom: "6px",
                    fontWeight: "600",
                  }}
                >
                  Stations (temps relatif) :
                </div>
                {currentLine.stations.map((station, stationIdx) => (
                  <div
                    key={stationIdx}
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      marginBottom: "6px",
                      fontSize: "11px",
                    }}
                  >
                    <span
                      style={{
                        minWidth: "180px",
                        color: "#003CA6",
                        fontWeight: "500",
                      }}
                    >
                      {station.name} : +{station.timestamp.toFixed(1)}s →{" "}
                      {(currentLine.startTime + station.timestamp).toFixed(1)}s
                    </span>
                    <button
                      onClick={() =>
                        onAdjustStationTimestamp(
                          currentLineIndex,
                          stationIdx,
                          -0.1
                        )
                      }
                      style={{
                        padding: "4px 8px",
                        background: "#667eea",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontSize: "10px",
                      }}
                    >
                      -0.1s
                    </button>
                    <button
                      onClick={() =>
                        onAdjustStationTimestamp(
                          currentLineIndex,
                          stationIdx,
                          +0.1
                        )
                      }
                      style={{
                        padding: "4px 8px",
                        background: "#667eea",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontSize: "10px",
                      }}
                    >
                      +0.1s
                    </button>
                    <button
                      onClick={() =>
                        onAdjustStationTimestamp(
                          currentLineIndex,
                          stationIdx,
                          -0.5
                        )
                      }
                      style={{
                        padding: "4px 8px",
                        background: "#764ba2",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontSize: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      -0.5s
                    </button>
                    <button
                      onClick={() =>
                        onAdjustStationTimestamp(
                          currentLineIndex,
                          stationIdx,
                          +0.5
                        )
                      }
                      style={{
                        padding: "4px 8px",
                        background: "#764ba2",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontSize: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      +0.5s
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LyricsDisplay;

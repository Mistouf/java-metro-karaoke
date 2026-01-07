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
}

function LyricsDisplay({
  lyrics,
  currentTime,
  timingEditMode = false,
  onAdjustLineStartTime,
  onAdjustStationTimestamp,
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
                  Stations :
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
                      {station.name} : {station.timestamp.toFixed(1)}s
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

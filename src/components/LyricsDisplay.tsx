import type { LyricLine } from "../App";
import "./LyricsDisplay.css";

interface LyricsDisplayProps {
  lyrics: LyricLine[];
  currentTime: number;
}

function LyricsDisplay({ lyrics, currentTime }: LyricsDisplayProps) {
  // Trouver la ligne courante
  const currentLine = lyrics.find(
    (line) => currentTime >= line.startTime && currentTime < line.endTime
  );

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
      </div>
    </div>
  );
}

export default LyricsDisplay;

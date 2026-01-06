import { useEffect, useRef, useState } from "react";
import "./MetroMap.css";
import { stationMapping } from "../data/metroData";
import { stationCoordinates } from "../data/stationCoordinates";

interface MetroMapProps {
  highlightedStations: string[];
}

function MetroMap({ highlightedStations }: MetroMapProps) {
  const grayImageRef = useRef<HTMLImageElement>(null);
  const colorImageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState({
    gray: false,
    color: false,
  });

  // Mapper les noms de la chanson vers les vrais noms de stations
  const mappedHighlightedStations = highlightedStations.map(
    (station) => stationMapping[station] || station
  );

  // Obtenir les coordonnées des stations (pas besoin de mise à l'échelle, le viewBox s'en occupe)
  const circles = mappedHighlightedStations
    .map((stationName) => {
      const coords = stationCoordinates[stationName];
      if (!coords) return null;
      return {
        x: coords.x,
        y: coords.y,
      };
    })
    .filter((coord): coord is { x: number; y: number } => coord !== null);

  return (
    <div className="metro-map-container" ref={containerRef}>
      {/* Plan en niveaux de gris (fond) */}
      <img
        ref={grayImageRef}
        src="/Carte_Métro_de_Paris.svg"
        alt="Plan du métro de Paris"
        className="metro-image metro-image-gray"
        onLoad={() => setImagesLoaded((prev) => ({ ...prev, gray: true }))}
      />

      {/* Plan en couleur avec masque circulaire */}
      <svg className="metro-svg-overlay" viewBox="0 0 7529.0861 5257.141">
        <defs>
          <mask id="circle-mask">
            {/* Fond noir (invisible) */}
            <rect width="100%" height="100%" fill="black" />
            {/* Cercles blancs (visibles) pour révéler le plan couleur */}
            {circles.map((circle, index) => (
              <circle
                key={index}
                cx={circle.x}
                cy={circle.y}
                r="150"
                fill="white"
                className="reveal-circle"
              />
            ))}
          </mask>
        </defs>

        {/* Image en couleur avec le masque appliqué */}
        <image
          ref={colorImageRef}
          href="/Carte_Métro_de_Paris.svg"
          width="7529.0861"
          height="5257.141"
          mask="url(#circle-mask)"
          onLoad={() => setImagesLoaded((prev) => ({ ...prev, color: true }))}
        />
      </svg>

      {/* Cercles décoratifs pour l'animation */}
      <svg className="metro-svg-overlay" viewBox="0 0 7529.0861 5257.141">
        {circles.map((circle, index) => (
          <g key={index}>
            {/* Cercle externe avec animation */}
            <circle
              cx={circle.x}
              cy={circle.y}
              r="120"
              fill="rgba(255, 51, 102, 0.2)"
              stroke="#FF3366"
              strokeWidth="12"
              className="station-circle"
            />
            {/* Point central */}
            <circle
              cx={circle.x}
              cy={circle.y}
              r="30"
              fill="#FF3366"
              className="station-dot"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

export default MetroMap;

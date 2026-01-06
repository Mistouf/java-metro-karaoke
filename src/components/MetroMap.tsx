import { useEffect, useRef, useState } from "react";
import "./MetroMap.css";
import { stationMapping } from "../data/metroData";
import { stationCoordinates } from "../data/stationCoordinates";

interface MetroMapProps {
  highlightedStations: string[];
}

// Mode édition : activé avec Ctrl+E (à retirer en production)
const EDIT_MODE_ENABLED = true;

function MetroMap({ highlightedStations }: MetroMapProps) {
  const grayImageRef = useRef<HTMLImageElement>(null);
  const colorImageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [imagesLoaded, setImagesLoaded] = useState({
    gray: false,
    color: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [customCoords, setCustomCoords] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [draggingStation, setDraggingStation] = useState<string | null>(null);

  // Activer/désactiver le mode édition avec Ctrl+E
  useEffect(() => {
    if (!EDIT_MODE_ENABLED) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "e") {
        e.preventDefault();
        setEditMode((prev) => !prev);
        console.log(`Mode édition: ${!editMode ? "ACTIVÉ" : "DÉSACTIVÉ"}`);
      }

      // Exporter les coordonnées avec Ctrl+Shift+E
      if (e.ctrlKey && e.shiftKey && e.key === "E") {
        e.preventDefault();
        exportCoordinates();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [editMode, customCoords]);

  // Exporter les coordonnées modifiées
  const exportCoordinates = () => {
    const updatedCoords = { ...stationCoordinates, ...customCoords };
    const output = JSON.stringify(updatedCoords, null, 2);
    console.log("=== COORDONNÉES MISES À JOUR ===");
    console.log(output);

    // Copier dans le presse-papier
    navigator.clipboard.writeText(output).then(() => {
      alert("Coordonnées copiées dans le presse-papier !");
    });
  };

  // Gérer le drag des cercles
  const handleMouseDown = (stationName: string) => {
    if (!editMode) return;
    setDraggingStation(stationName);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!editMode || !draggingStation || !svgRef.current) return;

    // Convertir les coordonnées de la souris en coordonnées SVG
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    setCustomCoords((prev) => ({
      ...prev,
      [draggingStation]: { x: svgP.x, y: svgP.y },
    }));
  };

  const handleMouseUp = () => {
    if (draggingStation && customCoords[draggingStation]) {
      const coords = customCoords[draggingStation];
      console.log(
        `Station "${draggingStation}": { x: ${coords.x.toFixed(
          4
        )}, y: ${coords.y.toFixed(4)} }`
      );
    }
    setDraggingStation(null);
  };

  // Mapper les noms de la chanson vers les vrais noms de stations
  const mappedHighlightedStations = highlightedStations.map(
    (station) => stationMapping[station] || station
  );

  // Obtenir les coordonnées des stations (avec les coordonnées custom si elles existent)
  const circles = mappedHighlightedStations
    .map((stationName) => {
      const coords =
        customCoords[stationName] || stationCoordinates[stationName];
      if (!coords) return null;
      return {
        name: stationName,
        x: coords.x,
        y: coords.y,
      };
    })
    .filter(
      (coord): coord is { name: string; x: number; y: number } => coord !== null
    );

  return (
    <div className="metro-map-container" ref={containerRef}>
      {/* Indicateur mode édition */}
      {EDIT_MODE_ENABLED && editMode && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(255, 51, 102, 0.9)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            zIndex: 1000,
            fontWeight: "bold",
            fontSize: "14px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          🔧 MODE ÉDITION
          <br />
          <small style={{ fontSize: "11px", opacity: 0.9 }}>
            Déplacez les cercles | Ctrl+Shift+E pour exporter
          </small>
        </div>
      )}

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
      <svg
        ref={svgRef}
        className="metro-svg-overlay"
        viewBox="0 0 7529.0861 5257.141"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: editMode ? "crosshair" : "default" }}
      >
        {circles.map((circle, index) => (
          <g
            key={index}
            onMouseDown={() => handleMouseDown(circle.name)}
            style={{ cursor: editMode ? "move" : "default" }}
          >
            {/* Cercle externe avec animation */}
            <circle
              cx={circle.x}
              cy={circle.y}
              r="200"
              fill="rgba(255, 51, 102, 0.2)"
              stroke="#FF3366"
              strokeWidth="15"
              className="station-circle"
              style={{ pointerEvents: editMode ? "all" : "none" }}
            />
            {/* Point central */}
            <circle
              cx={circle.x}
              cy={circle.y}
              r="25"
              fill={editMode ? "#FF3366" : "#FF336600"}
              className="station-dot"
              style={{ pointerEvents: editMode ? "all" : "none" }}
            />
            {/* Label pour le mode édition */}
            {editMode && (
              <text
                x={circle.x}
                y={circle.y - 220}
                textAnchor="middle"
                fill="#FF3366"
                fontSize="80"
                fontWeight="bold"
                style={{
                  pointerEvents: "none",
                  textShadow: "0 0 3px white, 0 0 3px white, 0 0 3px white",
                }}
              >
                {circle.name}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

export default MetroMap;

import { useEffect, useRef, useState } from "react";
import "./MetroMap.css";
import { stationMapping } from "../data/metroData";
import { stationCoordinates } from "../data/stationCoordinates";

interface MetroMapProps {
  highlightedStations: string[]; // Stations en cours d'animation (cercles)
  revealedStations: string[]; // Stations déjà révélées (carte en couleur)
}

// Mode édition : activé avec Ctrl+E (à retirer en production)
const EDIT_MODE_ENABLED = true;

// Dimensions du viewBox original
const ORIGINAL_WIDTH = 7529.0861;
const ORIGINAL_HEIGHT = 5257.141;

// Zone zoomée calculée à partir des stations intra-muros et portes du périphérique
// Limites: stations entre X:2884 et X:6596, Y:650 et Y:4498
// Sans marge
const ZOOM_X = 2885;
const ZOOM_Y = 650;
const ZOOM_WIDTH = 3712;
const ZOOM_HEIGHT = 3849;

function MetroMap({ highlightedStations, revealedStations }: MetroMapProps) {
  const grayImageRef = useRef<HTMLImageElement>(null);
  const colorImageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [imagesLoaded, setImagesLoaded] = useState({
    gray: false,
    color: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [zoomMode, setZoomMode] = useState(false);
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
  const mappedHighlightedStations = highlightedStations.map((station) => {
    const mappedName = stationMapping[station];
    if (!mappedName) {
      console.warn(
        `⚠️ Station "${station}" non trouvée dans le mapping - utilisation du nom brut`
      );
    }
    return mappedName || station;
  });

  const mappedRevealedStations = revealedStations.map((station) => {
    const mappedName = stationMapping[station];
    if (!mappedName) {
      console.warn(
        `⚠️ Station "${station}" non trouvée dans le mapping - utilisation du nom brut`
      );
    }
    return mappedName || station;
  });

  // Calculer le viewBox selon le mode zoom
  const viewBox = zoomMode
    ? `${ZOOM_X} ${ZOOM_Y} ${ZOOM_WIDTH} ${ZOOM_HEIGHT}`
    : `0 0 ${ORIGINAL_WIDTH} ${ORIGINAL_HEIGHT}`;

  // Limites du viewBox en mode zoom
  const zoomBounds = zoomMode
    ? {
        minX: ZOOM_X,
        maxX: ZOOM_X + ZOOM_WIDTH,
        minY: ZOOM_Y,
        maxY: ZOOM_Y + ZOOM_HEIGHT,
      }
    : null;

  // Fonction pour contraindre une position aux bords du viewBox
  const constrainToViewBox = (x: number, y: number) => {
    if (!zoomBounds) return { x, y };

    let constrainedX = x;
    let constrainedY = y;
    let isConstrained = false;

    if (x < zoomBounds.minX) {
      constrainedX = zoomBounds.minX + 100;
      isConstrained = true;
    } else if (x > zoomBounds.maxX) {
      constrainedX = zoomBounds.maxX - 100;
      isConstrained = true;
    }

    if (y < zoomBounds.minY) {
      constrainedY = zoomBounds.minY + 100;
      isConstrained = true;
    } else if (y > zoomBounds.maxY) {
      constrainedY = zoomBounds.maxY - 100;
      isConstrained = true;
    }

    return { x: constrainedX, y: constrainedY, isConstrained };
  };

  // Cercles d'animation (stations en cours d'animation seulement)
  const circles = mappedHighlightedStations
    .map((stationName) => {
      const coords =
        customCoords[stationName] || stationCoordinates[stationName];
      if (!coords) {
        console.error(
          `❌ Impossible d'animer la station "${stationName}" : coordonnées introuvables dans stationCoordinates`
        );
        return null;
      }

      // En mode zoom, contraindre les positions au bord si hors du cadre
      const adjusted = zoomMode
        ? constrainToViewBox(coords.x, coords.y)
        : { x: coords.x, y: coords.y, isConstrained: false };

      if (adjusted.isConstrained) {
        console.info(
          `ℹ️ Station "${stationName}" hors du cadre zoom - position contrainte aux bords (${coords.x.toFixed(
            0
          )}, ${coords.y.toFixed(0)}) → (${adjusted.x.toFixed(
            0
          )}, ${adjusted.y.toFixed(0)})`
        );
      }

      return {
        name: stationName,
        x: adjusted.x,
        y: adjusted.y,
        isConstrained: adjusted.isConstrained || false,
      };
    })
    .filter(
      (
        coord
      ): coord is {
        name: string;
        x: number;
        y: number;
        isConstrained: boolean;
      } => coord !== null
    );

  // Toutes les stations révélées (pour le masque de la carte en couleur)
  const revealedCircles = mappedRevealedStations
    .map((stationName) => {
      const coords =
        customCoords[stationName] || stationCoordinates[stationName];
      if (!coords) {
        console.error(
          `❌ Impossible de révéler la station "${stationName}" : coordonnées introuvables dans stationCoordinates`
        );
        return null;
      }

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
      {/* Bouton Zoom/Dézoom */}
      <button
        onClick={() => setZoomMode(!zoomMode)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: zoomMode ? "#667eea" : "rgba(255, 255, 255, 0.9)",
          color: zoomMode ? "white" : "#333",
          border: zoomMode ? "none" : "2px solid #667eea",
          padding: "12px 24px",
          borderRadius: "8px",
          zIndex: 1000,
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
        aria-label={zoomMode ? "Dézoom" : "Zoom Paris intramuros"}
      >
        {zoomMode ? "🔍 Dézoom" : "🔍 Zoom"}
      </button>

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

      {/* Plan en niveaux de gris (fond) - en SVG pour supporter le viewBox */}
      <svg
        className="metro-svg-overlay"
        viewBox={viewBox}
        style={{ zIndex: 1 }}
      >
        <image
          ref={grayImageRef}
          href="/Carte_Métro_de_Paris.svg"
          width="7529.0861"
          height="5257.141"
          style={{ filter: "grayscale(100%)" }}
          onLoad={() => setImagesLoaded((prev) => ({ ...prev, gray: true }))}
        />
      </svg>

      {/* Plan en couleur avec masque circulaire */}
      <svg className="metro-svg-overlay" viewBox={viewBox}>
        <defs>
          <mask id="circle-mask">
            {/* Fond noir (invisible) */}
            <rect width="100%" height="100%" fill="black" />
            {/* Cercles blancs (visibles) pour révéler le plan couleur - toutes les stations révélées */}
            {revealedCircles.map((circle, index) => (
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
        viewBox={viewBox}
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
              fill="rgba(0, 60, 166, 0.3)"
              stroke="#003CA6"
              strokeWidth="18"
              className="station-circle"
              style={{ pointerEvents: editMode ? "all" : "none" }}
            />
            {/* Point central */}
            <circle
              cx={circle.x}
              cy={circle.y}
              r="30"
              fill={editMode ? "#003CA6" : "#003CA600"}
              className="station-dot"
              style={{ pointerEvents: editMode ? "all" : "none" }}
            />
            {/* Label pour le mode édition OU si station contrainte aux bords */}
            {(editMode || circle.isConstrained) && (
              <text
                x={circle.x}
                y={circle.y - 220}
                textAnchor="middle"
                fill={circle.isConstrained ? "#667eea" : "#FF3366"}
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

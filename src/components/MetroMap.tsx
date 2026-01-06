import { useEffect, useRef, useState } from "react";
import "./MetroMap.css";
import { stationMapping } from "../data/metroData";

interface MetroMapProps {
  highlightedStations: string[];
}

function MetroMap({ highlightedStations }: MetroMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Coordonnées approximatives des stations sur le plan du métro parisien (en pixels)
  // Ces coordonnées devront être ajustées en fonction de la taille réelle de l'image SVG
  const stationCoordinates: { [key: string]: { x: number; y: number } } = {
    "Marx Dormoy": { x: 580, y: 220 },
    Belleville: { x: 750, y: 380 },
    "Porte de la Chapelle": { x: 620, y: 150 },
    "Jacques Bonsergent": { x: 700, y: 350 },
    "Gare de Lyon": { x: 820, y: 550 },
    Monceau: { x: 520, y: 350 },
    "Place de Clichy": { x: 480, y: 280 },
    Vavin: { x: 600, y: 530 },
    "Filles du Calvaire": { x: 730, y: 420 },
    "Porte de Clignancourt": { x: 550, y: 150 },
    Cité: { x: 650, y: 480 },
    "Malakoff - Plateau de Vanves": { x: 420, y: 650 },
    "Pont de Levallois - Bécon": { x: 350, y: 280 },
    Passy: { x: 380, y: 480 },
    Gallieni: { x: 950, y: 440 },
    "Porte d'Orléans": { x: 550, y: 720 },
    Ternes: { x: 450, y: 350 },
    Pasteur: { x: 520, y: 560 },
    Bérault: { x: 920, y: 470 },
    "Pont de Sèvres": { x: 280, y: 580 },
    Iéna: { x: 420, y: 450 },
    "Montparnasse - Bienvenüe": { x: 550, y: 570 },
    "Rue de la Pompe": { x: 380, y: 420 },
    Picpus: { x: 850, y: 520 },
    "La Motte-Picquet - Grenelle": { x: 450, y: 520 },
    Montgallet: { x: 820, y: 540 },
    Châtelet: { x: 680, y: 460 },
    Poissonnière: { x: 640, y: 340 },
    "Charenton - Écoles": { x: 880, y: 580 },
    Luxembourg: { x: 630, y: 510 },
    Exelmans: { x: 350, y: 550 },
    "Denfert-Rochereau": { x: 600, y: 600 },
    "Chemin Vert": { x: 720, y: 430 },
    Trocadéro: { x: 400, y: 450 },
    Blanche: { x: 520, y: 310 },
    "Bel-Air": { x: 840, y: 510 },
    Commerce: { x: 470, y: 580 },
    Wagram: { x: 500, y: 320 },
    Parmentier: { x: 710, y: 400 },
    "Havre - Caumartin": { x: 600, y: 370 },
    "Champs-Élysées - Clemenceau": { x: 520, y: 410 },
  };

  useEffect(() => {
    // Charger l'image SVG
    const img = new Image();
    img.src = "/Carte_Métro_de_Paris.svg";
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
  }, []);

  useEffect(() => {
    if (!imageLoaded) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !imageRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ajuster la taille du canvas à son conteneur
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Dessiner l'image du métro en grayscale
    ctx.filter = "grayscale(100%)";
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    ctx.filter = "none";

    // Mapper les noms de la chanson vers les vrais noms de stations
    const mappedHighlightedStations = highlightedStations.map(
      (station) => stationMapping[station] || station
    );

    // Dessiner les cercles pour les stations en surbrillance
    mappedHighlightedStations.forEach((stationName) => {
      const coords = stationCoordinates[stationName];
      if (!coords) return;

      // Adapter les coordonnées à la taille du canvas
      const scaleX = canvas.width / 1200; // Taille de référence
      const scaleY = canvas.height / 800;
      const x = coords.x * scaleX;
      const y = coords.y * scaleY;

      // Dessiner un cercle coloré autour de la station
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(255, 51, 102, 0.4)";
      ctx.fill();
      ctx.strokeStyle = "#FF3366";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Cercle intérieur
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = "#FF3366";
      ctx.fill();
    });
  }, [highlightedStations, imageLoaded]);

  return (
    <div className="metro-map-container" ref={containerRef}>
      <canvas ref={canvasRef} className="metro-canvas" />
    </div>
  );
}

export default MetroMap;

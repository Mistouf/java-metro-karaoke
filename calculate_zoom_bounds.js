// Script pour calculer les limites du zoom basé sur les stations intra-muros
import { stationCoordinates } from './src/data/stationCoordinates.ts';

// Stations intra-muros et portes du périphérique (à exclure : banlieues lointaines)
const excludedStations = [
  "Malakoff - Plateau de Vanves",
  "Pont de Levallois - Bécon",
  "Gallieni",
  "Pont de Sèvres",
  "Châtelet", // coordonnées incorrectes (673.18604)
  "La Défense", // coordonnées incorrectes
  "Porte Dauphine", // coordonnées incorrectes
  "Louis Blanc", // coordonnées incorrectes
  "Mairie de Montreuil", // coordonnées incorrectes
  "Balard", // coordonnées incorrectes
  "Mairie d'Issy", // coordonnées incorrectes
  "Gambetta", // coordonnées incorrectes
  "Porte des Lilas", // coordonnées incorrectes
];

const stations = Object.entries(stationCoordinates)
  .filter(([name]) => !excludedStations.includes(name))
  .filter(([, coords]) => coords.x > 1500 && coords.x < 7000) // Filtrer les valeurs aberrantes
  .map(([name, coords]) => ({ name, ...coords }));

const minX = Math.min(...stations.map(s => s.x));
const maxX = Math.max(...stations.map(s => s.x));
const minY = Math.min(...stations.map(s => s.y));
const maxY = Math.max(...stations.map(s => s.y));

const width = maxX - minX;
const height = maxY - minY;

// Ajouter 10% de marge
const margin = 0.10;
const finalMinX = minX - width * margin;
const finalMaxX = maxX + width * margin;
const finalMinY = minY - height * margin;
const finalMaxY = maxY + height * margin;
const finalWidth = finalMaxX - finalMinX;
const finalHeight = finalMaxY - finalMinY;

console.log('=== LIMITES CALCULÉES POUR LE ZOOM ===');
console.log(`Min X: ${minX.toFixed(2)}`);
console.log(`Max X: ${maxX.toFixed(2)}`);
console.log(`Min Y: ${minY.toFixed(2)}`);
console.log(`Max Y: ${maxY.toFixed(2)}`);
console.log(`\nAvec marge de ${margin * 100}%:`);
console.log(`const ZOOM_X = ${finalMinX.toFixed(2)};`);
console.log(`const ZOOM_Y = ${finalMinY.toFixed(2)};`);
console.log(`const ZOOM_WIDTH = ${finalWidth.toFixed(2)};`);
console.log(`const ZOOM_HEIGHT = ${finalHeight.toFixed(2)};`);
console.log(`\nViewBox: "${finalMinX.toFixed(2)} ${finalMinY.toFixed(2)} ${finalWidth.toFixed(2)} ${finalHeight.toFixed(2)}"`);

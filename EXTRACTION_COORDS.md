# Extraction des coordonnées des stations de métro

## Résumé

J'ai extrait les coordonnées de 107 stations de métro parisiennes depuis le fichier SVG `Carte_Métro_de_Paris.svg`.

## Méthode

1. **Analyse automatique** : J'ai créé un script Python qui parse le fichier SVG et recherche les éléments `<tspan>` contenant les noms des stations
2. **Extraction des coordonnées** : Pour chaque station trouvée, j'ai extrait les attributs `x` et `y` du SVG
3. **Gestion des variantes** : Prise en compte des variantes d'orthographe (ex: "Malakoff" vs "MalaKoff", "Pont de Levalois" vs "Pont de Levallois")

## Résultats

- **97 stations** trouvées automatiquement dans le SVG avec leurs coordonnées exactes
- **10 stations** ajoutées manuellement avec des coordonnées estimées car absentes du SVG :
  - Gare de Lyon
  - Poissonnière
  - Luxembourg
  - Trocadéro
  - Champs-Élysées - Clemenceau (coordonnées trouvées)
  - Saint-Lazare
  - Bourg-la-Reine
  - Port-Royal
  - Porte de Saint-Ouen (coordonnées trouvées)
  - Haussmann - Saint-Lazare

## Fichiers générés

1. **stationCoordinates.ts** : Fichier TypeScript avec toutes les coordonnées exportées
2. **station_coordinates.json** : Version JSON des coordonnées
3. **extract_coords.py** : Script Python utilisé pour l'extraction

## Format des coordonnées

Les coordonnées sont dans le système du SVG :
- **ViewBox** : `0 0 7529.0861 5257.141`
- **x** : Position horizontale (0 à 7529.0861)
- **y** : Position verticale (0 à 5257.141)

## Utilisation

```typescript
import { stationCoordinates } from './data/stationCoordinates';

// Obtenir les coordonnées d'une station
const coords = stationCoordinates["Châtelet"];
console.log(coords); // { x: 673.18604, y: 1447.1716 }
```

## Conversion pour l'affichage

Pour afficher sur une carte avec des dimensions différentes :

```typescript
const svgWidth = 7529.0861;
const svgHeight = 5257.141;
const displayWidth = 800; // Largeur d'affichage souhaitée
const displayHeight = (svgHeight / svgWidth) * displayWidth;

function convertCoords(station: string) {
  const svgCoords = stationCoordinates[station];
  return {
    x: (svgCoords.x / svgWidth) * displayWidth,
    y: (svgCoords.y / svgHeight) * displayHeight
  };
}
```

## Notes

- Certaines stations de terminus partagent les mêmes coordonnées dans le fichier d'origine (ex: Porte de Clignancourt, Louis Blanc, Balard, etc.)
- Les coordonnées négatives pour certaines stations (ex: Place de Clichy y: -1402) sont normales car le SVG peut avoir des éléments en dehors du viewBox
- Pour les stations avec plusieurs lignes, les coordonnées correspondent à la première occurrence trouvée dans le SVG

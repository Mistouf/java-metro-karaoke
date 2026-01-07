import { metroLyrics } from "../data/lyrics";
import type { LyricLine } from "../App";

/**
 * Liste toutes les lignes avec leur index pour faciliter la navigation
 */
export function listLines(): void {
  console.log("=== LISTE DES LIGNES ===");
  metroLyrics.forEach((line, index) => {
    console.log(`[${index}] ${line.startTime}s : "${line.text.substring(0, 50)}${line.text.length > 50 ? '...' : ''}"`);
  });
  console.log(`\nTotal: ${metroLyrics.length} lignes`);
}

/**
 * Trouve une ligne par recherche de texte
 * @param searchText Texte à chercher (insensible à la casse)
 */
export function findLine(searchText: string): void {
  const results = metroLyrics
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => line.text.toLowerCase().includes(searchText.toLowerCase()));
  
  if (results.length === 0) {
    console.log(`❌ Aucune ligne trouvée avec "${searchText}"`);
    return;
  }
  
  console.log(`=== ${results.length} RÉSULTAT(S) POUR "${searchText}" ===`);
  results.forEach(({ line, index }) => {
    console.log(`[${index}] ${line.startTime}s : "${line.text}"`);
  });
}

/**
 * Ajuste le timing d'une ligne et décale toutes les lignes suivantes
 * @param lineIndex Index de la ligne à ajuster (commence à 0)
 * @param newStartTime Nouveau startTime pour cette ligne
 */
export function adjustLineAndShift(
  lineIndex: number,
  newStartTime: number
): LyricLine[] {
  const adjustedLyrics = [...metroLyrics];
  
  if (lineIndex < 0 || lineIndex >= adjustedLyrics.length) {
    console.error("Index invalide");
    return adjustedLyrics;
  }

  const oldStartTime = adjustedLyrics[lineIndex].startTime;
  const shift = newStartTime - oldStartTime;

  console.log(`📝 Ligne [${lineIndex}]: "${adjustedLyrics[lineIndex].text}"`);
  console.log(`   Ancien timing: ${oldStartTime}s`);
  console.log(`   Nouveau timing: ${newStartTime}s`);
  console.log(`   Décalage appliqué aux lignes suivantes: ${shift > 0 ? '+' : ''}${shift}s`);

  // Ajuster la ligne courante
  adjustedLyrics[lineIndex] = {
    ...adjustedLyrics[lineIndex],
    startTime: newStartTime,
  };

  // Décaler toutes les lignes suivantes
  for (let i = lineIndex + 1; i < adjustedLyrics.length; i++) {
    adjustedLyrics[i] = {
      ...adjustedLyrics[i],
      startTime: adjustedLyrics[i].startTime + shift,
      stations: adjustedLyrics[i].stations.map(station => ({
        ...station,
        timestamp: station.timestamp + shift,
      })),
    };
  }

  // Afficher le résultat formaté pour copier-coller
  console.log("\n=== NOUVEAU TABLEAU DE PAROLES ===");
  console.log("export const metroLyrics: LyricLine[] = [");
  adjustedLyrics.forEach((line, idx) => {
    console.log(`  {`);
    console.log(`    text: "${line.text}",`);
    console.log(`    startTime: ${line.startTime},`);
    console.log(`    stations: [`);
    line.stations.forEach(station => {
      console.log(`      { name: "${station.name}", timestamp: ${station.timestamp} },`);
    });
    console.log(`    ],`);
    console.log(`  }${idx < adjustedLyrics.length - 1 ? ',' : ''}`);
  });
  console.log("];");

  return adjustedLyrics;
}

/**
 * Version simplifiée : décale toutes les lignes à partir d'un index
 * @param fromIndex À partir de quelle ligne (incluse)
 * @param shiftSeconds Décalage en secondes (peut être négatif)
 */
export function shiftLinesFrom(fromIndex: number, shiftSeconds: number): void {
  const adjustedLyrics = [...metroLyrics];

  if (fromIndex < 0 || fromIndex >= adjustedLyrics.length) {
    console.error("❌ Index invalide. Utilisez listLines() pour voir les index disponibles.");
    return;
  }

  console.log(`📝 Décalage de ${shiftSeconds > 0 ? '+' : ''}${shiftSeconds}s à partir de la ligne [${fromIndex}]: "${adjustedLyrics[fromIndex].text}"`);

  for (let i = fromIndex; i < adjustedLyrics.length; i++) {
    adjustedLyrics[i] = {
      ...adjustedLyrics[i],
      startTime: adjustedLyrics[i].startTime + shiftSeconds,
      stations: adjustedLyrics[i].stations.map(station => ({
        ...station,
        timestamp: station.timestamp + shiftSeconds,
      })),
    };
  }

  // Afficher le résultat dans la console
  const output = JSON.stringify(adjustedLyrics, null, 2);
  console.log(`✅ ${adjustedLyrics.length - fromIndex} lignes décalées`);
  console.log("=== COPIER CE CONTENU ===");
  console.log(output);
  console.log("=== FIN ===");
  
  // Essayer de copier dans le presse-papier (peut échouer si la page n'est pas focus)
  navigator.clipboard.writeText(output)
    .then(() => console.log("📋 Résultat copié dans le presse-papier"))
    .catch(() => console.log("⚠️ Copie automatique impossible (sélectionnez et copiez manuellement le JSON ci-dessus)"));
}

// Exposer globalement pour utilisation dans la console
if (typeof window !== 'undefined') {
  (window as any).listLines = listLines;
  (window as any).findLine = findLine;
  (window as any).adjustLineAndShift = adjustLineAndShift;
  (window as any).shiftLinesFrom = shiftLinesFrom;
  
  console.log("🎵 Utilitaires de timing chargés !");
  console.log("   • listLines() - Liste toutes les lignes avec leur index");
  console.log("   • findLine('texte') - Cherche une ligne par son texte");
  console.log("   • shiftLinesFrom(index, seconds) - Décale à partir d'un index");
  console.log("   • adjustLineAndShift(index, newStart, newEnd) - Ajuste et décale");
}

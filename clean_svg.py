#!/usr/bin/env python3
"""
Script pour supprimer les éléments du SVG avec x < 1507.0405
"""

# Plages de lignes à supprimer (triées de la fin vers le début)
lines_to_remove = [
    (8192, 8198),  # flowRegion
    (6524, 6538),  # Réaumur-Sébastopol
    (6224, 6234),  # Invalides
    (6171, 6181),  # Opéra
    (6157, 6167),  # Madeleine
    (6139, 6153),  # Champs-Élysées
    (3541, 3551),  # Sentier
    (3527, 3537),  # Bourse
    (3509, 3523),  # Quatre-Septembre
    (2744, 2753),  # Boulogne
    (54, 58),      # tspan vide
]

# Lire le fichier
input_file = r'c:\Tech\perso\java\public\Carte_Métro_de_Paris.svg'
output_file = r'c:\Tech\perso\java\public\Carte_Métro_de_Paris_cleaned.svg'

print(f"Lecture de {input_file}...")
with open(input_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

total_lines = len(lines)
print(f"Total de lignes: {total_lines}")

# Marquer les lignes à supprimer
lines_to_delete = set()
for start, end in lines_to_remove:
    for line_num in range(start, end + 1):
        lines_to_delete.add(line_num - 1)  # Conversion en index 0-based

print(f"Lignes à supprimer: {len(lines_to_delete)}")

# Créer le nouveau contenu
new_lines = []
for i, line in enumerate(lines):
    if i not in lines_to_delete:
        new_lines.append(line)

print(f"Lignes conservées: {len(new_lines)}")

# Écrire le fichier nettoyé
print(f"Écriture de {output_file}...")
with open(output_file, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("✅ Nettoyage terminé!")
print(f"Lignes supprimées: {total_lines - len(new_lines)}")
print(f"Fichier de sortie: {output_file}")

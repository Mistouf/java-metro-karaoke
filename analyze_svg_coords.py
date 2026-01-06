import re
import sys

# Seuil de coordonnée x
THRESHOLD = 1507.0405

def extract_x_coordinates(line):
    """Extrait toutes les coordonnées x d'une ligne"""
    coords = []
    # Recherche de x="...", cx="...", x1="...", x2="..."
    patterns = [
        (r'\bx="([0-9]+\.?[0-9]*)"', 'x'),
        (r'\bcx="([0-9]+\.?[0-9]*)"', 'cx'),
        (r'\bx1="([0-9]+\.?[0-9]*)"', 'x1'),
        (r'\bx2="([0-9]+\.?[0-9]*)"', 'x2')
    ]
    
    for pattern, attr_name in patterns:
        matches = re.finditer(pattern, line)
        for match in matches:
            value = float(match.group(1))
            coords.append((attr_name, value, match.start(), match.end()))
    
    return coords

def analyze_svg_file(filepath):
    """Analyse le fichier SVG et trouve tous les éléments avec x < threshold"""
    elements_found = []
    current_element = None
    element_start_line = None
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for line_num, line in enumerate(lines, 1):
        # Chercher les balises ouvrantes
        tag_match = re.search(r'<(\w+)', line)
        
        # Extraire les coordonnées x
        coords = extract_x_coordinates(line)
        
        # Filtrer les coordonnées < threshold
        filtered_coords = [(attr, val, start, end) for attr, val, start, end in coords if val < THRESHOLD]
        
        if filtered_coords:
            # Déterminer le type d'élément
            if tag_match:
                element_type = tag_match.group(1)
            else:
                element_type = "continuation"
            
            # Vérifier si c'est un élément sur une seule ligne ou multi-lignes
            is_single_line = '/>' in line or '>' in line and '</' in line
            
            elements_found.append({
                'line': line_num,
                'element_type': element_type,
                'coordinates': filtered_coords,
                'single_line': is_single_line,
                'content_preview': line.strip()[:100]
            })
    
    return elements_found

def group_consecutive_elements(elements):
    """Regroupe les éléments consécutifs qui appartiennent au même élément XML"""
    if not elements:
        return []
    
    grouped = []
    current_group = [elements[0]]
    
    for elem in elements[1:]:
        # Si la ligne est consécutive et que c'est une continuation
        if elem['line'] == current_group[-1]['line'] + 1 and elem['element_type'] == 'continuation':
            current_group.append(elem)
        else:
            grouped.append(current_group)
            current_group = [elem]
    
    grouped.append(current_group)
    return grouped

def print_analysis(elements):
    """Affiche l'analyse de manière structurée"""
    print(f"\n{'='*80}")
    print(f"ANALYSE DU FICHIER SVG - Éléments avec x < {THRESHOLD}")
    print(f"{'='*80}\n")
    print(f"Total d'éléments trouvés : {len(elements)}\n")
    
    grouped = group_consecutive_elements(elements)
    
    for group_idx, group in enumerate(grouped, 1):
        start_line = group[0]['line']
        end_line = group[-1]['line']
        element_type = group[0]['element_type']
        
        print(f"\n{'-'*80}")
        print(f"Élément #{group_idx}")
        print(f"{'-'*80}")
        
        if len(group) == 1:
            print(f"Ligne : {start_line}")
        else:
            print(f"Lignes : {start_line} - {end_line} ({len(group)} lignes)")
        
        print(f"Type : <{element_type}>")
        
        # Afficher toutes les coordonnées trouvées
        all_coords = []
        for elem in group:
            for attr, val, start, end in elem['coordinates']:
                all_coords.append((attr, val))
        
        print(f"Coordonnées x trouvées :")
        for attr, val in all_coords:
            print(f"  - {attr}=\"{val}\"")
        
        # Afficher un aperçu du contenu
        print(f"\nAperçu :")
        for elem in group[:3]:  # Limiter à 3 lignes pour l'aperçu
            print(f"  {elem['content_preview']}")
        if len(group) > 3:
            print(f"  ... ({len(group)-3} lignes supplémentaires)")
    
    print(f"\n{'='*80}")
    print(f"RÉSUMÉ")
    print(f"{'='*80}")
    print(f"Total d'éléments : {len(grouped)}")
    
    # Compter par type
    type_counts = {}
    for group in grouped:
        elem_type = group[0]['element_type']
        type_counts[elem_type] = type_counts.get(elem_type, 0) + 1
    
    print(f"\nRépartition par type :")
    for elem_type, count in sorted(type_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  - <{elem_type}>: {count}")
    
    # Générer une liste de lignes à supprimer
    print(f"\n{'='*80}")
    print(f"LIGNES À SUPPRIMER")
    print(f"{'='*80}")
    
    lines_to_delete = set()
    for group in grouped:
        for elem in group:
            lines_to_delete.add(elem['line'])
    
    # Grouper les lignes consécutives
    sorted_lines = sorted(lines_to_delete)
    ranges = []
    if sorted_lines:
        start = sorted_lines[0]
        end = sorted_lines[0]
        
        for line in sorted_lines[1:]:
            if line == end + 1:
                end = line
            else:
                if start == end:
                    ranges.append(f"Ligne {start}")
                else:
                    ranges.append(f"Lignes {start}-{end}")
                start = line
                end = line
        
        if start == end:
            ranges.append(f"Ligne {start}")
        else:
            ranges.append(f"Lignes {start}-{end}")
    
    for r in ranges:
        print(f"  - {r}")

if __name__ == "__main__":
    filepath = r"c:\Tech\perso\java\public\Carte_Métro_de_Paris.svg"
    
    print(f"Analyse du fichier : {filepath}")
    print(f"Recherche des éléments avec x < {THRESHOLD}")
    
    elements = analyze_svg_file(filepath)
    print_analysis(elements)

import re
import sys

# Seuil de coordonnée x
THRESHOLD = 1507.0405

def extract_x_coordinates(line):
    """Extrait toutes les coordonnées x d'une ligne"""
    coords = []
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
            coords.append((attr_name, value))
    
    return coords

def find_element_boundaries(lines, target_line_num):
    """Trouve les limites d'un élément XML à partir d'une ligne"""
    # Chercher la ligne de début (balise ouvrante)
    start_line = target_line_num
    
    # Remonter jusqu'à trouver une balise ouvrante
    for i in range(target_line_num - 1, max(0, target_line_num - 20), -1):
        if re.search(r'<(\w+)', lines[i]):
            start_line = i + 1  # +1 car enumerate commence à 1
            break
    
    # Chercher la ligne de fin
    # Cas 1: élément auto-fermant sur une seule ligne
    if '/>' in lines[start_line - 1]:
        return start_line, start_line
    
    # Cas 2: balise fermante sur plusieurs lignes
    end_line = start_line
    tag_name = re.search(r'<(\w+)', lines[start_line - 1])
    if tag_name:
        tag_name = tag_name.group(1)
        closing_tag = f'</{tag_name}>'
        
        for i in range(start_line - 1, min(len(lines), start_line + 50)):
            if closing_tag in lines[i] or '/>' in lines[i]:
                end_line = i + 1
                break
    
    return start_line, end_line

def analyze_svg_file(filepath):
    """Analyse le fichier SVG et trouve tous les éléments avec x < threshold"""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Première passe: trouver toutes les lignes avec des coordonnées < threshold
    lines_with_coords = []
    
    for line_num, line in enumerate(lines, 1):
        coords = extract_x_coordinates(line)
        filtered_coords = [(attr, val) for attr, val in coords if val < THRESHOLD]
        
        if filtered_coords:
            lines_with_coords.append((line_num, filtered_coords, line.strip()))
    
    # Deuxième passe: identifier les éléments complets
    elements = []
    processed_ranges = set()
    
    for line_num, coords, line_content in lines_with_coords:
        # Trouver les limites de l'élément
        start, end = find_element_boundaries(lines, line_num)
        
        # Éviter les doublons (plusieurs lignes du même élément)
        range_key = (start, end)
        if range_key in processed_ranges:
            continue
        processed_ranges.add(range_key)
        
        # Extraire le type d'élément
        tag_match = re.search(r'<(\w+)', lines[start - 1])
        element_type = tag_match.group(1) if tag_match else "unknown"
        
        # Extraire tout le contenu de l'élément
        element_content = ''.join(lines[start - 1:end])
        
        # Extraire toutes les coordonnées de l'élément
        all_coords = []
        for l in lines[start - 1:end]:
            all_coords.extend(extract_x_coordinates(l))
        
        # Filtrer les coordonnées < threshold
        filtered = [(attr, val) for attr, val in all_coords if val < THRESHOLD]
        
        # Extraire l'ID si présent
        id_match = re.search(r'id="([^"]+)"', element_content)
        element_id = id_match.group(1) if id_match else "no-id"
        
        # Extraire un aperçu du contenu textuel
        text_content = ""
        if element_type == "text":
            tspan_match = re.search(r'<tspan[^>]*>([^<]+)</tspan>', element_content)
            if tspan_match:
                text_content = tspan_match.group(1)
        
        elements.append({
            'start_line': start,
            'end_line': end,
            'element_type': element_type,
            'element_id': element_id,
            'coordinates': filtered,
            'text_content': text_content,
            'preview': element_content[:200].replace('\n', ' ')
        })
    
    return elements

def print_detailed_analysis(elements):
    """Affiche l'analyse détaillée"""
    print(f"\n{'='*100}")
    print(f"ANALYSE DÉTAILLÉE DU FICHIER SVG - Éléments avec x < {THRESHOLD}")
    print(f"{'='*100}\n")
    print(f"Total d'éléments trouvés : {len(elements)}\n")
    
    for idx, elem in enumerate(elements, 1):
        print(f"\n{'-'*100}")
        print(f"Élément #{idx}")
        print(f"{'-'*100}")
        
        if elem['start_line'] == elem['end_line']:
            print(f"Ligne : {elem['start_line']}")
        else:
            print(f"Lignes : {elem['start_line']} - {elem['end_line']} ({elem['end_line'] - elem['start_line'] + 1} lignes)")
        
        print(f"Type : <{elem['element_type']}>")
        print(f"ID : {elem['element_id']}")
        
        if elem['text_content']:
            print(f"Texte : \"{elem['text_content']}\"")
        
        print(f"Coordonnées x < {THRESHOLD} :")
        for attr, val in elem['coordinates']:
            print(f"  - {attr}=\"{val}\"")
        
        print(f"\nAperçu : {elem['preview'][:150]}...")
    
    # Résumé
    print(f"\n{'='*100}")
    print(f"RÉSUMÉ")
    print(f"{'='*100}")
    print(f"Total d'éléments : {len(elements)}")
    
    # Compter par type
    type_counts = {}
    for elem in elements:
        elem_type = elem['element_type']
        type_counts[elem_type] = type_counts.get(elem_type, 0) + 1
    
    print(f"\nRépartition par type :")
    for elem_type, count in sorted(type_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  - <{elem_type}>: {count}")
    
    # Liste des lignes à supprimer
    print(f"\n{'='*100}")
    print(f"LIGNES À SUPPRIMER (par plages)")
    print(f"{'='*100}\n")
    
    for idx, elem in enumerate(elements, 1):
        if elem['start_line'] == elem['end_line']:
            range_str = f"Ligne {elem['start_line']}"
        else:
            range_str = f"Lignes {elem['start_line']}-{elem['end_line']}"
        
        desc = f"<{elem['element_type']} id=\"{elem['element_id']}\">"
        if elem['text_content']:
            desc += f" - \"{elem['text_content'][:30]}...\""
        
        print(f"{idx:3d}. {range_str:20s} : {desc}")
    
    # Générer un fichier de commandes pour suppression
    print(f"\n{'='*100}")
    print(f"SCRIPT DE SUPPRESSION")
    print(f"{'='*100}\n")
    
    # Trier par ordre décroissant pour supprimer de la fin vers le début
    sorted_elements = sorted(elements, key=lambda x: x['start_line'], reverse=True)
    
    print("# Commandes sed pour supprimer les lignes (à exécuter de la fin vers le début)")
    for elem in sorted_elements:
        if elem['start_line'] == elem['end_line']:
            print(f"sed -i '{elem['start_line']}d' Carte_Métro_de_Paris.svg")
        else:
            print(f"sed -i '{elem['start_line']},{elem['end_line']}d' Carte_Métro_de_Paris.svg")

if __name__ == "__main__":
    filepath = r"c:\Tech\perso\java\public\Carte_Métro_de_Paris.svg"
    
    print(f"Analyse du fichier : {filepath}")
    print(f"Recherche des éléments avec x < {THRESHOLD}")
    
    elements = analyze_svg_file(filepath)
    print_detailed_analysis(elements)

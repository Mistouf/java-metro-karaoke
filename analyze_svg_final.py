import re

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
            try:
                value = float(match.group(1))
                coords.append((attr_name, value))
            except:
                pass
    
    return coords

def find_element_boundaries(lines, start_idx):
    """Trouve les limites d'un élément XML à partir d'une ligne"""
    start_line = start_idx + 1
    
    # Vérifier si c'est un élément auto-fermant
    if '/>' in lines[start_idx]:
        return start_line, start_line
    
    # Trouver la balise fermante
    tag_match = re.search(r'<(\w+)', lines[start_idx])
    if not tag_match:
        return start_line, start_line
    
    tag_name = tag_match.group(1)
    closing_tag = f'</{tag_name}>'
    
    for i in range(start_idx, min(len(lines), start_idx + 100)):
        if closing_tag in lines[i] or (i > start_idx and '/>' in lines[i]):
            return start_line, i + 1
    
    return start_line, start_line

def analyze_svg_file(filepath):
    """Analyse le fichier SVG et trouve tous les éléments avec x < threshold"""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    elements = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Chercher une balise ouvrante
        tag_match = re.search(r'<(\w+)', line)
        if not tag_match:
            i += 1
            continue
        
        tag_name = tag_match.group(1)
        
        # Trouver les limites de l'élément
        start_line, end_line = find_element_boundaries(lines, i)
        
        # Extraire tout le contenu de l'élément
        element_content = ''.join(lines[i:end_line])
        
        # Extraire toutes les coordonnées de l'élément
        all_coords = []
        for l in lines[i:end_line]:
            all_coords.extend(extract_x_coordinates(l))
        
        # Filtrer les coordonnées < threshold
        filtered = [(attr, val) for attr, val in all_coords if val < THRESHOLD]
        
        # Si cet élément a des coordonnées < threshold, l'ajouter
        if filtered:
            # Extraire l'ID
            id_match = re.search(r'id="([^"]+)"', element_content)
            element_id = id_match.group(1) if id_match else "no-id"
            
            # Extraire le contenu textuel
            text_content = ""
            if tag_name in ["text", "tspan"]:
                tspan_match = re.search(r'>([^<]+)</tspan>', element_content)
                if tspan_match:
                    text_content = tspan_match.group(1).strip()
            
            # Calculer la coordonnée x minimale
            min_x = min([val for _, val in filtered])
            
            elements.append({
                'start_line': start_line,
                'end_line': end_line,
                'element_type': tag_name,
                'element_id': element_id,
                'coordinates': filtered,
                'min_x': min_x,
                'text_content': text_content,
                'preview': element_content[:200].replace('\n', ' ').strip()
            })
        
        # Sauter à la fin de l'élément
        i = end_line
    
    return elements

def remove_nested_elements(elements):
    """Supprime les éléments qui sont contenus dans d'autres éléments"""
    filtered = []
    
    for i, elem1 in enumerate(elements):
        is_nested = False
        
        for j, elem2 in enumerate(elements):
            if i != j:
                # Vérifier si elem1 est contenu dans elem2
                if (elem2['start_line'] <= elem1['start_line'] and 
                    elem1['end_line'] <= elem2['end_line'] and
                    not (elem2['start_line'] == elem1['start_line'] and elem2['end_line'] == elem1['end_line'])):
                    is_nested = True
                    break
        
        if not is_nested:
            filtered.append(elem1)
    
    return filtered

def print_final_analysis(elements):
    """Affiche l'analyse finale"""
    print(f"\n{'='*120}")
    print(f"ANALYSE FINALE - Éléments principaux avec x < {THRESHOLD} (La Défense)")
    print(f"{'='*120}\n")
    print(f"Total d'éléments principaux trouvés : {len(elements)}\n")
    
    # Trier par ligne de début
    elements = sorted(elements, key=lambda x: x['start_line'])
    
    for idx, elem in enumerate(elements, 1):
        print(f"\n{'-'*120}")
        print(f"Élément #{idx}")
        print(f"{'-'*120}")
        
        if elem['start_line'] == elem['end_line']:
            print(f"Ligne          : {elem['start_line']}")
        else:
            print(f"Lignes         : {elem['start_line']} - {elem['end_line']} ({elem['end_line'] - elem['start_line'] + 1} lignes)")
        
        print(f"Type           : <{elem['element_type']}>")
        print(f"ID             : {elem['element_id']}")
        print(f"X minimum      : {elem['min_x']}")
        
        if elem['text_content']:
            print(f"Texte          : \"{elem['text_content'][:50]}\"")
        
        print(f"\nCoordonnées x < {THRESHOLD} :")
        unique_coords = list(set(elem['coordinates']))
        for attr, val in sorted(unique_coords):
            print(f"  - {attr}=\"{val}\"")
        
        preview = elem['preview'][:120]
        if len(elem['preview']) > 120:
            preview += "..."
        print(f"\nAperçu         : {preview}")
    
    # Résumé
    print(f"\n{'='*120}")
    print(f"RÉSUMÉ")
    print(f"{'='*120}")
    print(f"Total d'éléments principaux : {len(elements)}")
    
    # Compter par type
    type_counts = {}
    for elem in elements:
        elem_type = elem['element_type']
        type_counts[elem_type] = type_counts.get(elem_type, 0) + 1
    
    print(f"\nRépartition par type :")
    for elem_type, count in sorted(type_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  - <{elem_type}>: {count}")
    
    # Stations identifiées
    print(f"\n{'='*120}")
    print(f"STATIONS/ÉLÉMENTS IDENTIFIÉS")
    print(f"{'='*120}\n")
    
    for idx, elem in enumerate(elements, 1):
        if elem['text_content']:
            desc = f"{elem['text_content'][:40]}"
        else:
            desc = f"<{elem['element_type']} id=\"{elem['element_id']}\">"
        
        if elem['start_line'] == elem['end_line']:
            line_info = f"ligne {elem['start_line']}"
        else:
            line_info = f"lignes {elem['start_line']}-{elem['end_line']}"
        
        print(f"{idx:3d}. {desc:50s} (x={elem['min_x']:.2f}, {line_info})")
    
    # Liste pour suppression
    print(f"\n{'='*120}")
    print(f"COMMANDES DE SUPPRESSION (de la fin vers le début pour éviter le décalage des numéros)")
    print(f"{'='*120}\n")
    
    # Trier par ordre décroissant
    sorted_elements = sorted(elements, key=lambda x: x['start_line'], reverse=True)
    
    print("# Copier-coller ces lignes dans le fichier à supprimer :")
    print("# Format : lignes à supprimer | description\n")
    
    for elem in sorted_elements:
        if elem['start_line'] == elem['end_line']:
            range_str = f"{elem['start_line']}"
        else:
            range_str = f"{elem['start_line']}-{elem['end_line']}"
        
        desc = elem['text_content'][:30] if elem['text_content'] else f"<{elem['element_type']}>"
        print(f"{range_str:15s} | {desc}")

if __name__ == "__main__":
    filepath = r"c:\Tech\perso\java\public\Carte_Métro_de_Paris.svg"
    
    print(f"Analyse du fichier : {filepath}")
    print(f"Recherche des éléments avec x < {THRESHOLD} (position de La Défense)")
    
    elements = analyze_svg_file(filepath)
    
    # Supprimer les éléments imbriqués
    elements = remove_nested_elements(elements)
    
    print_final_analysis(elements)

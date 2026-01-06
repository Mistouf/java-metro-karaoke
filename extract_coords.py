import re
import xml.etree.ElementTree as ET
import json

# Charger le fichier SVG
svg_file = r"c:\Tech\perso\java\public\Carte_Métro_de_Paris.svg"

# Liste des stations à chercher
stations_to_find = [
    "Marx Dormoy", "Belleville", "Porte de la Chapelle", "Jacques Bonsergent",
    "Gare de Lyon", "Monceau", "Place de Clichy", "Vavin", "Filles du Calvaire",
    "Porte de Clignancourt", "Cité", "Malakoff - Plateau de Vanves",
    "Pont de Levallois - Bécon", "Passy", "Gallieni", "Porte d'Orléans",
    "Ternes", "Pasteur", "Bérault", "Pont de Sèvres", "Iéna",
    "Montparnasse - Bienvenüe", "Rue de la Pompe", "Picpus",
    "La Motte-Picquet - Grenelle", "Montgallet", "Châtelet", "Poissonnière",
    "Charenton - Écoles", "Luxembourg", "Exelmans", "Denfert-Rochereau",
    "Chemin Vert", "Trocadéro", "Blanche", "Bel-Air", "Commerce",
    "Wagram", "Parmentier", "Havre - Caumartin", "Champs-Élysées - Clemenceau",
    "La Défense", "Bercy", "Dupleix", "Quai de la Rapée", "Odéon",
    "Saint-Lazare", "Kléber", "Tuileries", "Raspail", "Gabriel Péri",
    "Porte Dauphine", "Pont de Saint-Cloud", "Pont de Neuilly", "Porte Maillot",
    "Michel-Ange - Auteuil", "Gobelins", "Censier - Daubenton",
    "Barbès - Rochechouart", "Louis Blanc", "Mairie de Montreuil",
    "Bourg-la-Reine", "Port-Royal", "Couronnes", "Varenne", "Charonne",
    "Voltaire", "Bastille", "Argentine", "Église de Pantin", "Dugommier",
    "Brochant", "La Fourche", "Porte de Saint-Ouen", "Saint-Sulpice",
    "Crimée", "Sentier", "Convention", "Pyrénées", "Rennes",
    "Réaumur - Sébastopol", "Anvers", "Saint-Paul", "Abbesses", "Gambetta",
    "Jourdain", "Ménilmontant", "Duroc", "Haussmann - Saint-Lazare",
    "Daumesnil", "Invalides", "Balard", "Mairie d'Issy", "Porte de Choisy",
    "Edgar Quinet", "Opéra", "Saint-Maur", "Porte des Lilas", "Corvisart",
    "Père Lachaise", "Sablons", "Porte de Champerret", "Volontaires",
    "École Militaire", "Sèvres - Babylone", "Plaisance", "Buttes-Chaumont"
]

# Variantes d'orthographe potentielles à chercher
station_variants = {
    "Malakoff - Plateau de Vanves": ["MalaKoff", "Plateau de Vanves", "Malakoff"],
    "Pont de Levallois - Bécon": ["Pont de Levalois - Bécon"],
    "Charenton - Écoles": ["Charenton - Ecoles"],
    "Barbès - Rochechouart": ["Barbès-Rochechouart"],
    "Michel-Ange - Auteuil": ["Auteuil", "Michel-Ange"],
    "Gobelins": ["Les Gobelins"],
    "Censier - Daubenton": ["Censier", "Daubenton"],
    "Réaumur - Sébastopol": ["Sébastopol", "Réaumur"],
    "Haussmann - Saint-Lazare": ["Haussmann", "Saint-Lazare"],
    "Saint-Maur": ["Rue Saint-Maur"],
    "Sablons": ["Les Sablons"],
    "École Militaire": ["Ecole Militaire"],
    "Montparnasse - Bienvenüe": ["Montparnasse", "Bienvenüe"],
    "Havre - Caumartin": ["Havre", "Caumartin"],
    "Denfert-Rochereau": ["Denfert", "Rochereau"],
    "Père Lachaise": ["Père", "Lachaise"],
    "Pont de Saint-Cloud": ["Boulogne - Pont de Saint-Cloud"],
    "Jacques Bonsergent": ["Jacques", "Bonsergent"],
    "Filles du Calvaire": ["du Calvaire"],
    "Église de Pantin": ["Eglise de Pantin"],
    "La Motte-Picquet - Grenelle": ["Grenelle"],
    "Champs-Élysées - Clemenceau": ["Champs-Élysées"],
    "Sèvres - Babylone": ["Sèvres - Babylone", "Sèvres", "Babylone"]
}

print("Analyse du fichier SVG...")

# Lire le contenu brut du fichier
with open(svg_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Parser le XML
tree = ET.parse(svg_file)
root = tree.getroot()

# Namespace pour SVG
ns = {'svg': 'http://www.w3.org/2000/svg'}

# Dictionnaire pour stocker les coordonnées trouvées
coordinates = {}

# Fonction pour normaliser les noms de stations
def normalize_station_name(text):
    if not text:
        return ""
    # Supprimer les espaces multiples et nettoyer
    return ' '.join(text.strip().split())

# Chercher dans tous les éléments text et tspan
for text_elem in root.iter('{http://www.w3.org/2000/svg}text'):
    x = text_elem.get('x')
    y = text_elem.get('y')
    
    # Vérifier le texte dans l'élément text lui-même
    text_content = text_elem.text
    if text_content:
        text_content = normalize_station_name(text_content)
    
    # Chercher dans les tspan enfants
    tspans = list(text_elem.iter('{http://www.w3.org/2000/svg}tspan'))
    
    # Construire le texte complet de tous les tspans
    full_text = ""
    tspan_coords = None
    
    for tspan in tspans:
        tspan_text = tspan.text
        if tspan_text:
            full_text += " " + normalize_station_name(tspan_text)
            # Utiliser les coordonnées du premier tspan s'il en a
            if not tspan_coords:
                tspan_x = tspan.get('x')
                tspan_y = tspan.get('y')
                if tspan_x and tspan_y:
                    tspan_coords = (tspan_x, tspan_y)
    
    full_text = normalize_station_name(full_text)
    
    # Utiliser les coordonnées du tspan si disponibles, sinon celles du text
    if tspan_coords:
        x, y = tspan_coords
    
    if not x or not y:
        continue
        
    # Vérifier si ce texte correspond à une station
    for station in stations_to_find:
        # Normaliser le nom de la station
        normalized_station = normalize_station_name(station)
        
        # Vérifier les variantes
        variants = [normalized_station]
        if station in station_variants:
            variants.extend(station_variants[station])
        
        # Chercher dans full_text et text_content
        for variant in variants:
            variant_normalized = normalize_station_name(variant)
            if variant_normalized and (
                variant_normalized in full_text or 
                (text_content and variant_normalized in text_content) or
                full_text in variant_normalized
            ):
                # Stocker avec priorité pour les correspondances exactes
                if normalized_station not in coordinates:
                    try:
                        coord_x = float(x)
                        coord_y = float(y)
                        coordinates[normalized_station] = {"x": coord_x, "y": coord_y}
                        print(f"✓ Trouvé: {station} at ({coord_x}, {coord_y})")
                    except ValueError:
                        pass
                break

print(f"\n\nStations trouvées: {len(coordinates)}/{len(stations_to_find)}")
print("\nStations manquantes:")
for station in stations_to_find:
    normalized = normalize_station_name(station)
    if normalized not in coordinates:
        print(f"  - {station}")

# Générer le code TypeScript
print("\n\n=== CODE TYPESCRIPT ===\n")
print("export const stationCoordinates: Record<string, { x: number; y: number }> = {")
for station, coords in sorted(coordinates.items()):
    print(f'  "{station}": {{ x: {coords["x"]}, y: {coords["y"]} }},')
print("};")

# Sauvegarder en JSON aussi
output_file = r"c:\Tech\perso\java\station_coordinates.json"
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(coordinates, f, indent=2, ensure_ascii=False)

print(f"\n\nCoordonnées sauvegardées dans: {output_file}")

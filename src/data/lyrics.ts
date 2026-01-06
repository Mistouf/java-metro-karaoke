import type { LyricLine } from "../App";

// Paroles complètes de "Métro" avec timestamps approximatifs
// Durée estimée: ~3:30 (210 secondes)
export const metroLyrics: LyricLine[] = [
  // Couplet 1
  {
    text: "Fini les cocktails Malakoff, les idées de Marx, J'Dormoy",
    startTime: 0,
    endTime: 4,
    stations: [
      { name: "Malakoff", timestamp: 1.5 },
      { name: "Marx, J'Dormoy", timestamp: 3 },
    ],
  },
  {
    text: "Tu rames Buttes alors Chaumont plutôt qu'faire Levallois",
    startTime: 4,
    endTime: 7.5,
    stations: [
      { name: "Buttes alors Chaumont", timestamp: 4.8 },
      { name: "Levallois", timestamp: 6.8 },
    ],
  },
  {
    text: "L'volontaire, pour l'Ecole Militaire y'a maldonne",
    startTime: 7.5,
    endTime: 10.5,
    stations: [
      { name: "volontaire", timestamp: 8 },
      { name: "Ecole Militaire", timestamp: 9.5 },
    ],
  },
  {
    text: "Plutôt crever qu'donner sa Sèvres à Babylone",
    startTime: 10.5,
    endTime: 13.5,
    stations: [
      { name: "Sèvres à Babylone", timestamp: 11.8 },
    ],
  },
  {
    text: "Ca s'Passy, ça t'Férino Plassy",
    startTime: 13.5,
    endTime: 16,
    stations: [
      { name: "Passy", timestamp: 14.5 },
      { name: "Férino Plassy", timestamp: 15.2 },
    ],
  },
  {
    text: "Tu vois une Belle Porte quand Jacques le Bonsergent Gare sa Bagnolet d'vant ma",
    startTime: 16,
    endTime: 20,
    stations: [
      { name: "Belle", timestamp: 17 },
      { name: "Porte", timestamp: 17.4 },
      { name: "Jacques le Bonsergent", timestamp: 18 },
      { name: "Gare", timestamp: 19 },
      { name: "Bagnolet", timestamp: 19.5 },
    ],
  },
  {
    text: "Porte d'Orléans... merdeur, un flic Ternes sans odeur",
    startTime: 20,
    endTime: 23.5,
    stations: [
      { name: "Porte d'Orléans", timestamp: 20.5 },
      { name: "Ternes", timestamp: 22.5 },
    ],
  },
  {
    text: "Raconte un Monceau d'Clichy que tout le monde connaît Pasteur",
    startTime: 23.5,
    endTime: 27,
    stations: [
      { name: "Monceau", timestamp: 24.5 },
      { name: "Clichy", timestamp: 25 },
      { name: "Pasteur", timestamp: 26.5 },
    ],
  },
  {
    text: "On s'en bat Marcel on a l'Bérault les Billancourt-celles",
    startTime: 27,
    endTime: 30.5,
    stations: [
      { name: "Marcel", timestamp: 28 },
      { name: "Bérault", timestamp: 29 },
      { name: "Billancourt", timestamp: 30 },
    ],
  },
  {
    text: "Qui font les Iéna, les cartons d'Vavin souhaitent la Bienvenüe à",
    startTime: 30.5,
    endTime: 34,
    stations: [
      { name: "Iéna", timestamp: 31.5 },
      { name: "Vavin", timestamp: 32.8 },
      { name: "Bienvenüe", timestamp: 33.5 },
    ],
  },
  {
    text: "Montparnasse, faut qu'j'vide mes bourses Rue de la Pompe",
    startTime: 34,
    endTime: 37,
    stations: [
      { name: "Montparnasse", timestamp: 34.5 },
      { name: "Rue de la Pompe", timestamp: 36 },
    ],
  },
  {
    text: "Mon Piquet dans ta Motte Montgallet dans tes trompes",
    startTime: 37,
    endTime: 40,
    stations: [
      { name: "Piquet dans ta Motte", timestamp: 37.8 },
      { name: "Montgallet", timestamp: 39.2 },
    ],
  },
  {
    text: "Ta Châtelet pourrie sent la Poissonnière",
    startTime: 40,
    endTime: 42.5,
    stations: [
      { name: "Châtelet", timestamp: 40.8 },
      { name: "Poissonnière", timestamp: 42 },
    ],
  },
  {
    text: "C'est d'la Charenton, c'est pas du Luxembourg, Fille du calvaire !",
    startTime: 42.5,
    endTime: 46,
    stations: [
      { name: "Charenton", timestamp: 43.2 },
      { name: "Luxembourg", timestamp: 44.2 },
      { name: "Fille du calvaire", timestamp: 45 },
    ],
  },
  {
    text: "J'ai attrapé d'l'Exelmans, c'est Denfert",
    startTime: 46,
    endTime: 48.5,
    stations: [
      { name: "Exelmans", timestamp: 46.8 },
      { name: "Denfert", timestamp: 48 },
    ],
  },
  {
    text: "J'prends l'Chemin Vert au lieu Trocadéro à Blanche j'respire le Bel-Air",
    startTime: 48.5,
    endTime: 52,
    stations: [
      { name: "Chemin Vert", timestamp: 49.2 },
      { name: "Trocadéro", timestamp: 50 },
      { name: "Blanche", timestamp: 50.8 },
      { name: "Bel-Air", timestamp: 51.5 },
    ],
  },
  {
    text: "Change de Commerce, t'ont Clignancourt dans ta Cité",
    startTime: 52,
    endTime: 55,
    stations: [
      { name: "Commerce", timestamp: 52.8 },
      { name: "Clignancourt", timestamp: 53.5 },
      { name: "Cité", timestamp: 54.5 },
    ],
  },
  {
    text: "Pour Wagram de hashich Parmentier, pour cacher le Havre",
    startTime: 55,
    endTime: 58.5,
    stations: [
      { name: "Wagram", timestamp: 55.5 },
      { name: "Parmentier", timestamp: 56.5 },
      { name: "Havre", timestamp: 57.8 },
    ],
  },
  {
    text: "Pour Caumartin, monter jusqu'aux Champs-Elysées",
    startTime: 58.5,
    endTime: 61.5,
    stations: [
      { name: "Caumartin", timestamp: 58.8 },
      { name: "Champs-Elysées", timestamp: 60.5 },
    ],
  },
  {
    text: "Pour Comatec sur la grande arche de La Défonce",
    startTime: 61.5,
    endTime: 64.5,
    stations: [
      { name: "Comatec", timestamp: 62 },
      { name: "La Défonce", timestamp: 63.5 },
    ],
  },

  // Refrain 1
  {
    text: "Alors laisse-toi Bercy par le rythme saccadé",
    startTime: 64.5,
    endTime: 68,
    stations: [
      { name: "Bercy", timestamp: 66 },
    ],
  },
  {
    text: "Ma musique s'est perdue dans les couloirs...",
    startTime: 68,
    endTime: 71,
    stations: [],
  },
  {
    text: "T'es sur l'bon rail en Dupleix du Quai de la Rapée",
    startTime: 71,
    endTime: 74.5,
    stations: [
      { name: "Dupleix", timestamp: 72.5 },
      { name: "Quai de la Rapée", timestamp: 73.8 },
    ],
  },
  {
    text: "Odéon joue nos vies, c'est Saint-Lazare...",
    startTime: 74.5,
    endTime: 78,
    stations: [
      { name: "Odéon", timestamp: 75 },
      { name: "Saint-Lazare", timestamp: 77 },
    ],
  },
  {
    text: "Laisse-toi Bercy...",
    startTime: 78,
    endTime: 81,
    stations: [
      { name: "Bercy", timestamp: 79 },
    ],
  },
  {
    text: "Hey, oh, quoi, hein ?",
    startTime: 81,
    endTime: 83,
    stations: [],
  },

  // Couplet 2
  {
    text: "Ramène pas ton Kléber, me cherche pas les Tuileries",
    startTime: 83,
    endTime: 86.5,
    stations: [
      { name: "Kléber", timestamp: 84 },
      { name: "Tuileries", timestamp: 85.8 },
    ],
  },
  {
    text: "Joue pas les Raspail à c'petit jeu Gabriel Péri",
    startTime: 86.5,
    endTime: 90,
    stations: [
      { name: "Raspail", timestamp: 87.5 },
      { name: "Gabriel Péri", timestamp: 89 },
    ],
  },
  {
    text: "Tu dis qu't'es Foch, t'as pas Saint-Cloud",
    startTime: 90,
    endTime: 92.5,
    stations: [
      { name: "Foch", timestamp: 90.8 },
      { name: "Pont de Saint-Cloud", timestamp: 92 },
    ],
  },
  {
    text: "Mon Neuilly, ça s'voit sur ta gueule que tu Porte le Maillot d'Auteuil",
    startTime: 92.5,
    endTime: 96,
    stations: [
      { name: "Neuilly", timestamp: 93 },
      { name: "Porte Maillot", timestamp: 94.5 },
      { name: "Michel-Ange Auteuil", timestamp: 95.5 },
    ],
  },
  {
    text: "Me fais pas Gobelins Censier d'la Dauben(Bâ)ton",
    startTime: 96,
    endTime: 99,
    stations: [
      { name: "Gobelins", timestamp: 96.8 },
      { name: "Censier-Daubenton", timestamp: 97.8 },
    ],
  },
  {
    text: "Comme des Picpus-ckets on va t'Barbès tes Louis Blanc",
    startTime: 99,
    endTime: 102.5,
    stations: [
      { name: "Picpus", timestamp: 99.8 },
      { name: "Barbès", timestamp: 100.8 },
      { name: "Louis Blanc", timestamp: 101.8 },
    ],
  },
  {
    text: "Choisy-le-roi moi j'Bourg-la-Reine, Port Royal",
    startTime: 102.5,
    endTime: 105.5,
    stations: [
      { name: "Mairie de Montreuil", timestamp: 103 },
      { name: "Bourg-la-Reine", timestamp: 104 },
      { name: "Port-Royal", timestamp: 105 },
    ],
  },
  {
    text: "T'as voulu la Couronnes ? Maintenant tu peux toujours tracer à Varenne, Charonne !",
    startTime: 105.5,
    endTime: 109.5,
    stations: [
      { name: "Couronnes", timestamp: 106.5 },
      { name: "Varenne", timestamp: 108 },
      { name: "Charonne", timestamp: 109 },
    ],
  },
  {
    text: "Voltaire part sous la Guillotine",
    startTime: 109.5,
    endTime: 111.5,
    stations: [
      { name: "Voltaire", timestamp: 110 },
    ],
  },
  {
    text: "On t'retrouvera à Bastille pas le temps de t'exiler à Argentine",
    startTime: 111.5,
    endTime: 115,
    stations: [
      { name: "Bastille", timestamp: 112.5 },
      { name: "Argentine", timestamp: 114.2 },
    ],
  },
  {
    text: "Pantin ! J'vais t'Dugommier t'emBrochant à La Fourche Hoche la teuté",
    startTime: 115,
    endTime: 119,
    stations: [
      { name: "Pantin", timestamp: 115.2 },
      { name: "Dugommier", timestamp: 116.2 },
      { name: "Brochant", timestamp: 117 },
      { name: "La Fourche", timestamp: 117.8 },
      { name: "Hoche", timestamp: 118.5 },
    ],
  },
  {
    text: "Au Saint-Sulpice c'est un Crimée Sentier, oui on sait c'que tu Vaugirard-ment vu Pyrénées-rgumène",
    startTime: 119,
    endTime: 124,
    stations: [
      { name: "Saint-Sulpice", timestamp: 119.8 },
      { name: "Crimée", timestamp: 120.8 },
      { name: "Sentier", timestamp: 121.5 },
      { name: "Vaugirard", timestamp: 122.5 },
      { name: "Pyrénées", timestamp: 123.5 },
    ],
  },
  {
    text: "T'es condamné à errer dans l'Marais et faire la drag-Rennes",
    startTime: 124,
    endTime: 127.5,
    stations: [
      { name: "Rennes", timestamp: 126.8 },
    ],
  },
  {
    text: "T'auras beau mettre la Réaumur-Sébastopol",
    startTime: 127.5,
    endTime: 130,
    stations: [
      { name: "Réaumur-Sébastopol", timestamp: 129 },
    ],
  },
  {
    text: "Tu t'feras prendre à l'Anvers à la station... par Saint-Paul",
    startTime: 130,
    endTime: 133.5,
    stations: [
      { name: "Anvers", timestamp: 131 },
      { name: "Saint-Paul", timestamp: 133 },
    ],
  },
  {
    text: "Abbesses le froc Gambetta !",
    startTime: 133.5,
    endTime: 135.5,
    stations: [
      { name: "Abbesses", timestamp: 134 },
      { name: "Gambetta", timestamp: 135 },
    ],
  },
  {
    text: "Il te met son Jourdain son Ménilmontant c'est Duroc",
    startTime: 135.5,
    endTime: 138.5,
    stations: [
      { name: "Jourdain", timestamp: 136.2 },
      { name: "Ménilmontant", timestamp: 137 },
      { name: "Duroc", timestamp: 138 },
    ],
  },
  {
    text: "Tout droit dans l'Haussmann t'as l'Daumesnil la Clichy tu gémis",
    startTime: 138.5,
    endTime: 142,
    stations: [
      { name: "Haussmann", timestamp: 139.5 },
      { name: "Daumesnil", timestamp: 140.2 },
      { name: "Clichy", timestamp: 141.2 },
    ],
  },
  {
    text: "T'es Invalides t'as l'trou de Balard en fer, Mai(s j')rie d'Issy",
    startTime: 142,
    endTime: 145.5,
    stations: [
      { name: "Invalides", timestamp: 142.5 },
      { name: "Balard", timestamp: 143.8 },
      { name: "Mairie d'Issy", timestamp: 145 },
    ],
  },
  {
    text: "Va t'faire Masséna par Edgar le Quinet",
    startTime: 145.5,
    endTime: 148,
    stations: [
      { name: "Masséna", timestamp: 146.5 },
      { name: "Edgar Quinet", timestamp: 147.5 },
    ],
  },
  {
    text: "Faut qu'on t'Opéra, trop tard t'es Saint-Maur et j'Porte des Lilas",
    startTime: 148,
    endTime: 151.5,
    stations: [
      { name: "Opéra", timestamp: 148.8 },
      { name: "Saint-Maur", timestamp: 149.8 },
      { name: "Porte des Lilas", timestamp: 150.8 },
    ],
  },
  {
    text: "Sur ton Corvisart, direction Père Lachaise",
    startTime: 151.5,
    endTime: 154,
    stations: [
      { name: "Corvisart", timestamp: 152 },
      { name: "Père Lachaise", timestamp: 153.2 },
    ],
  },
  {
    text: "Sablons le Champerret, criant au nom d'la Ligne 13",
    startTime: 154,
    endTime: 157.5,
    stations: [
      { name: "Sablons", timestamp: 154.5 },
      { name: "Porte de Champerret", timestamp: 155.5 },
    ],
  },

  // Refrain final (x4)
  {
    text: "Alors laisse-toi Bercy par le rythme saccadé",
    startTime: 157.5,
    endTime: 161,
    stations: [
      { name: "Bercy", timestamp: 159 },
    ],
  },
  {
    text: "Ma musique s'est perdue dans les couloirs...",
    startTime: 161,
    endTime: 164,
    stations: [],
  },
  {
    text: "T'es sur l'bon rail en Dupleix du Quai de la Rapée",
    startTime: 164,
    endTime: 167.5,
    stations: [
      { name: "Dupleix", timestamp: 165.5 },
      { name: "Quai de la Rapée", timestamp: 166.8 },
    ],
  },
  {
    text: "Odéon joue nos vies, c'est Saint-Lazare...",
    startTime: 167.5,
    endTime: 171,
    stations: [
      { name: "Odéon", timestamp: 168 },
      { name: "Saint-Lazare", timestamp: 170 },
    ],
  },
  {
    text: "Alors laisse-toi Bercy par le rythme saccadé",
    startTime: 171,
    endTime: 174.5,
    stations: [
      { name: "Bercy", timestamp: 172.5 },
    ],
  },
  {
    text: "Ma musique s'est perdue dans les couloirs...",
    startTime: 174.5,
    endTime: 177.5,
    stations: [],
  },
  {
    text: "T'es sur l'bon rail en Dupleix du Quai de la Rapée",
    startTime: 177.5,
    endTime: 181,
    stations: [
      { name: "Dupleix", timestamp: 179 },
      { name: "Quai de la Rapée", timestamp: 180.3 },
    ],
  },
  {
    text: "Odéon joue nos vies, c'est Saint-Lazare...",
    startTime: 181,
    endTime: 184.5,
    stations: [
      { name: "Odéon", timestamp: 181.5 },
      { name: "Saint-Lazare", timestamp: 183.5 },
    ],
  },
  {
    text: "Alors laisse-toi Bercy par le rythme saccadé",
    startTime: 184.5,
    endTime: 188,
    stations: [
      { name: "Bercy", timestamp: 186 },
    ],
  },
  {
    text: "Ma musique s'est perdue dans les couloirs...",
    startTime: 188,
    endTime: 191,
    stations: [],
  },
  {
    text: "T'es sur l'bon rail en Dupleix du Quai de la Rapée",
    startTime: 191,
    endTime: 194.5,
    stations: [
      { name: "Dupleix", timestamp: 192.5 },
      { name: "Quai de la Rapée", timestamp: 193.8 },
    ],
  },
  {
    text: "Odéon joue nos vies, c'est Saint-Lazare...",
    startTime: 194.5,
    endTime: 198,
    stations: [
      { name: "Odéon", timestamp: 195 },
      { name: "Saint-Lazare", timestamp: 197 },
    ],
  },
  {
    text: "Alors laisse-toi Bercy par le rythme saccadé",
    startTime: 198,
    endTime: 201.5,
    stations: [
      { name: "Bercy", timestamp: 199.5 },
    ],
  },
  {
    text: "Ma musique s'est perdue dans les couloirs...",
    startTime: 201.5,
    endTime: 204.5,
    stations: [],
  },
  {
    text: "T'es sur l'bon rail en Dupleix du Quai de la Rapée",
    startTime: 204.5,
    endTime: 208,
    stations: [
      { name: "Dupleix", timestamp: 206 },
      { name: "Quai de la Rapée", timestamp: 207.3 },
    ],
  },
  {
    text: "Odéon joue nos vies, c'est Saint-Lazare...",
    startTime: 208,
    endTime: 211.5,
    stations: [
      { name: "Odéon", timestamp: 208.5 },
      { name: "Saint-Lazare", timestamp: 210.5 },
    ],
  },
  {
    text: "Alors laisse-toi Bercy",
    startTime: 211.5,
    endTime: 214,
    stations: [
      { name: "Bercy", timestamp: 212.5 },
    ],
  },
  {
    text: "Alors laisse-toi Bercy",
    startTime: 214,
    endTime: 217,
    stations: [
      { name: "Bercy", timestamp: 215 },
    ],
  },
];

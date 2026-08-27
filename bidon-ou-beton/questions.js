/*
 * ============================================================================
 * BIDON OU BÉTON ? — contenu du jeu
 * ============================================================================
 * Ce fichier ne contient AUCUN code de jeu : uniquement les questions et les
 * profils. Pour corriger une faute, changer une explication ou ajuster un
 * seuil de score, il suffit de modifier les valeurs ci-dessous — pas besoin
 * d'ouvrir game.js.
 *
 * Format d'une question :
 *   prompt      — la phrase posée au joueur
 *   answers     — exactement 3 propositions, dans l'ordre d'affichage par
 *                 défaut (elles sont mélangées automatiquement à chaque
 *                 partie, donc l'ordre ici n'a pas d'importance pour le jeu)
 *   answers[].text    — le texte de la proposition
 *   answers[].correct — true pour la SEULE bonne réponse (le "béton"),
 *                       false pour les deux inventées (les "bidons")
 *   explanation — la ligne affichée après le choix du joueur, sous la bonne
 *                 réponse
 *
 * Règle de contenu : les 5 projets réels listés dans le brief sont les SEULS
 * vérifiés. N'en ajoute pas d'autres sans vérification. Les propositions
 * bidons peuvent être inventées librement, mais doivent rester drôles et
 * clairement invraisemblables.
 * ============================================================================
 */

const QUESTIONS = [
  {
    prompt: "Un seul de ces projets a vraiment été financé.",
    answers: [
      { text: "Un cours de yoga pour les pigeons de la Riponne", correct: false },
      { text: "Un poulailler collectif aux Fiches Nord", correct: true },
      { text: "Un télésiège entre Sauvabelin et le Chalet-à-Gobet", correct: false },
    ],
    explanation: "Des voisins ont construit un poulailler pour avoir une raison de se croiser.",
  },
  {
    prompt: "Un seul de ces projets a vraiment été financé.",
    answers: [
      { text: "Un bar à sirop sur une place de jeux, imaginé par trois enfants", correct: true },
      { text: "Un distributeur de raclette ouvert la nuit à la Sallaz", correct: false },
      { text: "Un service de portage de courses assuré par des chèvres", correct: false },
    ],
    explanation: "À Praz-Séchaud. Trois gamins ont porté le dossier jusqu'au bout.",
  },
  {
    prompt: "Un seul de ces projets a vraiment été financé.",
    answers: [
      { text: "Repeindre les escaliers du Marché en touches de piano", correct: false },
      { text: "Habiller toute une avenue en tricot et en crochet", correct: true },
      { text: "Traduire les annonces du M2 en patois vaudois", correct: false },
    ],
    explanation: "Le tricot-graffiti de l'avenue de la Harpe. Oui, vraiment.",
  },
  {
    prompt: "Un seul de ces projets a vraiment été financé.",
    answers: [
      { text: "Une bibliothèque où on emprunte des perceuses au lieu des livres", correct: true },
      { text: "Une piste de luge d'été à Bellevaux", correct: false },
      { text: "Un gardien de parapluies à l'entrée du Flon", correct: false },
    ],
    explanation: "La Manivelle, rue Saint-Martin. On peut y aller aujourd'hui.",
  },
  {
    prompt: "Un seul de ces projets a vraiment été financé.",
    answers: [
      { text: "Une rizière expérimentale à Vidy", correct: false },
      { text: "Une truffière à Sauvabelin", correct: false },
      { text: "Un verger de pommiers à cidre, récolté et pressé par les habitants", correct: true },
    ],
    explanation: "À Montblesson. Les projets peuvent se déployer sur trois ans.",
  },
  {
    prompt: "Pour déposer un projet, laquelle de ces règles est vraie ?",
    answers: [
      { text: "Il faut être de nationalité suisse", correct: false },
      { text: "Il faut être au moins trois personnes", correct: true },
      { text: "Il faut déjà avoir une association avec des statuts", correct: false },
    ],
    explanation: "Trois personnes et dix parrains ou marraines. Ni passeport, ni statuts, ni comité.",
  },
  {
    prompt: "Combien peut-on demander pour un projet ?",
    answers: [
      { text: "Ce qu'on veut, il n'y a pas de plafond", correct: false },
      { text: "Jusqu'à 500 francs", correct: false },
      { text: "Jusqu'à 20 000 francs", correct: true },
    ],
    explanation: "20 000 francs par projet, 10 000 pour un événement ponctuel. L'enveloppe totale est de 200 000 francs.",
  },
  {
    prompt: "Qui choisit les projets qui seront réalisés ?",
    answers: [
      { text: "Le Conseil communal", correct: false },
      { text: "Un jury d'experts", correct: false },
      { text: "La population lausannoise, par un vote", correct: true },
    ],
    explanation: "Près de 18 630 personnes ont voté lors de la dernière édition.",
  },
];

/*
 * ----------------------------------------------------------------------------
 * Profils de fin de partie
 * ----------------------------------------------------------------------------
 * min / max — bornes de score (sur 8) auxquelles ce profil s'applique
 * name       — nom du profil, affiché en grand sur l'écran final
 * tagline    — phrase de caractérisation
 * avatar     — identifiant du sprite pixel à afficher (voir index.html,
 *              symboles #avatar-pigeon, #avatar-pendulaire, etc.)
 * ----------------------------------------------------------------------------
 */

const PROFILES = [
  {
    min: 0,
    max: 2,
    name: "Le Pigeon de la Riponne",
    tagline: "Vous étiez là pour les miettes, pas pour la démocratie.",
    avatar: "pigeon",
  },
  {
    min: 3,
    max: 4,
    name: "Le Pendulaire du M2",
    tagline: "Vous traversez la ville tous les jours sans jamais lever les yeux.",
    avatar: "pendulaire",
  },
  {
    min: 5,
    max: 6,
    name: "La Voisine du marché",
    tagline: "Vous connaissez le quartier, vous saluez les gens, vous savez des choses.",
    avatar: "voisine",
  },
  {
    min: 7,
    max: 7,
    name: "Le Parrain de quartier",
    tagline: "Il vous manque juste neuf autres personnes comme vous.",
    avatar: "parrain",
  },
  {
    min: 8,
    max: 8,
    name: "Béton armé",
    tagline: "Vous n'avez plus d'excuse. Déposez.",
    avatar: "beton",
  },
];

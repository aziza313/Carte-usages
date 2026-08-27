# Bidon ou Béton ?

Mini-jeu web sur le Budget participatif de la Ville de Lausanne. Le joueur
voit trois propositions par manche, une seule est vraie (« béton »), les
deux autres sont inventées (« bidon »). 8 manches, 10 secondes chacune, un
profil à la fin.

Site statique, sans backend, sans dépendance externe, sans police distante.
HTML + CSS + JS vanilla — aucun framework, aucun bundler.

## Lancer en local

Aucune installation nécessaire. Deux options :

- **Ouvrir directement** `index.html` dans un navigateur (double-clic, ou
  `open index.html` / `xdg-open index.html`).
- **Ou servir le dossier** avec un petit serveur local, pour être au plus
  près des conditions de GitHub Pages :
  ```bash
  cd bidon-ou-beton
  python3 -m http.server 8000
  # puis ouvrir http://localhost:8000
  ```

## Modifier les questions

Tout le contenu (les 8 questions, leurs 3 réponses, l'explication, et les
5 profils de fin) vit dans **`questions.js`**. C'est un fichier de données
commenté, séparé du code du jeu (`game.js`) : on peut corriger une faute de
frappe ou changer une explication sans toucher au moteur.

Pour une question :
```js
{
  prompt: "Un seul de ces projets a vraiment été financé.",
  answers: [
    { text: "...", correct: false },
    { text: "...", correct: true },   // une seule réponse correct: true
    { text: "...", correct: false },
  ],
  explanation: "La phrase affichée après le choix du joueur.",
}
```

Règle de contenu à respecter : les projets présentés comme réels doivent
être vérifiés. Les propositions inventées doivent rester drôles et
clairement invraisemblables — jamais crédibles au point qu'on reparte en y
croyant.

Pour un profil de fin :
```js
{ min: 0, max: 2, name: "...", tagline: "...", avatar: "pigeon" }
```
`avatar` doit correspondre à l'identifiant d'un sprite pixel défini dans
`index.html` (`#avatar-pigeon`, `#avatar-pendulaire`, `#avatar-voisine`,
`#avatar-parrain`, `#avatar-beton`).

Le nombre de manches suit automatiquement la longueur du tableau
`QUESTIONS` — pas besoin de toucher à `game.js` si on ajoute ou retire une
question (au-delà de 8, la pente du décor en arrière-plan reste calée sur
8 terrasses dessinées dans `index.html` : à ajuster si le nombre de
questions change réellement).

## Ajouter le logo officiel

Deux emplacements sont réservés et signalés par un cadre en pointillés
dans `index.html` : `<div class="logo-slot">` sur l'écran d'accueil, et la
mention en pied de page « Ville de Lausanne — Service quartiers, jeunesse
et familles ». Remplacer le texte du cadre par une image du logo (SVG ou
PNG léger) le moment venu.

## Déployer

Le dossier est autonome : il suffit de le publier tel quel sur n'importe
quel hébergement statique.

**GitHub Pages** :
1. Pousser ce dossier sur une branche du dépôt.
2. Dans les paramètres du dépôt → Pages, choisir la branche et, si le jeu
   n'est pas à la racine du dépôt, le dossier `/bidon-ou-beton`.
3. GitHub Pages sert directement `index.html`.

**Autre hébergement statique** (Netlify, un simple serveur web, une clé
USB) : copier les 4 fichiers (`index.html`, `style.css`, `questions.js`,
`game.js`) tels quels, dans le même dossier.

## Ce que fait le `localStorage`

Une seule information y est stockée : l'horodatage de fin de la dernière
partie, sans aucune donnée personnelle. Il sert uniquement à afficher une
note discrète sur l'écran d'accueil si une partie vient de se terminer à
l'instant — les questions et l'ordre des réponses sont de toute façon
retirés au hasard à chaque partie.

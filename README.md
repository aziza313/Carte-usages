# Carte des usages — Quartier des Falaises (Lausanne)

Outil de terrain pour l'enquête « domaine quartier » : repérer, lieu par lieu, l'usage et le type de population qui le fréquente, dans le quartier des Falaises (en face du CHUV).

## Fichier

`carte-usages.html` est une page autonome (HTML/CSS/JS, sans dépendance externe) publiée comme Artifact Claude. Elle utilise les capacités runtime `artifact` (sauvegarde des points collectés, partagée via republication de la page) et `downloads` (export CSV).

## Deux modes

- **Saisie terrain** : mode par défaut à l'ouverture. On touche la carte pour signaler un lieu, on décrit son usage (commerce, habitat, espace public…) et qui le fréquente (âge, lien au quartier, genre, moment observé), avec une note libre. Ce mode ne montre jamais les réponses déjà collectées, pour ne pas influencer la personne qui répond — utilisable en entretien face à face ou envoyé à distance.
- **Vue chercheur** : derrière un écran d'avertissement (pas une vraie protection par mot de passe — voir limites ci-dessous), affiche tous les points collectés, filtrables par usage / âge / lien au quartier / genre / moment, avec des compteurs, une vue carte, une vue tableau et un export CSV.

## Fond de carte

Le fond de carte est un **schéma reconstitué à la main** (SVG) d'après trois orthophotos à l'échelle 1:1000 fournies par l'utilisateur, et non les photos elles-mêmes : l'environnement d'exécution ne permet pas d'accéder aux fichiers d'images collées dans la conversation, ni au réseau (OpenStreetMap, Nominatim, tuiles satellite testés et bloqués). Le schéma est fidèle dans ses grandes lignes (bâtiments en terrasses, talus boisé, jardins familiaux, carrefour vers la station m2/CHUV) mais **n'est pas géométriquement précis** — l'échelle affichée est indicative.

## Limites à connaître

- **Pas de sécurité réelle** sur la « Vue chercheur » : les données collectées sont intégrées dans le code de la page publiée, donc visibles par quiconque examine le code source, indépendamment de l'écran d'avertissement. Ne partagez le lien qu'avec les personnes de confiance.
- **Écriture par des tiers** : pour que des personnes interrogées à distance puissent réellement enregistrer leurs réponses via le lien, l'artifact doit être partagé avec un droit d'édition (pas seulement de lecture) dans les paramètres de partage de Claude — à vérifier avant un envoi en nombre.
- **Conflits d'écriture simultanée** : si deux personnes valident un point au même instant, l'une des deux peut voir sa saisie retardée (resynchronisation automatique à la prochaine ouverture de la page).

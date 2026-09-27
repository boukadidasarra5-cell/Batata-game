# 🥔 Batata Game

Petit jeu 2D style "endless runner" : évite le couteau qui fonce sur Batata en sautant, marque des points, et regarde le décor changer à mesure que le score augmente (cuisine → jardin → labo → enfer).

## 🎮 Comment jouer

- **Espace** ou **clic/tap sur Batata** : sauter
- **Échap** : pause
- Le score augmente à chaque couteau évité
- 3 vies, le jeu se termine à la 3e collision

## 🗂️ Structure du projet

```
.
├── index.html      # page unique (accueil + jeu)
├── style.css        # tous les styles
├── script.js         # logique du jeu
├── batatarun.png      # sprite course
├── batatajump.png       # sprite saut
├── kitchen.jpg            # fond niveau 0
├── garden.jpg               # fond niveau 1 (score ≥ 10)
├── lab.jpg                    # fond niveau 2 (score ≥ 20)
└── hell.jpg                     # fond niveau 3 (score ≥ 30)
```
**Démo en ligne :** https://boukadidasarra5-cell.github.io/Batata-game/
## 💻 Tester en local

Ouvrir simplement `index.html` dans un navigateur, ou lancer un petit serveur local (recommandé pour éviter les soucis de chemins relatifs) :
```bash
python3 -m http.server 8000
```
puis aller sur `http://localhost:8000`.

## 🛠️ Idées d'amélioration future

- Ajouter un vrai système de niveaux/difficulté progressive
- Ajouter des animations de sprite plus riches (plusieurs frames)
- Classement des meilleurs scores en ligne
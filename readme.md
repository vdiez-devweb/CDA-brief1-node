# Projet chef d'oeuvre pour passage du titre Concepteur Développeur d'application

- Sujet : Créer un annuaire des élèves de Simplon
- date : de février à septembre 2023
- Référentiels  Concepteur⋅rice développeur⋅se d'applications

## table des matières

- [Projet chef d'oeuvre pour passage du titre Concepteur Développeur d'application](#projet-chef-doeuvre-pour-passage-du-titre-concepteur-développeur-dapplication)
  - [table des matières](#table-des-matières)
  - [Sujet du projet](#sujet-du-projet)
  - [Choix techniques](#choix-techniques)
  - [Tâches restant à accomplir](#tâches-restant-à-accomplir)
  - [Installation du projet](#installation-du-projet)

## Sujet du projet

## Choix techniques

l'application web utilise les technologies suivantes :

- langage de programmation : NodeJs v18.12.1
- Frameworks : Express v4.18.2
- Base de données NoSql : MongoDB
- ORM : Mongoose v7.0.3 pour l'ORM
- moteur de template pour les vues : EJS v3.1.9
- CSS : Bootstrap v5.2.3
- Dans un premier temps, l'authentification dans l'application est simplement gérée par les sessions, avec 1 seul utilisateur administrateur dont les identifiants sont stockés dans les variables globales d'environnement dans le fichier `.env`
- versioning : git en lien avec gitHub, [repo publique](https://github.com/vdiez-devweb/CDA-annuaire.git)

## Tâches restant à accomplir

- [ ] Vérification des champs dans le front (validation) et le back (unicité, doublons, champs requis etc. ) Dashboard + API
- [ ] gestionnaire d’erreurs pour traiter les 404 et 500 par exemple
- [ ] Dans l'API mettre en place le système d'authentification Basic Auth
- [ ] Dans l'API Revoir messages renvoyés

## Installation du projet

- télécharger et installer npm si besoin pour nodeJs
- cloner le projet en local dans le dossier de votre choix `[git clone https://gitlab.com/cda-simplon/brief1-node.git](https://github.com/vdiez-devweb/CDA-annuaire.git)`
- Créer votre BDD sur MongoDB :
  - Créer un compte mongoDB si besoin
  - créer un base de données à connecter à l'application
  - créer un utilisateur ayant accès à cette BDD
  - récupérer le lien de connection commençant par `mongodb+srv://USERNAME:PASS@...`
  - créer un compte sur MongoDB Compass, créer une nouvelle connexion au cluster MongoDB créé auparavant
- créer un fichier .env à la racine de votre projet, contenant les valeurs vous concernant dans les variables d'environnement suivantes :
  
```text
BASE_URL = http://localhost:8082
MONGODB_URI = 
SESSION_SECRET = 
SESSION_NAME =
ADMIN_USERNAME =
ADMIN_PASSWORD = (le mot de passe de l'administrateur non crypté)
```

- taper la commande `npm install`
- configurer le serveur dev `npm i nodemon --save-dev`
- lancer le serveur dev `npm run dev`
- accéder via un navigateur à l'url `localhost:8082`

<!-- TODO vérifier que la procédure est complète -->

# Enquête de satisfaction

Ce projet est une application de questionnaire de satisfaction conçue pour créer, afficher, modifier et gérer des formulaires de sondage de manière simple et organisée.

## Objectif du projet

L'objectif de ce projet est de proposer une interface permettant de construire un formulaire d'enquête, de préparer la collecte des réponses et de faciliter la modification des formulaires selon les besoins.

## Technologies utilisées

- Frontend : Next.js, React, ReactDOM.
- Backend : Express.js, Prisma, dotenv, cors, cookie-parser, jsonwebtoken, bcryptjs, nodemailer, pg, nodemon.
- Base de données : PostgreSQL.
- ORM : Prisma.
- Styles : Tailwind CSS.

## Travail réalisé jusqu'à présent

### 1. Mise en place du projet
- Création de la structure principale du projet.
- Organisation du dépôt avec une partie frontend pour l'interface utilisateur.
- Préparation du projet pour le suivi de version avec Git et GitHub.

### 2. Base du frontend
- Mise en place de l'environnement frontend.
- Début du développement de l'interface utilisateur de l'application.
- Préparation de la structure de l'application pour afficher et gérer les formulaires plus facilement.

### 3. Création des formulaires
- Développement du premier flux de création de formulaire.
- Ajout de la possibilité de définir les champs nécessaires pour une enquête de satisfaction.
- Organisation du formulaire pour prendre en charge plusieurs types de champs, comme les champs texte, les choix multiples et les questions de notation.

### 4. Affichage et interaction
- Mise en place de l'affichage des formulaires côté utilisateur.
- Amélioration de la présentation et de l'interaction pour rendre le formulaire plus clair et plus facile à remplir.
- Début de liaison entre les données du formulaire et la logique de l'interface.

### 5. Modification des formulaires
- Ajout de la fonctionnalité de modification des formulaires.
- Possibilité de mettre à jour un formulaire existant sans le recréer entièrement.
- Ajout de la modification des champs et de l'adaptation de la structure du questionnaire pendant le développement.

## Architecture technique

### Frontend
Le frontend a été réalisé avec Next.js. Les pages principales incluent l'accueil, la connexion, l'inscription, la récupération du mot de passe et la réinitialisation du mot de passe. Les composants et la structure des pages permettent d'afficher une interface simple et fluide pour l'utilisateur.

### Backend
Le backend a été réalisé avec Express.js. Il contient les routes, les contrôleurs, les middlewares et les fichiers utilitaires nécessaires pour organiser la logique du serveur. L'architecture a été pensée de manière modulaire afin de garder un code clair et maintenable.

### Base de données
La base de données est gérée avec Prisma et PostgreSQL. Prisma permet de définir les modèles, de générer le client de base de données et de gérer les migrations.

## Comment utiliser le projet sur un PC

### Prérequis
Avant d'utiliser le projet, il faut installer :
- Git
- Node.js
- npm
- PostgreSQL
- Prisma CLI

### 1. Cloner le projet
```bash
git clone https://github.com/HasnaAmal/enquete.git
```

### 2. Ouvrir le dossier du projet
```bash
cd enquete
```

### 3. Installer et lancer le backend
Ouvrir un terminal dans le dossier backend puis installer les dépendances :
```bash
cd backend
npm install
```

Les dépendances backend utilisées peuvent inclure :
- express
- prisma
- @prisma/client
- dotenv
- cors
- cookie-parser
- jsonwebtoken
- bcryptjs
- nodemailer
- pg
- nodemon

Créer le fichier `.env` si nécessaire, puis ajouter la configuration de la base de données :
```env
DATABASE_URL="your_database_url"
```

Ensuite, exécuter Prisma :
```bash
npx prisma generate
npx prisma migrate dev
```

Puis lancer le backend :
```bash
npm run dev
```

### 4. Installer et lancer le frontend
Ouvrir un autre terminal dans le dossier frontend puis installer les dépendances :
```bash
cd frontend
npm install
```

Les dépendances frontend utilisées peuvent inclure :
- next
- react
- react-dom
- tailwindcss

Puis lancer le frontend :
```bash
npm run dev
```

### 5. Ouvrir l'application
Ensuite, ouvrir l'adresse affichée dans le terminal, généralement :
```bash
http://localhost:3000
```

# Chat Talks - Version mobile

## Objectifs et présentation du projet

Dans le cadre du cours "Solutions Front" de Hetic en 3ème année du bachelor Web, nous devons créer une application de chat.<br>

Cette application se divise en trois parties: 
- Une application mobile réalisé avec React Native
- Une application web réalisé avec React Js
- Une API réalisé avec Goland et notamment gorilla websocket

Ici vous êtes sur le repo de l'application mobile: 
- Le dossier "chattalksapp" contient le code de l'application mobile en React Native et inclu le code de l'api (Goland).
- Le sous-dossier "gorilla" contient le code de l'API afin de faciliter le déploiement local de l'application mobile.

Il n'y a pas à ce stade de version en production pour l'application mobile, il faut donc installer les composant en local pour la faire fonctionner.
Nous allons vous guider dans cette installation.


[**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## Installation locale

>**Note**: Vous devez avoir installé React Native et le nécessaire en suivant les étapes sur ce lien: 
> [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) 
> Choisissez l'option **"React CLI"** avec votre OS et la plateforme **Android**.

>**Note**: Vous devez aussi avoir installé Go et le nécessaire en suivant les étapes sur ce lien: [Go - Getting Started](https://golang.org/doc/install)

Avant de procéder, verifiez que vous avez bien installé un voir deux émulateurs pour appareils Android. 
En installant deux émulateurs, vous pourrez tester le chat.

### Start the Metro Server

Aller à la racine du projet là où se trouve le package.json et lancer la commande suivante:

```bash
# using npm
npm start
```

Vous avez maintenant lancé le serveur Metro qui va permettre de faire fonctionner l'application. 

### Etape 2: lancer l'api (Goland)

Ouvrez un terminal et placez-vous dans le dossier "gorilla" où il y a le fichier main.go.

Lancer la commande suivante pour lancer l'api:

```bash
 go run .
```

Aller sur localhost:8000 et vérifiez que vous arrivez sur une page 404 ou une page d'accueil de l'api (si celle-ci a été intégré). 
Si oui c'est que l'api est lancée.

Si vous avez une erreur, il se peut que celle-ci soit liée à une connexion à la base de donnée. 
Vous pouvez changer les élèments de connexion à la BDD dans sa configuration dans main.go.

### Etape 3: lancer l'application

Ouvrez un second terminal, toujours à la racine du projet et lancer cette commande pour ouvrir votre app _Android_ :

```bash
# using npm
npm run android
```

>La première fois il se peut que vous deviez attendre longtemps et donc n'hésitez pas à prendre une pause pendant le téléchargement des packages.

>En fin de process vous devez avoir le ou les émulateurs qui s'ouvrent automatiquement. 

>**Note**: Si vous avez deux émulateurs, vous connectez-vous avec deux comptes différents pour tester le chat.

## Etape 4 : Usage de l'application

Une fois l'émulateur lancé, vous arrivez sur la page de connexion. 
Vous pouvez créer votre compte ou utiliser un compte existant car la base de donnée est en ligne et non locale.

Vous trouvez l'adresse et autres élèments de connexion à la base de donnée dans l'api en Go et dans le fichier main.go <br>
Si besoin ou si la base de donnée en ligne est défaillante vous pouvez changer ces élèments pour vous connecter à votre propre base de donnée.<br>

Vous pouvez ensuite accéder à un salon et discuter avec l'autre utilisateur sur l'autre émulateur localement, vous discuterez donc avec vous-même pour le test.<br> 
Ceci n'a pas énormément de sens mais cela peut permettre de tester l'application.


## Apartés

- Si vous voulez ajouter ce code dans une application existante, consultez [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- Si vous voulez en savoir plus sur React Native, consultez: [Introduction to React Native](https://reactnative.dev/docs/getting-started).

## Troubleshooting

Si vous avez des problèmes avec l'installation, vous pouvez consulter cette page: [Troubleshooting](https://reactnative.dev/docs/troubleshooting).

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

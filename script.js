const socket = io('http://localhost:3000') //On utilise la fonction IO pour régler notre socket sur le serveur.

//On insére tous les éléments HTML avec lesquels nous interagissons dans des constantes.
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

//On demande le nom à l'utilisateur avec un pop-up.
const name = prompt('Bienvenue !\nAvant de continuer, nous avons besoin\nde votre pseudonyme :')

//On insére le message de bienvenue dans la liste du chat.
appendMessage('Vous avez rejoint la salle de chat. Dites bonjour !');

//Une fois le nom entré par le prompt, on envoie une émission de connexion au serveur avec le nom.
socket.emit('new-user', name);

//Selon les émissions qu'on reçoit depuis le serveur
//Si on reçoit une émission de message
socket.on('chat-message', data => {
  //Écrire le message dans la liste.
  appendMessage(`${data.name}: ${data.message}`)
});

//Si on reçoit une émission de connexion d'utilisateur
socket.on('user-connected', name => {
  //On l'écrit.
  appendMessage(`${name} s'est connecté à la salle de chat !`);
});

//Si on reçoit une émission de déconnexion d'utilisateur.
socket.on('user-disconnected', name => {
  appendMessage(`${name} s'est déconnecté. À bientôt !`);
});

//On ajoute un EventListenter sur le bouton "SEND".
messageForm.addEventListener('submit', e => {
  e.preventDefault(); //On empêche la page de se recharger quand on clique sur le bouton.
  const message = messageInput.value; // On enregistre le message dans une variable.
  appendMessage(`${name}: ${message}`); // On écrit notre propre message.
  socket.emit('send-chat-message', message); // On envoie une émission contenant notre message au serveur.
  messageInput.value = ''; // On vide l'input.
});

//Fonction permettant d'insérér un message dans la liste.
function appendMessage(message) {
  const messageElement = document.createElement('div'); // On crée une div.
  messageElement.innerText = message; // On y ajoute le texte passé en argument.
  messageContainer.append(messageElement); //On insére l'élément dans le HTML.
}
/*
 *  ETML
 *  NOM : FAZLIJA YLLI
 *  DATE : 25.01.2021
 *  DESCRIPTION : Javascript côté client, reçevant les émissions du serveur et émettant ses propres messages.
*/
//On utilise la fonction IO pour régler notre socket sur le serveur.
const socket = io('http://localhost:3000');

//On insére tous les éléments HTML avec lesquels nous interagissons dans des constantes.
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const userTable = document.getElementById('user-table');
const oldHTML = userTable.innerHTML;

//On demande le nom à l'utilisateur avec un pop-up.
const name = prompt('Bienvenue !\nAvant de continuer, nous avons besoin\nde votre pseudonyme :');
const reg = name.match(/^$|^\s$/g);

//Création du tableau des couleurs disponibles, et séléction d'une couleur au hasard.
const colors = ['red', 'blue', 'green', 'cyan', 'magenta', 'lime', 'brown', 'pink', 'purple'];
const color = colors[Math.floor(Math.random() * (colors.length))];

if(reg !== null)
{
  appendMessage('Erreur : Le nom fourni n\'est pas valide. Veuillez recharger la page.','red');
  throw new Error('Erreur : Le nom fourni n\'est pas valide. Veuillez recharger la page.');
}
else
{
  //On insére le message de bienvenue dans la liste du chat.
  appendMessage('You joined the chatroom.', 'gold');
}

//Une fois le nom entré par le prompt, on envoie une émission de connexion au serveur avec le nom.
socket.emit('new-user', { name: name, color: color });

//Si on reçoit une émission de mise à jour de la liste des utilisateurs.
socket.on('update-list', users =>{
  console.log('appending users...');
  console.log(users);
  userTable.innerHTML = oldHTML;
  users.forEach(user => {
    appendUser(user.name, user.color);
  });
});

//Selon les émissions qu'on reçoit depuis le serveur
//Si on reçoit une émission de message
socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`, data.color); //Écrire le message dans la liste.
});

//Si on reçoit une émission de connexion d'utilisateur
socket.on('user-connected', data => {
  console.log('new user connected')
  appendMessage(`${data.name} joined the chatroom.`,'gold'); //On l'écrit.
});

//Si on reçoit une émission de déconnexion d'utilisateur.
socket.on('user-disconnected', data => {
  console.log("new user disconnected");
  appendMessage(`${data.name} left the chatroom.`,'gold');
});

//On ajoute un EventListenter sur le bouton "SEND".
messageForm.addEventListener('submit', e => {
  e.preventDefault(); //On empêche la page de se recharger quand on clique sur le bouton.
  const message = messageInput.value; // On enregistre le message dans une variable.
  appendMessage(`${name}: ${message}`, color); // On écrit notre propre message.
  socket.emit('send-chat-message', {message: message, color: color}); // On envoie une émission contenant notre message au serveur.
  messageInput.value = ''; // On vide l'input.
});

/**
 * Permets d'insérér un élément HTML contenant le message dans l'élément messageContainer
 * @param message Message à afficher dans la div.
 * @param color Couleur CSS à appliquer à la div.
 */
function appendMessage(message, color) {
  const messageElement = document.createElement('div'); // On crée une div.
  messageElement.innerText = message; // On y ajoute le texte passé en argument.
  messageElement.style.color = color; // On colore le texte de la couleur de l'utilisateur.
  messageContainer.append(messageElement); //On insére l'élément dans le HTML.
}

/**
 * Permets d'insérer un utilisateur dans le tableau des utilisateurs.
 * @param user Utilisateur à ajouter.
 * @param color Couleur de l'utilisateur.
 */
function appendUser(user, color) {
  const row = userTable.insertRow(1)
  const cell = row.insertCell(0);
  cell.innerText = user;
  cell.style.color = color;
}
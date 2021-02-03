/*
 *  ETML
 *  NOM : FAZLIJA YLLI
 *  DATE : 25.01.2021
 *  DESCRIPTION : Javascript côté serveur, envoyant les émissions, attribuant un socket à chaque utilisateur et faisant la liaison entre chacun.
*/

//Démarrage du serveur socket.io sur le port 3000
const User = require("./User");
const io = require('socket.io')(3000);

//Tableau des utilisateurs
const users = {};
//const userColors = {};

//Si un utilisateur se connecte au serveur, on lui attribue un socket et démarre un callback
io.on('connection', socket => {
  //On écoute si ce socket (utilisateur) envoie certaines émissions
  //S'il envoie 'new-user', on va broadcast (à tout le monde sauf le sender) un message 'user-conncted' avec son nom.
  socket.on('new-user', data => {
    //On stocke le nom dans la case de l'id du socket dans le tableau 'users'.
    users[socket.id] = new User(data.name, data.color);
    //Émission du message broadcast
    socket.broadcast.emit('user-connected', {name: users[socket.id].name, color: users[socket.id].color});
  });

  //S'il envoie 'send-chat-message' on envoie en broadcast (à tout le monde sauf le sender) le message avec le nom d'utilisateur.
  socket.on('send-chat-message', data => {
    socket.broadcast.emit('chat-message', { message: data.message, name: users[socket.id].name, color: users[socket.id].color});
  });
  //S'il se déconnecte, on envoie un message en broadcast de déconnexion, et on supprime l'entrée dans le tableau.
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', {name: users[socket.id].name, color: users[socket.id].color});
    delete users[socket.id];
  });
});
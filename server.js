/*
 *  ETML
 *  NOM : FAZLIJA YLLI
 *  DATE : 25.01.2021
 *  DESCRIPTION : Javascript côté serveur, envoyant les émissions, attribuant un socket à chaque utilisateur et faisant la liaison entre chacun.
*/

const User = require("./src/js/User"); //Requiering my User class

const express = require('express'); //Requiering Express
const app = express(); //Creating an express app
const server = require('http').Server(app) //Setting up an http server with express
const io = require('socket.io')(server); //Using socket.io on this server.
const port = 3000;

//Creating a listener for the server.
server.listen(port, ()=>{
  console.log(`Server is now listening on port ${port}`);
});

//Setting up which folder can express use ; in this case, the entire project.
app.use(express.static(__dirname));

//ROUTING
//Default Route
app.get('/',(req,res)=>{
  res.sendFile(__dirname + '/index.html');
});

/*
TABLEAUX DES UTILISATEURS
Le tableau "users" et le tableau "usersToEmit sont les deux différents et nécéssaires pour le moment.

Le tableau "users" contient des objets "User" et les clés sont le socket.id
EXEMPLE : users['AJdgfdDGYfDfygf324'].name = 'Simon';

Le tableau "usersToEmit" fut créé par un problème Javascript. En effet, essayer d'émettre le tableau "users", où les objets
sont créés par référence, ne fonctionnait pas. J'ai donc créé un deuxième tableau, où j'ai utilisé la méthode "array.push"
afin de placer l'objet User à l'intérieur. Donc les utiliseurs se trouveront aux index 0, 1, 2, 3 etc. et pour trouver
un User dans ce tableau il faudra utiliser l'attribut id de l'objet User, qui contient aussi le socket.id.
 */

var users = [];
var usersToEmit = [];

//Si un utilisateur se connecte au serveur, on lui attribue un socket et démarre un callback
io.on('connection', socket => {
  //On écoute si ce socket (utilisateur) envoie certaines émissions
  //S'il envoie 'new-user', on va broadcast (à tout le monde sauf le sender) un message 'user-conncted' avec son nom.
  socket.on('new-user', data => {
    users[socket.id] = new User(socket.id, data.name, data.color); //On stocke le nom dans la case de l'id du socket dans le tableau 'users'.
    usersToEmit.push(users[socket.id]); //On stocke le même utilisateur dans le tableau usersToEmit.
    io.emit('update-list', usersToEmit); //Émission de la liste des utilisateurs mise à jour
    socket.broadcast.emit('user-connected', {name: users[socket.id].name, color: users[socket.id].color}); //Émission du message broadcast
  });

  //S'il envoie 'send-chat-message' on envoie en broadcast (à tout le monde sauf le sender) le message avec le nom d'utilisateur.
  socket.on('send-chat-message', data => {
    socket.broadcast.emit('chat-message', { message: data.message, name: users[socket.id].name, color: users[socket.id].color});
  });

  //S'il se déconnecte, on envoie un message en broadcast de déconnexion, et on supprime l'entrée dans le tableau.
  socket.on('disconnect', () => {
    if(users[socket.id] != null)
    {
      //On émet l'évement déconnexion de l'utilisateur
      socket.broadcast.emit('user-disconnected', {name: users[socket.id].name, color: users[socket.id].color});
      delete users[socket.id]; //suppression de l'utilisateur du tableau users

      //On cherche l'index de l'utilisateur grâce à son ID dans usersToEmit pour mettre à jour la liste
      usersToEmit.splice(usersToEmit.findIndex(user => user.id === socket.id),1);
      io.emit('update-list', usersToEmit); //On émet la mise à jour
    }
  });
});
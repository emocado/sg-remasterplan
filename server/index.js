const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom, removePlanningArea, addCard, addTableToken, removeIndividualToken, addIndividualToken, removeTableToken, addPermanentIndividualToken, addPermanentIndividualTokenBackToUser } = require('./users');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

// const tokenArr = ['environment', 'economy', 'defence', 'housing', 'tourism', 'reserve']
// const tokenIndex = {'environment': 0, 'economy': 1, 'defence': 2, 'housing': 3, 'tourism': 4, 'reserve': 5}
// const planningAreas = ['limchukang', 'punggol','museum','seletar','pasirris','bedok','mandai','sembawang']

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if(error) return callback(error);
    
    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { users: getUsersInRoom(user.room), tableToken: user.tableToken, planningAreas: user.planningAreas, cards: user.cards });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('deletePlanningArea', (planningArea, callback) => {
    const user = getUser(socket.id);
    removePlanningArea(socket.id, planningArea, user.room)
    io.to(user.room).emit('roomData', { users: getUsersInRoom(user.room), tableToken: user.tableToken, planningAreas: user.planningAreas, cards: user.cards });
  })

  socket.on('addCardToStorage', (card, callback) => {
    const user = getUser(socket.id);
    addCard(socket.id, card)
    io.to(user.room).emit('roomData', { users: getUsersInRoom(user.room), tableToken: user.tableToken, planningAreas: user.planningAreas, cards: user.cards });
  })

  socket.on('giveBackToken', (tokenName, callback) => {
    const user = getUser(socket.id);
    if (removeIndividualToken(socket.id, tokenName)) {
      addTableToken(socket.id, tokenName)
      io.to(user.room).emit('roomData', { users: getUsersInRoom(user.room), tableToken: user.tableToken, planningAreas: user.planningAreas, cards: user.cards });
    }
  })

  socket.on('addToken', (tokenName, callback) => {
    const user = getUser(socket.id);
    if (removeTableToken(socket.id, tokenName)) {
      addIndividualToken(socket.id, tokenName)
    }

    io.to(user.room).emit('roomData', { users: getUsersInRoom(user.room), tableToken: user.tableToken, planningAreas: user.planningAreas, cards: user.cards });
  })

  socket.on('addPermanentTokenBackToUser', (nothingHere, callback) => {
    const user = getUser(socket.id);
    addPermanentIndividualTokenBackToUser(socket.id)
    io.to(user.room).emit('roomData', { users: getUsersInRoom(user.room), tableToken: user.tableToken, planningAreas: user.planningAreas, cards: user.cards });
  })

  socket.on('addPermanentToken', (tokenName, callback) => {
    const user = getUser(socket.id);
    addPermanentIndividualToken(socket.id, tokenName)
    io.to(user.room).emit('roomData', { users: getUsersInRoom(user.room), tableToken: user.tableToken, planningAreas: user.planningAreas, cards: user.cards });
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { users: getUsersInRoom(user.room), tableToken: user.tableToken, planningAreas: user.planningAreas, cards: user.cards });
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));
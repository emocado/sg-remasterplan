const users = [];
const agencies = ['npb', 'edb', 'mindef', 'hdb', 'stb']
const agencyPrivilege = {'npb': 'environment', 'edb': 'economy', 'mindef': 'defence', 'hdb': 'housing', 'stb': 'tourism'}
const tokenArr = ['environment', 'economy', 'defence', 'housing', 'tourism', 'reserve']

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  const tokens = [0,0,0,0,0,0,0,0,0,0,0,0]
  const cards = []
  let planningAreas
  let tableToken


  const existingUser = users.find((user) => user.room === room && user.name === name);
  const usersInRoom = getUsersInRoom(room).map((user) => user.agency)
  const agency = agencies.filter((agency) => !usersInRoom.includes(agency))[0]

  if(!name || !room) return { error: 'Username and room are required.' };
  if(existingUser) return { error: 'Username is taken.' };
  if(usersInRoom.length >= 5) return { error: 'Room is full.' };


  // if room is empty start of with default tableToken if not use the existing room tableToken
  // if room is empty start of with default planningAreas if not use the existing room planningAreas
  if (usersInRoom.length === 0) {
    tableToken = [9,9,9,9,9,5]
    planningAreas = ['limchukang', 'punggol','museum','seletar','pasirris','bedok','mandai','sembawang']
  } else {
    let userWithSameRoom = getUsersInRoom(room)[0]
    tableToken = userWithSameRoom.tableToken
    planningAreas = userWithSameRoom.planningAreas
  }

  // add privilege token to tokens
  const privilegeTokenIndex = tokenArr.findIndex((ele) => ele === agencyPrivilege[agency])
  tokens[privilegeTokenIndex] += 1

  const user = { id, name, room, tokens, tableToken, agency, planningAreas, cards };
  users.push(user);

  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

const removePlanningArea = (id, planningArea, room) => {
  const userIndex = users.findIndex((user) => user.id === id);
  const areaIndex = users[userIndex].planningAreas.findIndex((area) => area === planningArea)
  for (let i = 0; i < users.length; i++) {
    if (users[i].room === room) {
      users[i].planningAreas.splice(areaIndex, 1)
      break
    }
  }
}

const addCard = (id, card) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      users[i].cards.push(card)
      return users[i].cards
    }    
  }
}

const addTableToken = (id, tokenName) => {
  const tokenIndex = tokenArr.findIndex((ele) => ele === tokenName);
  const userIndex = users.findIndex((user) => user.id === id);
  users[userIndex].tableToken[tokenIndex] += 1
}

const removeTableToken = (id, tokenName) => {
  const tokenIndex = tokenArr.findIndex((ele) => ele === tokenName);
  const userIndex = users.findIndex((user) => user.id === id);
  if (users[userIndex].tableToken[tokenIndex] > 0) {
    users[userIndex].tableToken[tokenIndex] -= 1
    return true
  }
  return false
}


const removeIndividualToken = (id, tokenName) => {
  const tokenIndex = tokenArr.findIndex((ele) => ele === tokenName);
  const userIndex = users.findIndex((user) => user.id === id);
  if (users[userIndex].tokens[tokenIndex] > 0) {
  users[userIndex].tokens[tokenIndex] -= 1
  return true
  }
  return false
}

const addIndividualToken = (id, tokenName) => {
  const tokenIndex = tokenArr.findIndex((ele) => ele === tokenName);
  const userIndex = users.findIndex((user) => user.id === id);
  users[userIndex].tokens[tokenIndex] += 1
}

const addPermanentIndividualToken = (id, tokenName) => {
  const tokenIndex = tokenArr.findIndex((ele) => ele === tokenName);
  const userIndex = users.findIndex((user) => user.id === id);
  users[userIndex].tokens[tokenIndex+6] += 1
}

const addPermanentIndividualTokenBackToUser = (id) => {
  const userIndex = users.findIndex((user) => user.id === id);
  const tokenLengthHalf = users[userIndex].tokens.length/2
  for (let i = 0; i < tokenLengthHalf; i++) {
    users[userIndex].tokens[i] += users[userIndex].tokens[i+6]
  }
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom, removePlanningArea, addCard, addTableToken, removeIndividualToken, addIndividualToken, removeTableToken, addPermanentIndividualToken, addPermanentIndividualTokenBackToUser };
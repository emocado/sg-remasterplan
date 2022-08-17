import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import BankToken from '../BankToken/BankToken';
import Card from '../Card/Card';
import CardModal from "../CardModal/CardModal";

import Modal from '../Modal/Modal';

import './Chat.css';

// const ENDPOINT = 'https://singapore-rediscovers.herokuapp.com/';
const ENDPOINT = 'http://localhost:5000/';

let socket;

const tokenArr = ['environment', 'economy', 'defence', 'housing', 'tourism', 'reserve']
// const tokenIndex = {'environment': 0, 'economy': 1, 'defence': 2, 'housing': 3, 'tourism': 4, 'reserve': 5}
// const areas = ['limchukang', 'punggol','museum','seletar','pasirris','bedok','mandai','sembawang']
const cost = {'limchukang': {'environment': 0, 'economy': 6, 'defence': 4, 'housing': 0, 'tourism': 0},
              'punggol': {'environment': 3, 'economy': 3, 'defence': 0, 'housing': 4, 'tourism': 0},
              'museum': {'environment': 0, 'economy': 3, 'defence': 0, 'housing': 0, 'tourism': 7}, 
              'seletar': {'environment': 0, 'economy': 5, 'defence': 3, 'housing': 3, 'tourism': 4}, 
              'pasirris': {'environment': 0, 'economy': 3, 'defence': 0, 'housing': 3, 'tourism': 0}, 
              'bedok': {'environment': 2, 'economy': 0, 'defence': 2, 'housing': 3, 'tourism': 3}, 
              'mandai': {'environment': 0, 'economy': 4, 'defence': 0, 'housing': 0, 'tourism': 0}, 
              'sembawang': {'environment': 0, 'economy': 1, 'defence': 2, 'housing': 1, 'tourism': 2} 
            }

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [tableToken, setTableToken] = useState([]);
  const [cards, setCards] = useState([]);
  const [cardsModal, setCardsModal] = useState(false);

  // const [players, setPlayers] = useState([])
  const [modalOpen, setModalOpen] = useState(false);
  const [planningArea, setPlanningArea] = useState('');
  const [planningAreas, setPlanningAreas] = useState(['limchukang', 'punggol','museum','seletar','pasirris','bedok','mandai','sembawang']);

  const thisUserTokens = () => {
    const thisUser = users.find((user) => user.name === name)
    let tokenObj = {}
    const tokens = thisUser.tokens
    for (let i = 0; i < tokens.length; i++) {
      tokenObj[tokenArr[i]] = tokens[i]      
    }
    return tokenObj
  }

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users, tableToken, planningAreas, cards }) => {
      setTableToken(tableToken);
      setUsers(users);
      setPlanningAreas(planningAreas);
      setCards(cards)
    });
}, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      {cardsModal && <CardModal setCardsModal={setCardsModal} cards={cards} setModalOpen={setModalOpen} setPlanningArea={setPlanningArea} />}
      {modalOpen && <Modal setModalOpen={setModalOpen} planningArea={planningArea} socket={socket} thisUserTokens={thisUserTokens} cardsModal={cardsModal} />}
      <div className="newestContainer">
        <div className="newContainer">
          {tokenArr.map((token, index) => (
            <BankToken key={index} token={token} numToken={tableToken[index]} socket={socket} />
          )
          )}
        </div>
        <div className="grid-container">
          {planningAreas.map((area, index) => (
            <Card key={index} area={area} setModalOpen={setModalOpen} setPlanningArea={setPlanningArea}/>
          ))}
        </div>
      </div>

      <div className="newContainer">
        <TextContainer users={users} socket={socket} username={name} setModalOpen={setModalOpen} setPlanningArea={setPlanningArea} setCardsModal={setCardsModal} setCards={setCards} />
        <div className="container">
            <InfoBar room={room} />
            <Messages messages={messages} name={name} />
            <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
}

export default Chat;

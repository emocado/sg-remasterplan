import React from 'react';

// import onlineIcon from '../../icons/onlineIcon.png';
import Token from '../Token/Token'
import CardModal from '../CardModal/CardModal'

import './TextContainer.css';

const tokenArr = ['environment', 'economy', 'defence', 'housing', 'tourism', 'reserve']
// const tokenIndex = {'environment': 0, 'economy': 1, 'defence': 2, 'housing': 3, 'tourism': 4, 'reserve': 5}


const TextContainer = ({ users, socket, username, setModalOpen, setPlanningArea, setCardsModal, setCards }) => {
  
  const openModal = (area) => {
    setModalOpen(true);
    setPlanningArea(area)
  };

  return (
  <div className="textContainer">
    {
      users
        ? (
          <div>
            <div className="activeContainer">
              <h2>
                {users.map(({name, tokens, agency, cards}) => (
                  <div key={name} className="activeItem">
                    <div className='agency' onClick={()=>openModal(agency)}>
                      <img alt="Online Icon" src={require(`../../icons/${agency}.png`)}/>
                    </div>
                    <div className='playerName' onClick={()=>{
                      setCardsModal(true)
                      setCards(cards)
                      }}>
                      {name}
                    </div>
                    {tokenArr.map((token, index)=>{
                      const numToken = tokens[index]
                      const nameMatch = username === name
                      return <Token key={index} token={token} numToken={numToken} socket={socket} nameMatch={nameMatch}/>
                    })}
                  </div>
                ))}
              </h2>
            </div>
          </div>
        )
        : null
    }
  </div>
);}

export default TextContainer;
import React, { useState, useEffect } from "react";
import "./Modal.css";
const agencies = ['npb', 'edb', 'mindef', 'hdb', 'stb']

const cost = {'limchukang': {'environment': 0, 'economy': 6, 'defence': 4, 'housing': 0, 'tourism': 0, 'environmentBonus': 0, 'economyBonus': 1, 'defenceBonus': 0, 'housingBonus': 0, 'tourismBonus': 0},
              'punggol': {'environment': 3, 'economy': 3, 'defence': 0, 'housing': 4, 'tourism': 0, 'environmentBonus': 0, 'economyBonus': 0, 'defenceBonus': 0, 'housingBonus': 1, 'tourismBonus': 0},
              'museum': {'environment': 0, 'economy': 3, 'defence': 0, 'housing': 0, 'tourism': 7, 'environmentBonus': 0, 'economyBonus': 0, 'defenceBonus': 0, 'housingBonus': 0, 'tourismBonus': 1}, 
              'seletar': {'environment': 0, 'economy': 5, 'defence': 3, 'housing': 3, 'tourism': 4, 'environmentBonus': 0, 'economyBonus': 1, 'defenceBonus': 0, 'housingBonus': 0, 'tourismBonus': 0}, 
              'pasirris': {'environment': 0, 'economy': 3, 'defence': 0, 'housing': 3, 'tourism': 0, 'environmentBonus': 0, 'economyBonus': 0, 'defenceBonus': 0, 'housingBonus': 1, 'tourismBonus': 0}, 
              'bedok': {'environment': 2, 'economy': 0, 'defence': 2, 'housing': 3, 'tourism': 3, 'environmentBonus': 0, 'economyBonus': 0, 'defenceBonus': 0, 'housingBonus': 1, 'tourismBonus': 0}, 
              'mandai': {'environment': 0, 'economy': 4, 'defence': 0, 'housing': 0, 'tourism': 0, 'environmentBonus': 0, 'economyBonus': 1, 'defenceBonus': 0, 'housingBonus': 0, 'tourismBonus': 0}, 
              'sembawang': {'environment': 0, 'economy': 1, 'defence': 2, 'housing': 1, 'tourism': 2, 'environmentBonus': 0, 'economyBonus': 0, 'defenceBonus': 1, 'housingBonus': 0, 'tourismBonus': 0} 
            }
const tokenArr = ['environment', 'economy', 'defence', 'housing', 'tourism', 'reserve']

function Modal({ setModalOpen, planningArea, socket, thisUserTokens, cardsModal}) {
  const [isCardBack, setIsCardBack] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState(false)
  const [realAcquire, setRealAcquire] = useState(false)

  const isAgency = agencies.includes(planningArea)
  const message = "Please let other players in the chat know that you want to acquire this card. Other players can challenge you"
  const tokenObj = thisUserTokens()
  const isEnoughTokens = () => {
    for (let i = 0; i < tokenArr.length; i++) {
      let tokenName = tokenArr[i];
      if (cost[planningArea][tokenName] > tokenObj[tokenName]) {
        return false
      }
    }
    return true
  }

  const deletePlanningArea = () => {
    setModalOpen(false)
    setRealAcquire(false)
    if (isEnoughTokens()) {
      const tokenObj = cost[planningArea]
      tokenArr.forEach(tokenName => {
        let bonus = tokenObj[`${tokenName}Bonus`]
        if (bonus) {
          socket.emit('addPermanentToken', tokenName, () => {})
        }
        for (let i = 0; i < tokenObj[tokenName]; i++) {
          socket.emit('giveBackToken', tokenName, () => {});             
        }
      });
      socket.emit('addPermanentTokenBackToUser', true, () => {});
      socket.emit('deletePlanningArea', planningArea, () => {});
      socket.emit('addCardToStorage', planningArea, () => {});
    } else {
      alert("Not enough tokens!")
    }
  }

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setModalOpen(false);
              setConfirmMessage(false);
            }}
          >
            X
          </button>
        </div>
        {/* <div className="title">
          <h1>Are You Sure You Want to Continue?</h1>
        </div> */}
        <div className="body">
          <div className="card-display">
            {confirmMessage? message: isCardBack ? <img src={require(`../../icons/${planningArea}-back.png`)} alt="button" /> : <img src={require(`../../icons/${planningArea}.png`)} alt="button" />}
          </div>
        </div>
        <div className="footer">
          {!isAgency && !cardsModal && !confirmMessage && <button
            onClick={() => {
              setConfirmMessage(true);
              setRealAcquire(true);
            }}
            id="cancelBtn"
          >
            Acquire
          </button>}

          {realAcquire && <button id="cancelBtn" onClick={()=>deletePlanningArea()}>Acquire</button>}

          <button onClick={()=>{
            setIsCardBack(!isCardBack)
            setConfirmMessage(false)
            }}>
              {confirmMessage? "Back":"Flip Card"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
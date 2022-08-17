import React, { useState, useEffect } from "react";
import Card from "../Card/Card"
import './CardModal.css';

const agencies = ['npb', 'edb', 'mindef', 'hdb', 'stb']

const tokenArr = ['environment', 'economy', 'defence', 'housing', 'tourism', 'reserve']

function CardModal({ setCardsModal, cards, setModalOpen, setPlanningArea }) {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setCardsModal(false);
            }}
          >
            X
          </button>
        </div>

        <div className="body">
          <div className="grid-container">
          {cards.length !== 0 ? cards.map((area, index) => (
            <Card key={index} area={area} setModalOpen={setModalOpen} setPlanningArea={setPlanningArea} isStorage={true} />
          )): "You have not acquired any cards yet"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardModal;
import React from "react";
import './Card.css';

const Card = ({ area, setModalOpen, setPlanningArea, isStorage }) => {
    const openModal = () => {
        setModalOpen(true);
        setPlanningArea(area);
    };


    return (
    <div className="grid-item">
        <button onClick={()=>openModal()} className={isStorage? "storageButton":"cardButton"}>
            <img src={require(`../../icons/${area}.png`)} alt="button" />
        </button>
    </div>
    )
}

export default Card;
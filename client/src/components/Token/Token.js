import React from 'react';
import './Token.css';

const Token = ({token, numToken, socket, nameMatch}) => {
    const giveBackToken = (event) => {
        event.preventDefault();
        if (nameMatch) {
            socket.emit('giveBackToken', token, () => {});
            
        }
    }
    return (
        <div className='tokenContainer'>
            <button className='token' onClick={(e) => giveBackToken(e)}>
                <img alt="Online Icon" src={require(`../../icons/${token}.png`)}/>
            </button>
            <div>
                {numToken}
            </div>
        </div>
    )
}

export default Token;
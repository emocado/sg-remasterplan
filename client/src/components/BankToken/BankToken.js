import React from 'react';

const BankToken = ({token, numToken, socket}) => {
    const addToken = (event) => {
        event.preventDefault();
        socket.emit('addToken', token, ()=>{});
    }
    return (
        <div>
            <button onClick={e => addToken(e)}>
                <img alt="Online Icon" src={require(`../../icons/${token}.png`)}/>
                {numToken}
            </button>
        </div>
    )
}

export default BankToken;
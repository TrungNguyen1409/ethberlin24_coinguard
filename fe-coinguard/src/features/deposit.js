// src/components/Deposit.js
import React, { useState } from 'react';
import axios from 'axios';

const Deposit = () => {
  const [note, setNote] = useState('');

  const handleDeposit = async (currency, amount) => {
    try {
      const response = await axios.post('http://localhost:3001/deposit', { currency, amount });
      setNote(response.data.note);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={() => handleDeposit('eth', '0.1')}>Deposit 0.1 ETH</button>
      {note && <p>Your note: {note}</p>}
    </div>
  );
};

export default Deposit;

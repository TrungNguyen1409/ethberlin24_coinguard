// src/components/Deposit.js
import React, { useState } from 'react';
import axios from 'axios';
import {Button} from "antd";
const Deposit = () => {
  const [note, setNote] = useState('');

  const handleDeposit = async (currency, amount) => {
    try {
      const response = await axios.post('http://localhost:3001/deposit', { currency, amount });
      console.log("hitting the route")
      setNote(response.data.note);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => handleDeposit('eth', '0.1')}>Deposit in Incognito</Button>
      {note && <p>Your note: {note}</p>}
    </div>
  );
};

export default Deposit;

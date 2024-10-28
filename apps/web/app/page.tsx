'use client'
import { useState } from 'react';
import { useSocket } from '../context/SocketProvider';
import classes from './page.module.css';

export default function Page() {

  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState('');

  return (
    <div className={classes["main-page"]}>
      <div>
        <h1>
          All messages
        </h1>
        <div>
          {
            messages.map((val, idx) => {
              return (
                <li key={idx}>{val}</li>
              )
            })
          }
        </div>
      </div>
      <div>
        <input type="text" onChange={e => setMessage(e.target.value)} className={classes["input-box"]} />
        <button onClick={e => sendMessage(message)} className={classes["button"]}>Send</button>
      </div>
    </div>
  )
}
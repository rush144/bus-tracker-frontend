import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './style.css';

// 👇 Setup socket connection with auth
const socket = io('https://bus-tracker-production-93a5.up.railway.app', {
  auth: {
    token: localStorage.getItem('token'),
  },
});

// 👇 Decode JWT to get user info
let userInfo = { username: '', role: '' };
try {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = jwtDecode(token);
    userInfo = {
      username: decoded.username,
      role: decoded.role,
    };
  }
} catch (err) {
  console.error('Failed to decode token:', err);
}

export function GlobalChat() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatBoxRef = useRef(null);

  // Load chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await axios.get('https://bus-tracker-production-93a5.up.railway.app/api/chat');
        setChat(res.data);
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };
    fetchChatHistory();
  }, []);

  // Listen for real-time incoming chat messages
  useEffect(() => {
    socket.on('chatMessage', (msgData) => {
      setChat((prev) => [...prev, msgData]);
    });

    return () => {
      socket.off('chatMessage');
    };
  }, []);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('chatMessage', {
        username: userInfo.username,
        role: userInfo.role,
        text: message,
      });
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <h3>🗨️ Global Chat</h3>
      <div className="chat-box" ref={chatBoxRef}>
        {chat.map((msg, idx) => {
          const isMine = msg.username === userInfo.username;
          return (
            <div
              key={idx}
              className={`chat-msg ${isMine ? 'mine' : ''}`}
              data-role={msg.role}
            >
              <span className="chat-meta">
                <strong>{msg.username} ({msg.role})</strong> — {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
              <div className="chat-text">{msg.message || msg.text}</div>
            </div>
          );
        })}
      </div>
      <div className="chat-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

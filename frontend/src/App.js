import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import "./App.css"

const colors = [
  '#2196F3', '#32c787', '#00BCD4', '#ff5652',
  '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

const ChatApp = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [stompClient, setStompClient] = useState(null);

  const messageAreaRef = useRef(null);
  const connectingRef = useRef(null);

  const handleUsernameSubmit = (event) => {
    event.preventDefault();
    if (username.trim()) {
      connect();
    }
  };

  const connect = () => {
    if (username && !stompClient) { // Only connect if stompClient is null
      const socket = new SockJS('http://backend:8080/ws');
      const stompClientInstance = Stomp.over(socket);
      stompClientInstance.connect({}, onConnected, onError);
      setStompClient(stompClientInstance);
    }
  };
  

  const onConnected = () => {
    stompClient.subscribe('/topic/public', onMessageReceived);
    stompClient.send("/app/chat.addUser", {}, JSON.stringify({ sender: username, messageType: 'JOIN' }));

    setConnected(true);
    connectingRef.current.classList.add('hidden');
    
    fetchPreviousMessages();
  };

  const fetchPreviousMessages = () => {
    fetch('/api/messages')
      .then(response => response.json())
      .then(fetchedMessages => {
        setMessages(prevMessages => [...prevMessages, ...fetchedMessages]);
      })
      .catch(error => {
        console.error('Error fetching previous messages:', error);
        connectingRef.current.textContent = 'Could not retrieve previous messages.';
        connectingRef.current.style.color = 'red';
      });
  };

  const onError = (error) => {
    connectingRef.current.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingRef.current.style.color = 'red';
  };

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    if (message.trim() && stompClient) {
      const chatMessage = {
        sender: username,
        content: message,
        messageType: 'CHAT',
      };
      stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
      setMessage('');
    }
  };

  const onMessageReceived = (payload) => {
    const receivedMessage = JSON.parse(payload.body);
    setMessages(prevMessages => [...prevMessages, receivedMessage]);
  };

  const displayMessages = () => {
    return messages.map((message, index) => {
      let messageElement;
      if (message.messageType === 'JOIN') {
        messageElement = <li key={index} className="event-message">{message.sender} joined!</li>;
      } else if (message.messageType === 'LEAVE') {
        messageElement = <li key={index} className="event-message">{message.sender} left!</li>;
      } else {
        messageElement = (
          <li key={index} className="chat-message">
            <i style={{ backgroundColor: getAvatarColor(message.sender) }}>{message.sender[0]}</i>
            <span>{message.sender}</span>
            <p>{message.content}</p>
          </li>
        );
      }
      return messageElement;
    });
  };

  const getAvatarColor = (messageSender) => {
    let hash = 0;
    for (let i = 0; i < messageSender.length; i++) {
      hash = 31 * hash + messageSender.charCodeAt(i);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      
      {!connected ? (
        <div id="username-page" className="flex items-center justify-center min-h-screen flex-col">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Peter's Live Chat App
          </h1>

          <form
            id="usernameForm"
            onSubmit={handleUsernameSubmit}
            className="flex flex-col content-center items-center justify-center space-y-4 w-full max-w-md p-4 bg-white shadow-md rounded"
          >
            
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="w-full p-2 rounded bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Start Chat
            </button>
          </form>
      </div>
      
      ) : (
        <div id="chat-page" className="h-full">
          <ul id="messageArea" ref={messageAreaRef} className="list-none overflow-auto p-5 h-[calc(100%-150px)] bg-white">
            {displayMessages()}
          </ul>
          <form id="messageForm" onSubmit={handleMessageSubmit} className="p-5 flex items-center">
            <input
              type="text"
              id="message"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-control flex-1 p-2 rounded border border-gray-300"
            />
            <button type="submit" className="primary w-20 ml-2 p-2 bg-green-500 text-white rounded">Send</button>
          </form>
        </div>
      )}
      <div className="connecting text-center text-gray-500 top-16 w-full" ref={connectingRef}>Connecting...</div>
    </div>
  );
};

export default ChatApp;

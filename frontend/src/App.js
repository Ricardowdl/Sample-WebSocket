import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // 创建 WebSocket 连接
    socketRef.current = new WebSocket('ws://localhost:8080');
    socketRef.current.onopen = () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      setMessages(prevMessages => [...prevMessages, 'Connected to WebSocket server!']);
    };

    socketRef.current.onmessage = (event) => {
      console.log('Message from server ', event.data);
      setMessages(prevMessages => [...prevMessages, `Server: ${event.data}`]);
    };

    socketRef.current.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
      setMessages(prevMessages => [...prevMessages, 'Disconnected from WebSocket server!']);
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error: ', error);
      setMessages(prevMessages => [...prevMessages, 'WebSocket error!']);
    };

    // 清理函数：组件卸载时关闭 WebSocket 连接
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []); // 空依赖数组表示仅在组件挂载和卸载时运行

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const sendMessage = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && inputValue) {
      socketRef.current.send(inputValue);
      setMessages(prevMessages => [...prevMessages, `You: ${inputValue}`]);
      setInputValue(''); // 清空输入框
    } else {
      setMessages(prevMessages => [...prevMessages, 'Cannot send message. WebSocket is not connected or input is empty.']);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React WebSocket Client</h1>
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter message to send"
          />
          <button onClick={sendMessage} disabled={!isConnected}>
            Send Message
          </button>
        </div>
        <div>
          <h2>Messages:</h2>
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
        <p>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      </header>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";

const WebSocketComponent = () => {
  const [userId, setUserId] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (connected && userId) {
      // WebSocket 서버에 연결
      const ws = new WebSocket(
        `wss://unbiased-evenly-worm.ngrok-free.app/join?userId=${userId}`
      );

      ws.onopen = () => {
        console.log(`WebSocket connection established for user ${userId}`);
        setMessage(`Connected as user ${userId}`);
      };

      ws.onmessage = (event) => {
        setMessage(event.data); // 서버로부터 받은 메시지 처리
      };

      ws.onclose = () => {
        console.log(`WebSocket connection closed for user ${userId}`);
      };

      setSocket(ws);

      // 컴포넌트가 언마운트될 때 WebSocket을 닫음
      return () => {
        if (ws) ws.close();
      };
    }
  }, [connected, userId]);

  const handleConnect = () => {
    if (userId && toUserId) {
      setConnected(true);
    } else {
      alert("Please enter both your ID and the target ID.");
    }
  };

  const sendMessage = () => {
    if (socket && inputMessage) {
      socket.send(`TO:${toUserId}|MESSAGE:${inputMessage}`); // 대상 사용자에게 메시지 전송
      setInputMessage(""); // 메시지 입력 초기화
    }
  };

  return (
    <div>
      {!connected ? (
        <div>
          <h2>Enter your ID and the recipient's ID to connect</h2>
          <input
            type="text"
            placeholder="Your ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Recipient ID"
            value={toUserId}
            onChange={(e) => setToUserId(e.target.value)}
          />
          <button onClick={handleConnect}>Connect</button>
        </div>
      ) : (
        <div>
          <h2>
            User {userId}: Send Message to {toUserId}
          </h2>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Enter message"
          />
          <button onClick={sendMessage}>Send Message to {toUserId}</button>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default WebSocketComponent;

import React, { useEffect, useState } from "react";

const WebSocketComponent = () => {
  const [userId, setUserId] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [socket, setSocket] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]); // 받은 메시지 저장

  useEffect(() => {
    if (connected && userId) {
      // WebSocket 서버에 연결
      const ws = new WebSocket(
        `wss://unbiased-evenly-worm.ngrok-free.app/join?userId=${userId}`
      );

      ws.onopen = () => {
        console.log(`WebSocket connection established for user ${userId}`);
        setMessages((prevMessages) => [
          ...prevMessages,
          `Connected as user ${userId}`,
        ]);
      };

      ws.onmessage = (event) => {
        setMessages((prevMessages) => [...prevMessages, event.data]); // 서버로부터 받은 메시지 저장
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
      setMessages((prevMessages) => [...prevMessages, `You: ${inputMessage}`]); // 자신이 보낸 메시지도 추가
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

          <h3>Messages:</h3>
          <div
            style={{
              border: "1px solid black",
              height: "200px",
              overflowY: "scroll",
              padding: "10px",
            }}
          >
            {messages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebSocketComponent;

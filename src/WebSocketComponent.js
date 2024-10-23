import React, { useEffect, useState } from "react";

const WebSocketComponent = () => {
  const [userId, setUserId] = useState(""); // 내 ID
  const [toUserId, setToUserId] = useState(""); // 상대방 ID (알림을 보낸 사용자)
  const [socket, setSocket] = useState(null);
  const [inputMessage, setInputMessage] = useState(""); // 보낼 메시지
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]); // 알림 저장
  const [currentNotification, setCurrentNotification] = useState(null); // 현재 알림
  const [responses, setResponses] = useState([]); // 응답 저장
  const [roomCode, setRoomCode] = useState(""); // 방 코드 저장

  // WebSocket 연결 설정
  useEffect(() => {
    let pingInterval;

    if (connected && userId) {
      const ws = new WebSocket(
        `wss://unbiased-evenly-worm.ngrok-free.app/join?userId=${userId}`
      );

      ws.onopen = () => {
        console.log(`WebSocket connection established for user ${userId}`);

        // 주기적으로 서버에 ping 메시지를 전송 (30초마다)
        pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send("ping"); // 서버로 ping 메시지 전송
          }
        }, 30000); // 30초마다 ping 전송
      };

      ws.onmessage = (event) => {
        const data = event.data;
        console.log("Received data:", data); // 수신된 데이터를 로그로 출력
        if (data.startsWith("ALERT:")) {
          const notification = data.replace("ALERT: ", "");
          setCurrentNotification(notification); // 알림을 저장

          // 알림을 보낸 사람의 ID 추출 (예: "ALERT: 메시지 (from 1)")
          const senderId = data.split("from ")[1].replace(")", ""); // 보낸 사람 ID 추출
          setToUserId(senderId); // 알림을 보낸 사람의 ID 저장
        } else if (data.startsWith("RESPONSE:")) {
          const response = data.replace("RESPONSE: ", "");
          console.log("Response received:", response); // 응답이 올바르게 수신되었는지 확인
          setResponses((prevResponses) => [...prevResponses, response]); // 응답 메시지 저장
        } else if (data.startsWith("Room code:")) {
          const roomCode = data.replace("Room code: ", "");
          setRoomCode(roomCode); // 방 코드 저장
          console.log("Room code received:", roomCode);
        }
      };

      ws.onclose = () => {
        console.log(`WebSocket connection closed for user ${userId}`);
        clearInterval(pingInterval); // 연결이 닫히면 ping 전송 중단
      };

      setSocket(ws);

      return () => {
        if (ws) ws.close();
        clearInterval(pingInterval); // 컴포넌트가 언마운트되면 ping 전송 중단
      };
    }
  }, [connected, userId]);

  // 사용자 로그인 (연결 시작)
  const handleLogin = () => {
    if (userId) {
      setConnected(true);
    } else {
      alert("Please enter your ID to log in.");
    }
  };

  // 메시지 전송
  const sendNotification = () => {
    if (socket && inputMessage) {
      // 상대방 ID가 입력되지 않으면 메시지를 모든 사용자에게 보냄
      const targetUserId = toUserId ? `TO:${toUserId}` : "TO:ALL";
      socket.send(`ALERT:${targetUserId}|MESSAGE:${inputMessage}`);
      setInputMessage(""); // 메시지 입력 초기화
    }
  };

  const handleResponse = (response) => {
    if (socket && currentNotification && toUserId) {
      socket.send(`RESPONSE:TO:${toUserId}|MESSAGE:${response}`); // 알림을 보낸 사람에게 응답 전송
      setCurrentNotification(null); // 현재 알림 초기화
    } else {
      console.error("No toUserId or current notification found.");
    }
  };

  return (
    <div>
      {!connected ? (
        <div>
          <h2>Login with your ID</h2>
          <input
            type="text"
            placeholder="Your ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Logged in as {userId}</h2>
          <input
            type="text"
            placeholder="Recipient ID (optional)"
            value={toUserId}
            onChange={(e) => setToUserId(e.target.value)}
          />
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Enter notification message"
          />
          <button onClick={sendNotification}>Send Notification</button>

          <h3>Notifications:</h3>
          <div
            style={{
              border: "1px solid black",
              height: "200px",
              overflowY: "scroll",
              padding: "10px",
            }}
          >
            {notifications.map((notification, index) => (
              <p key={index}>{notification}</p>
            ))}
          </div>

          {currentNotification && (
            <div>
              <h3>New Notification: {currentNotification}</h3>
              <button onClick={() => handleResponse("Accepted")}>Accept</button>
              <button onClick={() => handleResponse("Rejected")}>Reject</button>
            </div>
          )}

          <h3>Responses:</h3>
          <div
            style={{
              border: "1px solid black",
              height: "100px",
              overflowY: "scroll",
              padding: "10px",
            }}
          >
            {responses.length > 0 ? (
              responses.map((response, index) => <p key={index}>{response}</p>)
            ) : (
              <p>No responses yet</p>
            )}
          </div>

          <h3>Room Code:</h3>
          {roomCode ? <p>{roomCode}</p> : <p>No room code yet</p>}
        </div>
      )}
    </div>
  );
};

export default WebSocketComponent;

import React, { useEffect, useState } from "react";

const MeetingRequestA = () => {
  const userId = "A"; // 고정된 A 사용자
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
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
  }, [userId]);

  return (
    <div>
      <h2>User A: Connected</h2>
      <p>{message}</p>
    </div>
  );
};

export default MeetingRequestA;

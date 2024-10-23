import React, { useState, useEffect } from "react";

const MeetingRequest = () => {
  const [message, setMessage] = useState("");
  const userId = "A"; // 사용자 A의 ID
  const roomId = "123"; // 방 ID, 고정 값이거나 동적으로 설정 가능

  useEffect(() => {
    const socket = new WebSocket(
      `wss://unbiased-evenly-worm.ngrok-free.app/voice-chat?roomId=${roomId}`
    );

    socket.onopen = () => {
      console.log("WebSocket connection established for user A");
      socket.send("A has connected to room " + roomId);
    };

    socket.onmessage = (event) => {
      setMessage(event.data); // 서버로부터 받은 메시지
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed for user A");
    };

    return () => {
      socket.close(); // 컴포넌트가 unmount될 때 WebSocket 연결 종료
    };
  }, []);

  return (
    <div>
      <h2>User A (Room {roomId})</h2>
      <p>Message from Server: {message}</p>
    </div>
  );
};

export default MeetingRequest;

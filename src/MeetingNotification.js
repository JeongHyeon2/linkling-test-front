import React, { useEffect, useState } from "react";

const MeetingNotification = ({ userId }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const ws = new WebSocket(
      `wss://unbiased-evenly-worm.ngrok-free.app/match?userId=${userId}`
    );

    ws.onopen = () => {
      console.log(`WebSocket connection established for user ${userId}`);
    };

    ws.onmessage = (event) => {
      setMessage(event.data); // A로부터 매칭 요청을 받음
    };

    ws.onclose = () => {
      console.log(`WebSocket connection closed for user ${userId}`);
    };

    setSocket(ws);

    return () => {
      if (ws) ws.close();
    };
  }, [userId]);

  const acceptMatchRequest = () => {
    if (socket) {
      socket.send(`ACCEPT:A`);
      setMessage("Match request accepted.");
    }
  };

  return (
    <div>
      <h2>User {userId}: Accept Match Request</h2>
      {message.includes("wants to match") && (
        <button onClick={acceptMatchRequest}>Accept Match Request</button>
      )}
      <p>{message}</p>
    </div>
  );
};

export default MeetingNotification;

import React, { useEffect, useState } from "react";

const MeetingRequest = ({ userId }) => {
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
      setMessage(event.data); // B로부터 매칭 수락 여부를 받음
    };

    ws.onclose = () => {
      console.log(`WebSocket connection closed for user ${userId}`);
    };

    setSocket(ws);

    return () => {
      if (ws) ws.close();
    };
  }, [userId]);

  const sendMatchRequest = () => {
    if (socket) {
      socket.send(`MATCH:B`);
      setMessage("Match request sent to user B.");
    }
  };

  return (
    <div>
      <h2>User {userId}: Send Match Request</h2>
      <button onClick={sendMatchRequest}>Send Match Request to B</button>
      <p>{message}</p>
    </div>
  );
};

export default MeetingRequest;

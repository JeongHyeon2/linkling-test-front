import React, { useEffect, useState } from "react";

const MeetingNotification = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const ws = new WebSocket(
      "wss://unbiased-evenly-worm.ngrok-free.app/noti?userId=B"
    );

    ws.onopen = () => {
      console.log("WebSocket connection established for user B");
    };

    ws.onmessage = (event) => {
      setMessage(event.data); // A로부터 받은 알림 메시지
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed for user B");
    };

    setSocket(ws);

    return () => {
      if (ws) ws.close();
    };
  }, []);

  return (
    <div>
      <h2>User B: Receive Notifications</h2>
      <p>Notification: {message}</p>
    </div>
  );
};

export default MeetingNotification;

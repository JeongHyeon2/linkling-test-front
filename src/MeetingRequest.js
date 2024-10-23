import React, { useEffect, useState } from "react";

const MeetingRequest = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    const ws = new WebSocket(
      "wss://unbiased-evenly-worm.ngrok-free.app/noti?userId=A"
    );

    ws.onopen = () => {
      console.log("WebSocket connection established for user A");
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed for user A");
    };

    setSocket(ws);

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.send(`TO:B|MESSAGE:${input}`);
      setMessage("Message sent to user B");
    }
  };

  return (
    <div>
      <h2>User A: Send Notification</h2>
      <input
        type="text"
        placeholder="Enter message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message to B</button>
      <p>{message}</p>
    </div>
  );
};

export default MeetingRequest;

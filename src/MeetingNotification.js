import React, { useEffect, useState } from "react";

const MeetingNotification = ({ userId }) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = new WebSocket(
      `wss://unbiased-evenly-worm.ngrok-free.app/ws/meet?userId=${userId}`
    );

    socket.onmessage = (event) => {
      setMessage(event.data); // 서버로부터 받은 알림 메시지
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close(); // 컴포넌트가 unmount 될 때 WebSocket 연결을 닫음
    };
  }, [userId]);

  const acceptMeeting = async () => {
    try {
      const response = await fetch(
        `https://unbiased-evenly-worm.ngrok-free.app/api/meet/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomId: message.split("room: ")[1] }),
        }
      );
      if (response.ok) {
        alert("Meeting accepted!");
      }
    } catch (error) {
      console.error("Error accepting meeting:", error);
    }
  };

  return (
    <div>
      <h2>Meeting Notification</h2>
      {message ? (
        <div>
          <p>{message}</p>
          <button onClick={acceptMeeting}>Accept Meeting</button>
        </div>
      ) : (
        <p>No new meeting requests.</p>
      )}
    </div>
  );
};

export default MeetingNotification;

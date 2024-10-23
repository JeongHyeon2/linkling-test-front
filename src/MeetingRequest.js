import React, { useState } from "react";
import axios from "axios";

const MeetingRequest = ({ fromUserId, toUserId }) => {
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");

  const sendMeetingRequest = async () => {
    try {
      const response = await axios.post("/api/meet/request", {
        fromUserId,
        toUserId,
        roomId: "", // 서버에서 생성
      });
      if (response.data.success) {
        setMessage("Meeting request sent!");
      } else {
        setMessage("Failed to send request.");
      }
    } catch (error) {
      setMessage("Error sending request.");
    }
  };

  return (
    <div>
      <h2>Send Meeting Request</h2>
      <button onClick={sendMeetingRequest}>Send Request</button>
      <p>{message}</p>
    </div>
  );
};

export default MeetingRequest;

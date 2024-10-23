import React from "react";
import MeetingRequest from "./MeetingRequest";
import MeetingNotification from "./MeetingNotification";

const App = () => {
  const fromUserId = "A"; // A 사용자 ID
  const toUserId = "B"; // B 사용자 ID

  return (
    <div>
      <h1>Meeting App</h1>
      <div>
        <MeetingRequest fromUserId={fromUserId} toUserId={toUserId} />
      </div>
      <div>
        <MeetingNotification userId={toUserId} />
      </div>
    </div>
  );
};

export default App;

import React from "react";
import MeetingRequest from "./MeetingRequest";
import MeetingNotification from "./MeetingNotification";

const App = () => {
  return (
    <div>
      <h1>Matchmaking App</h1>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {/* 사용자 A */}
        <MeetingRequest userId="A" />

        {/* 사용자 B */}
        <MeetingNotification userId="B" />
      </div>
    </div>
  );
};

export default App;

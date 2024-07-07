/*
initiates a conversation about booking a resort room ->
bot fetches room options from an API and responds with a list of room options ->
The user selects a room ->
The bot provides pricing information ->
The user confirms they want to proceed with booking ->
The bot makes a simulated API call to book the room and returns a booking confirmation with a booking ID.
*/

import { useState } from "react";
import AppLayout from "./components/AppLayout";
import { v4 as uuidv4 } from "uuid";

/*
  {
    id: uuidv4(),
    message: "Hi, I'm a user. Help me",
    sender: "user",
  },

  Conversation Message
*/

let first_id = uuidv4();
function App() {
  const [allChats, setAllChats] = useState({
    [first_id]: {
      id: first_id,
      name: "Chat 1",
      conversation: [],
    },
  });

  const [activeChatId, setActiveChatId] = useState(null);

  const updateAllChats = (newChats) => {
    setAllChats(newChats);
  };

  return (
    <div className="h-screen">
      <AppLayout
        allChats={allChats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        updateAllChats={setAllChats}
      />
    </div>
  );
}
export default App;

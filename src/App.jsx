import { Routes, Route } from "react-router";

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />

      <Route path="/login" element={<div>Login</div>} />

      <Route path="/chat" element={<div>Chat</div>} />

      <Route path="/chat/:conversationId" element={<div>Conversation</div>} />

      <Route path="/groups/new" element={<div>Create Group</div>} />

      <Route path="/landing" element={<div>Landing Page</div>} />
    </Routes>
  );
}

export default App;

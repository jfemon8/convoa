import { Route, Routes, Navigate } from "react-router";

import ProtectedRoute from "./components/layout/ProtectedRoute";
import GuestRoute from "./components/layout/GuestRoute";

import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import CreateGroupPage from "./pages/CreateGroupPage";

const LandingPage = () => {
  return <div>Landing Page</div>;
};

const App = () => {
  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
        <Route path="/groups/new" element={<CreateGroupPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/chat" replace />} />
    </Routes>
  );
};

export default App;

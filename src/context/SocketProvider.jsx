import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";

import { useAuth } from "./AuthContext";
import SocketContext from "./SocketContext";

const SocketProvider = ({ children }) => {
  const { token } = useAuth();

  const socket = useMemo(() => {
    if (!token) {
      return null;
    }

    return io(import.meta.env.VITE_SOCKET_URL, {
      auth: {
        token,
      },
    });
  }, [token]);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const handleConnect = () => {
      console.log("[Socket] Connected:", socket.id);
    };

    const handleDisconnect = (reason) => {
      console.log("[Socket] Disconnected:", reason);
    };

    const handleConnectError = (error) => {
      console.error("[Socket] Connection error:", error);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);

      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;

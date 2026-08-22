import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { useAuth } from "./AuthContext";
import SocketContext from "./SocketContext";

const SocketProvider = ({ children }) => {
  const { token } = useAuth();

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const instance = io(import.meta.env.VITE_SOCKET_URL, {
      auth: {
        token,
      },
    });

    const handleConnect = () => {
      console.log("[Socket] Connected:", instance.id);
    };

    const handleDisconnect = (reason) => {
      console.log("[Socket] Disconnected:", reason);
    };

    const handleConnectError = (error) => {
      console.error("[Socket] Connection error:", error);
    };

    instance.on("connect", handleConnect);
    instance.on("disconnect", handleDisconnect);
    instance.on("connect_error", handleConnectError);

    setSocket(instance);

    return () => {
      instance.off("connect", handleConnect);
      instance.off("disconnect", handleDisconnect);
      instance.off("connect_error", handleConnectError);

      instance.disconnect();

      setSocket((current) => (current === instance ? null : current));
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;

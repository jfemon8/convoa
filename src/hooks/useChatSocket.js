import { useEffect } from "react";

import {
    connectSocket,
    disconnectSocket,
} from "../lib/socket";

const useChatSocket = ({
    token,
    conversationId,
    onMessage,
    onConversationUpdated,
}) => {
    useEffect(() => {
        if (!token) {
            return undefined;
        }

        const socket = connectSocket(token);

        if (!socket) {
            return undefined;
        }

        const handleNewMessage = (message) => {
            if (!message?._id) {
                return;
            }

            if (
                conversationId &&
                message.conversation !== conversationId
            ) {
                return;
            }

            onMessage?.(message);
        };

        const handleConversationUpdated = (conversation) => {
            onConversationUpdated?.(conversation);
        };

        socket.on("message:new", handleNewMessage);

        socket.on(
            "conversation:updated",
            handleConversationUpdated
        );

        return () => {
            socket.off("message:new", handleNewMessage);

            socket.off(
                "conversation:updated",
                handleConversationUpdated
            );
        };
    }, [
        token,
        conversationId,
        onMessage,
        onConversationUpdated,
    ]);

    useEffect(() => {
        return () => {
            disconnectSocket();
        };
    }, []);
};

export default useChatSocket;

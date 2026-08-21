import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getConversationMessages } from "../services/conversation.service";

const useConversationMessages = (conversationId) => {
    const [messages, setMessages] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMessages = useCallback(async () => {
        if (!conversationId) {
            setMessages([]);
            setHasMore(false);
            setError(null);
            setIsLoading(false);

            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response =
                await getConversationMessages(conversationId);

            setMessages(response?.messages || []);
            setHasMore(Boolean(response?.hasMore));
        } catch (error) {
            const message =
                error.response?.data?.error?.message ||
                "Failed to load messages.";

            setMessages([]);
            setHasMore(false);
            setError(message);

            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, [conversationId]);

    useEffect(() => {
        let cancelled = false;

        const loadMessages = async () => {
            if (!conversationId) {
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response =
                    await getConversationMessages(conversationId);

                if (cancelled) {
                    return;
                }

                setMessages(response?.messages || []);
                setHasMore(Boolean(response?.hasMore));
            } catch (error) {
                if (cancelled) {
                    return;
                }

                const message =
                    error.response?.data?.error?.message ||
                    "Failed to load messages.";

                setMessages([]);
                setHasMore(false);
                setError(message);

                toast.error(message);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadMessages();

        return () => {
            cancelled = true;
        };
    }, [conversationId]);

    return {
        messages,
        setMessages,
        hasMore,
        isLoading,
        error,
        refetch: fetchMessages,
    };
};

export default useConversationMessages;

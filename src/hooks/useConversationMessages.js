import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getConversationMessages } from "../services/conversation.service";
import { normalizeMessage } from "../utils/message";

const MESSAGE_PAGE_SIZE = 50;

const useConversationMessages = (conversationId) => {
    const [messages, setMessages] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingOlder, setIsLoadingOlder] = useState(false);
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
            const response = await getConversationMessages(conversationId, {
                limit: MESSAGE_PAGE_SIZE,
            });

            const incomingMessages = response?.messages || [];

            // Backend returns newest -> oldest.
            // Frontend stores oldest -> newest.
            const normalizedMessages = [...incomingMessages]
                .reverse()
                .map(normalizeMessage)
                .filter(Boolean);

            setMessages(normalizedMessages);
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

    const loadOlderMessages = useCallback(async () => {
        if (
            !conversationId ||
            !hasMore ||
            isLoadingOlder ||
            messages.length === 0
        ) {
            return;
        }

        // Because frontend stores oldest -> newest,
        // index 0 is always the oldest loaded message.
        const oldestMessage = messages[0];

        if (!oldestMessage?._id) {
            return;
        }

        try {
            setIsLoadingOlder(true);

            const response = await getConversationMessages(conversationId, {
                limit: MESSAGE_PAGE_SIZE,
                before: oldestMessage._id,
            });

            const olderMessagesFromApi = response?.messages || [];

            // Backend returns newest -> oldest.
            // Normalize to oldest -> newest before prepending.
            const olderMessages = [...olderMessagesFromApi]
                .reverse()
                .map(normalizeMessage)
                .filter(Boolean);

            setMessages((previousMessages) => {
                const existingIds = new Set(
                    previousMessages.map((message) => message._id),
                );

                const uniqueOlderMessages = olderMessages.filter(
                    (message) => !existingIds.has(message._id),
                );

                return [...uniqueOlderMessages, ...previousMessages];
            });

            setHasMore(Boolean(response?.hasMore));
        } catch (error) {
            const message =
                error.response?.data?.error?.message ||
                "Failed to load older messages.";

            toast.error(message);
        } finally {
            setIsLoadingOlder(false);
        }
    }, [conversationId, hasMore, isLoadingOlder, messages]);

    useEffect(() => {
        let cancelled = false;

        const loadMessages = async () => {
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
                const response = await getConversationMessages(conversationId, {
                    limit: MESSAGE_PAGE_SIZE,
                });

                if (cancelled) {
                    return;
                }

                const incomingMessages = response?.messages || [];

                // Backend: newest -> oldest
                // Frontend: oldest -> newest
                const normalizedMessages = [...incomingMessages]
                    .reverse()
                    .map(normalizeMessage)
                    .filter(Boolean);

                setMessages(normalizedMessages);
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
        isLoadingOlder,
        error,
        refetch: fetchMessages,
        loadOlderMessages,
    };
};

export default useConversationMessages;

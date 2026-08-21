import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getConversationMessages } from "../services/conversation.service";

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
            const response = await getConversationMessages(
                conversationId,
                {
                    limit: MESSAGE_PAGE_SIZE,
                },
            );

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

    const loadOlderMessages = useCallback(async () => {
        if (
            !conversationId ||
            !hasMore ||
            isLoadingOlder ||
            messages.length === 0
        ) {
            return;
        }

        const oldestMessage = messages[0];

        if (!oldestMessage?._id) {
            return;
        }

        try {
            setIsLoadingOlder(true);

            const response = await getConversationMessages(
                conversationId,
                {
                    limit: MESSAGE_PAGE_SIZE,
                    before: oldestMessage._id,
                },
            );

            const olderMessages = response?.messages || [];

            setMessages((previousMessages) => {
                const existingIds = new Set(
                    previousMessages.map(
                        (message) => message._id,
                    ),
                );

                const uniqueOlderMessages =
                    olderMessages.filter(
                        (message) =>
                            !existingIds.has(message._id),
                    );

                return [
                    ...uniqueOlderMessages,
                    ...previousMessages,
                ];
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
    }, [
        conversationId,
        hasMore,
        isLoadingOlder,
        messages,
    ]);

    useEffect(() => {
        let cancelled = false;

        const loadMessages = async () => {
            if (!conversationId) {
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await getConversationMessages(
                    conversationId,
                    {
                        limit: MESSAGE_PAGE_SIZE,
                    },
                );

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
        isLoadingOlder,
        error,
        refetch: fetchMessages,
        loadOlderMessages,
    };
};

export default useConversationMessages;
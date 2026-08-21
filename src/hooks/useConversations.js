import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getConversations } from "../services/conversation.service";

const useConversations = () => {
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchConversations = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await getConversations();

            setConversations(data?.data || []);
        } catch (error) {
            const message =
                error.response?.data?.error?.message ||
                "Failed to load conversations.";

            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        const loadConversations = async () => {
            try {
                const data = await getConversations();

                if (cancelled) {
                    return;
                }

                setConversations(data?.data || []);
            } catch (error) {
                if (cancelled) {
                    return;
                }

                const message =
                    error.response?.data?.error?.message ||
                    "Failed to load conversations.";

                setError(message);
                toast.error(message);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadConversations();

        return () => {
            cancelled = true;
        };
    }, []);

    return {
        conversations,
        isLoading,
        error,
        refetch: fetchConversations,
    };
};

export default useConversations;

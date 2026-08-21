import api from "../lib/api";

export const getConversations = async () => {
    const response = await api.get("/conversations");

    return response.data;
};

export const searchUsers = async (query) => {
    const response = await api.get("/users/search", {
        params: {
            q: query,
        },
    });

    return response.data;
};

export const startDirectConversation = async (userId) => {
    const response = await api.post("/conversations", {
        userId,
    });

    return response.data;
};

export const getConversationMessages = async (
    conversationId,
    params = {}
) => {
    const response = await api.get(
        `/conversations/${conversationId}/messages`,
        {
            params,
        }
    );

    return response.data;
};

export const sendMessage = async ({
    conversationId,
    text,
}) => {
    const response = await api.post("/messages", {
        conversationId,
        text,
    });

    return response.data;
};

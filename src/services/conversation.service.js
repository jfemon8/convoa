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

export const createGroupConversation = async ({
    name,
    participantIds,
}) => {
    const response = await api.post("/conversations/group", {
        name,
        participantIds,
    });

    return response.data;
};

export const addGroupParticipants = async (
    conversationId,
    userIds,
) => {
    const response = await api.post(
        `/conversations/${conversationId}/participants`,
        {
            userIds,
        },
    );

    return response.data;
};

export const removeGroupParticipant = async (
    conversationId,
    userId,
) => {
    const response = await api.delete(
        `/conversations/${conversationId}/participants/${userId}`,
    );

    return response.data;
};

export const renameGroupConversation = async (
    conversationId,
    name,
) => {
    const response = await api.patch(
        `/conversations/${conversationId}`,
        {
            name,
        },
    );

    return response.data;
};

export const promoteGroupAdmin = async (
    conversationId,
    userId,
) => {
    const response = await api.post(
        `/conversations/${conversationId}/admins`,
        {
            userId,
        },
    );

    return response.data;
};

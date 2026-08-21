export const isDirectConversation = (conversation) =>
    conversation?.type === "direct";

export const isGroupConversation = (conversation) =>
    conversation?.type === "group";

export const getConversationTitle = (conversation) => {
    if (!conversation) {
        return "";
    }

    if (conversation.type === "group") {
        return conversation.name || "Unnamed Group";
    }

    return conversation.participant?.name || "Unknown User";
};

export const getConversationSubtitle = (conversation) => {
    if (!conversation) {
        return "";
    }

    if (conversation.type === "group") {
        const count = conversation.participants?.length || 0;

        return `${count} member${count === 1 ? "" : "s"}`;
    }

    return conversation.participant?.phone || "";
};

export const getLastMessagePreview = (conversation) => {
    const lastMessage = conversation?.lastMessage;

    if (!lastMessage?.text) {
        return "";
    }

    return lastMessage.text;
};

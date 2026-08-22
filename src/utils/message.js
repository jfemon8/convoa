const toIsoString = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
};

export const normalizeMessage = (message) => {
  if (!message) {
    return null;
  }

  const id = message._id ?? message.id;

  if (!id) {
    return null;
  }

  const conversation =
    typeof message.conversation === "object"
      ? message.conversation?._id
      : message.conversation;

  const sender =
    typeof message.sender === "object" ? message.sender?._id : message.sender;

  return {
    ...message,
    _id: String(id),
    conversation: conversation ? String(conversation) : conversation,
    sender: sender ? String(sender) : sender,
    createdAt: toIsoString(message.createdAt),
  };
};

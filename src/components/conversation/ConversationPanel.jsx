import { MessageCircle } from "lucide-react";
import { useCallback, useEffect } from "react";

import { useAuth } from "../../context/AuthContext";
import useConversationMessages from "../../hooks/useConversationMessages";
import MessageInput from "./MessageInput";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import MessageList from "./MessageList";
import { useSocket } from "../../context/useSocket";

const ConversationPanel = ({ conversation }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const conversationId = conversation?._id;

  const {
    messages,
    setMessages,
    hasMore,
    isLoading,
    isLoadingOlder,
    error,
    loadOlderMessages,
  } = useConversationMessages(conversationId);

  const addMessage = useCallback(
    (message) => {
      if (!message?._id) {
        return;
      }

      setMessages((previousMessages) => {
        const exists = previousMessages.some(
          (existingMessage) => existingMessage._id === message._id,
        );

        if (exists) {
          return previousMessages;
        }

        return [...previousMessages, message];
      });
    },
    [setMessages],
  );

  const handleMessageSent = useCallback(
    (message) => {
      addMessage(message);
    },
    [addMessage],
  );

  const socket = useSocket();

  useEffect(() => {
    if (!socket || !conversationId) {
      return undefined;
    }

    const handleNewMessage = (message) => {
      if (message?.conversation !== conversationId) {
        return;
      }

      addMessage(message);
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [socket, conversationId, addMessage]);

  if (!conversation) {
    return (
      <section className="flex min-w-0 flex-1 flex-col bg-slate-950">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900">
            <MessageCircle size={28} className="text-slate-500" />
          </div>

          <h2 className="mt-5 text-lg font-semibold">Select a conversation</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Choose a conversation from the sidebar or search for someone to
            start a new one.
          </p>
        </div>
      </section>
    );
  }

  const title =
    conversation.type === "group"
      ? conversation.name || "Unnamed Group"
      : conversation.participant?.name || "Unknown User";

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-slate-950">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-800 px-4">
        <button
          type="button"
          onClick={() => navigate("/chat")}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white md:hidden"
          aria-label="Back to conversations"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-white">{title}</h2>

          <p className="mt-0.5 truncate text-xs text-slate-500">...</p>
        </div>
      </header>

      {/* Messages */}
      <div className="min-h-0 flex-1">
        {isLoading && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-500">Loading messages...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {!isLoading && !error && messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-500">No messages yet.</p>
          </div>
        )}

        {!isLoading && !error && messages.length > 0 && (
          <MessageList
            key={conversationId}
            messages={messages}
            currentUserId={user?._id}
            hasMore={hasMore}
            isLoadingOlder={isLoadingOlder}
            onLoadOlder={loadOlderMessages}
          />
        )}
      </div>

      {/* Message Composer */}
      <MessageInput
        conversationId={conversationId}
        onMessageSent={handleMessageSent}
      />
    </section>
  );
};

export default ConversationPanel;

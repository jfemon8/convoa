import { useCallback, useEffect, useMemo, useRef } from "react";
import { ArrowLeft, Loader2, MessageSquare, Users } from "lucide-react";
import { useParams, useNavigate } from "react-router";

import ConversationList from "../components/conversation/ConversationList";
import ConversationPanel from "../components/conversation/ConversationPanel";
import UserSearch from "../components/conversation/UserSearch";
import { useAuth } from "../context/AuthContext";
import useConversations from "../hooks/useConversations";
import { useSocket } from "../context/useSocket";
import { normalizeMessage } from "../utils/message";

const ChatPage = () => {
  const { user, logout } = useAuth();
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const { conversations, setConversations, isLoading, error, refetch } =
    useConversations();

  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation._id === conversationId,
      ) || null,
    [conversations, conversationId],
  );

  const socket = useSocket();

  const handleConversationUpdated = useCallback(() => {
    refetch();
  }, [refetch]);

  const conversationsRef = useRef(conversations);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  const handleIncomingMessage = useCallback(
    (incomingMessage) => {
      const message = normalizeMessage(incomingMessage);

      if (!message) {
        return;
      }

      const isKnownConversation = conversationsRef.current.some(
        (conversation) =>
          String(conversation._id) === String(message.conversation),
      );

      if (!isKnownConversation) {
        refetch();

        return;
      }

      setConversations((previousConversations) => {
        const index = previousConversations.findIndex(
          (conversation) =>
            String(conversation._id) === String(message.conversation),
        );

        if (index === -1) {
          return previousConversations;
        }

        const updatedConversation = {
          ...previousConversations[index],
          lastMessage: {
            text: message.text,
            sender: message.sender,
            createdAt: message.createdAt,
          },
          updatedAt: message.createdAt,
        };

        return [
          updatedConversation,
          ...previousConversations.slice(0, index),
          ...previousConversations.slice(index + 1),
        ];
      });
    },
    [refetch, setConversations],
  );

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    socket.on("conversation:updated", handleConversationUpdated);
    socket.on("message:new", handleIncomingMessage);

    return () => {
      socket.off("conversation:updated", handleConversationUpdated);
      socket.off("message:new", handleIncomingMessage);
    };
  }, [socket, handleConversationUpdated, handleIncomingMessage]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex h-screen overflow-hidden border-x border-slate-800">
        {/* Sidebar */}
        <aside
          className={`flex w-full max-w-sm shrink-0 flex-col border-r border-slate-800 bg-slate-900 ${
            conversationId ? "hidden md:flex" : "flex"
          }`}
        >
          <header className="border-b border-slate-800 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold">Convoa</h1>

                <p className="mt-0.5 text-xs text-slate-400">{user?.name}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/groups/new")}
                  className="flex items-center gap-1.5 rounded border border-slate-700 p-1 text-xs text-slate-300 transition hover:bg-slate-800 hover:text-white cursor-pointer"
                >
                  <Users size={14} />
                  Create Group
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="text-xs text-slate-300 hover:text-white p-1 border border-slate-700 rounded hover:bg-slate-800 transition duration-200 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>

            <UserSearch onConversationCreated={refetch} />
          </header>

          <div className="min-h-0 flex-1">
            <ConversationList
              conversations={conversations}
              isLoading={isLoading}
              error={error}
              onRetry={refetch}
            />
          </div>
        </aside>

        {/* Conversation */}
        {conversationId && selectedConversation ? (
          <ConversationPanel
            key={conversationId}
            conversation={selectedConversation}
            onConversationUpdated={refetch}
          />
        ) : (
          <section
            className={`flex-1 items-center justify-center bg-slate-950 px-6 ${
              conversationId ? "flex" : "hidden md:flex"
            }`}
          >
            <div className="max-w-sm text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900">
                {conversationId && isLoading ? (
                  <Loader2 size={26} className="animate-spin text-slate-400" />
                ) : (
                  <MessageSquare size={28} className="text-slate-400" />
                )}
              </div>

              <h2 className="mt-5 text-lg font-semibold">
                {!conversationId
                  ? "Select a conversation"
                  : isLoading
                    ? "Loading conversation..."
                    : "Conversation not found"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {!conversationId
                  ? "Choose a conversation from the sidebar or search for someone to start a new one."
                  : isLoading
                    ? "Hang tight while we fetch your conversations."
                    : "This conversation may have been removed, or you are no longer a participant."}
              </p>

              {conversationId && !isLoading && (
                <button
                  type="button"
                  onClick={() => navigate("/chat")}
                  className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                >
                  <ArrowLeft size={16} />
                  Back to conversations
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ChatPage;

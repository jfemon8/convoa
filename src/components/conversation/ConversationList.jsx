import { MessageCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import ConversationItem from "./ConversationItem";

const ConversationList = ({ conversations, isLoading, error, onRetry }) => {
  const navigate = useNavigate();
  const { conversationId } = useParams();

  const handleConversationClick = (conversation) => {
    navigate(`/chat/${conversation._id}`);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-16 animate-pulse rounded-xl bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
        <p className="text-sm text-red-400">{error}</p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-slate-700 px-4 py-2 text-sm text-white transition hover:bg-slate-600"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <MessageCircle size={38} className="text-slate-600" />

        <h3 className="mt-4 text-sm font-semibold text-white">
          No conversations yet
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          Search for someone to start a conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation._id}
          conversation={conversation}
          isActive={conversation._id === conversationId}
          onClick={() => handleConversationClick(conversation)}
        />
      ))}
    </div>
  );
};

export default ConversationList;

import { Users, UserRound } from "lucide-react";

import {
  getConversationTitle,
  getConversationSubtitle,
  getLastMessagePreview,
} from "../../utils/conversation";

const ConversationItem = ({ conversation, isActive = false, onClick }) => {
  const isGroup = conversation.type === "group";

  const title = getConversationTitle(conversation);
  const subtitle = getConversationSubtitle(conversation);
  const preview = getLastMessagePreview(conversation);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 border-b border-slate-800 px-4 py-3 text-left transition cursor-pointer ${
        isActive ? "bg-slate-800" : "hover:bg-slate-800/60"
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-700 text-slate-200">
        {isGroup ? <Users size={19} /> : <UserRound size={19} />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-white">{title}</h3>

          <span className="shrink-0 text-xs text-slate-400">
            {conversation.updatedAt
              ? new Date(conversation.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>
        </div>

        <p className="mt-0.5 truncate text-xs text-slate-400">
          {preview || subtitle}
        </p>
      </div>
    </button>
  );
};

export default ConversationItem;

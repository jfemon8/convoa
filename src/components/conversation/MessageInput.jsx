import { Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { sendMessage } from "../../services/conversation.service";

const MessageInput = ({ conversationId, onMessageSent }) => {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const messageText = text.trim();

    if (!messageText) {
      return;
    }

    try {
      setIsSending(true);

      const message = await sendMessage({
        conversationId,
        text: messageText,
      });

      setText("");

      onMessageSent?.(message);
    } catch (error) {
      const message =
        error.response?.data?.error?.message || "Unable to send message.";

      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="shrink-0 border-t border-slate-800 bg-slate-900 p-4"
    >
      <div className="flex items-end gap-3">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type a message..."
          rows={1}
          disabled={isSending}
          className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();

              event.currentTarget.form?.requestSubmit();
            }
          }}
        />

        <button
          type="submit"
          disabled={!text.trim() || isSending}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>

      <p className="mt-2 text-[11px] text-slate-600">
        Enter to send · Shift + Enter for a new line
      </p>
    </form>
  );
};

export default MessageInput;

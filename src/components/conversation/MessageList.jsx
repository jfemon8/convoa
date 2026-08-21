import { useEffect, useRef } from "react";
import { format } from "date-fns";

const MessageList = ({ messages, currentUserId }) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const shouldAutoScrollRef = useRef(true);

  const updateScrollState = () => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    shouldAutoScrollRef.current = distanceFromBottom < 120;
  };

  useEffect(() => {
    if (shouldAutoScrollRef.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      onScroll={updateScrollState}
      className="relative min-h-0 flex-1 overflow-y-auto p-5"
    >
      <div className="space-y-3">
        {messages.map((message) => {
          const isMine = message.sender === currentUserId;

          return (
            <div
              key={message._id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  isMine
                    ? "rounded-br-md bg-blue-600 text-white"
                    : "rounded-bl-md bg-slate-800 text-slate-100"
                }`}
              >
                <p className="text-sm leading-6">{message.text}</p>

                <p
                  className={`mt-1 text-[10px] ${
                    isMine ? "text-blue-100" : "text-slate-500"
                  }`}
                >
                  {format(new Date(message.createdAt), "hh:mm a")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;

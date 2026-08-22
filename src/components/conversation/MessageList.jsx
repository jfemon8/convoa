import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDown, Loader2 } from "lucide-react";
import { format } from "date-fns";

const AUTO_SCROLL_THRESHOLD = 120;
const TOP_LOAD_THRESHOLD = 80;

const MessageList = ({
  messages,
  currentUserId,
  hasMore,
  isLoadingOlder,
  onLoadOlder,
}) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const isInitialRenderRef = useRef(true);
  const wasLoadingOlderRef = useRef(false);
  const previousMessageCountRef = useRef(0);
  const previousFirstMessageIdRef = useRef(null);

  const scrollStateRef = useRef({
    isNearBottom: true,
    previousScrollHeight: 0,
  });

  const [showNewMessages, setShowNewMessages] = useState(false);

  const updateScrollState = () => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    scrollStateRef.current.isNearBottom =
      distanceFromBottom <= AUTO_SCROLL_THRESHOLD;

    if (scrollStateRef.current.isNearBottom) {
      setShowNewMessages(false);
    }

    if (
      container.scrollTop <= TOP_LOAD_THRESHOLD &&
      hasMore &&
      !isLoadingOlder
    ) {
      scrollStateRef.current.previousScrollHeight = container.scrollHeight;

      wasLoadingOlderRef.current = true;

      onLoadOlder?.();
    }
  };

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container || !messages.length) {
      return;
    }

    const currentFirstMessageId = messages[0]?._id;

    if (isInitialRenderRef.current) {
      bottomRef.current?.scrollIntoView({
        behavior: "auto",
      });

      isInitialRenderRef.current = false;

      previousMessageCountRef.current = messages.length;

      previousFirstMessageIdRef.current = currentFirstMessageId;

      return;
    }

    const previousFirstMessageId = previousFirstMessageIdRef.current;

    const olderMessagesWereAdded =
      wasLoadingOlderRef.current &&
      currentFirstMessageId !== previousFirstMessageId;

    if (olderMessagesWereAdded) {
      const previousScrollHeight = scrollStateRef.current.previousScrollHeight;

      const newScrollHeight = container.scrollHeight;

      container.scrollTop += newScrollHeight - previousScrollHeight;

      wasLoadingOlderRef.current = false;
    } else if (scrollStateRef.current.isNearBottom) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });

      setShowNewMessages(false);
    } else if (messages.length > previousMessageCountRef.current) {
      setShowNewMessages(true);
    }

    previousMessageCountRef.current = messages.length;

    previousFirstMessageIdRef.current = currentFirstMessageId;
  }, [messages]);

  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport) {
      return undefined;
    }

    const handleViewportResize = () => {
      if (!scrollStateRef.current.isNearBottom) {
        return;
      }

      bottomRef.current?.scrollIntoView({
        behavior: "auto",
      });
    };

    viewport.addEventListener("resize", handleViewportResize);

    return () => {
      viewport.removeEventListener("resize", handleViewportResize);
    };
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

    setShowNewMessages(false);
  };

  return (
    <div
      ref={containerRef}
      onScroll={updateScrollState}
      className="relative h-full overflow-y-auto overscroll-contain p-3 sm:p-5"
    >
      {hasMore && isLoadingOlder && (
        <div className="mb-4 flex justify-center">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Loader2 size={14} className="animate-spin" />
            Loading older messages...
          </div>
        </div>
      )}

      <div className="space-y-3">
        {messages.map((message) => {
          const isMine = String(message.sender) === String(currentUserId);

          return (
            <div
              key={message._id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 sm:max-w-[75%] sm:px-4 sm:py-2.5 ${
                  isMine
                    ? "rounded-br-md bg-blue-600 text-white"
                    : "rounded-bl-md bg-slate-800 text-slate-100"
                }`}
              >
                <p className="text-sm leading-6 whitespace-pre-wrap wrap-break-word">
                  {message.text}
                </p>

                <p
                  className={`mt-1 text-[10px] ${
                    isMine ? "text-blue-100" : "text-slate-400"
                  }`}
                >
                  {format(new Date(message.createdAt), "hh:mm a")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {showNewMessages && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="sticky bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-lg transition hover:bg-blue-500"
        >
          <ArrowDown size={14} />
          New messages
        </button>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;

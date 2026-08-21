import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

const DEMO_REPLIES = [
  "That feels much better already.",
  "Nice — I got it instantly.",
  "Perfect. Let's keep it moving.",
  "Looks good from my side.",
];

const FEATURES = [
  {
    number: "01",
    icon: Zap,
    title: "Real-time messaging",
    description:
      "New messages arrive without refreshes, keeping every conversation naturally in sync.",
  },
  {
    number: "02",
    icon: Users,
    title: "Direct & group chat",
    description:
      "Start a private conversation or bring the whole team into a shared thread.",
  },
  {
    number: "03",
    icon: Clock3,
    title: "History that keeps up",
    description:
      "Older messages load progressively, so long conversations stay fast and readable.",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Thoughtful interaction",
    description:
      "Smart scrolling, clear states, and focused UI details make the experience feel finished.",
  },
];

const FLOW = [
  {
    step: "01",
    title: "Find someone",
    text: "Search by name or phone number and start a conversation in seconds.",
  },
  {
    step: "02",
    title: "Start talking",
    text: "Send messages in a focused thread with a clear distinction between both sides.",
  },
  {
    step: "03",
    title: "Keep the context",
    text: "Scroll through existing history or load older messages when you need them.",
  },
  {
    step: "04",
    title: "Bring people in",
    text: "Create groups, manage participants and keep the whole conversation together.",
  },
];

const DEMO_MESSAGES = [
  {
    id: 1,
    mine: false,
    text: "Hey Emon — did you get the latest update?",
    time: "10:42 AM",
  },
  {
    id: 2,
    mine: true,
    text: "Yep. It arrived immediately.",
    time: "10:42 AM",
  },
  {
    id: 3,
    mine: false,
    text: "Perfect. That's exactly how it should feel.",
    time: "10:43 AM",
  },
];

const CHAT_USERS = [
  {
    name: "Alice Smith",
    preview: "Perfect. That's exactly how it should feel.",
    time: "10:43",
    initial: "A",
  },
  {
    name: "Project Team",
    preview: "Emon: I'll send the update soon.",
    time: "10:38",
    initial: "P",
  },
  {
    name: "Test Candidate",
    preview: "See you tomorrow.",
    time: "10:21",
    initial: "T",
  },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [draft, setDraft] = useState("");
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [isDemoTyping, setIsDemoTyping] = useState(false);

  const demoBodyRef = useRef(null);
  const replyTimerRef = useRef(null);

  const ctaTarget = useMemo(
    () => (isAuthenticated ? "/chat" : "/login"),
    [isAuthenticated],
  );

  useEffect(() => {
    return () => {
      if (replyTimerRef.current) {
        window.clearTimeout(replyTimerRef.current);
      }
    };
  }, []);

  const scrollDemoToBottom = () => {
    const body = demoBodyRef.current;

    if (!body) return;

    body.scrollTo({
      top: body.scrollHeight,
      behavior: "smooth",
    });

    setShowNewMessage(false);
  };

  const sendDemoMessage = () => {
    const text = draft.trim();

    if (!text) return;

    const newMessage = {
      id: Date.now(),
      mine: true,
      text,
      time: "Now",
    };

    setMessages((current) => [...current, newMessage]);
    setDraft("");
    setIsDemoTyping(true);

    replyTimerRef.current = window.setTimeout(() => {
      const reply =
        DEMO_REPLIES[Math.floor(Math.random() * DEMO_REPLIES.length)];

      setIsDemoTyping(false);

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          mine: false,
          text: reply,
          time: "Now",
        },
      ]);
    }, 850);
  };

  const handleDemoScroll = () => {
    const body = demoBodyRef.current;

    if (!body) return;

    const distanceFromBottom =
      body.scrollHeight - body.scrollTop - body.clientHeight;

    if (distanceFromBottom < 72) {
      setShowNewMessage(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#171717]">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-orange-300/15 blur-3xl" />
        <div className="absolute right-[-10rem] top-[18rem] h-[30rem] w-[30rem] rounded-full bg-emerald-300/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#F7F5EF]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link
            to="/landing"
            className="group flex items-center gap-3"
            aria-label="Convoa home"
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-[#171717] text-[#F7F5EF] shadow-sm transition-transform duration-200 group-hover:-rotate-3">
              <MessageCircle size={18} strokeWidth={2.2} />

              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#F7F5EF] bg-[#FF5A36]" />
            </span>

            <span className="font-serif text-xl font-semibold tracking-tight">
              Convoa
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
            >
              How it works
            </a>

            <Link
              to="/chat"
              className="text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
            >
              Live demo
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {!isAuthenticated && (
              <Link
                to="/login"
                className="hidden rounded-full px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:text-neutral-950 sm:inline-flex"
              >
                Sign in
              </Link>
            )}

            <Link
              to={ctaTarget}
              className="inline-flex items-center gap-2 rounded-full bg-[#171717] px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#292929] sm:px-5"
            >
              {isAuthenticated ? "Open chat" : "Start chatting"}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-2 text-xs font-semibold text-orange-700">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF5A36]" />
              Real conversations. Less friction.
            </div>

            <h1 className="mt-6 max-w-2xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
              Stay in the
              <span className="text-[#FF5A36]"> conversation.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
              Convoa brings direct and group messaging into one focused
              experience — with real-time updates, searchable people, message
              history, and controls that stay out of your way.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to={ctaTarget}
                className="inline-flex items-center gap-2 rounded-full bg-[#FF5A36] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#E84D2D]"
              >
                {isAuthenticated ? "Open Convoa" : "Try Convoa"}
                <ArrowRight size={16} />
              </Link>

              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-6 py-3.5 text-sm font-semibold text-neutral-800 transition hover:bg-white"
              >
                See it in action
                <ChevronDown size={15} />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-black/8 pt-7">
              <div>
                <p className="font-serif text-2xl font-semibold">Live</p>
                <p className="mt-1 text-xs text-neutral-500">
                  real-time updates
                </p>
              </div>

              <div>
                <p className="font-serif text-2xl font-semibold">Direct</p>
                <p className="mt-1 text-xs text-neutral-500">
                  one-to-one chats
                </p>
              </div>

              <div>
                <p className="font-serif text-2xl font-semibold">Groups</p>
                <p className="mt-1 text-xs text-neutral-500">
                  shared conversations
                </p>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-xl bg-orange-300/10 blur-2xl" />

            <div
              id="demo"
              className="scroll-mt-18 relative overflow-hidden rounded-[1.75rem] border border-black/8 bg-white shadow-[0_30px_80px_-35px_rgba(0,0,0,0.28)]"
            >
              {/* Window top */}
              <div className="flex items-center justify-between border-b border-black/6 px-4 py-3.5 sm:px-5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF6A55]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E1B04A]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#67B86B]" />
                </div>

                <div className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                  Live product preview
                </div>
              </div>

              <div className="grid min-h-[31rem] grid-cols-1 sm:grid-cols-[14rem_1fr]">
                {/* Sidebar */}
                <aside className="hidden border-r border-black/6 bg-[#FAFAF8] sm:block">
                  <div className="border-b border-black/6 p-4">
                    <div className="flex items-center gap-2 rounded-xl border border-black/6 bg-white px-3 py-2.5">
                      <Search size={14} className="text-neutral-400" />
                      <span className="text-xs text-neutral-400">Search</span>
                    </div>
                  </div>

                  <div className="space-y-1 p-2.5">
                    {CHAT_USERS.map((user, index) => (
                      <div
                        key={user.name}
                        className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 ${
                          index === 0 ? "bg-orange-50" : "hover:bg-neutral-100"
                        }`}
                      >
                        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-serif text-xs font-semibold text-emerald-700">
                          {user.initial}

                          {index === 0 && (
                            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-xs font-semibold text-neutral-800">
                              {user.name}
                            </p>
                            <span className="shrink-0 text-[9px] text-neutral-400">
                              {user.time}
                            </span>
                          </div>

                          <p className="mt-0.5 truncate text-[10px] text-neutral-400">
                            {user.preview}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>

                {/* Chat */}
                <div className="flex min-h-[31rem] min-w-0 flex-col">
                  <div className="flex items-center justify-between border-b border-black/6 px-4 py-3.5 sm:px-5">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 font-serif text-sm font-semibold text-emerald-700">
                        A
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold">Alice Smith</p>
                        <p className="mt-0.5 text-[10px] text-emerald-600">
                          Active now
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                      aria-label="More options"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  <div
                    ref={demoBodyRef}
                    onScroll={handleDemoScroll}
                    className="relative flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto bg-[#FCFCFA] p-4 sm:p-5"
                  >
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.mine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-5 shadow-sm ${
                            message.mine
                              ? "rounded-br-md bg-[#FF5A36] text-white"
                              : "rounded-bl-md bg-[#EEECE5] text-neutral-800"
                          }`}
                        >
                          <p>{message.text}</p>

                          <div
                            className={`mt-1 text-[9px] ${
                              message.mine
                                ? "text-white/65"
                                : "text-neutral-400"
                            }`}
                          >
                            {message.time}
                          </div>
                        </div>
                      </div>
                    ))}

                    {isDemoTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-[#EEECE5] px-4 py-3">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" />
                        </div>
                      </div>
                    )}

                    {showNewMessage && (
                      <button
                        type="button"
                        onClick={scrollDemoToBottom}
                        className="sticky bottom-1 mx-auto flex items-center gap-2 rounded-full bg-[#171717] px-3.5 py-2 text-xs font-semibold text-white shadow-lg"
                      >
                        <ArrowDown size={13} />
                        New message
                      </button>
                    )}
                  </div>

                  <div className="border-t border-black/6 bg-white p-3.5 sm:p-4">
                    <div className="flex items-center gap-2 rounded-2xl border border-black/8 bg-[#F7F5EF] p-1.5">
                      <button
                        type="button"
                        className="rounded-xl p-2 text-neutral-400 transition hover:bg-white hover:text-neutral-700"
                        aria-label="Attach file"
                      >
                        <Paperclip size={15} />
                      </button>

                      <input
                        type="text"
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            sendDemoMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-neutral-400"
                      />

                      <button
                        type="button"
                        onClick={sendDemoMessage}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#171717] text-white transition hover:bg-[#FF5A36]"
                        aria-label="Send demo message"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating product labels */}
            <div className="absolute -left-3 bottom-7 hidden rounded-2xl border border-black/8 bg-white/95 px-4 py-3 shadow-xl backdrop-blur sm:block">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Zap size={14} />
                </span>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                    Connection
                  </p>
                  <p className="text-xs font-semibold text-neutral-800">
                    Live & connected
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -right-3 top-12 hidden rounded-2xl border border-black/8 bg-white/95 px-4 py-3 shadow-xl backdrop-blur lg:block">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-[#FF5A36]">
                  <MessageCircle size={14} />
                </span>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                    Messages
                  </p>
                  <p className="text-xs font-semibold text-neutral-800">
                    Delivered instantly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-y border-black/6 bg-[#ECE9E0]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.number}
                className={`border-black/6 px-5 py-7 sm:px-6 lg:px-7 ${
                  index % 2 !== 0 ? "border-l" : ""
                } ${index >= 2 ? "border-t lg:border-t-0" : ""} ${
                  index !== 0 ? "lg:border-l" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-[#FF5A36]">
                    {feature.number}
                  </span>

                  <Icon size={16} className="text-neutral-500" />
                </div>

                <h3 className="mt-5 font-serif text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-18 mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              How it works
            </p>

            <h2 className="mt-3 max-w-lg font-serif text-4xl font-semibold leading-tight tracking-[-0.025em] sm:text-5xl">
              Simple on the surface.
              <br />
              Thoughtful underneath.
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-neutral-500">
              The experience stays deliberately focused: find a person, start a
              thread, keep the history, and bring others in when the
              conversation grows.
            </p>

            <Link
              to={ctaTarget}
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#171717] underline decoration-black/20 underline-offset-4 transition hover:decoration-black"
            >
              Open the actual app
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute left-5 top-4 bottom-4 w-px bg-black/8 sm:left-7" />

            <div className="space-y-0">
              {FLOW.map((item, index) => (
                <div
                  key={item.step}
                  className="relative grid grid-cols-[2.5rem_1fr] gap-5 border-b border-black/7 py-8 first:pt-2 last:border-b-0 sm:grid-cols-[4rem_1fr] sm:gap-7"
                >
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-[#F7F5EF] font-mono text-[10px] font-medium text-[#FF5A36] sm:h-14 sm:w-14">
                    {item.step}
                  </div>

                  <div className="pt-0.5">
                    <h3 className="font-serif text-2xl font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-7 text-neutral-500 sm:text-base">
                      {item.text}
                    </p>

                    {index === 1 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-orange-50 px-3 py-1.5 text-[11px] font-medium text-orange-700">
                          real-time updates
                        </span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-emerald-700">
                          clear message states
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product philosophy */}
      <section
        id="features"
        className="bg-[#171717] text-[#F7F5EF] scroll-mt-18"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FF8164]">
                The details
              </p>

              <h2 className="mt-3 max-w-md font-serif text-4xl font-semibold leading-tight tracking-[-0.025em] sm:text-5xl">
                The little things are part of the product.
              </h2>

              <p className="mt-5 max-w-md text-base leading-7 text-neutral-400">
                A chat application is more than sending text. The experience
                depends on what happens between messages too.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-2">
              <div className="bg-[#171717] p-6 sm:p-7">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5A36]/15 text-[#FF8164]">
                  <ArrowDown size={16} />
                </div>

                <h3 className="mt-5 font-serif text-xl font-medium">
                  Scroll that respects you
                </h3>

                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  New messages can appear without dragging someone away from the
                  history they are currently reading.
                </p>
              </div>

              <div className="bg-[#171717] p-6 sm:p-7">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5A36]/15 text-[#FF8164]">
                  <Clock3 size={16} />
                </div>

                <h3 className="mt-5 font-serif text-xl font-medium">
                  Older messages on demand
                </h3>

                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Long conversations can grow without forcing the whole history
                  into the initial view.
                </p>
              </div>

              <div className="bg-[#171717] p-6 sm:p-7">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5A36]/15 text-[#FF8164]">
                  <Users size={16} />
                </div>

                <h3 className="mt-5 font-serif text-xl font-medium">
                  Groups with real controls
                </h3>

                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Membership, admin roles, group names, and leaving a group are
                  part of the same conversation experience.
                </p>
              </div>

              <div className="bg-[#171717] p-6 sm:p-7">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5A36]/15 text-[#FF8164]">
                  <Check size={16} />
                </div>

                <h3 className="mt-5 font-serif text-xl font-medium">
                  States that explain themselves
                </h3>

                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Loading, empty, error, and unavailable states are designed to
                  tell the user what is happening and what to do next.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-6 lg:py-32">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Ready to talk?
        </p>

        <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl lg:text-6xl">
          One conversation.
          <span className="text-[#FF5A36]"> Zero noise.</span>
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-neutral-500 sm:text-lg">
          Open Convoa and see the experience from the other side of this page.
        </p>

        <Link
          to={ctaTarget}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF5A36] px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#E84D2D]"
        >
          {isAuthenticated ? "Open chat" : "Start chatting"}
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/7">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#171717] text-white">
              <MessageCircle size={13} />
            </span>

            <span>Convoa</span>
          </div>

          <p>
            Built around real conversations, thoughtful interactions, and
            focused messaging.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;

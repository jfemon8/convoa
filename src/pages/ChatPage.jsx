import { MessageSquare } from "lucide-react";

import ConversationList from "../components/conversation/ConversationList";
import UserSearch from "../components/conversation/UserSearch";
import { useAuth } from "../context/AuthContext";
import useConversations from "../hooks/useConversations";

const ChatPage = () => {
  const { user, logout } = useAuth();

  const { conversations, isLoading, error, refetch } = useConversations();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex h-screen max-w-7xl overflow-hidden border-x border-slate-800">
        <aside className="flex w-full max-w-sm flex-col border-r border-slate-800 bg-slate-900">
          <header className="border-b border-slate-800 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold">Convoa</h1>

                <p className="mt-0.5 text-xs text-slate-500">{user?.name}</p>
              </div>

              <button
                type="button"
                onClick={logout}
                className="text-xs text-slate-500 hover:text-white p-1 border border-slate-700 rounded hover:bg-slate-800 transition duration-200 cursor-pointer"
              >
                Logout
              </button>
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

        <section className="hidden flex-1 items-center justify-center bg-slate-950 md:flex">
          <div className="max-w-sm text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900">
              <MessageSquare size={28} className="text-slate-500" />
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              Select a conversation
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Choose a conversation from the sidebar or search for someone to
              start a new one.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ChatPage;

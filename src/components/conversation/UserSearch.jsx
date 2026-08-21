import { Search, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import {
  searchUsers,
  startDirectConversation,
} from "../../services/conversation.service";
import { useAuth } from "../../context/AuthContext";

const UserSearch = ({ onConversationCreated }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  const [isSearching, setIsSearching] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const displayUsers = query.trim()
    ? users.filter((user) => String(user._id) !== String(currentUser?._id))
    : [];

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return undefined;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsSearching(true);

        const data = await searchUsers(trimmedQuery);

        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        const message =
          error.response?.data?.error?.message || "Unable to search users.";

        toast.error(message);
        setUsers([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  const handleStartConversation = async (user) => {
    try {
      setIsStarting(true);

      const conversation = await startDirectConversation(user._id);

      setQuery("");
      setUsers([]);

      await onConversationCreated?.();

      navigate(`/chat/${conversation._id}`);
    } catch (error) {
      const message =
        error.response?.data?.error?.message || "Unable to start conversation.";

      toast.error(message);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search
          size={17}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or phone"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-500"
        />
      </div>

      {query.trim() && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
          {isSearching && (
            <div className="px-4 py-5 text-center text-sm text-slate-500">
              Searching...
            </div>
          )}

          {!isSearching && !displayUsers.length && (
            <div className="px-4 py-5 text-center text-sm text-slate-500">
              No users found.
            </div>
          )}

          {!isSearching &&
            displayUsers.map((user) => (
              <button
                key={user._id}
                type="button"
                disabled={isStarting}
                onClick={() => handleStartConversation(user)}
                className="flex w-full items-center gap-3 border-b border-slate-800 px-4 py-3 text-left last:border-b-0 hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700">
                  <UserRound size={16} className="text-slate-300" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {user.name}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {user.phone}
                  </p>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;

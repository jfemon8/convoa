import { ArrowLeft, Check, Search, UserRound, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import {
  searchUsers,
  createGroupConversation,
} from "../services/conversation.service";
import { useAuth } from "../context/AuthContext";

const CreateGroupPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const displayUsers = useMemo(() => {
    const currentUserId = String(currentUser?._id);

    return users.filter((user) => String(user._id) !== currentUserId);
  }, [users, currentUser?._id]);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setUsers([]);
      return undefined;
    }

    let cancelled = false;

    const timeoutId = setTimeout(async () => {
      try {
        setIsSearching(true);

        const data = await searchUsers(trimmedQuery);

        if (cancelled) {
          return;
        }

        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error.response?.data?.error?.message || "Unable to search users.";

        toast.error(message);
        setUsers([]);
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }, 350);

    return () => {
      cancelled = true;

      clearTimeout(timeoutId);
    };
  }, [query]);

  const isSelected = (userId) => {
    return selectedUsers.some((user) => String(user._id) === String(userId));
  };

  const toggleUser = (user) => {
    setSelectedUsers((previousUsers) => {
      const exists = previousUsers.some(
        (item) => String(item._id) === String(user._id),
      );

      if (exists) {
        return previousUsers.filter(
          (item) => String(item._id) !== String(user._id),
        );
      }

      return [...previousUsers, user];
    });
  };

  const removeSelectedUser = (userId) => {
    setSelectedUsers((previousUsers) =>
      previousUsers.filter((user) => String(user._id) !== String(userId)),
    );
  };

  const handleCreateGroup = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Please enter a group name.");
      return;
    }

    if (selectedUsers.length < 2) {
      toast.error("A group requires at least two other participants.");
      return;
    }

    try {
      setIsCreating(true);

      const conversation = await createGroupConversation({
        name: trimmedName,
        participantIds: selectedUsers.map((user) => user._id),
      });

      toast.success("Group created successfully.");

      navigate(`/chat/${conversation._id}`);
    } catch (error) {
      const message =
        error.response?.data?.error?.message || "Unable to create group.";

      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen flex-col border-x border-slate-800">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-800 bg-slate-900 px-4">
          <button
            type="button"
            onClick={() => navigate("/chat")}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white cursor-pointer"
            aria-label="Back to chat"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800">
            <Users size={18} />
          </div>

          <div>
            <h1 className="text-sm font-semibold">Create Group</h1>
            <p className="text-xs text-slate-400">
              Add at least two other participants
            </p>
          </div>
        </header>

        <form onSubmit={handleCreateGroup} className="flex flex-1 flex-col">
          <div className="space-y-5 p-5">
            <div>
              <label
                htmlFor="group-name"
                className="mb-2 block text-xs font-medium text-slate-400"
              >
                Group name
              </label>

              <input
                id="group-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Project Team"
                maxLength={100}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-500"
              />
            </div>

            <div>
              <label
                htmlFor="participant-search"
                className="mb-2 block text-xs font-medium text-slate-400"
              >
                Add participants
              </label>

              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="participant-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by name or phone"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-500"
                />
              </div>

              {query.trim() && (
                <div className="mt-2 max-h-72 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900">
                  {isSearching && (
                    <div className="px-4 py-5 text-center text-sm text-slate-400">
                      Searching...
                    </div>
                  )}

                  {!isSearching && !displayUsers.length && (
                    <div className="px-4 py-5 text-center text-sm text-slate-400">
                      No users found.
                    </div>
                  )}

                  {!isSearching &&
                    displayUsers.map((user) => {
                      const selected = isSelected(user._id);

                      return (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => toggleUser(user)}
                          className="flex w-full items-center gap-3 border-b border-slate-800 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-800"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700">
                            <UserRound size={16} className="text-slate-300" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-white">
                              {user.name}
                            </p>

                            <p className="truncate text-xs text-slate-400">
                              {user.phone}
                            </p>
                          </div>

                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                              selected
                                ? "border-blue-500 bg-blue-600"
                                : "border-slate-600"
                            }`}
                          >
                            {selected && <Check size={14} />}
                          </div>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>

            {selectedUsers.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-slate-400">
                  Selected ({selectedUsers.length})
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <button
                      key={user._id}
                      type="button"
                      onClick={() => removeSelectedUser(user._id)}
                      className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 transition hover:border-slate-500 hover:text-white"
                    >
                      {user.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-900 p-4">
            <button
              type="submit"
              disabled={isCreating || !name.trim() || selectedUsers.length < 2}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreating ? "Creating group..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateGroupPage;

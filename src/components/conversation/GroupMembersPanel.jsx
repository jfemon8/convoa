import { Check, UserMinus, UserPlus, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import {
  addGroupParticipants,
  removeGroupParticipant,
  searchUsers,
} from "../../services/conversation.service";
import ConfirmModal from "../common/ConfirmModal";

const GroupMembersPanel = ({
  conversation,
  onConversationUpdated,
  onClose,
}) => {
  const { user: currentUser } = useAuth();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removingUserId, setRemovingUserId] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const participants = conversation?.participants || [];
  const admins = conversation?.admins || [];

  const isAdmin = admins.some(
    (admin) =>
      String(typeof admin === "object" ? admin._id : admin) ===
      String(currentUser?._id),
  );

  const existingParticipantIds = useMemo(
    () => new Set(participants.map((participant) => String(participant._id))),
    [participants],
  );

  const displayUsers = useMemo(() => {
    return users.filter(
      (user) =>
        String(user._id) !== String(currentUser?._id) &&
        !existingParticipantIds.has(String(user._id)),
    );
  }, [users, currentUser?._id, existingParticipantIds]);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setUsers([]);
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

  const handleAddMember = async (user) => {
    try {
      setIsSubmitting(true);

      await addGroupParticipants(conversation._id, [user._id]);

      toast.success(`${user.name} added to the group.`);

      setQuery("");
      setUsers([]);

      await onConversationUpdated?.();
    } catch (error) {
      const message =
        error.response?.data?.error?.message || "Unable to add member.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = (user) => {
    if (!isAdmin) {
      return;
    }

    setRemoveTarget(user);
  };

  const confirmRemoveMember = async () => {
    if (!removeTarget) {
      return;
    }

    try {
      setRemovingUserId(removeTarget._id);

      await removeGroupParticipant(conversation._id, removeTarget._id);

      toast.success(`${removeTarget.name} was removed.`);

      setRemoveTarget(null);

      await onConversationUpdated?.();
    } catch (error) {
      const message =
        error.response?.data?.error?.message || "Unable to remove member.";

      toast.error(message);
    } finally {
      setRemovingUserId(null);
    }
  };

  const handleLeaveGroup = () => {
    setShowLeaveModal(true);
  };

  const confirmLeaveGroup = async () => {
    try {
      setIsSubmitting(true);

      await removeGroupParticipant(conversation._id, currentUser._id);

      toast.success("You left the group.");

      setShowLeaveModal(false);
      onClose?.();

      window.location.href = "/chat";
    } catch (error) {
      const message =
        error.response?.data?.error?.message || "Unable to leave the group.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="absolute right-4 top-14 z-30 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div className="flex items-center gap-2">
            <Users size={17} className="text-slate-400" />

            <div>
              <h3 className="text-sm font-semibold text-white">
                Group members
              </h3>

              <p className="text-xs text-slate-500">
                {participants.length} members
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        {isAdmin && (
          <div className="border-b border-slate-800 p-3">
            <div className="relative">
              <UserPlus
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Add a member..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-slate-500"
              />
            </div>

            {query.trim() && (
              <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-slate-800">
                {isSearching && (
                  <p className="px-3 py-4 text-center text-xs text-slate-500">
                    Searching...
                  </p>
                )}

                {!isSearching && !displayUsers.length && (
                  <p className="px-3 py-4 text-center text-xs text-slate-500">
                    No users found.
                  </p>
                )}

                {!isSearching &&
                  displayUsers.map((user) => (
                    <button
                      key={user._id}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleAddMember(user)}
                      className="flex w-full items-center gap-3 border-b border-slate-800 px-3 py-2.5 text-left last:border-b-0 hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700">
                        <span className="text-xs font-semibold text-slate-200">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-white">
                          {user.name}
                        </p>

                        <p className="truncate text-[11px] text-slate-500">
                          {user.phone}
                        </p>
                      </div>

                      <Check size={15} className="text-slate-500" />
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}

        <div className="max-h-80 overflow-y-auto">
          {participants.map((participant) => {
            const participantIsCurrentUser =
              String(participant._id) === String(currentUser?._id);

            const participantIsAdmin = admins.some(
              (admin) =>
                String(typeof admin === "object" ? admin._id : admin) ===
                String(participant._id),
            );

            return (
              <div
                key={participant._id}
                className="flex items-center gap-3 border-b border-slate-800 px-4 py-3 last:border-b-0"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700">
                  <span className="text-xs font-semibold text-slate-200">
                    {participant.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white">
                    {participant.name}

                    {participantIsCurrentUser && (
                      <span className="ml-1 text-xs text-slate-500">(You)</span>
                    )}
                  </p>

                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs text-slate-500">
                      {participant.phone}
                    </p>

                    {participantIsAdmin && (
                      <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400">
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                {isAdmin && !participantIsCurrentUser && (
                  <button
                    type="button"
                    disabled={removingUserId === participant._id}
                    onClick={() => handleRemoveMember(participant)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 cursor-pointer"
                    aria-label={`Remove ${participant.name}`}
                  >
                    <UserMinus size={15} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-800 p-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleLeaveGroup}
            className="w-full rounded-xl border border-red-500/20 px-3 py-2.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            Leave Group
          </button>
        </div>
      </div>
      <ConfirmModal
        isOpen={Boolean(removeTarget)}
        title="Remove member?"
        message={
          removeTarget
            ? `Are you sure you want to remove ${removeTarget.name} from this group?`
            : ""
        }
        confirmText="Remove"
        cancelText="Cancel"
        onCancel={() => setRemoveTarget(null)}
        onConfirm={confirmRemoveMember}
        isLoading={Boolean(removingUserId)}
      />

      <ConfirmModal
        isOpen={showLeaveModal}
        title="Leave group?"
        message="You will no longer receive messages or updates from this group."
        confirmText="Leave Group"
        cancelText="Stay"
        onCancel={() => setShowLeaveModal(false)}
        onConfirm={confirmLeaveGroup}
        isLoading={isSubmitting}
      />
    </>
  );
};

export default GroupMembersPanel;

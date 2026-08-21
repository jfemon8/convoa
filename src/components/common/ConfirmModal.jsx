import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  danger = true,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) {
          onCancel?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl"
      >
        <div className="flex items-center gap-2">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              danger ? "bg-red-500/10" : "bg-blue-500/10"
            }`}
          >
            <AlertTriangle
              size={20}
              className={danger ? "text-red-400" : "text-blue-400"}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-white">{title}</h2>

            <p className="mt-1 text-sm text-slate-400">{message}</p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition cursor-pointer ${
              danger
                ? "bg-red-600 hover:bg-red-500"
                : "bg-blue-600 hover:bg-blue-500"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isLoading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

"use client";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  apkUrl: string;
};

export function DownloadApkModal({ open, onClose, apkUrl }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: 0.7 }}
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative z-10 w-[min(420px,95%)] rounded-lg border border-white p-6 bg-white text-black">
        <header className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold">Download APK</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-sm px-2 py-1"
          >
            ✕
          </button>
        </header>

        <div className="mt-4 space-y-4">
          <p className="text-sm">
            Tap the button below to download the APK to your device. On Android, open the downloaded APK to install.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <a
              href={apkUrl}
              className="inline-block w-full text-center rounded-md border border-black px-4 py-2 text-sm font-medium"
              download
              rel="noopener noreferrer"
            >
              Download APK
            </a>

            <button
              onClick={onClose}
              className="inline-block w-full text-center rounded-md px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-gray-700">
            Note: Android only. iOS doesn’t support APKs — show this only on supported platforms if desired.
          </p>
        </div>
      </div>
    </div>
  );
}

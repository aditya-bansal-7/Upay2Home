"use client";
import { useState, useEffect } from "react";
import useIsPWA from "@/hooks/useIsPWA";
import { DownloadApkModal } from "./download-apk-modal";
import { set } from "zod";
import { Download, DownloadIcon, HardDriveDownload } from "lucide-react";

export function Header() {
  const isPWA = useIsPWA();
  const [showModal, setShowModal] = useState(false);

  // Capture the beforeinstallprompt event (optional) to allow native install on Android
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      // @ts-ignore
      e.preventDefault?.();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, []);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const apkUrl = process.env.NEXT_PUBLIC_APK_URL || "/U PAY 2 HOME.apk";

  const openModal = () => {
    // If we have the native prompt available, show it first
    if (deferredPrompt) {
      deferredPrompt.prompt();
      // optionally check outcome
      deferredPrompt.userChoice?.then((choiceResult: any) => {
        // if dismissed, fall back to modal or nothing
        if (choiceResult.outcome === "dismissed") {
          setShowModal(true);
        }
      });
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <header className="  px-4 py-4 text-black">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Upay2Home</h1>

          {/* Only show Download APK when NOT running as PWA */}
          {!isPWA && (
            <button
              onClick={openModal}
              title="Download APK"
              className="ml-3 inline-flex items-center gap-2 rounded px-3 py-1 text-sm font-medium border border-black"
            >
              {/* small icon-like text to keep black/white theme */}
              <DownloadIcon /> APK
            </button>
          )}
        </div>
      </header>

      <DownloadApkModal open={showModal} onClose={() => setShowModal(false)} apkUrl={apkUrl} />
    </>
  );
}

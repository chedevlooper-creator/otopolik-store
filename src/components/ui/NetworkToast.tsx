"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOffIcon } from "lucide-react";

/**
 * Premium connectivity tracker toast that alerts the user on connection drop.
 */
export function NetworkToast() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOffline(!window.navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="pointer-events-none fixed inset-x-0 top-0 z-[9999] flex justify-center p-4"
        >
          <div className="flex items-center gap-3 rounded-full border border-red-500/25 bg-black/90 px-5 py-2.5 shadow-2xl backdrop-blur-md">
            <WifiOffIcon className="h-4 w-4 text-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-white/90 tracking-wide">
              Bağlantı kesildi. Bazı özellikler çalışmayabilir.
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

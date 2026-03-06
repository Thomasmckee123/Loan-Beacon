"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

type SnackbarType = "success" | "warning" | "error";

interface Snackbar {
  id: number;
  message: string;
  type: SnackbarType;
}

interface SnackbarContextValue {
  showSnackbar: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

let nextId = 0;

const config: Record<
  SnackbarType,
  { bg: string; icon: typeof CheckCircle; iconColor: string }
> = {
  success: { bg: "bg-green-600", icon: CheckCircle, iconColor: "text-green-200" },
  warning: { bg: "bg-yellow-500", icon: AlertTriangle, iconColor: "text-yellow-200" },
  error: { bg: "bg-red-600", icon: XCircle, iconColor: "text-red-200" },
};

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbars, setSnackbars] = useState<Snackbar[]>([]);

  const showSnackbar = useCallback(
    (message: string, type: SnackbarType = "success") => {
      const id = nextId++;
      setSnackbars((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setSnackbars((prev) => prev.filter((s) => s.id !== id));
      }, 4000);
    },
    [],
  );

  const dismiss = useCallback((id: number) => {
    setSnackbars((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {snackbars.map((snackbar) => {
            const { bg, icon: Icon, iconColor } = config[snackbar.type];
            return (
              <motion.div
                key={snackbar.id}
                initial={{ opacity: 0, x: 80, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`${bg} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px] max-w-[420px]`}
              >
                <Icon className={`w-5 h-5 ${iconColor} shrink-0`} />
                <span className="text-sm font-medium flex-1">
                  {snackbar.message}
                </span>
                <button
                  onClick={() => dismiss(snackbar.id)}
                  className="text-white/70 hover:text-white transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
}

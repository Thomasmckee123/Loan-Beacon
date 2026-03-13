"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <motion.div
        className="relative size-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-navy-800 animate-spin" />
      </motion.div>
      <motion.p
        className="mt-4 text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Loading...
      </motion.p>
    </div>
  );
}

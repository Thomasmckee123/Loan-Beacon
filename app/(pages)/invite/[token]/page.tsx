"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function AcceptInvitePage() {
  const { token } = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAccept = async () => {
    setStatus("loading");

    const res = await fetch("/api/teams/invite/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (res.ok) {
      setStatus("success");
      setTimeout(() => router.push("/dashboard/team"), 2000);
    } else {
      const err = await res.json();
      setErrorMessage(err.error || "Failed to accept invite");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-navy-100 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {status === "success" ? (
          <>
            <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="size-8 text-green-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              You&apos;re in!
            </h1>
            <p className="text-sm text-gray-500">
              Redirecting to your team dashboard...
            </p>
          </>
        ) : status === "error" ? (
          <>
            <div className="size-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="size-8 text-red-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Invite Failed
            </h1>
            <p className="text-sm text-gray-500 mb-6">{errorMessage}</p>
            <Link
              href="/login"
              className="text-sm text-blue-700 hover:text-blue-600 font-medium"
            >
              Sign in with a different account
            </Link>
          </>
        ) : (
          <>
            <div className="size-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="size-8 text-amber-400" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Team Invite
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              You&apos;ve been invited to join a team on LoanBeacon. Click below
              to accept.
            </p>
            <button
              onClick={handleAccept}
              disabled={status === "loading"}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-navy-800 rounded-md hover:bg-navy-900 disabled:opacity-50 transition-all duration-200"
            >
              {status === "loading" ? "Joining..." : "Accept Invite"}
            </button>
            <p className="text-xs text-gray-400 mt-4">
              You must be signed in with the email the invite was sent to.
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Building2,
  Banknote,
  CalendarDays,
  BellRing,
  Search,
  LogOut,
  User,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Companies", href: "/dashboard/companies", icon: Building2 },
  { name: "Loans", href: "/dashboard/loans", icon: Banknote },
  { name: "Timeline", href: "/dashboard/timeline", icon: CalendarDays },
  { name: "Alerts", href: "/dashboard/alerts", icon: BellRing },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userInitials, setUserInitials] = useState("...");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const firstName = user.user_metadata?.first_name || "";
        const lastName = user.user_metadata?.last_name || "";
        if (firstName || lastName) {
          setUserInitials(
            `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
          );
        } else if (user.email) {
          setUserInitials(user.email.charAt(0).toUpperCase());
        }
        setUserEmail(user.email || "");
      }
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Sidebar */}
      <motion.div
        className="fixed inset-y-0 left-0 w-64 bg-navy-900 shadow-xl hidden md:block"
        initial={{ x: -264 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <motion.div
            className="flex items-center h-16 px-6 border-b border-navy-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h1 className="text-xl font-bold text-white">LoanBeacon</h1>
            <div className="ml-3 w-1 h-6 bg-gold-400 rounded-full"></div>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item, index) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname?.startsWith(item.href));
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      isActive
                        ? "bg-navy-700 text-white border-l-4 border-gold-400"
                        : "text-navy-300 hover:bg-navy-800 hover:text-white"
                    }`}
                  >
                    <IconComponent className="mr-3 w-5 h-5" />
                    {item.name}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className="px-4 py-4 border-t border-navy-800">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-navy-400 rounded-md hover:bg-navy-800 hover:text-white transition-all duration-200"
            >
              <LogOut className="mr-3 w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Header - shown only on mobile */}
      <motion.div
        className="md:hidden bg-white shadow-lg border-b border-navy-200 fixed top-0 left-0 right-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-navy-900">LoanBeacon</h1>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-navy-600">Welcome!</span>
              <div className="w-6 h-6 bg-navy-800 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-white">{userInitials}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Bottom Navigation - shown only on mobile */}
      <motion.div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-navy-900 border-t border-navy-800 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <nav className="flex justify-around py-2">
          {navigation.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex-1"
              >
                <Link
                  href={item.href}
                  className={`flex flex-col items-center py-2 px-1 text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "text-gold-400"
                      : "text-navy-400 hover:text-white"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="mb-1"
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.div>
                  <span className="truncate">{item.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </motion.div>

      {/* Main content */}
      <div className="pl-0 md:pl-64">
        {/* Header */}
        <motion.div
          className="bg-white shadow-md border-b border-navy-200 hidden md:block"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      placeholder="Search companies, loans..."
                      className="w-full px-4 py-2 border border-navy-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 transition-all duration-200"
                    />
                  </div>
                  <div className="ml-4">
                    <motion.button
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-navy-800 border border-transparent rounded-md hover:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-600 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </motion.button>
                  </div>
                </div>
              </div>
              <div className="ml-6">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-navy-700">Welcome back!</span>
                  <motion.div
                    className="w-8 h-8 bg-navy-800 rounded-full flex items-center justify-center ring-2 ring-transparent hover:ring-gold-400"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-xs font-medium text-white">{userInitials}</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Page content */}
        <motion.main
          className="p-6 pt-20 pb-20 md:pt-6 md:pb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
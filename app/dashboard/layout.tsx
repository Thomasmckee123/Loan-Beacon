"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "🏠" },
  { name: "Companies", href: "/dashboard/companies", icon: "🏢" },
  { name: "Loans", href: "/dashboard/loans", icon: "💰" },
  { name: "Timeline", href: "/dashboard/timeline", icon: "📅" },
  { name: "Alerts", href: "/dashboard/alerts", icon: "🚨" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div
        className="fixed inset-y-0 left-0 w-64 bg-gray-800 shadow-xl hidden md:block"
        initial={{ x: -264 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <motion.div
            className="flex items-center h-16 px-6 border-b border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h1 className="text-xl font-bold text-white">LoanBeacon</h1>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item, index) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname?.startsWith(item.href));
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
                        ? "bg-red-600 text-white border-l-4 border-red-400"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>
      </motion.div>

      {/* Mobile Header - shown only on mobile */}
      <motion.div 
        className="md:hidden bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-red-600">LoanBeacon</h1>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600">Welcome!</span>
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-white">JD</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Bottom Navigation - shown only on mobile */}
      <motion.div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <nav className="flex justify-around py-2">
          {navigation.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));
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
                      ? "text-red-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <motion.span 
                    className="text-lg mb-1"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {item.icon}
                  </motion.span>
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
          className="bg-white shadow-lg border-b border-gray-200 hidden md:block"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    />
                  </div>
                  <div className="ml-4">
                    <motion.button 
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Search
                    </motion.button>
                  </div>
                </div>
              </div>
              <div className="ml-6">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Welcome back!</span>
                  <motion.div 
                    className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-xs font-medium text-white">JD</span>
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
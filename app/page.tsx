'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Building2, Bell, ArrowRight, Shield } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const Counter = ({ end, label }: { end: number; label: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 2500;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end]);

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <div className="text-4xl font-bold text-gold-400 mb-2">
        {count.toLocaleString()}+
      </div>
      <p className="text-white text-lg">{label}</p>
    </motion.div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Navigation Bar */}
      <motion.nav
        className="fixed top-0 w-full bg-navy-900/95 backdrop-blur-md z-50 border-b border-gold-400/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/loan-beacon-logo.svg" alt="LoanBeacon" className="h-10" />
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-white hover:text-gold-400 transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-gold-400 hover:bg-gold-500 text-navy-900 font-semibold px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-gold-400/50"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Gradient Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              className="flex justify-center mb-6"
              variants={fadeInUp}
            >
              <Shield className="w-16 h-16 text-gold-400" />
            </motion.div>

            <motion.h1
              className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
              variants={fadeInUp}
            >
              Navigate Your Debt Portfolio with
              <span className="block text-gold-400">Confidence</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Track loan maturities and identify refinancing opportunities 3-6 months in advance. Your comprehensive platform for intelligent debt advisory and portfolio management.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-900 font-bold py-4 px-10 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-gold-400/50"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/login"
                  className="inline-block border-2 border-white hover:border-gold-400 text-white hover:text-gold-400 font-bold py-4 px-10 rounded-lg transition-all duration-200"
                >
                  Sign In
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-navy-800/50">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4"
              variants={fadeInUp}
            >
              Powerful Features for Modern Finance
            </motion.h2>
            <motion.div
              className="w-16 h-1 bg-gold-400 mx-auto"
              variants={fadeInUp}
            />
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            {/* Feature 1 */}
            <motion.div
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              variants={fadeInUp}
              whileHover={{ y: -8 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-navy-900" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-3">
                Track Maturities
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor loan maturity dates and get intelligent alerts 3-6 months in advance to plan your refinancing strategies.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              variants={fadeInUp}
              whileHover={{ y: -8 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8 text-navy-900" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-3">
                Company Portfolio
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Manage client companies and their loan portfolios with comprehensive financial metrics and performance tracking.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              variants={fadeInUp}
              whileHover={{ y: -8 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bell className="w-8 h-8 text-navy-900" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-3">
                Smart Alerts
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get priority-based alerts for refinancing opportunities, covenant monitoring, and critical portfolio events.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            className="grid md:grid-cols-3 gap-12"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <Counter end={500} label="Loans Tracked" />
            <Counter end={2} label="Billion+ Portfolio Value" />
            <Counter end={98} label="% Client Retention" />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-navy-800 to-navy-900 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6"
              variants={fadeInUp}
            >
              Ready to Transform Your Debt Portfolio?
            </motion.h2>

            <motion.p
              className="text-xl text-gray-300 mb-10"
              variants={fadeInUp}
            >
              Join hundreds of financial professionals already using LoanBeacon to optimize their refinancing strategies and maximize financial performance.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-900 font-bold py-4 px-12 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-gold-400/50 text-lg"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 border-t border-gold-400/20 px-4 py-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2 mb-6 md:mb-0">
              <img src="/loan-beacon-logo.svg" alt="LoanBeacon" className="h-8" />
            </Link>

            <div className="flex gap-8">
              <Link href="#" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">
                Contact
              </Link>
            </div>
          </div>

          <div className="border-t border-gold-400/20 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 LoanBeacon. All rights reserved. Premium Debt Advisory Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

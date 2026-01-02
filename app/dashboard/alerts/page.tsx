'use client';

import { useState } from 'react';
import { companies, loans, alerts } from '@/data/dummyData';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: { duration: 0.3 }
  }
};

export default function AlertsPage() {
  const [alertList, setAlertList] = useState(alerts);
  const [filter, setFilter] = useState('All');

  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const filteredAlerts = alertList.filter(alert => {
    if (filter === 'All') return true;
    return alert.priority === filter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'High': return 'bg-red-100 text-red-700 border-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getBorderColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'border-red-500';
      case 'High': return 'border-red-400';
      case 'Medium': return 'border-yellow-400';
      case 'Low': return 'border-gray-400';
      default: return 'border-gray-300';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical': return '🚨';
      case 'High': return '⚠️';
      case 'Medium': return '⚡';
      case 'Low': return 'ℹ️';
      default: return '📋';
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlertList(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, dismissed: true }
          : alert
      )
    );
  };

  const undismissAlert = (alertId: string) => {
    setAlertList(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, dismissed: false }
          : alert
      )
    );
  };

  const activeAlerts = filteredAlerts.filter(alert => !alert.dismissed);
  const dismissedAlerts = filteredAlerts.filter(alert => alert.dismissed);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
        <p className="text-gray-600">Monitor important notifications about loan maturities and covenants</p>
      </motion.div>

      {/* Summary stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl border-l-4 border-red-600"
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {alertList.filter(a => !a.dismissed && a.priority === 'Critical').length}
            </p>
            <p className="text-sm text-red-700">Critical</p>
          </div>
        </motion.div>
        <motion.div 
          className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl border-l-4 border-red-500"
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500">
              {alertList.filter(a => !a.dismissed && a.priority === 'High').length}
            </p>
            <p className="text-sm text-red-600">High Priority</p>
          </div>
        </motion.div>
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {alertList.filter(a => !a.dismissed && a.priority === 'Medium').length}
            </p>
            <p className="text-sm text-gray-500">Medium Priority</p>
          </div>
        </motion.div>
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
          variants={cardVariants}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">
              {alertList.filter(a => a.dismissed).length}
            </p>
            <p className="text-sm text-gray-500">Dismissed</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Filter */}
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="flex items-center space-x-4">
          <label htmlFor="priority-filter" className="text-sm font-medium text-gray-700">
            Filter by Priority:
          </label>
          <select
            id="priority-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 transition-all duration-200"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Active Alerts */}
      <motion.div 
        className="bg-white shadow-lg rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Active Alerts ({activeAlerts.length})
          </h2>
        </div>
        
        {activeAlerts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">✅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active alerts</h3>
            <p className="text-gray-500">All alerts have been addressed or dismissed.</p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div 
              className="divide-y divide-gray-200"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {activeAlerts
                .sort((a, b) => {
                  const priorityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
                  return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
                })
                .map((alert) => {
                  const company = companies.find(c => c.id === alert.companyId);
                  const loan = loans.find(l => l.id === alert.loanId);

                  return (
                    <motion.div 
                      key={alert.id} 
                      className={`px-6 py-4 border-l-4 ${getBorderColor(alert.priority)} hover:bg-red-50 transition-all duration-200`}
                      variants={cardVariants}
                      whileHover={{ x: 4 }}
                      exit="exit"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <motion.div 
                            className="text-2xl"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          >
                            {getPriorityIcon(alert.priority)}
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(alert.priority)}`}>
                                {alert.priority}
                              </span>
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                {alert.type}
                              </span>
                            </div>
                          
                            <div className="mb-2">
                              <Link
                                href={`/dashboard/companies/${company?.id}`}
                                className="font-medium text-red-600 hover:text-red-500 transition-colors duration-200"
                              >
                                {company?.name}
                              </Link>
                              {loan && (
                                <span className="ml-2 text-sm text-gray-500">
                                  • {loan.type} • {loan.lender}
                                </span>
                              )}
                            </div>
                            
                            <p className="text-gray-900 mb-2">{alert.message}</p>
                            
                            <div className="text-sm text-gray-500">
                              <span>Created: {formatDate(new Date(alert.createdAt))}</span>
                              {alert.daysUntilMaturity > 0 && (
                                <span className="ml-4">
                                  Days until maturity: {alert.daysUntilMaturity}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          <motion.button
                            onClick={() => dismissAlert(alert.id)}
                            className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-red-100 hover:text-red-700 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Dismiss
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>

      {/* Dismissed Alerts */}
      {dismissedAlerts.length > 0 && (
        <motion.div 
          className="bg-white shadow-lg rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Dismissed Alerts ({dismissedAlerts.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {dismissedAlerts.map((alert) => {
              const company = companies.find(c => c.id === alert.companyId);
              const loan = loans.find(l => l.id === alert.loanId);

              return (
                <div key={alert.id} className="px-6 py-4 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1 opacity-60">
                      <div className="text-2xl">
                        {getPriorityIcon(alert.priority)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(alert.priority)}`}>
                            {alert.priority}
                          </span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {alert.type}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                            Dismissed
                          </span>
                        </div>
                        
                        <div className="mb-2">
                          <span className="font-medium text-gray-600">{company?.name}</span>
                          {loan && (
                            <span className="ml-2 text-sm text-gray-500">
                              • {loan.type} • {loan.lender}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-2">{alert.message}</p>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <motion.button
                        onClick={() => undismissAlert(alert.id)}
                        className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Restore
                      </motion.button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
'use client';

import { companies, loans } from '@/data/dummyData';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 }
  }
};

export default function TimelinePage() {
  // Group loans by maturity year and month
  const groupedLoans = loans.reduce((acc, loan) => {
    const maturityDate = new Date(loan.maturityDate);
    const yearMonth = `${maturityDate.getFullYear()}-${String(maturityDate.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[yearMonth]) {
      acc[yearMonth] = [];
    }
    acc[yearMonth].push(loan);
    return acc;
  }, {} as Record<string, typeof loans>);

  // Sort by date
  const sortedPeriods = Object.keys(groupedLoans).sort();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Upcoming': return 'bg-gray-100 text-gray-600 border-gray-300';
      case 'Maturing Soon': return 'bg-red-100 text-red-800 border-red-300';
      case 'Matured': return 'bg-red-200 text-red-900 border-red-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getMonthName = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long' 
    }).format(date);
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Timeline</h1>
        <p className="text-gray-600">Visual timeline of loan maturity dates</p>
      </motion.div>

      {/* Summary stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{loans.length}</p>
            <p className="text-sm text-gray-500">Total Loans Tracked</p>
          </div>
        </motion.div>
        <motion.div 
          className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl border-l-4 border-red-600"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {loans.filter(l => l.status === 'Maturing Soon').length}
            </p>
            <p className="text-sm text-red-700">Maturing Soon (≤30 days)</p>
          </div>
        </motion.div>
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">
              {loans.filter(l => l.status === 'Upcoming').length}
            </p>
            <p className="text-sm text-gray-500">Upcoming (≤6 months)</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Timeline */}
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        {sortedPeriods.map((period, index) => {
          const periodLoans = groupedLoans[period];
          const totalValue = periodLoans.reduce((sum, loan) => sum + loan.amount, 0);
          
          return (
            <motion.div 
              key={period} 
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              {/* Timeline line */}
              {index !== sortedPeriods.length - 1 && (
                <motion.div 
                  className="absolute left-6 top-16 w-0.5 h-full bg-red-600"
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ duration: 0.6, delay: 0.2 * index }}
                ></motion.div>
              )}
              
              {/* Timeline marker */}
              <div className="flex items-start">
                <motion.div 
                  className="flex-shrink-0 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center z-10 shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 * index }}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-white text-sm font-medium">📅</span>
                </motion.div>
                
                <div className="ml-6 flex-1">
                  {/* Period header */}
                  <motion.div 
                    className="bg-white rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {getMonthName(period)}
                        </h3>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {periodLoans.length} loans • {formatCurrency(totalValue)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Loans for this period */}
                    <div className="px-6 py-4">
                      <motion.div 
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {periodLoans
                          .sort((a, b) => new Date(a.maturityDate).getTime() - new Date(b.maturityDate).getTime())
                          .map((loan, loanIndex) => {
                            const company = companies.find(c => c.id === loan.companyId);
                            
                            return (
                              <motion.div
                                key={loan.id}
                                className={`border rounded-lg p-4 ${getStatusColor(loan.status)} transition-all duration-200 hover:shadow-md cursor-pointer`}
                                variants={itemVariants}
                                whileHover={{ scale: 1.01, x: 4 }}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-3">
                                      <Link
                                        href={`/dashboard/companies/${company?.id}`}
                                        className="font-medium text-gray-900 hover:text-red-600 transition-colors duration-200"
                                      >
                                        {company?.name}
                                      </Link>
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(loan.status)}`}>
                                        {loan.status}
                                      </span>
                                    </div>
                                    <div className="mt-1 grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                                      <div>
                                        <span className="text-gray-500">Type:</span>
                                        <span className="ml-1 text-gray-900">{loan.type}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Lender:</span>
                                        <span className="ml-1 text-gray-900">{loan.lender}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Amount:</span>
                                        <span className="ml-1 text-gray-900">{formatCurrency(loan.amount)}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Rate:</span>
                                        <span className="ml-1 text-gray-900">{loan.interestRate}%</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {formatDate(loan.maturityDate)}
                                    </div>
                                    {loan.notes && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        {loan.notes.length > 50 
                                          ? `${loan.notes.substring(0, 50)}...` 
                                          : loan.notes}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty state */}
      {sortedPeriods.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No loans to display</h3>
          <p className="text-gray-500">
            Add some loans to see them on the timeline.{' '}
            <Link href="/dashboard/loans/new" className="text-red-600 hover:text-red-500 transition-colors duration-200">
              Add your first loan
            </Link>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
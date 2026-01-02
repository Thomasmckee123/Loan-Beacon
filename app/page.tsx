import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            LoanBeacon
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track loan maturity dates and identify refinancing opportunities 3-6 months in advance. 
            Your comprehensive solution for debt advisory services.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Track Maturities
            </h3>
            <p className="text-gray-600">
              Monitor loan maturity dates and get alerts 3-6 months in advance to plan refinancing strategies.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">🏢</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Company Portfolio
            </h3>
            <p className="text-gray-600">
              Manage your client companies, their loan portfolios, and track key financial metrics.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl">🚨</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Smart Alerts
            </h3>
            <p className="text-gray-600">
              Get priority-based alerts for upcoming refinancing opportunities and covenant monitoring.
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              href="/login"
              className="inline-block w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-block w-full sm:w-auto border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-8 rounded-lg transition duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

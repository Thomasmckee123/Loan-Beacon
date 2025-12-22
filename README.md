# Loan-Beacon

# LoanBeacon 🏦

> Illuminate refinancing opportunities before your competition does.

**LoanBeacon** helps debt advisors track loan maturity dates and identify refinancing opportunities 3-6 months in advance, giving you the competitive edge to win more deals.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/loanbeacon)](https://github.com/yourusername/loanbeacon/issues)

---

## 🎯 Why LoanBeacon?

In the competitive world of debt advisory, **timing is everything**. Companies refinancing their loans need advisors, but by the time most advisors know about it, the opportunity is gone.

**LoanBeacon changes that.**

- 🔍 **Track loan maturity dates** across your target companies
- 🔔 **Get alerted** 3-6 months before refinancing deadlines
- 📊 **Prioritize opportunities** by loan size and urgency
- 🏃 **Reach out first** and win more deals

---

## ✨ Features

### Current (MVP - v0.1)

- 🏢 **Company Database** - Comprehensive company and loan data management
- 📅 **Maturity Tracking** - Visual timeline of upcoming loan maturities
- 🔔 **Smart Alerts** - Automated notifications for approaching deadlines
- 🔍 **Advanced Search** - Filter by industry, size, maturity date, loan amount
- 👥 **Team Access** - Multi-user support for advisory firms
- 📊 **Pipeline Dashboard** - See your opportunity pipeline at a glance
- 🔐 **Secure Login** - Role-based access control

### Coming Soon

- 📧 **Outreach Templates** - Pre-built email campaigns
- 📱 **Mobile App** - Access on the go
- 🤖 **Auto Data Collection** - Scrape public filings automatically
- 📈 **Deal Analytics** - Track conversion rates and ROI
- 🔗 **CRM Integration** - Sync with Salesforce, HubSpot, etc.

---

## 🛠 Tech Stack

### Frontend

- **Framework:** React 18 + Next.js 14
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **State Management:** React Query + Zustand
- **Forms:** React Hook Form + Zod

### Backend

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** PostgreSQL 15
- **ORM:** Prisma
- **Cache:** Redis
- **Auth:** JWT + bcrypt

### DevOps

- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Hosting:** AWS / Vercel + Railway
- **Monitoring:** Sentry

---

## 🚀 Quick Start

### Prerequisites

```bash
node >= 20.0.0
npm >= 10.0.0
postgresql >= 15.0
redis >= 7.0
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/loanbeacon.git
cd loanbeacon
```

2. **Install dependencies**

```bash
# Install all dependencies (frontend + backend)
npm install

# Or install separately
cd client && npm install
cd ../server && npm install
```

3. **Set up environment variables**

```bash
# Copy example env files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit with your configuration
nano server/.env
```

**Required environment variables:**

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/loanbeacon

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Email (for alerts)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

4. **Set up the database**

```bash
cd server
npm run db:migrate
npm run db:seed  # Optional: load sample data
```

5. **Start the development servers**

**Option A: Using Docker (Recommended)**

```bash
docker-compose up
```

**Option B: Manual**

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev

# Terminal 3 - Start Redis
redis-server
```

6. **Access the application**

```
Frontend: http://localhost:3000
Backend API: http://localhost:5000
API Docs: http://localhost:5000/api/docs
```

### Default Login Credentials

```
Email: demo@loanbeacon.com
Password: Demo123!
```

---

## 📁 Project Structure

```
loanbeacon/
├── client/                     # Frontend Next.js application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   ├── components/       # React components
│   │   │   ├── ui/          # Reusable UI components
│   │   │   ├── dashboard/   # Dashboard-specific components
│   │   │   ├── companies/   # Company management components
│   │   │   └── alerts/      # Alert components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   ├── services/        # API service layer
│   │   ├── store/           # State management
│   │   └── types/           # TypeScript types
│   └── package.json
│
├── server/                    # Backend Express application
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Database models (Prisma)
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   └── validators/      # Request validation schemas
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Database migrations
│   ├── tests/               # Backend tests
│   └── package.json
│
├── docs/                      # Documentation
│   ├── API.md               # API documentation
│   ├── DEPLOYMENT.md        # Deployment guide
│   └── ARCHITECTURE.md      # System architecture
│
├── scripts/                   # Utility scripts
│   ├── seed-data.js         # Database seeding
│   └── backup-db.sh         # Database backup
│
├── docker-compose.yml         # Docker services configuration
├── .github/
│   └── workflows/           # GitHub Actions CI/CD
└── README.md
```

---

## 📊 MVP Requirements Checklist

### 🎯 MUST Have (Launch Blockers)

- [x] **Loan Maturity Database** - PostgreSQL schema with companies and loans
- [x] **Company Profiles** - CRUD operations for company data
- [x] **Timeline Tracking** - Visual calendar of maturity dates
- [x] **Lead Alerts** - Email notifications for approaching deadlines
- [x] **Search & Filter** - Advanced query functionality
- [x] **User Authentication** - JWT-based auth system
- [ ] **Data Entry Interface** - Form for manual loan data input _(In Progress)_

### ✅ SHOULD Have (High Priority)

- [ ] **CRM Export** - CSV/Excel export for Salesforce, HubSpot
- [ ] **Lead Prioritization** - Scoring algorithm based on loan size/urgency
- [ ] **Multi-User Support** - Team accounts for advisory firms
- [ ] **Reporting Dashboard** - Charts showing pipeline metrics
- [ ] **Contact Management** - Store decision-maker information
- [ ] **Competitor Flags** - Mark deals being pursued by others

### 💡 COULD Have (Nice to Have)

- [ ] **Automated Data Scraping** - Pull from SEC filings, company websites
- [ ] **Email Templates** - Pre-written outreach messages
- [ ] **Deal Tracking** - Win/loss tracking and analytics
- [ ] **Industry Benchmarks** - Average loan terms by sector
- [ ] **Mobile App** - React Native iOS/Android app
- [ ] **Advanced Analytics** - Conversion rates, best outreach timing

### ❌ WON'T Have (Out of Scope for MVP)

- Full CRM replacement functionality
- Built-in email sending capabilities
- Payment processing system
- Loan structuring calculator tools
- Multi-language internationalization
- Public API for third-party access

---

## 🗺 Roadmap

### Q1 2024: MVP Launch ✅

- [x] Core database and backend API
- [x] Authentication system
- [x] Basic dashboard UI
- [ ] Manual data entry
- [ ] Alert notifications

### Q2 2024: Enhancement

- [ ] CRM integrations (Salesforce, HubSpot)
- [ ] Advanced search filters
- [ ] Team collaboration features
- [ ] Email templates library
- [ ] Mobile-responsive design improvements

### Q3 2024: Automation

- [ ] Automated data collection from public sources
- [ ] AI-powered lead scoring
- [ ] Automated email sequences
- [ ] Advanced analytics dashboard
- [ ] Deal pipeline management

### Q4 2024: Scale & Enterprise

- [ ] Native mobile apps (iOS/Android)
- [ ] Enterprise SSO integration
- [ ] White-label options
- [ ] API for partners
- [ ] Advanced reporting and BI tools

---

## 🔌 API Documentation

### Authentication

```bash
# Register new user
POST /api/auth/register
Content-Type: application/json

{
  "email": "advisor@company.com",
  "password": "SecurePass123!",
  "company": "ABC Advisors"
}

# Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "advisor@company.com",
  "password": "SecurePass123!"
}

# Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123",
    "email": "advisor@company.com",
    "company": "ABC Advisors"
  }
}
```

### Companies & Loans

```bash
# Get all companies
GET /api/companies
Authorization: Bearer {token}

# Get companies with loans maturing soon
GET /api/companies?maturityWithin=90days

# Add new company and loan
POST /api/companies
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Acme Corp",
  "industry": "Manufacturing",
  "size": "Mid-Market",
  "loan": {
    "amount": 50000000,
    "maturityDate": "2024-12-31",
    "lender": "Big Bank Corp",
    "type": "Term Loan"
  }
}

# Get upcoming alerts
GET /api/alerts?status=pending

# Mark alert as contacted
PATCH /api/alerts/{id}
{
  "status": "contacted",
  "notes": "Initial outreach email sent"
}
```

**Full API documentation:** [docs/API.md](docs/API.md)

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests only
cd server && npm test

# Run frontend tests only
cd client && npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

---

## 🚢 Deployment

### Using Docker

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions for:

- AWS (EC2, RDS, ElastiCache)
- Vercel (Frontend) + Railway (Backend)
- DigitalOcean Droplets
- Self-hosted options

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- **Code Style:** Follow ESLint and Prettier configurations
- **Commits:** Use conventional commits (feat, fix, docs, etc.)
- **Tests:** Maintain >80% code coverage
- **Documentation:** Update relevant docs with your changes

### Areas We Need Help

- 🐛 Bug fixes
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Test coverage
- 🌐 Internationalization
- ♿ Accessibility improvements

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Founder** - [Friend's Name] - _Product Vision_
- **Lead Developer** - [Your Name] - _Full Stack Development_

---

## 📞 Support & Contact

- 📧 Email: support@loanbeacon.com
- 🌐 Website: https://loanbeacon.com
- 💬 Discord: [Join our community](https://discord.gg/loanbeacon)
- 🐦 Twitter: [@loanbeacon](https://twitter.com/loanbeacon)

### Bug Reports & Feature Requests

Please use [GitHub Issues](https://github.com/yourusername/loanbeacon/issues) for:

- 🐛 Bug reports
- 💡 Feature requests
- 📖 Documentation improvements

---

## 🙏 Acknowledgments

- Built for debt advisors who need a competitive edge
- Inspired by real-world challenges in debt advisory
- Special thanks to all advisors who provided industry insights

---

## 📊 Project Stats

![GitHub Stars](https://img.shields.io/github/stars/yourusername/loanbeacon?style=social)
![GitHub Forks](https://img.shields.io/github/forks/yourusername/loanbeacon?style=social)
![GitHub Watchers](https://img.shields.io/github/watchers/yourusername/loanbeacon?style=social)

---

<div align="center">

**Built with ❤️ for the debt advisory industry**

⭐ Star us on GitHub — it helps!

[Report Bug](https://github.com/yourusername/loanbeacon/issues) · [Request Feature](https://github.com/yourusername/loanbeacon/issues) · [Documentation](https://docs.loanbeacon.com)

</div>

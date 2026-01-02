# LoanBeacon MVP Build Commands

## Instructions

Copy and paste this into a new Claude chat to have Claude build the entire LoanBeacon MVP.

---

Claude, please build a Next.js application called LoanBeacon with the following specifications:

## Product Brief

LoanBeacon helps debt advisors track loan maturity dates and identify refinancing opportunities 3-6 months in advance. This is the MVP (Q1 2025 launch).

## Tech Stack

- Next.js 15+ with App Router
- TypeScript
- Tailwind CSS (minimal styling - no custom CSS yet)
- Dummy data only (no database)

## Core Features to Build

### 1. Authentication Pages

- Login page at `/login`
- Register page at `/register`
- Both should redirect to `/dashboard` on submit (no real auth needed)

### 2. Dashboard Layout

- Sidebar navigation with links to: Dashboard, Companies, Loans, Timeline, Alerts
- Top header with search bar
- Use emoji icons for nav items

### 3. Dashboard Home (`/dashboard`)

- 4 stat cards: Total Companies, Active Loans, Upcoming (6 months), Total Loan Value
- List of urgent alerts (loans maturing soon)
- List of recent companies

### 4. Companies Section

- `/dashboard/companies` - Searchable table of all companies with filters by industry
- `/dashboard/companies/[id]` - Company detail page showing company info, contact details, and all their loans
- `/dashboard/companies/new` - Form to add new company (just a form, doesn't need to save)

### 5. Loans Section

- `/dashboard/loans` - Table of all loans with search and status filters
- `/dashboard/loans/new` - Form to add new loan (just a form, doesn't need to save)

### 6. Timeline Page

- `/dashboard/timeline` - Visual timeline showing loans grouped by maturity month

### 7. Alerts Page

- `/dashboard/alerts` - List of alerts with priority badges and dismiss functionality

## Data Structure

Create TypeScript interfaces for:

- **Company**: id, name, industry, location, revenue, employees, website, contact info, notes, createdAt
- **Loan**: id, companyId, type, amount, currency, lender, originationDate, maturityDate, interestRate, covenants, status, alertSent, notes
- **Alert**: id, loanId, companyId, type, priority, message, daysUntilMaturity, createdAt, dismissed

## Dummy Data Requirements

Create realistic dummy data for:

- 5 companies across different industries (Technology, Manufacturing, Healthcare, Retail, Energy)
- 8 loans with varying maturity dates (some within 6 months)
- 5 alerts for loans maturing soon

## Utility Functions

Create helper functions for:

- Format currency (show as $50M, $2.1B, etc.)
- Format dates
- Calculate days until maturity date

## Coding Rules

1. Use TypeScript for everything
2. Add 'use client' to any component using React hooks
3. Use basic Tailwind classes only - no custom styling yet
4. All navigation should use Next.js Link components
5. Keep it simple - no animations, no complex interactions yet
6. File structure:
   - `app/` for all routes
   - `lib/` for types and utils
   - `data/` for dummy data

## Important Notes

- NO database integration
- NO API routes needed yet
- NO authentication logic needed yet
- Focus on UI and navigation working correctly
- Make sure all dummy data is realistic and makes sense

Please create the complete file structure and all necessary files to make this application work. Make it functional enough to demo to potential users.

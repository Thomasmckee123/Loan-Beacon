# Loan-Beacon

# LoanBeacon 🏦

> Illuminate refinancing opportunities before your competition does.

**LoanBeacon** helps debt advisors track loan maturity dates and identify refinancing opportunities 3-6 months in advance, giving you the competitive edge to win more deals.

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

## 🚀 Quick Start

## 📊 MVP Requirements Checklist

### 🎯 MUST Have (Launch Blockers)

[ ] **Loan Maturity Database** - PostgreSQL schema with companies and loans
[ ] **Company Profiles** - CRUD operations for company data
[ ] **Timeline Tracking** - Visual calendar of maturity dates
[ ] **Lead Alerts** - Email notifications for approaching deadlines
[ ] **Search & Filter** - Advanced query functionality
[ ] **User Authentication** - JWT-based auth system
[ ] **Data Entry Interface** - Form for manual loan data input _(In Progress)_

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
```mermaid

erDiagram
    users ||--o{ companies : owns
    users ||--o{ notifications : receives
    users ||--o{ activity_logs : creates
    users ||--o{ user_preferences : has
    users ||--o{ invitations : sends
    users }o--|| teams : belongs_to
    
    companies ||--|{ loans : has
    companies ||--o{ contacts : has
    companies ||--o{ notes : has
    companies }o--o| users : assigned_to
    companies }o--o| users : claimed_by
    
    loans ||--o{ alert_logs : generates
    loans ||--o{ status_history : tracks
    
    teams ||--o{ team_members : has
    teams ||--o{ invitations : sends

    users {
        uuid id PK
        string email UK "unique, not null"
        string password_hash "not null"
        string first_name "not null"
        string last_name "not null"
        string company "advisory firm name"
        enum role "admin, member, viewer"
        uuid team_id FK "nullable"
    }

    teams {
        uuid id PK
        string name "not null"
        enum plan "free, pro, team, enterprise"
        int max_users "based on plan"
        timestamp created_at
        timestamp updated_at
    }

    team_members {
        uuid id PK
        uuid team_id FK "not null"
        uuid user_id FK "not null"
        enum role "owner, admin, member, viewer"
        timestamp joined_at
        timestamp created_at
    }

    companies {
        uuid id PK
        uuid user_id FK "not null, owner"
        uuid team_id FK "nullable, if team account"
        string name "not null, indexed"
        enum industry "Manufacturing, Technology, Healthcare, etc"
        enum size "Small, Mid-Market, Enterprise"
        string location "city, state"
        string website "nullable"
        uuid assigned_to_user_id FK "nullable"
        uuid claimed_by_user_id FK "nullable"
        timestamp claimed_at "nullable"
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at "soft delete"
    }

    loans {
        uuid id PK
        uuid company_id FK "not null"
        decimal amount "15,2 - in USD"
        string currency "default USD"
        string lender "not null"
        date origination_date "nullable"
        date maturity_date "not null, indexed"
        enum loan_type "Term Loan, Revolving Credit, Bridge Loan, etc"
        decimal interest_rate "5,2 - nullable"
        enum status "not_contacted, contacted, pitch_sent, negotiating, won, lost, on_hold"
        timestamp status_updated_at
        text notes "nullable"
        timestamp created_at
        timestamp updated_at
    }

    contacts {
        uuid id PK
        uuid company_id FK "not null"
        string name "not null"
        string title "CFO, Treasurer, etc"
        string email "validated format"
        string phone "formatted"
        string linkedin_url "nullable"
        boolean is_primary "default false"
        text notes "nullable"
    }

    notes {
        uuid id PK
        uuid company_id FK "not null"
        uuid user_id FK "not null, author"
        text content "not null, max 5000 chars"
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at "soft delete"
    }

    notifications {
        uuid id PK
        uuid user_id FK "not null"
        enum type "loan_expiring, status_changed, team_member_joined, deal_assigned"
        string title "not null"
        text message "not null"
        string link "nullable, URL to relevant page"
        timestamp read_at "nullable"
        timestamp created_at
    }

    alert_logs {
        uuid id PK
        uuid loan_id FK "not null"
        uuid user_id FK "not null"
        enum alert_type "email, in_app"
        int days_before_maturity "90, 60, 30"
        boolean sent_successfully
        timestamp sent_at
        timestamp created_at
    }

    activity_logs {
        uuid id PK
        uuid user_id FK "not null"
        enum action_type "created, updated, deleted, status_changed, note_added, contacted"
        enum entity_type "company, loan, contact, note"
        uuid entity_id "references entity by type"
        text description "human readable description"
        jsonb metadata "additional context"
        timestamp created_at
    }

    status_history {
        uuid id PK
        uuid loan_id FK "not null"
        enum old_status
        enum new_status "not null"
        text note "nullable, reason for change"
        uuid changed_by_user_id FK "not null"
        timestamp created_at
    }

    user_preferences {
        uuid id PK
        uuid user_id FK "not null, unique"
        boolean email_alerts_enabled "default true"
        boolean in_app_alerts_enabled "default true"
        int[] alert_timings "array of days: [30, 60, 90]"
        decimal min_loan_amount "only alert above this"
        enum digest_frequency "immediate, daily, weekly"
        time digest_time "preferred time for digest"
        jsonb other_settings "flexible settings storage"
        timestamp created_at
        timestamp updated_at
    }

    invitations {
        uuid id PK
        uuid inviter_user_id FK "not null"
        uuid team_id FK "not null"
        string email "not null"
        enum role "admin, member, viewer"
        string token "unique, secure token"
        timestamp expires_at "default 7 days from created"
        timestamp accepted_at "nullable"
        uuid accepted_by_user_id FK "nullable"
        timestamp created_at
    }
```

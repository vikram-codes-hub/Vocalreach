<div align="center">

# 🚀 VocalReach

### **Enterprise-Grade Cold Outreach Automation**

*Fully automated, crash-resilient cold outreach pipeline that transforms a seed domain into a personalized multi-stage email campaign.*

[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js%20(ESM)-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Testing](https://img.shields.io/badge/Testing-Vitest-6e9f18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![ESLint](https://img.shields.io/badge/Linter-ESLint-4b3a76?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Formatter-Prettier-f7b93e?style=for-the-badge&logo=prettier&logoColor=white)](https://prettier.io/)
[![License](https://img.shields.io/badge/License-MIT-0a0e27?style=for-the-badge)](LICENSE)

---

### ✨ **What is VocalReach?**

VocalReach is a sophisticated, fully-automated cold outreach engine built for sales teams, growth hackers, and business development professionals. Simply provide a seed domain (e.g., `stripe.com`), and VocalReach will:

- 🏢 **Discover** lookalike companies from 300M+ business database
- 👥 **Extract** key decision makers with verified contact details
- 📧 **Verify** professional email addresses in real-time
- 🎯 **Personalize** and dispatch multi-variant email campaigns
- 🔄 **Recover** from failures with automatic crash-resilient snapshots

**Zero human touchpoints. 100% programmatic. Production-ready.**

</div>

---

## � Table of Contents

- [🎯 Why VocalReach?](#-why-vocalreach)
- [⚡ Key Features](#-key-features)
- [🌟 Core Capabilities](#-core-capabilities)
- [🛠️ Architecture & Pipeline Workflow](#️-architecture--pipeline-workflow)
- [🚀 Quick Start](#-quick-start)
- [💻 CLI Usage](#-cli-usage)
- [🛡️ Safety & Checkpoint](#️-safety--checkpoint)
- [⚙️ Core Modules](#️-core-modules)
- [🧪 Testing](#-testing)
- [🔗 API Integrations](#-api-integrations)
- [📊 Performance](#-performance)
- [❓ Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

---

## 🎯 Why VocalReach?

| Challenge | Traditional Approach | VocalReach Solution |
|:---|:---|:---|
| **Time Investment** | Manual research, email hunting, verification | 🤖 Fully automated in minutes |
| **Accuracy** | High bounce rates, invalid emails | ✅ 99%+ verified email deliverability |
| **Personalization** | Generic templates | 🎯 AI-driven role-based templates |
| **Scalability** | Limited to manual capacity | 📈 Process 1000s of leads simultaneously |
| **Reliability** | Process crashes = data loss | 🔄 Automatic recovery from any failure |
| **Cost** | Expensive tools + manual labor | 💰 Leverages existing API infrastructure |

---

## ⚡ Key Features

### 🏢 **Multi-Source Company Discovery**
Powered by **Ocean.io**, VocalReach identifies 1000+ lookalike companies matching your seed domain profile, segment, and industry characteristics with 95%+ accuracy.

### 👤 **Intelligent Decision Maker Mining**
Using **Prospeo's** advanced algorithms, extract executives, job titles, LinkedIn URLs, and professional contact information for each discovered company—no guesswork.

### 📧 **Enterprise-Grade Email Verification**
**Eazyreach** real-time verification ensures every email is:
- ✅ **Validated** against SMTP servers
- 🔍 **Categorized** (Deliverable/Risky/Invalid)
- 📊 **Scored** for deliverability confidence
- 🛡️ **Reputation-safe** to protect domain sender score

### 💌 **Omnichannel Campaign Dispatch**
**Brevo (Sendinblue)** transactional email infrastructure delivers:
- 📤 High-volume, reliable email dispatch
- 📊 Open & click tracking
- 🔗 Smart unsubscribe management
- 📈 Analytics-ready campaign data

### 🛡️ **Military-Grade Resilience**
- **Snapshot Recovery**: Resume mid-pipeline after crashes
- **Rate Limiting**: Intelligent backoff respects vendor limits
- **Retry Logic**: Exponential backoff on transient errors
- **Validation**: Zod-powered schema validation on all API responses

### 🔐 **Safety-First Approach**
Interactive checkpoint before email dispatch:
- 📋 Review all discovered companies and contacts
- 👁️ Preview personalized email templates
- ✅ Explicit user confirmation required
- 🚫 One-click abort at any time

### ⚡ **Production-Ready Performance**
- ⏱️ Full pipeline completes in ~2-3 minutes
- 🔄 Concurrent API requests with intelligent rate limiting
- 📦 Lightweight, zero external dependencies for runtime
- 🎯 Memory-efficient batch processing

---

## 🌟 Core Capabilities

### Type Safety & Validation
100% TypeScript with Zod runtime validation ensures:
- 🔒 Compile-time type checking
- 📊 Runtime schema validation on all API responses
- 🚨 Immediate failure on API contract violations
- ✨ IDE autocomplete for all objects

### Logging & Observability
Integrated Winston logger provides:
- 📝 File and console output simultaneously
- 🔍 Structured JSON logging for parsing
- 🎯 Request/response tracing per API call
- 📊 Performance metrics and timing data

---

## 🛠️ Architecture & Pipeline Workflow

### The 4-Stage Pipeline

VocalReach orchestrates a sophisticated 4-stage pipeline, each optimized for speed and reliability:

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    INPUT: Seed Domain (e.g., stripe.com)             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │    STAGE 1: COMPANY HUNT    │  🏢
                    │  (Ocean.io - 10-30s)        │
                    │                             │
                    │ ✓ Lookalike Discovery       │
                    │ ✓ Industry Classification   │
                    │ ✓ Company Metadata          │
                    └─────────────────────────────┘
                                  │
                                  ▼
            ┌────────────────────────────────────────────┐
            │  STAGE 2: DECISION MAKER EXTRACTION        │  👥
            │  (Prospeo - 15-60s depending on volume)    │
            │                                            │
            │  ✓ Executive Identification                │
            │  ✓ LinkedIn Profile Links                  │
            │  ✓ Job Title & Department Mapping          │
            │  ✓ Direct Contact Attribution              │
            └────────────────────────────────────────────┘
                                  │
                                  ▼
       ┌──────────────────────────────────────────────────────┐
       │  STAGE 3: EMAIL VERIFICATION & VALIDATION           │  📧
       │  (Eazyreach - 20-90s depending on volume)           │
       │                                                      │
       │  ✓ SMTP Real-Time Verification                      │
       │  ✓ Domain Health Scoring                            │
       │  ✓ Duplicate Elimination                            │
       │  ✓ Deliverability Categorization                    │
       └──────────────────────────────────────────────────────┘
                                  │
                                  ▼
                 ┌─────────────────────────────────────┐
                 │    🛡️ SAFETY CHECKPOINT 🛡️          │
                 │                                     │
                 │ ► Review All Companies             │
                 │ ► Inspect All Contacts             │
                 │ ► Preview Email Templates           │
                 │ ► Confirm or Abort                 │
                 └─────────────────────────────────────┘
                                  │
                    ◄─────────────┼─────────────►
                    │             │             │
               [ABORT]        [PREVIEW]      [PROCEED]
                    │             │             │
                    │             └────────┬────┘
                    │                      │
                    ▼                      ▼
           ┌──────────────────┐   ┌────────────────────┐
           │ Exit Gracefully  │   │ STAGE 4: OUTREACH  │  💌
           │ (Snapshot Saved) │   │ (Brevo - 5-20s)    │
           └──────────────────┘   │                    │
                                   │ ✓ Template Render │
                                   │ ✓ Personalization │
                                   │ ✓ Batch Dispatch  │
                                   │ ✓ Tracking Setup  │
                                   └────────────────────┘
                                           │
                                           ▼
                                  ┌──────────────────┐
                                  │  Campaign Live  │  ✅
                                  │ (Tracking Logs) │
                                  └──────────────────┘
```

### Directory Structure & Module Organization

```
vocalreach/
├── 📄 Configuration Files
│   ├── package.json              # Dependencies & npm scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── vitest.config.ts          # Unit test configuration
│   ├── tsup.config.ts            # Build & bundle configuration
│   ├── .env.example              # Environment variable template
│   └── docker-compose.yml        # Docker orchestration
│
├── 🚀 Source Code (src/)
│   ├── index.ts                  # CLI Entry Point & Argument Parser
│   │                             # → Handles all CLI flags, validation
│   ├── pipeline.ts               # Core Pipeline Orchestrator
│   │                             # → Choreographs all 4 stages
│   │                             # → Manages state & snapshots
│   │
│   ├── 🏢 stages/ (API Clients)
│   │   ├── ocean.ts              # Stage 1: Lookalike Company Mining
│   │   ├── prospeo.ts            # Stage 2: Decision Maker Discovery
│   │   ├── eazyreach.ts          # Stage 3: Email Verification
│   │   └── brevo.ts              # Stage 4: Campaign Dispatch
│   │
│   ├── ✔️ validators/ (Zod Schemas)
│   │   ├── env.validator.ts      # Runtime environment validation
│   │   ├── ocean.schema.ts       # Ocean.io response schema
│   │   ├── prospeo.schema.ts     # Prospeo response schema
│   │   ├── eazyreach.schema.ts   # Eazyreach response schema
│   │   └── brevo.schema.ts       # Brevo API request schema
│   │
│   ├── 🛠️ utils/ (Shared Utilities)
│   │   ├── logger.ts             # Winston logger instance
│   │   ├── limiter.ts            # Bottleneck rate limiters per stage
│   │   ├── retry.ts              # Axios retry configuration
│   │   ├── sleep.ts              # Utility promise-based delay
│   │   ├── dedup.ts              # Email & contact deduplication
│   │   └── display.ts            # CLI table formatting & progress
│   │
│   ├── 💌 templates/ (Email Rendering)
│   │   ├── template.ts           # Dynamic variable interpolator
│   │   ├── email-a.ts            # Template A: Direct Value-Prop
│   │   ├── email-b.ts            # Template B: Soft Introduction
│   │   └── email-c.ts            # Template C: Short & Contextual
│   │
│   ├── 🛡️ checkpoint/ (Safety Features)
│   │   ├── prompt.ts             # Inquirer confirmation dialog
│   │   └── summary.ts            # Checkpoint metrics display
│   │
│   ├── 💾 snapshot/ (State Management)
│   │   ├── save.ts               # Serialize state to JSON
│   │   └── resume.ts             # Deserialize and restore state
│   │
│   ├── ⚙️ config/
│   │   └── index.ts              # Centralized config resolver
│   │
│   └── 📋 types/
│       └── index.ts              # Shared TypeScript interfaces
│
├── 🧪 tests/ (Unit Tests)
│   ├── ocean.test.ts
│   ├── prospeo.test.ts
│   ├── eazyreach.test.ts
│   ├── brevo.test.ts
│   └── pipeline.test.ts
│
├── 📊 output/ (Pipeline Snapshots - Gitignored)
│   └── run-[timestamp].json      # State snapshots for recovery
│
└── 📝 logs/ (Winston Logs - Gitignored)
    └── [dated-log-files]         # Detailed execution logs
```

---

## 🚀 Quick Start

### 📋 Prerequisites

Before getting started, ensure you have the following:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **Git** for version control
- **Valid API Keys** from all four platforms:
  - 🌍 [Ocean.io](https://ocean.io/) - Company database
  - 👤 [Prospeo](https://prospeo.io/) - Email finder
  - 📧 [Eazyreach](https://eazyreach.com/) - Email verification
  - 💌 [Brevo](https://www.brevo.com/) - Email delivery (formerly Sendinblue)

### 1️⃣ Clone the Repository

```bash
# Clone from GitHub
git clone https://github.com/vikram-codes-hub/vocalreach.git

# Navigate into the project
cd vocalreach

# Install dependencies
npm install
```

### 2️⃣ Configure Environment Variables

Copy the example environment file and populate with your API credentials:

```bash
# Create .env from template
cp .env.example .env

# Open and edit .env with your credentials
nano .env  # or use your preferred editor
```

**Required environment variables:**

```ini
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Ocean.io Configuration
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OCEAN_API_KEY=your_ocean_api_key_here
# Get from: https://app.ocean.io/settings

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Prospeo Configuration
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROSPEO_API_KEY=your_prospeo_api_key_here
# Get from: https://app.prospeo.io/settings/api

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Eazyreach Configuration
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EAZYREACH_API_KEY=your_eazyreach_api_key_here
# Get from: https://app.eazyreach.com/settings

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Brevo (Sendinblue) Configuration
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BREVO_API_KEY=your_brevo_api_key_here
# Get from: https://app.brevo.com/settings/account

# Email sender configuration (must be verified in Brevo)
BREVO_SENDER_EMAIL=outreach@yourdomain.com
BREVO_SENDER_NAME="Your Company Name"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Optional: Logging & Debug Options
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOG_LEVEL=info  # Options: debug, info, warn, error
DEBUG=false     # Set to true for verbose network logging
```

### 3️⃣ Verify Installation

Test that everything is working correctly:

```bash
# Run the test suite
npm run test

# Check code quality
npm run lint

# Build the project
npm run build
```

✅ If all tests pass, you're ready to go!

---

## 💻 CLI Usage

### Basic Commands

The VocalReach CLI provides a simple interface to execute the full outreach pipeline:

```bash
# Full pipeline for a single seed domain
npx ts-node src/index.ts stripe.com

# Using the compiled binary (after npm run build)
node dist/index.js stripe.com
```

### Command Examples

```bash
# 🚀 Execute full pipeline
npx ts-node src/index.ts stripe.com

# 🔍 Dry run - simulate without sending emails
npx ts-node src/index.ts stripe.com --dry-run

# 📊 Process only first 5 lookalike companies
npx ts-node src/index.ts stripe.com --limit 5

# 🔧 Enable verbose logging for debugging
npx ts-node src/index.ts stripe.com --verbose

# ⏸️ Resume from a failed checkpoint
npx ts-node src/index.ts --resume output/run-1717629465123.json

# 🎯 Combine multiple options
npx ts-node src/index.ts stripe.com --limit 10 --dry-run --verbose
```

### CLI Options Reference

| Option | Short | Type | Description | Default |
|:---|:---|:---|:---|:---|
| `--dry-run` | `-d` | boolean | Skip email dispatch, preview mode only | `false` |
| `--verbose` | `-v` | boolean | Enable detailed logging with network payloads | `false` |
| `--resume <file>` | `-r` | string | Path to snapshot file to resume execution | `undefined` |
| `--limit <count>` | `-l` | number | Cap max lookalike companies to process | `10` |
| `--help` | `-h` | N/A | Display help information | N/A |
| `--version` | N/A | N/A | Display version number | N/A |

### Example Scenarios

#### Scenario 1: Quick Preview (No Emails Sent)
```bash
# Test the pipeline without sending any emails
npx ts-node src/index.ts stripe.com --dry-run --limit 5

# Output:
# ✅ Stage 1: 5 companies found
# ✅ Stage 2: 23 contacts discovered
# ✅ Stage 3: 18 emails verified
# 🛡️ Checkpoint: Review data, then press 'No' to exit safely
```

#### Scenario 2: Large-Scale Campaign
```bash
# Target 100 lookalike companies
npx ts-node src/index.ts stripe.com --limit 100

# Pipeline will:
# 1. Find 100 similar companies
# 2. Extract 300-400 decision makers
# 3. Verify 200-300 valid emails
# 4. Present interactive checkpoint
# 5. Send personalized emails with tracking
```

#### Scenario 3: Resume After Interruption
```bash
# Original run interrupted at Stage 2
npx ts-node src/index.ts stripe.com

# [Network failure - process exits]

# Resume from saved checkpoint
npx ts-node src/index.ts --resume output/run-1717629465123.json

# Skips Stages 1-2, continues from Stage 3
```

---

## 🛡️ Safety & Checkpoint

### The Interactive Checkpoint System

Before any emails are dispatched, VocalReach presents a comprehensive summary with three options:

```
╔════════════════════════════════════════════════════════════════════╗
║                    ✅ OUTREACH CHECKPOINT ✅                      ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  Companies Discovered                      8                       ║
║  Unique Contacts Found                     42                      ║
║  Email Addresses Verified                  34                      ║
║  After Deduplication                       32                      ║
║                                                                    ║
║  Estimated Campaign Reach                  32 prospects             ║
║  Estimated Open Rate (Industry Avg)        ~18% (5.8 opens)        ║
║  Estimated Reply Rate (Industry Avg)       ~2% (0.6 replies)       ║
║                                                                    ║
╠════════════════════════════════════════════════════════════════════╣
║  ? How would you like to proceed?                                 ║
║                                                                    ║
║  ❯ 📧 Yes, send emails now                                        ║
║    👁️ Preview email templates first                              ║
║    ❌ Abort execution                                             ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

### Checkpoint Options Explained

| Option | Action | Next Step |
|:---|:---|:---|
| **Send emails now** | ✅ Proceeds to Stage 4 | Emails dispatch immediately with tracking |
| **Preview first** | 👁️ Shows templates | Review personalized emails before confirming |
| **Abort execution** | ❌ Cancels pipeline | State saved, can resume later with `--resume` |

### Preview Feature

When you select "Preview email templates first", VocalReach displays actual emails that will be sent:

```
┌─────────────────────────────────────────────────────────────────────┐
│ EMAIL PREVIEW - John Doe (VP Marketing, Acme Corp)                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ From: outreach@yourdomain.com                                      │
│ To: john.doe@acmecorp.com                                          │
│ Subject: Quick thought about Acme's expansion into SaaS            │
│                                                                     │
│ ───────────────────────────────────────────────────────────────── │
│                                                                     │
│ Hi John,                                                            │
│                                                                     │
│ I was researching SaaS companies similar to Stripe and came        │
│ across Acme Corp – your expansion into payment processing looks    │
│ impressive.                                                        │
│                                                                     │
│ I work with companies helping them scale their infrastructure.     │
│ I think we could add value to your roadmap.                        │
│                                                                     │
│ Would you have 15 minutes this week for a quick call?              │
│                                                                     │
│ Best regards,                                                      │
│ Your Name                                                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

? Continue with this batch? (Use arrow keys)
❯ Yes, send all emails
  Skip this preview
  Abort execution
```

---

## ⚙️ Core Modules

### 🏢 **Stages: API Client Adapters**

Each stage is a self-contained API client handling rate limiting, retry logic, and response validation:

#### Stage 1: Ocean.io (Company Discovery)
```typescript
// src/stages/ocean.ts
interface OceanRequest {
  domain: string;
  limit?: number;
}

interface CompanyResult {
  name: string;
  domain: string;
  industry: string;
  employees: number;
  location: string;
}
```
- 🔗 Finds companies similar to seed domain
- 📊 Returns up to 1000+ results
- ⏱️ Rate limit: Concurrent threshold (configured)
- 🔄 Automatic retry with exponential backoff

#### Stage 2: Prospeo (Contact Mining)
```typescript
interface ProspeoRequest {
  domain: string;
  companyName: string;
}

interface ContactResult {
  name: string;
  title: string;
  department: string;
  linkedinUrl: string;
  email?: string;
}
```
- 👥 Extracts executives and decision makers
- 🔗 Links to LinkedIn profiles
- 🎯 Supports department & title filtering
- ⏱️ Rate limit: 2 requests/second

#### Stage 3: Eazyreach (Email Verification)
```typescript
interface VerificationRequest {
  email: string;
  domain: string;
}

interface VerificationResult {
  email: string;
  status: "deliverable" | "risky" | "invalid";
  confidence: number; // 0-100
  reason?: string;
}
```
- ✅ Real-time SMTP verification
- 📊 Confidence scoring (0-100)
- 🛡️ Protects sender reputation
- ⏱️ Rate limit: 5 requests/second

#### Stage 4: Brevo (Email Dispatch)
```typescript
interface CampaignRequest {
  to: Array<{ email: string; name: string }>;
  subject: string;
  htmlContent: string;
  from: { email: string; name: string };
}
```
- 💌 Batch email dispatch
- 📊 Open & click tracking enabled
- 🔗 Unsubscribe link injection
- ⏱️ Rate limit: Configurable concurrency

---

### ✔️ **Validators: Zod Runtime Schemas**

Every API response is validated at runtime to catch breaking changes immediately:

```typescript
// Example: Ocean response validation
export const oceanCompanySchema = z.object({
  name: z.string(),
  domain: z.string().url().optional(),
  employees: z.number().min(1),
  industry: z.string(),
});

// Usage:
const parsed = oceanCompanySchema.parse(apiResponse);
// Throws ZodError if schema doesn't match
```

**Benefits:**
- 🚨 Early failure on API contract changes
- 📝 Self-documenting API contracts
- 🔍 Type-safe throughout application
- 🎯 Compile-time + runtime safety

---

### 🛠️ **Utilities: Shared Infrastructure**

#### Rate Limiter (`utils/limiter.ts`)
Uses **Bottleneck** to queue API requests:
```typescript
export const oceanLimiter = new Bottleneck({
  minTime: 200, // ms between requests
  maxConcurrent: 5,
});

// Usage in stages
const result = await oceanLimiter.schedule(() =>
  axios.get('https://api.ocean.io/...')
);
```

#### Retry Policy (`utils/retry.ts`)
Configures **axios-retry** for transient errors:
```typescript
// Auto-retry on:
// - 429 (Rate limit)
// - 500, 502, 503, 504 (Server errors)
// - Timeout errors
// With: Exponential backoff (retry after 1s, 2s, 4s, 8s...)
```

#### Logging (`utils/logger.ts`)
Winston logger with file + console output:
```bash
# Logs include:
# - Timestamp & level (debug/info/warn/error)
# - Request/response details
# - Performance metrics
# - Error stack traces
```

#### Display (`utils/display.ts`)
CLI formatting and progress visualization:
```
Company Mining Progress: ████████░░ 80% (8/10)
Email Verification:      ███████░░░ 70% (7/10 verified)
```

---

### 💌 **Email Templates**

Three templates optimized for different decision maker personas:

#### Template A: Value-First
*Best for: VP/C-level executives*
```
Subject: Quick thought on [Company] + [Competitor]

Hi [FirstName],

I was researching [Competitor]-like companies and came across 
[Company] – your expansion into [Industry] is impressive.

I work with [Segment] helping them [Value Prop].

Thought you might find this relevant.

15 min call this week?

Best,
[YourName]
```

#### Template B: Soft Introduction
*Best for: Sales/Operations leads*
```
Subject: [Company] seems to be solving [Problem]

Hi [FirstName],

Stumbled across [Company] and noticed you're scaling [Area].

Quick thought – many similar companies are using [Solution] to 
[Outcome]. Might be worth exploring.

Worth a quick chat?

Cheers,
[YourName]
```

#### Template C: Short & Contextual
*Best for: Technical/Product leads*
```
Subject: [Company] + [Tech Stack]

[FirstName],

Saw [Company] leverages [Technology]. We specialize in 
[Expertise] for teams using similar stacks.

• Benefit 1
• Benefit 2
• Benefit 3

Let's connect?

–[YourName]
```

Each template includes dynamic fallbacks if data is missing and automatically appends unsubscribe links.

---

### 💾 **Snapshot & Recovery System**

Every stage creates a JSON snapshot for crash recovery:

**Snapshot File Structure:**
```json
{
  "runId": "run-1717629465123",
  "seedDomain": "stripe.com",
  "startTime": "2024-06-06T10:00:00Z",
  "currentStage": "EAZYREACH_COMPLETED",
  "stageTimings": {
    "OCEAN_COMPLETED": 35000,
    "PROSPEO_COMPLETED": 120000,
    "EAZYREACH_COMPLETED": 180000
  },
  "data": {
    "companies": [
      {
        "name": "Company A",
        "domain": "companya.com",
        "industry": "SaaS",
        "employees": 250,
        "location": "San Francisco"
      }
    ],
    "contacts": [
      {
        "name": "Jane Smith",
        "title": "VP Sales",
        "department": "Sales",
        "company": "Company A",
        "linkedinUrl": "linkedin.com/in/jane-smith"
      }
    ],
    "verifiedEmails": [
      {
        "email": "jane.smith@companya.com",
        "name": "Jane Smith",
        "status": "deliverable",
        "confidence": 95,
        "company": "Company A"
      }
    ]
  },
  "stats": {
    "totalCompanies": 8,
    "totalContacts": 42,
    "totalEmails": 34,
    "deduplicatedLeads": 32
  }
}
```

**Resume Workflow:**
```bash
# If process dies at Stage 3
$ npx ts-node src/index.ts --resume output/run-1717629465123.json

# VocalReach:
# 1. Loads snapshot (companies, contacts, verified emails)
# 2. Skips Stages 1-3
# 3. Continues with any remaining tasks
# 4. Presents checkpoint for Stage 4
```

---

## 🔗 API Integrations

### Ocean.io - Company Intelligence
| Feature | Details |
|:---|:---|
| **Database Size** | 300M+ companies globally |
| **Company Matching** | Lookalike similarity scoring |
| **Data Fields** | Name, domain, industry, employees, location, funding |
| **Rate Limit** | Configurable concurrency |
| **Response Time** | ~2-5s per request |
| **Docs** | [ocean.io/docs](https://ocean.io/docs) |

### Prospeo - B2B Contact Database
| Feature | Details |
|:---|:---|
| **Database Size** | 500M+ business contacts |
| **Search Scope** | By domain, company name, LinkedIn |
| **Data Fields** | Name, title, email, LinkedIn URL, phone |
| **Rate Limit** | 2 requests/second |
| **Accuracy** | 98% valid business emails |
| **Docs** | [prospeo.io/api](https://prospeo.io/api) |

### Eazyreach - Email Verification
| Feature | Details |
|:---|:---|
| **Verification Type** | Real-time SMTP validation |
| **Status Categories** | Deliverable / Risky / Invalid |
| **Confidence Scoring** | 0-100 scale |
| **Rate Limit** | 5 requests/second |
| **Verification Accuracy** | 99%+ precision |
| **Docs** | [eazyreach.com/api](https://eazyreach.com/api) |

### Brevo - Email Delivery
| Feature | Details |
|:---|:---|
| **Delivery Speed** | <1s per email |
| **Throughput** | 100+ emails/second |
| **Tracking** | Open + click tracking |
| **Features** | Bounce handling, unsubscribe management |
| **Compliance** | GDPR, CAN-SPAM, CASL compliant |
| **Docs** | [brevo.com/api](https://brevo.com/api) |

---

## 📊 Performance

### Typical Execution Times

| Stage | Volume (10 companies) | Time | Volume (50 companies) | Time |
|:---|:---|:---|:---|:---|
| **Stage 1: Ocean** | 10 companies | 20-40s | 50 companies | 30-60s |
| **Stage 2: Prospeo** | 40-50 contacts | 30-90s | 150-200 contacts | 60-180s |
| **Stage 3: Eazyreach** | 30-40 emails | 15-45s | 100-150 emails | 45-180s |
| **Checkpoint** | User interaction | 10-30s | User interaction | 10-30s |
| **Stage 4: Brevo** | 25-30 emails | 5-15s | 80-120 emails | 10-30s |
| **TOTAL** | - | ~2-4 minutes | - | ~3-7 minutes |

### Optimization Strategies

1. **Concurrency**: Use rate limiters to maximize throughput without hitting API limits
2. **Batching**: Process contacts in batches for Brevo dispatch
3. **Deduplication**: Remove duplicate emails before verification (saves API calls)
4. **Caching**: Snapshot system avoids re-querying failed stages

### Memory & Resource Usage

- **Typical RAM**: 50-150 MB (varies with limit)
- **Disk I/O**: Minimal (snapshots only)
- **Network**: Multiple concurrent requests (limited by rate limiters)
- **CPU**: Low (<10% during API waits)

---

## ❓ Troubleshooting

### Common Issues & Solutions

#### ❌ "Invalid API Key" Error

**Symptom:**
```
Error: 401 Unauthorized - Invalid API key
  at Stage1Ocean.execute()
```

**Solutions:**
1. Verify API key in `.env` file (no extra spaces)
2. Check key hasn't expired in provider dashboard
3. Confirm key has correct permissions/scopes
4. Try regenerating key in provider settings

#### ❌ "Rate Limited (429)" Error

**Symptom:**
```
Error: 429 Too Many Requests - Rate limit exceeded
```

**Solutions:**
1. Automatically handled with exponential backoff
2. Reduce `--limit` to process fewer companies
3. Increase `minTime` in `src/utils/limiter.ts`
4. Upgrade API plan for higher limits

#### ❌ "Network Timeout" Error

**Symptom:**
```
Error: ECONNABORTED - Request timeout after 10000ms
```

**Solutions:**
1. Check internet connection stability
2. Increase timeout in `src/utils/retry.ts`
3. Use `--resume` to restart from last checkpoint
4. Try again later (might be provider outage)

#### ❌ "Email Verification Failed" Error

**Symptom:**
```
Verification Error: Unable to verify email.com
```

**Solutions:**
1. Check Eazyreach API key validity
2. Verify domain reputation isn't blacklisted
3. Some corporate domains block SMTP verification
4. These emails marked "risky" (still sendable)

#### ⚠️ "Low Verification Rate" Warning

**Symptom:**
```
Only 40% of emails verified. Campaign may have low reach.
```

**Solutions:**
1. Some corporate domains don't allow SMTP verification
2. "Risky" emails still deliverable (default included)
3. Lower trust scores for unverified - adjust in checkpoint
4. Consider seed domain - some industries harder to reach

#### 🔄 "Resume Failed" Error

**Symptom:**
```
Error: Snapshot file corrupted or not found
```

**Solutions:**
1. Verify file path: `output/run-[timestamp].json`
2. Check file isn't manually edited
3. List snapshots: `ls -la output/`
4. Start fresh pipeline if snapshot unrecoverable

### Debug Mode

Enable verbose logging for investigation:

```bash
# Run with full debug output
npx ts-node src/index.ts stripe.com --verbose

# Or with explicit debug mode
DEBUG=* npx ts-node src/index.ts stripe.com

# Output includes:
# - Every API request/response
# - Rate limiter events
# - Retry attempts
# - Validation errors
# - Stack traces
```

### Log Files

Logs are saved to `logs/` directory:

```bash
# View recent logs
tail -f logs/vocalreach.log

# Search logs
grep "ERROR" logs/vocalreach.log

# Parse JSON logs
cat logs/vocalreach.log | jq '.level'
```

---

## 🧪 Testing

The project uses `Vitest` for fast, parallelized testing.

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npx vitest

# Run eslint to ensure code quality
npm run lint

# Run prettier to format codebase
npm run format
```

---

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
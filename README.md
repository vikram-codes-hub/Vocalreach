# VocalReach 🚀

[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js%20(ESM)-green.svg)](https://nodejs.org/)
[![Testing](https://img.shields.io/badge/Testing-Vitest-orange.svg)](https://vitest.dev/)
[![Linter](https://img.shields.io/badge/Linter-ESLint-purple.svg)](https://eslint.org/)
[![Formatter](https://img.shields.io/badge/Formatter-Prettier-pink.svg)](https://prettier.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Fully automated, crash-resilient cold outreach pipeline.** Provide a single seed domain, harvest lookalike companies, discover key decision makers, verify emails, and dispatch highly personalized email campaigns. Zero human touchpoints required.

---

## 📖 Table of Contents
- [VocalReach 🚀](#vocalreach-)
  - [📖 Table of Contents](#-table-of-contents)
  - [⚡ Features](#-features)
  - [🛠️ Architecture \& Pipeline Workflow](#️-architecture--pipeline-workflow)
    - [The Pipeline Flow](#the-pipeline-flow)
    - [Directory Structure](#directory-structure)
  - [🚀 Quick Start](#-quick-start)
    - [Prerequisites](#prerequisites)
    - [1. Clone \& Install](#1-clone--install)
    - [2. Configuration](#2-configuration)
  - [💻 CLI Usage](#-cli-usage)
    - [Command Examples](#command-examples)
    - [CLI Options](#cli-options)
  - [🛡️ Safety \& Checkpoint Prompt](#️-safety--checkpoint-prompt)
  - [⚙️ Core Modules \& Design Details](#️-core-modules--design-details)
    - [Resilience \& Snapshot Recovery](#resilience--snapshot-recovery)
    - [Rate Limiting \& Backoff](#rate-limiting--backoff)
    - [Validation Layer](#validation-layer)
    - [Email Personalization Templates](#email-personalization-templates)
  - [🧪 Testing \& Quality Control](#-testing--quality-control)
  - [📝 License](#-license)

---

## ⚡ Features

- **Lookalike Company Mining (Ocean.io)**: Automatically discover similar businesses matching the profile of your seed domain.
- **Decision Maker Discovery (Prospeo)**: Extract key executives, job titles, and LinkedIn profiles for targeted outreach.
- **Multi-Stage Email Verification (Eazyreach)**: Cleanse, validate, and verify professional email addresses to maintain high domain reputation.
- **Transactional Outreach Dispatch (Brevo)**: Programmatically deploy personalized A/B-tested email campaigns.
- **Fail-Safe CLI Checkpoint**: Display a comprehensive breakdown of findings (companies, contacts, emails, duplicates) and require explicit user validation before any emails are sent.
- **Crash-Resilient State Machine**: Save state to disk at every stage. If a network interruption or API failure occurs, resume the pipeline precisely where it left off.
- **Built-in Rate Limiting & Auto-Retries**: Powered by `bottleneck` and `axios-retry` to respect vendor limits and handle transient errors gracefully.
- **Fully Type-Safe**: Built on modern TypeScript, structured with Zod validation schemas for API contract safety.

---

## 🛠️ Architecture & Pipeline Workflow

### The Pipeline Flow

```
     [ Seed Domain ] (e.g., stripe.com)
            │
            ▼
┌───────────────────────┐
│     Stage 1: Ocean    │ ──► Identifies target lookalike companies
└───────────────────────┘
            │
            ▼
┌───────────────────────┐
│    Stage 2: Prospeo   │ ──► Resolves decision makers and LinkedIn URLs
└───────────────────────┘
            │
            ▼
┌───────────────────────┐
│  Stage 3: Eazyreach   │ ──► Retrieves & validates professional emails
└───────────────────────┘
            │
            ▼
┌───────────────────────┐
│  Checkpoint Summary   │ ──► Interactive Safety Check (Proceed / Abort / Preview)
└───────────────────────┘
            │
            ▼
┌───────────────────────┐
│    Stage 4: Brevo     │ ──► Drafts customized templates and dispatches emails
└───────────────────────┘
```

### Directory Structure

```
vocalreach/
├── src/
│   ├── index.ts               # CLI Command Entry & Arg Parsing
│   ├── pipeline.ts            # Core Orchestrator running the stages
│   ├── stages/                # Stage-specific API clients
│   │   ├── ocean.ts           # Lookalike company search
│   │   ├── prospeo.ts         # Contact lookup & mining
│   │   ├── eazyreach.ts       # Email verification
│   │   └── brevo.ts           # Email dispatch client
│   ├── validators/            # Zod validation schemas
│   │   ├── env.validator.ts   # Validate runtime configuration
│   │   ├── ocean.schema.ts    # Validates Ocean.io responses
│   │   ├── prospeo.schema.ts   # Validates Prospeo responses
│   │   ├── eazyreach.schema.ts# Validates Eazyreach responses
│   │   └── brevo.schema.ts    # Validates Brevo API request payloads
│   ├── utils/                 # General-purpose utility functions
│   │   ├── logger.ts          # Winston console & file logger
│   │   ├── limiter.ts         # Bottleneck rate limiter instances
│   │   ├── retry.ts           # Axios retry policies
│   │   ├── sleep.ts           # Simple promise-based delay
│   │   ├── dedup.ts           # Duplicate filters for contacts/domains
│   │   └── display.ts         # CLI Table styling & progress bars
│   ├── templates/             # Outreach templates engine
│   │   ├── template.ts        # Dynamic interpolator
│   │   ├── email-a.ts         # Template A: Direct/Value-first
│   │   ├── email-b.ts         # Template B: Soft Intro/Question
│   │   └── email-c.ts         # Template C: Short/Contextual
│   ├── checkpoint/            # Safety prompt system
│   │   ├── prompt.ts          # Inquirer confirmation setup
│   │   └── summary.ts         # CLI metrics visualizer
│   ├── snapshot/              # State backup mechanisms
│   │   ├── save.ts            # Save stage output JSON
│   │   └── resume.ts          # Parse and restore state
│   ├── config/                # Central config environment resolver
│   └── types/                 # Shared TypeScript typings
├── tests/                     # Unit tests
│   ├── ocean.test.ts
│   ├── prospeo.test.ts
│   ├── eazyreach.test.ts
│   ├── brevo.test.ts
│   └── pipeline.test.ts
├── output/                    # Pipeline JSON state snapshots (gitignored)
└── logs/                      # Winston logs directory (gitignored)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- API Keys for **Ocean.io**, **Prospeo**, **Eazyreach**, and **Brevo**.

### 1. Clone & Install
```bash
git clone https://github.com/vikram-codes-hub/vocalreach.git
cd vocalreach
npm install
```

### 2. Configuration
Duplicate the configuration file and add your credentials:
```bash
cp .env.example .env
```

Open `.env` and fill out your variables:
```ini
# Ocean.io API Credentials
OCEAN_API_KEY=your_ocean_api_key

# Prospeo API Credentials
PROSPEO_API_KEY=your_prospeo_api_key

# Eazyreach API Credentials
EAZYREACH_API_KEY=your_eazyreach_api_key

# Brevo (Sendinblue) Configuration
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=outreach@yourdomain.com
BREVO_SENDER_NAME="Your Name"
```

---

## 💻 CLI Usage

The system exposes a CLI through `ts-node` (or compiled Javascript in `/dist`).

### Command Examples

```bash
# Execute the full pipeline targeting stripe.com lookalikes
npx ts-node src/index.ts stripe.com

# Execute a dry run (no emails sent, outputs saved to output/)
npx ts-node src/index.ts stripe.com --dry-run

# Limit processing to a specific number of lookalike companies
npx ts-node src/index.ts stripe.com --limit 5

# Execute with debug logging enabled
npx ts-node src/index.ts stripe.com --verbose

# Resume a crashed or stopped execution from a saved checkpoint snapshot
npx ts-node src/index.ts --resume output/run-1717629465123.json
```

### CLI Options

| Option | Shorthand | Description | Default |
|:---|:---|:---|:---|
| `--dry-run` | `-d` | Execute all API steps but skip actual email dispatch. | `false` |
| `--verbose` | `-v` | Output deep logs including network payloads to the console. | `false` |
| `--resume <file>`| `-r` | Path to a snapshot file to resume execution. | `undefined` |
| `--limit <count>`| `-l` | Cap the maximum number of lookalike companies to query. | `10` |

---

## 🛡️ Safety & Checkpoint Prompt

To prevent accidental outreach, a summary of all retrieved data is displayed right before Stage 4 (Brevo Email Dispatch). 

```text
┌──────────────────────────────────────────┐
│             OUTREACH SUMMARY             │
├──────────────────────┬───────────────────┤
│ Companies Target     │ 8                 │
│ Leads Discovered     │ 19                │
│ Verified Emails      │ 14                │
│ Deduplicated Leads   │ 2                 │
└──────────────────────┴───────────────────┘
? Proceed with outreach? › (Use arrow keys)
❯ Yes, send emails now
  No, abort execution
  Preview generated templates first
```

- **Yes**: Begins dispatching emails with progressive loading feedback.
- **No**: Safely exits the process. The state snapshot is kept in `/output` if you wish to run it later.
- **Preview**: Interactively displays raw email drafts for randomly selected leads before confirming dispatch.

---

## ⚙️ Core Modules & Design Details

### Resilience & Snapshot Recovery
Every stage successfully completed saves the pipeline context to `output/run-[timestamp].json`.
A snapshot file contains the following structure:
```json
{
  "runId": "run-1717629465123",
  "seedDomain": "stripe.com",
  "currentStage": "EAZYREACH_COMPLETED",
  "data": {
    "companies": [
      { "name": "Stripe Lookalike", "domain": "lookalike.com" }
    ],
    "contacts": [
      { "name": "John Doe", "title": "VP Marketing", "domain": "lookalike.com", "linkedin": "..." }
    ],
    "verifiedEmails": [
      { "name": "John Doe", "email": "john@lookalike.com", "status": "deliverable" }
    ]
  }
}
```
If the process dies during verification, you can launch:
```bash
npx ts-node src/index.ts --resume output/run-1717629465123.json
```
VocalReach will skip Ocean.io and Prospeo, load the cached records, complete any missing Eazyreach verifications, and present the safety checkpoint.

### Rate Limiting & Backoff
API providers have strict usage limitations:
- **Ocean.io**: Concurrency threshold limit.
- **Prospeo**: 2 requests per second.
- **Eazyreach**: 5 requests per second.
- **Brevo**: Concurrency rate bounds on SMTP dispatch.

VocalReach isolates each stage inside a specific `Bottleneck` scheduler (`src/utils/limiter.ts`) that queues API requests and executes them at calibrated intervals. Unhandled `429 Too Many Requests` status codes are intercepted by `axios-retry`, triggering exponential backoff.

### Validation Layer
All third-party payload responses are dynamically checked at runtime. If an API provider changes its response model, Zod (`src/validators/*`) instantly catches the discrepancy, alerts the logs, and keeps the engine from operating on corrupted/undefined data.

### Email Personalization Templates
Outreach quality is maximised by rotating and dynamically parsing email formats (`src/templates/`):
- **Template A**: Highlights company lookalike context and direct value propositions.
- **Template B**: Casual enquiry seeking connection with the relevant department lead.
- **Template C**: Bulleted context about lookalike competitors with a direct call-to-action.

Each email template features:
- Dynamic fallback variables if details are missing.
- Unsubscribe links.
- Contextual formatting based on job role.

---

## 🧪 Testing & Quality Control

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
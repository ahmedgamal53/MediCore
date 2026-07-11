# MediCore

**A full-stack medical clinic management system built with Role-Based Access Control, real-time data synchronization, and a Supabase-powered backend.**

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TanStack%20Query-State-FF4154?style=flat-square&logo=reactquery&logoColor=white" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/Vite-Build-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square" alt="License" />
</p>



<p align="center">
  <a href="https://medicore-2iq.pages.dev/"><strong>🔗 Live Demo</strong></a>
</p>

---

## Screenshots

> Placeholders — to be replaced with actual application screenshots.

## Admin Dashboard


<table>
<tr>
<td align="center">
<b>Dashboard</b><br>
<img src="https://github.com/user-attachments/assets/0064fb0f-9c7c-4a76-bd64-115e36b34109" height="170">
</td>

<td align="center">
<b>Patients</b><br>
<img src="https://github.com/user-attachments/assets/f98adf38-915a-4dae-ab50-f2fa1dd6fb92" height="170">
</td>

<td align="center">
<b>Doctors</b><br>
<img src="https://github.com/user-attachments/assets/3b733957-b1a1-460f-ad62-e88854202b58" height="170">
</td>
</tr>

<tr>
<td align="center">
<b>Appointments</b><br>
<img src="https://github.com/user-attachments/assets/92205ee0-df98-41db-8d84-a5b7c45e0063" height="170">
</td>

<td align="center">
<b>Add Patient</b><br>
<img src="https://github.com/user-attachments/assets/7f440ff2-57ab-47c0-9c27-0b7d74d116cd" height="170">
</td>

<td align="center">
<b>Add Doctor</b><br>
<img src="https://github.com/user-attachments/assets/f35aaddf-eba1-452e-9a77-940ee697fd51" height="170">
</td>
</tr>
</table>

### Doctor Dashboard

<table>
<tr>
<td align="center">
<b>Dashboard</b><br>
<img src="https://github.com/user-attachments/assets/390c37f5-5510-4f6a-bb34-50f88fe14fff" width="320" height="auto"/>
</td>

<td align="center">
<b>Patients</b><br>
<img src="https://github.com/user-attachments/assets/88e1d887-427d-4b80-9de1-7a12a2cd7b87" width="320" height="auto"/>
</td>

<td align="center">
<b>Patient Visit</b><br>
<img src="https://github.com/user-attachments/assets/266559f6-cddf-473d-8386-113b885d1ec6" width="320" height="auto"/>
</td>
</tr>

<tr>
<td align="center" colspan="3">
<b>Schedule</b><br>
<img src="https://github.com/user-attachments/assets/1ea2d718-e04d-461e-ab97-b5e9be93c239" width="320" height="auto"/>
</td>

  <td align="center" colspan="3">
<b>Patient Information</b><br>
 <img width="1919" height="944" alt="image" src="https://github.com/user-attachments/assets/f35466d7-d89d-491a-aff0-58052ff45bfb" />
<img width="1919" height="884" alt="image" src="https://github.com/user-attachments/assets/a02116e6-234a-4642-9d5e-9ee5cd181a38" />

</td>

<td align="center" colspan="3">
<b>Patient Visit</b><br>
<img width="1915" height="937" alt="image" src="https://github.com/user-attachments/assets/28489056-3f68-4134-9307-251a207fc7fa" />
</td>

</tr>
</table>



### Patient Dashboard
![Patient Dashboard](images/patient-dashboard.png)

### Login
![Login](images/login.png)

### Appointments
![Appointments](images/appointments.png)

### Calendar
![Calendar](images/calendar.png)

---

## Table of Contents

- [Screenshots](#screenshots)
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Role-Based Access Control](#role-based-access-control)
- [Core Features](#core-features)
- [Appointment System — Business Logic](#appointment-system--business-logic)
- [Database Design](#database-design)
- [Authentication & Security](#authentication--security)
- [State Management Strategy](#state-management-strategy)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Future Improvements](#future-improvements)
- [Why This Project?](#why-this-project)

---

## Overview

MediCore digitizes the day-to-day workflow of a medical clinic — connecting **administrators**, **doctors**, and **patients** through a single, shared backend while giving each role a completely distinct experience and permission set.

The project was built to demonstrate **production-grade full-stack architecture**: relational database design, backend authorization, real-time-capable data flow, and scalable application structure — not just frontend UI construction.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React + TypeScript (strict mode) |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **Routing** | React Router |
| **Server State** | TanStack Query (React Query) |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| **Database** | PostgreSQL with Row Level Security (RLS) |
| **Tooling** | ESLint, Git |

---

## System Architecture

MediCore follows a **single-backend, multi-role architecture**. Rather than building separate applications per role, the system uses one Supabase project and one PostgreSQL schema, with access differentiated entirely through **authorization logic** — both on the client (route guarding, conditional rendering) and on the server (Row Level Security policies, foreign-key constraints).

```
┌─────────────────────────────────────────────────────────┐
│                     React Client (SPA)                   │
│                                                            │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐           │
│   │  Admin   │    │  Doctor  │    │ Patient  │           │
│   │  Routes  │    │  Routes  │    │  Routes  │           │
│   └────┬─────┘    └────┬─────┘    └────┬─────┘           │
│        └───────────────┴───────────────┘                 │
│                        │                                  │
│              Protected Route Layer                        │
│           (role check + session check)                     │
│                        │                                  │
│              TanStack Query (cache/sync)                   │
└────────────────────────┼──────────────────────────────────┘
                          │
                  Supabase Client SDK
                          │
┌─────────────────────────▼──────────────────────────────────┐
│                      Supabase Backend                       │
│                                                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │    Auth    │  │  PostgreSQL │  │  Storage   │            │
│  │ (JWT/RLS)  │  │  + RLS      │  │ (files)    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│                                                               │
│                    Edge Functions                             │
│           (server-side business rules)                        │
└───────────────────────────────────────────────────────────────┘
```

The client never trusts its own role state for authorization — every sensitive read/write is re-validated at the database layer via **Row Level Security policies** tied to the authenticated user's `auth.uid()`. UI-level role checks exist purely for user experience, not for security.

---

## Role-Based Access Control

MediCore implements RBAC through a `profiles` table that stores a `role` column (`admin`, `doctor`, `patient`), linked 1:1 to Supabase's `auth.users`.

<details>
<summary><strong>How role resolution works</strong></summary>

1. On sign-in, Supabase Auth issues a JWT for the user.
2. The client fetches the corresponding `profiles` row to resolve the user's role.
3. Role is stored in a React context and used to:
   - Redirect users to their correct dashboard
   - Guard routes via a `ProtectedRoute` wrapper component
   - Conditionally render role-specific UI
4. Independently, every database query is scoped by **RLS policies** that check the role and ownership of the row being accessed — so even a manipulated client request cannot read or write data outside the user's permission boundary.

</details>

This dual-layer approach (client-side UX gating + server-side RLS enforcement) is what separates a real access-control system from a cosmetic one.

---

## Core Features

### Authentication
- Supabase Auth-based sign-up/sign-in
- Persistent sessions across reloads
- Automatic auth-state synchronization (see [Technical Decisions](#why-this-project) for a deadlock fix encountered here)
- Protected routing with role-aware redirects

### Admin
- Full CRUD on doctor and patient records
- Account creation and role assignment
- Appointment monitoring across the entire clinic
- Dashboard analytics (appointment volume, status breakdown, patient/doctor counts)

### Doctor
- Personalized appointment queue
- Patient visit workflow with a defined status state machine
- Structured visit documentation (diagnosis, medications, notes)
- Daily schedule view

### Patient
- Self-service registration
- Doctor discovery and profile browsing
- Appointment booking with conflict prevention
- Appointment history and cancellation

---

## Appointment System — Business Logic

The appointment system is the core transactional workflow of the application. Rather than a simple CRUD form, it enforces a set of business rules to keep clinic scheduling consistent:

**Booking validation**
- A patient can only book an appointment within a doctor's defined availability window.
- Before insertion, the system checks for existing appointments at the same doctor/time slot to **prevent double-booking**.
- Appointments are written with a `pending` status by default, requiring workflow progression rather than assuming immediate confirmation.

**Status lifecycle**

An appointment moves through a defined state machine rather than arbitrary status strings:

```
pending → confirmed → in_progress → completed
                  └──────────────→ cancelled
```

- **Doctors** transition appointments from `confirmed` → `in_progress` → `completed` as a visit happens, with inline validation and dynamic fields (e.g., medication rows) captured per visit.
- **Admins** can override or cancel appointments at the clinic-management level.
- **Patients** can cancel only their own `pending`/`confirmed` appointments — enforced by RLS, not just UI restriction.

**Schedule integrity**
- Doctor availability and appointment duration are used together to compute bookable slots, so the frontend never presents a slot that would overlap an existing booking.
- Appointment history queries are scoped per-user (patient sees only their own; doctor sees only theirs; admin sees all) via foreign-key relationships back to `profiles`.

---

## Database Design

MediCore uses **PostgreSQL via Supabase**, with a relational schema designed around clear ownership and referential integrity rather than denormalized convenience.

**Core tables**

| Table | Purpose |
|---|---|
| `profiles` | Central identity table, 1:1 with `auth.users`, holds `role` and shared profile data |
| `doctors` | Doctor-specific data (specialty, availability), FK → `profiles.id` |
| `patients` | Patient-specific data (medical info, contact), FK → `profiles.id` |
| `appointments` | Transactional table linking a patient, a doctor, a time slot, and a status; FK → `doctors.id`, FK → `patients.id` |
| `recent_activity` | Audit/event log table capturing key actions (bookings, status changes, record edits) for dashboard feeds and traceability; FK → `profiles.id` |

**Why this structure scales**

- **Single source of identity**: `profiles` is the anchor table for authentication and role resolution, avoiding duplicated identity logic across role-specific tables.
- **Normalized relationships**: Doctor and patient data are foreign-keyed rather than embedded, so updates propagate without duplication and queries stay indexable.
- **Extensible by design**: Adding new domains (e.g., `prescriptions`, `medical_records`, `notifications`) is a matter of adding foreign-keyed tables rather than restructuring existing ones.
- **RLS-first**: Because access control lives at the row level in Postgres rather than solely in application code, adding new client surfaces (e.g., a mobile app) does not require re-implementing authorization.

---

## Authentication & Security

- **Supabase Auth** handles credential storage, session issuance, and JWT signing.
- **Row Level Security (RLS)** policies enforce that a user can only read/write rows they are authorized for, independent of client-side logic.
- **Protected Routes** on the frontend prevent unauthorized navigation, but are treated as UX convenience — actual authorization is always re-checked server-side.
- **Environment variables** isolate Supabase project keys from source control (see [Environment Variables](#environment-variables)).
- **Auth state handling**: the client subscribes to Supabase's `onAuthStateChange` listener to keep session state in sync across tabs/reloads, with fetch logic deferred outside the callback to avoid blocking the auth client (see [Why This Project](#why-this-project)).

---

## State Management Strategy

Server state (anything originating from Supabase) is managed with **TanStack Query** rather than global client state, based on the principle that server data and client UI state are fundamentally different concerns.

- **Caching**: Query results are cached per key (e.g., `['appointments', doctorId]`), avoiding redundant network requests across components.
- **Refetching**: Stale data is refetched in the background on window focus/reconnect, keeping dashboards current without manual refresh logic.
- **Synchronization**: Mutations (booking, status updates, record edits) trigger targeted cache invalidation so all views depending on that data update consistently.
- **Optimistic UX**: Where appropriate, mutations update the local cache immediately and roll back on failure, keeping the interface responsive during network round-trips.

This keeps components declarative — they describe *what data they need*, not *how or when to fetch it*.

---

## Project Structure

```
medicore/
├── src/
│   ├── components/
│   │   ├── ui/               # Shared, reusable UI primitives
│   │   ├── admin/             # Admin-specific components
│   │   ├── doctor/            # Doctor-specific components
│   │   └── patient/           # Patient-specific components
│   ├── pages/
│   │   ├── admin/             # Admin dashboard & management pages
│   │   ├── doctor/             # Doctor workflow pages
│   │   └── patient/            # Patient-facing pages
│   ├── hooks/                 # Custom hooks (data fetching, auth, etc.)
│   ├── lib/
│   │   └── supabase.ts        # Supabase client configuration
│   ├── context/                # Auth/role context providers
│   ├── routes/                 # Route definitions & protected route logic
│   ├── types/                   # Shared TypeScript types/interfaces
│   └── utils/                   # Helper functions
├── supabase/
│   ├── migrations/              # SQL schema migrations
│   └── functions/                # Edge Functions
├── public/
├── .env.example
└── package.json
```

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/medicore.git
cd medicore

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# then fill in your Supabase project credentials

# 4. Run database migrations (if using Supabase CLI locally)
supabase db push

# 5. Start the development server
npm run dev
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Note:** Never commit `.env` to version control. Use `.env.example` as a template for collaborators.

---

## Future Improvements
- [ ] Implement advanced filtering and search across doctors, patients, and appointments.
- [ ] Expand the analytics dashboard with additional insights and performance metrics.
- [ ] Improve role permissions with more granular access control.
- [ ] Optimize database queries and application performance for larger datasets.
- [ ] Configure CI/CD pipelines for automated testing and deployment.

---

## Why This Project?

MediCore was built to demonstrate the ability to design and implement a **scalable, production-oriented full-stack application** — not simply to produce UI screens.

It reflects deliberate decisions around:

- **Data modeling**: a normalized relational schema that supports growth without restructuring.
- **Authorization architecture**: RBAC enforced at both the application layer and the database layer via Row Level Security, rather than relying on the client to self-police.
- **Business logic over CRUD**: the appointment system encodes a real state machine and validation rules instead of treating bookings as flat records.
- **Backend-aware frontend engineering**: using TanStack Query to treat server state as a first-class concern, and structuring Supabase's Auth/Postgres/Storage/Edge Function primitives as a cohesive backend rather than a collection of separate services.
- **Debugging real systems**: identifying and resolving a Supabase Auth callback deadlock (caused by an async listener awaiting nested Supabase calls) by deferring fetch logic outside the auth callback — the kind of concurrency issue that surfaces in real production systems, not tutorials.

The result is a project intended to reflect how a real clinic management SaaS product would be architected — role separation, secure data access, relational integrity, and a clear separation between client convenience and server-enforced rules.

---

<p align="center">Built with React, TypeScript, and Supabase.</p>

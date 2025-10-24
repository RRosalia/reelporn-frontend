# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 (beta) frontend application for ReelPorn - a multi-lingual adult content platform with real-time payment processing via WebSockets and cryptocurrency support. The project uses React 19, TypeScript, Tailwind CSS 4, and Bun as the package manager. It's part of a larger monorepo structure with separate backend (Laravel), crypto-rpc, and video-generator services.

## Development Environment

### Running Commands

**IMPORTANT**: All development commands must be run through Docker containers. Never run commands directly on the host machine.

- **Frontend development**: Use `docker exec reelporn_frontend <command>`
- **Example**: `docker exec reelporn_frontend bun run build`
- **Frontend dev server**: Runs on port 5173 (mapped to container port 3000)

### Common Commands

```bash
# Build for production
docker exec reelporn_frontend bun run build

# Linting
docker exec reelporn_frontend bun run lint
docker exec reelporn_frontend bun run lint:fix

# Type checking
docker exec reelporn_frontend bun run type-check
```

### Environment Setup

Copy `.env.local.example` to `.env.local` and configure:

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:9000)
- `NEXT_PUBLIC_REVERB_*`: Laravel Reverb WebSocket configuration
- `NEXT_PUBLIC_SITE_URL`: Site URL for SEO/hreflang tags
- `NEXT_PUBLIC_GTM_ID`: Google Tag Manager ID

## Architecture

### Directory Structure

```
src/
├── app/[locale]/          # Next.js App Router with internationalization
├── components/            # React components (auth, payment, checkout, etc.)
├── lib/
│   ├── api/              # API client with custom exception handling
│   ├── contexts/         # React contexts (Auth, MiniPlayer, CookieConsent)
│   ├── hooks/            # Custom hooks (Echo WebSockets, payment WS)
│   ├── repositories/     # Data access layer (AuthRepository, PaymentRepository, etc.)
│   ├── services/         # Business logic layer (AuthService, PaymentService, etc.)
│   └── utils/            # Utility functions
├── i18n/
│   ├── locales/          # Translation files (en.json, nl.json, de.json, fr.json)
│   └── routing.ts        # Internationalization routing config
└── types/                # TypeScript type definitions
```

### Key Architectural Patterns

**Service-Repository Pattern**:

- **Repositories** (`lib/repositories/`): Handle API calls via `apiClient`, return raw responses
- **Services** (`lib/services/`): Handle business logic, manage localStorage, call repositories
- **Example**: `AuthService.login()` calls `AuthRepository.login()`, then stores token/user in localStorage

**API Client** (`lib/api/apiClient.ts`):

- Axios instance with interceptors
- Auto-adds Bearer token from localStorage to requests
- Custom exception classes (UnauthorizedException, ValidationException, etc.)
- Auto-redirects to `/login` on 401 errors (unless already on login page)

**Context Architecture**:

- `AuthContext`: Authentication state, user data, login/logout handlers
- `MiniPlayerContext`: Video mini-player state management
- `CookieConsentContext`: GDPR cookie consent tracking
- All wrapped in `ClientProviders` component

**Real-time Communication**:

- Laravel Echo + Pusher for WebSocket connections
- Echo configured in `lib/echo-config.ts` with Laravel Reverb backend
- Custom hooks: `useUserChannel`, `usePaymentWebSocket`
- Automatically reinitializes Echo when auth token changes

### Internationalization (i18n)

- Uses `next-intl` with file-based routing: `app/[locale]/`
- ONLY fill in the en.json the other languages will be auto translated by the system upon deployment
- Locale prefix: "as-needed" (default locale 'en' has no prefix in URL)
- Localized pathnames defined in `i18n/routing.ts` (e.g., `/pornstars` → `/pornosterren` in Dutch)
- Translation files: `i18n/locales/{locale}.json`
- Metadata includes hreflang tags for SEO

### Authentication Flow

1. User logs in via `AuthService.login(email, password)`
2. `AuthRepository.login()` calls backend `/login` endpoint
3. Token stored in localStorage as `auth_token`
4. User data stored as `auth_user`
5. `apiClient` auto-adds token to all subsequent requests
6. `AuthContext` manages auth state across app
7. Echo WebSocket reinitializes with new auth token for private channels

### Type Safety

- Strict TypeScript enabled
- Path alias: `@/*` maps to `src/*`
- No emit (Next.js handles compilation)
- Target: ES2017

## Docker & Services

The monorepo uses docker-compose with these services:

- **frontend**: Next.js app (port 5173)
- **backend**: Laravel API (port 9000)
- **reverb**: Laravel Reverb WebSocket server (port 8080)
- **mysql**: Database (port 3306)
- **redis**: Cache/sessions (port 6379)
- **bitcoin, litecoin, ethereum**: Cryptocurrency nodes for payment processing

## Testing & Quality

- ESLint configured with Next.js rules
- Run type checking before committing: `docker exec reelporn_frontend bun run type-check`
- Lint before committing: `docker exec reelporn_frontend bun run lint:fix`

## Important Notes

- **React 19**: Uses new async server components pattern
- **Bun**: Fast package manager, not Node.js
- **Turbopack**: Enabled for dev server (`--turbopack` flag)
- **Server Components**: Most pages are server components; mark client components with `'use client'`
- **WebSocket Auth**: Private channels require authentication; Echo config updates when user logs in/out
- **Cookie Consent**: Required for GDPR; managed via `CookieConsentContext`
- **Age Verification**: Required on first visit; managed client-side
- **SEO**: Metadata includes hreflang, canonical URLs, and Open Graph tags

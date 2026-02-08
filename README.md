# Universal Stack

A complete Next.js template for building modern SaaS applications with authentication, payments, and AI capabilities.

## Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components, Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui ready
- **Database & Auth:** Supabase (PostgreSQL + Auth)
- **Payments:** LemonSqueezy (Merchant of Record)
- **AI:** OpenRouter (100+ models)

## Features

- Multi-provider OAuth (Google, GitHub, Apple, Email)
- Protected routes with middleware
- Subscription management ready
- AI chat endpoint
- Health check API
- LemonSqueezy webhooks
- Dark mode ready (CSS variables configured)
- Mobile-responsive design

## Quick Start

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd universal-stack

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.local.example .env.local

# 4. Add your API keys to .env.local

# 5. Start development server
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `LEMONSQUEEZY_API_KEY` | LemonSqueezy API key |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Webhook signing secret |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `OPENROUTER_MODEL` | Default AI model to use |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL |

## Project Structure

```
universal-stack/
├── app/
│   ├── (auth)/           # Auth pages (login, signup)
│   ├── (marketing)/      # Public pages (home, pricing)
│   ├── dashboard/        # Protected dashboard
│   └── api/              # API routes
├── components/
│   ├── auth/             # Auth components
│   ├── dashboard/        # Dashboard components
│   ├── providers/        # Context providers
│   └── ui/               # UI components (shadcn)
├── lib/
│   ├── supabase/         # Supabase clients
│   ├── validations/      # Zod schemas
│   └── utils.ts          # Utility functions
└── types/                # TypeScript types
```

## OAuth Setup

### Google
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add redirect URL: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
4. Add Client ID and Secret to Supabase Dashboard

### GitHub
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Add redirect URL: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
4. Add Client ID and Secret to Supabase Dashboard

### Apple
1. Go to [Apple Developer Portal](https://developer.apple.com)
2. Create an App ID and Services ID
3. Generate a private key
4. Add credentials to Supabase Dashboard

## Adding shadcn/ui Components

```bash
# Initialize (already configured)
npx shadcn@latest init

# Add components as needed
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Remember to add all environment variables in Vercel dashboard.

## License

MIT

### Plan:

1. Update README with:
   - Project overview
   - Setup instructions
   - Testing details
   - SST deployment steps
   - Environment configuration

# Project Management App

A full-stack project management application built with the T3 Stack and deployed on AWS using SST.

## Tech Stack

- [Next.js](https://nextjs.org) - React Framework
- [NextAuth.js](https://next-auth.js.org) - Authentication
- [Prisma](https://prisma.io) - Database ORM
- [tRPC](https://trpc.io) - Type-safe API
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Playwright](https://playwright.dev) - E2E Testing
- [SST](https://sst.dev) - AWS Deployment

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/project-management-app.git
```

2. Install dependencies:

```bash
npm install
```

3. Setup environment variables:

```env
DATABASE_URL=
AUTH_SECRET=
```

4. Setup database:

```bash
npm run db:push
```

5. Run development server:

```bash
npm run dev
```

## Testing

### E2E Tests with Playwright

```bash
# Install browsers
npx playwright install

# Run tests
npm run test

# Run tests with UI
npm run test:ui
```

## Deployment

### Deploy to AWS using SST

1. Configure AWS credentials:

```bash
aws configure
```

2. Deploy:

```bash
npx sst deploy --stage prod
```

3. Remove deployment:

```bash
npx sst remove --stage prod
```

### Environment Variables for Production

Required environment variables in GitHub Secrets for CI/CD:

-

AUTH_SECRET

-

DATABASE_URL

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## Project Structure

```
project-management-app/
├── src/
│   ├── app/          # Next.js App Router
│   ├── components/   # React Components
│   ├── server/       # tRPC Routes & DB
│   └── types/        # TypeScript Types
├── prisma/           # Database Schema
├── tests/           # Playwright Tests
└── sst.config.ts    # SST Configuration
```

## Contributing

1. Create a feature branch
2. Make changes
3. Run tests
4. Submit PR

## License

MIT

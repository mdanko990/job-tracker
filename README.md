This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

   Use a short, descriptive name (e.g. `add_contact_connection_status`, `add_status_event`). This creates a SQL file in `prisma/migrations/`, applies it to the database, and regenerates the Prisma Client.
3. Restart the dev server after any schema change. Prisma Client types don't always hot-reload cleanly.

### Common commands

| Command | What it does |
|---|---|
| `npx prisma migrate dev --name x` | Create + apply a new migration, regenerate client. Use this for every schema change. |
| `npx prisma generate` | Regenerate Prisma Client only, no DB change. Run this if types feel stale but the schema hasn't changed (e.g. after `git pull`). |
| `npx prisma migrate status` | Check whether local migrations match what's applied to the database. Run this first if something feels off. |
| `npx prisma studio` | Opens a GUI in the browser to view/edit data directly. Useful for checking what's actually in a table. |
| `npx prisma db pull` | Reads the actual database and overwrites `schema.prisma` to match it. Use only when the DB is the source of truth and your schema file has drifted (rare, see below). |

### If you get a "table does not exist" or "drift detected" error

This means `prisma/migrations/` and the actual database are out of sync. Usually caused by mixing `db push` with `migrate dev`, or running migrations against the wrong database.

1. Run `npx prisma migrate status` first, always, before doing anything destructive. It tells you exactly what's out of sync.
2. If there's genuinely no data worth keeping (early dev, test data only):

# Warrior Wives Unite - Development Guide

## Commands
- Build: `npm run build`
- Development server: `npm run dev`
- Production server: `npm run start`
- Lint: `npm run lint`
- Format with Prettier: `npx prettier --write .` or `npx prettier --write <file>`
- Type check: `npx tsc --noEmit`
- Run single test: Currently no test setup

## Code Style
- TypeScript with strict type checking
- React with Next.js 14 App Router architecture
- Double quotes for strings, semicolons required
- Max line length: 80 characters
- Tab width: 2 spaces
- Path aliases: `@/*` maps to `./src/*`
- Component files use PascalCase
- Utility files use camelCase
- UI components from shadcn/ui and Chakra UI
- Use zod/yup for form validation
- State management with React hooks and zustand
- Error handling with try/catch blocks
- Database queries via Prisma client
- File naming follows Next.js conventions
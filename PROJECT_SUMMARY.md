# Current Architecture

## Routes
- `/admin` — `app/admin/page.tsx`
- `/admin/[adminKey]` — `app/admin/[adminKey]/page.tsx`
  - `app/admin/[adminKey]/actions.ts`
  - `app/admin/[adminKey]/CopyLinkButton.tsx`
- `/admin/[adminKey]/edit` — `app/admin/[adminKey]/edit/page.tsx`
- `/admin/[adminKey]/items` — `app/admin/[adminKey]/items/page.tsx`
- `/create` — `app/create/page.tsx`
  - `app/create/actions.ts`
- `/e/[publicSlug]` — `app/e/[publicSlug]/page.tsx`
  - `app/e/[publicSlug]/actions.ts`
- `/page.tsx` — `app/page.tsx`
  - `app//layout.tsx`

## Prisma Schema
- `prisma/schema.prisma`

### Models
- `Event`
  - id          String   @id @default(cuid())
  - title       String
  - description String?
  - date        DateTime?
  - location    String?
  - publicSlug  String   @unique
  - adminKey    String   @unique
  - slots       SignupSlot[]
  - createdAt   DateTime @default(now())
  - updatedAt   DateTime @updatedAt

- `SignupSlot`
  - id        String   @id @default(cuid())
  - name      String
  - details   String?
  - sortOrder Int      @default(0)
  - eventId   String
  - event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  - claim     SignupClaim?
  - createdAt DateTime @default(now())

- `SignupClaim`
  - id          String   @id @default(cuid())
  - personName  String
  - description String?
  - slotId      String   @unique
  - slot        SignupSlot @relation(fields: [slotId], references: [id], onDelete: Cascade)
  - createdAt   DateTime @default(now())

## Features Completed
- Create signup sheet
- Public signup page
- Admin page
- Add items
- Remove items
- Claim items
- Remove claims
- Edit event
- Copy public link
- Vercel deployment
- Neon database
- Group duplicate items on public page
- Group duplicate items on admin page
- Delete event with cascading slot and claim removal

## Features Planned
### High Priority
- Custom domain
- Event deletion
- Edit individual items
- Better mobile styling
- #

### Medium Priority
- Event archive
- Export signup list
- Email notifications
- Church branding options
- #

### Future
- User accounts
- Recurring events
- Templates
- Multiple organizations
- #

### Public Page Cleanup
- Show "3 needed" instead of multiple cards
- Better spacing between groups
- Better mobile layout
- Cleaner claim descriptions
- Show remaining vs fulfilled counts

## Current Data Flow
1. A creator fills `/create`
2. `createSignupSheet` stores `Event` and `SignupSlot` records
3. Public users visit `/e/[publicSlug]`
4. They select open slots and submit `claimSlots`
5. Admins manage events via `/admin/[adminKey]`

## Recent Changes


- Added server-side validation for parsed item JSON in `app/create/actions.ts`
- Replaced insecure `Math.random()` key generation with `crypto.randomUUID()` for admin and public IDs
- Hardened `claimSlots` in `app/e/[publicSlug]/actions.ts` to verify the selected slots belong to the event and remain unclaimed
- Added `skipDuplicates` to claim creation to reduce duplicate inserts
- Added admin ownership checks in `app/admin/[adminKey]/actions.ts` for deleting claim and slot records
- Updated `addSlots` to verify the admin event and preserve slot ordering
- Fixed dynamic route page APIs by awaiting `params` in `app/admin/[adminKey]/page.tsx`, `app/admin/[adminKey]/edit/page.tsx`, `app/admin/[adminKey]/items/page.tsx`, and `app/e/[publicSlug]/page.tsx`
- Added a database connection error fallback rendering in `app/admin/page.tsx`
- Improved UI validation in `app/create/page.tsx` by disabling the add-item button when input is invalid
- Added clipboard feature safety handling in `app/admin/[adminKey]/CopyLinkButton.tsx`
- Added a secure event deletion flow in `app/admin/[adminKey]/actions.ts` and `app/admin/[adminKey]/DeleteEventButton.tsx` with a confirm prompt, admin-key verification, and redirect to `/admin`





## Notes


- `DATABASE_URL` is required for Prisma and must point to a reachable Postgres-compatible database.
- The admin key currently functions as the authorization token for admin operations.
- Additional future improvements could include:
  - a dedicated authentication layer for admin users
  - better user-facing validation errors on forms
  - more robust duplicate-claim handling with transactions
  - server-side pagination or filtering for dashboard results





## Source of Truth
- Planned feature work is maintained in `features.md`
- Current implementation and architecture are documented in `PROJECT_SUMMARY.md`
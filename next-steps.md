# ClownBinge — Next Steps

## My Account Page + Save for Later Feature

### What it is
A logged-in user experience with a personal account page and the ability to bookmark articles for later reading.

---

### Save for Later (Bookmark Icon)
- Add a save/bookmark icon near the top of every article page
- If the user is not logged in, clicking it prompts them to log in
- If logged in, it saves the article to their account and toggles to a "saved" state
- Saved state persists across sessions

---

### My Account Page (`/account`)
A tabbed page with three sections:

**Tab 1 — Recent Activity**
- List of articles the user has recently viewed or interacted with
- Shows article title, category, date of activity, and type (viewed, saved, etc.)

**Tab 2 — Saved Articles**
- All articles the user has bookmarked with the Save for Later button
- Ability to remove a saved article
- Shows article title, category, case number, and date saved

**Tab 3 — Inbox**
- Messages sent to or received from ClownBinge
- Includes system messages (e.g., confirmation of tip submissions) and any direct responses
- Unread indicator on new messages
- Click a message to expand and read it

---

### Technical Scope
1. **Authentication** — Replit Auth (OIDC/PKCE), sessions stored in PostgreSQL, no custom login form
2. **New DB tables**
   - `users` — from auth schema (id, email, name, profile image)
   - `sessions` — from auth schema (session store for cookies)
   - `saved_articles` — userId, postSlug, postTitle, savedAt
   - `user_activity` — userId, action, postSlug, postTitle, createdAt
   - `messages` — id, userId, direction (inbound/outbound), subject, body, readAt, createdAt
3. **New API routes**
   - `GET /api/account/saved` — list saved articles for current user
   - `POST /api/account/saved/:slug` — save an article
   - `DELETE /api/account/saved/:slug` — unsave an article
   - `GET /api/account/activity` — recent activity
   - `GET /api/account/messages` — inbox messages
   - `PUT /api/account/messages/:id/read` — mark message as read
4. **Frontend**
   - `SaveButton` component (bookmark icon) in `PostDetail.tsx`
   - `/account` page with tab navigation
   - Auth state awareness (login prompt for unauthenticated users)

### Files already partially set up (from previous session)
- `lib/db/src/schema/auth.ts` — users and sessions tables copied
- `lib/replit-auth-web/` — browser auth hook library copied
- `artifacts/api-server/src/lib/auth.ts` — auth utilities copied
- `artifacts/api-server/src/middlewares/authMiddleware.ts` — copied
- `artifacts/api-server/src/routes/auth.ts` — copied
- Still needed: install `openid-client`, wire `authMiddleware` into `app.ts`, push DB schema, build all frontend

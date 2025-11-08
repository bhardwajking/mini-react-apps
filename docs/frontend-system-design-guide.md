# Frontend System Design Mini‑Book

**Goal:** Help you narrate a complete frontend system design during interviews.  
**Tone:** Friendly but thorough; keeps deeper details the panel expects.  
**Structure:** Organized like a short field guide so you can jump to any page.

---

## Table of Contents
1. Part 1 – Interview Landscape  
2. Part 2 – Client–Server Primer  
3. Part 3 – End-to-End Workflow  
4. Part 4 – Technology Choices & Architecture  
5. Part 5 – Common Functional Modules  
6. Part 6 – Non-Functional Considerations  
7. Part 7 – Tools & Practice  
8. Part 8 – Mantras for the Room  
9. Part 9 – Preparation Checklist  
10. Part 10 – Performance Optimization Deep Dive  
11. Part 11 – Asset Optimization Guide  
12. Part 12 – JavaScript Memory Optimization  
13. Part 13 – Quick References & Commands  
14. Final Thought

---

## Part 1 – Interview Landscape

### Round Types
| Round | What they focus on | Sample React story |
|-------|--------------------|--------------------|
| **System Design** | How the product behaves, integrates, scales | “Design a multi-team dashboard that stitches inventory, payment, and fulfillment microservices with clear contracts and SLAs.” |
| **Product Sense** | User empathy, trade-offs, UX + tech | “Ship an MVP wishlist with optimistic updates before adding personalized recommendations.” |
| **UI Architecture** | Large-scale structure, shared libs, collaboration | “Split a ride-share admin portal into micro-frontends so pricing, support, and fleet teams ship independently.” |
| **Machine Coding / Component Design** | Implementation depth, tests, polish | “Build a WhatsApp-like autocomplete with debouncing, keyboard support, and unit tests.” |

**Tip:** Always clarify which round you are in so you aim at the right altitude.

---

## Part 2 – Client–Server Primer

### Roles at a Glance
| Layer | Analogy | Responsibility |
|-------|---------|----------------|
| User | Hungry customer | Drives requirements. |
| Client | Table + menu | Presents UI, collects input. |
| API | Waiter | Moves requests/responses. |
| Server | Kitchen manager | Enforces rules, coordinates services. |
| Database | Pantry | Stores durable data. |

```
User → Client → API → Server → Database
           ↑            ↓
        responses    more APIs
```

### Tiers in Practice
| Tier | Restaurant Analogy | Web Stack Example |
|------|--------------------|-------------------|
| 1-tier | Single stall (cook, serve, bill at one spot) | Static HTML + local SQLite |
| 2-tier | Dining area + kitchen linked by waiter | React SPA + Express/Monolith |
| 3-tier | Dining, billing counter, kitchen | React SPA → API Gateway → Node service → Postgres |
| N-tier | Dining, billing, kitchen, cold storage, delivery partner | SPA → API Gateway → auth/payment/order/search microservices → DB + cache + queue |

### Example Request Flow
```tsx
// src/api/orders.ts
export async function fetchOrders() {
  const response = await fetch('/api/orders', {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to load orders');
  return response.json();
}
```
```ts
// server/orders.router.ts
router.get('/api/orders', async (req, res, next) => {
  try {
    const orders = await getOrdersForUser(req.user!.id);
    res.json(orders); // Postgres/Redis behind the scenes
  } catch (error) {
    next(error);
  }
});
```
Always narrate: client calls API, API authenticates, server orchestrates business logic, database returns results, response flows back.

---

## Part 3 – End-to-End Workflow (Seven Steps)

1. **Frame the problem** – restate goal, audience, platforms.
2. **Gather requirements** – functional + non-functional (performance, accessibility, security, offline, localization).
3. **Scope carefully** – choose MVP slice; ask what to park.
4. **Select tools with intent** – library, state store, build tool, design system, feature flags; mention trade-offs.
5. **Map component hierarchy** – parent/child tree, routing, shared state, theming, reusable atoms.
6. **Design data + APIs** – endpoints, payloads, error contracts, pagination, caching, rate limits.
7. **Wrap succinctly** – recap decisions, risks, follow-ups; invite questions.

**HLD vs LLD:** Ask the interviewer which level they want before diving deep.

---

## Part 4 – Technology Choices & Architecture

### Component Architecture
- **Hierarchy:** From `AppShell` down to atomic components (`ProductGrid` → `ProductCard` → `PriceTag`).
- **Routing:** Handle modals, deep links, shareable URLs (`/invoices/:id#pay`).
- **State Sharing:** Prop drilling vs Context vs Redux/Zustand vs server cache (TanStack Query).
- **Composability:** Provide slots, theme overrides, feature flags for gradual rollout.

### Data, APIs, Protocols
- **Protocols:** REST, GraphQL, SSE, WebSockets, gRPC. Pick based on data shape and latency.
- **Payloads:** JSON, Protocol Buffers, NDJSON for streaming.
- **Interaction patterns:** Infinite scroll (IntersectionObserver), debounced search, `AbortController` for cancellation, sequence guards.
- **Caching layers:** HTTP cache, service worker, CDN edge, Redis/memcached, browser storage (IndexedDB/localStorage).

### Data Modeling & Contracts
- **Endpoints:** `GET /api/products`, `POST /api/cart/items`, `PATCH /api/users/:id`.
- **Requests:** Query params vs body, filter tokens, cursor pagination.
- **Responses:** Standard envelope `{ data, error }`, localization-ready error codes, precise HTTP status codes.
- **Versioning:** `/api/v2/...` or content negotiation, deprecation notices.

### Component-Level Design
- **API Contracts:** Props/defaults/events to enable safe reuse.
- **Separation of Concerns:** Smart vs dumb components (`UserListContainer` → `UserList`).
- **Inclusive UX:** ARIA roles, keyboard traps, `react-intl` for copy, responsive layouts.
- **Testing:** Unit (Jest), component (React Testing Library), integration (Cypress/Playwright), visual (Storybook).

---

## Part 5 – Common Functional Modules

| Module | Key Talking Points |
|--------|--------------------|
| **User management & auth** | Signup/login, OTP, JWT refresh, 2FA, RBAC. |
| **Support** | FAQ, live chat, ticket escalation, service-level targets. |
| **Payments** | Stripe Elements, tax engine, invoices, retries, refunds. |
| **Catalog** | Filters, search relevance, review aggregation, image lazy-load. |
| **Cart & checkout** | Optimistic updates, totals, coupons, address validation. |
| **Account & history** | Settings, preferences, exports, GDPR/CPRA compliance. |

Pick two modules to deep dive based on interviewer interest.

---

## Part 6 – Non-Functional Considerations

- **Devices:** Responsive vs adaptive layouts, accessibility for touch/keyboard.
- **Performance budgets:** LCP < 2.5s, bundle size caps, partial hydration.
- **Network resilience:** Edge caching, fallback UI for 3G, `navigator.connection` hints.
- **Security:** XSS (escape + CSP), CSRF (same-site cookies/tokens), RBAC, secret storage, audit logging.
- **Offline:** Service worker caching, queued mutations, optimistic UI.
- **Observability:** Structured logs, metrics (Datadog/New Relic), product analytics (Amplitude/Mixpanel), error monitoring (Sentry).
- **Release workflow:** CI/CD pipelines, lint/tests, feature flags, staged rollout, rollback strategy.
- **Internationalization:** `react-intl`, RTL support, dynamic locale bundles.

---

## Part 7 – Tools & Practice

- **Diagramming:** draw.io, Lucidchart, Miro, Jamboard.  
- **Whiteboarding:** real whiteboard, tablet, or collaborative doc.  
- **Coding practice:** CodeSandbox, StackBlitz, local dev + Storybook.  
- **Mock interviews:** pair with peers, record for self-review.  
- **Resource vault:** component diagrams, API templates, checklists.

---

## Part 8 – Mantras for the Room

1. Restate and align before drawing.  
2. Narrate trade-offs plainly.  
3. Ask “anything else?” after each major decision.  
4. Highlight risks and mitigation.  
5. Summarise and invite questions at the end.

---

## Part 9 – Preparation Checklist

### Before the Interview
- Review functional & non-functional requirement prompts.
- Pick a default stack (React + TanStack Query + Redux Toolkit + Vite, etc.).
- Prepare deep dives for two modules.
- Practice sketching the component tree and data flow.
- Memorize top performance and security habits.

### During the Interview
- Confirm scope (HLD vs LLD).  
- Walk through the seven steps.  
- Use analogies and simple language.  
- Mention trade-offs, risks, and monitoring.  
- Summarise decisions with next steps.

### After the Interview
- Note follow-up questions you missed.  
- Update diagrams/checklists.  
- Celebrate the learning!

---

## Part 10 – Performance Optimization Deep Dive

### Async vs Defer Scripts
- `async`: download during parsing, execute immediately (good for analytics).  
- `defer`: download during parsing, execute after DOM ready (great for bundles).
```html
<script src="/static/js/main.js" defer></script>
<script src="https://cdn.launchdarkly.com/js/client.min.js" async></script>
```

### Route-Level Code Splitting
```tsx
const Dashboard = lazy(() => import('../pages/Dashboard'));
```
Use `Suspense` with fallback skeletons.

### Lazy Loading Attributes
- `loading="lazy"` for below-the-fold images/iframes.  
- `fetchpriority="high|low"` to hint browser priority.  
- `priority="low"` (Chrome) for eager but deprioritized assets.

### Intersection Observer
```tsx
const sentinelRef = useInfiniteScroll(loadMore, { rootMargin: '400px', threshold: 0.25 });
```
Batches fetches only when needed.

### Content Visibility
```css
.timeline-section {
  content-visibility: auto;
  contain-intrinsic-size: 800px;
}
```
Guard with `@supports` to avoid older browser issues.

### Critical CSS & Async Swaps
Inline above-the-fold styles; lazy-load the rest with `onload` swap.

### Resource Hints
- `preload`, `prefetch`, `preconnect`, `dns-prefetch`, `modulepreload`, `prerender`.  
- Always set `as`, `type`, and `crossorigin` correctly.

### CDN & Cache Control Strategy
- Immutable hashed assets: `Cache-Control: public, max-age=31536000, immutable`.  
- HTML: `Cache-Control: public, max-age=0, must-revalidate, stale-while-revalidate=60`.  
- Use `Surrogate-Control` for CDN-specific lifetimes.

### Service Worker Caching
- Lifecycle: `install` (precache), `activate` (cleanup), `fetch` (strategy).  
- Choose between CacheFirst, NetworkFirst, StaleWhileRevalidate depending on resource.  
- Workbox for declarative setup.

### Rendering Strategies
- **CSR:** fast iteration, heavy initial JS, requires skeletons.  
- **SSR:** better SEO/TTFB, heavier infra.  
- **SSG:** static builds for docs/blogs.  
- **ISR:** hybrid revalidation (Next.js).  
- Use React 18 streaming + partial hydration for large pages.

### HTTP Compression
- Enable Brotli (`br`), fallback to Gzip.  
- Set `Vary: Accept-Encoding`.  
- Track asset size with `brotli-size`/`gzip-size`.

### Layout Shift Prevention
- Reserve space (`aspect-ratio`, fixed height).  
- Batch DOM reads/writes.  
- Use transforms/opacity for animations.  
- Preload fonts (`font-display: swap`).

### Web Vitals Telemetry
```tsx
reportWebVitals(({ name, value }) => {
  navigator.sendBeacon(
    '/metrics',
    JSON.stringify({ name, value, viewport: `${innerWidth}x${innerHeight}` })
  );
});
```
Capture metadata (connection type, UA) for cohort analysis.

### Frame Budget & `requestAnimationFrame`
Aim for ~10 ms main-thread work. Break long tasks with `requestIdleCallback` or chunk processing.

### Verify Improvements
- Lighthouse (lab).  
- WebPageTest (filmstrip, CPU).  
- CrUX (real user).  
- Lighthouse budgets in CI.

---

## Part 11 – Asset Optimization Guide

### Images
- Compression (Sharp/Squoosh/TinyPNG).  
- Multi-format `<picture>` with WebP/AVIF fallback to JPEG.  
- Responsive `srcset` + `sizes`.  
- Adaptive loading using `navigator.connection`.  
- Blur/dominant-color placeholders.  
- Icon sprites to reduce requests.

### Video
- Prefer WebM/AV1, fallback to MP4.  
- Replace GIF loops with muted autoplay videos.  
- `preload="metadata"` by default; use `auto` only for hero sections.  
- Remove audio when not needed.  
- Stream with HLS/DASH for long-form content.

### Fonts
- Multiple formats (WOFF2 → WOFF → TTF).  
- `font-display: swap` or `optional`.  
- Subset fonts with `pyftsubset`, `glyphhanger`.  
- Load with FontFaceObserver, toggle CSS classes when ready.  
- Use data URIs only for tiny assets.

### CSS
- Inline critical CSS, lazy-load remainder.  
- Media-specific bundles (`print.css`, `dark.css`).  
- Remove unused selectors (PurgeCSS, Tailwind `content`).  
- SSR extraction for CSS-in-JS libraries.

### JavaScript
- `defer` app bundles, `async` analytics.  
- Dynamic imports via `React.lazy`.  
- Tree-shake dependencies (ESM).  
- Workers for heavy compute.  
- Monitor hydration time and module budgets.

---

## Part 12 – JavaScript Memory Optimization

### Top 10 Leak Patterns
1. **Accidental globals** – use `'use strict'`, block-scoped declarations.
2. **Stale timers** – always `clearInterval`/`clearTimeout`.
3. **Listener buildup** – remove before re-adding or use `{ once: true }`.
4. **Detached DOM references** – nullify references after removing nodes.
5. **Heavy closures** – limit captured variables, release caches.
6. **Reference cycles** – break parent/child links on teardown.
7. **Detached windows** – `popup?.close(); popup = null`.
8. **Unsettled promises** – settle or race with timeouts.
9. **Observers & subscriptions** – call `disconnect()` or `unsubscribe()` on cleanup.
10. **Virtualised lists storing everything** – evict old items from state.

### Debugging Workflow
- Heap snapshots in DevTools.  
- Monitor JS heap in Performance panel.  
- Log `performance.memory.usedJSHeapSize` (Chrome).  
- Use `memlab`, `lighthouse --budgets`, or tests with `node --expose-gc`.

---

## Part 13 – Quick References & Commands

| Task | Command |
| ---- | ------- |
| Brotli size | `npx brotli-size build/static/js/main.js` |
| Lighthouse report | `npx lighthouse http://localhost:3000 --view` |
| Web Vitals logging | `npm install web-vitals` |
| Subset font | `pyftsubset font.ttf --text="abc..."` |

---

### Final Thought
Explain every design like you are helping a teammate, not passing an exam.  
Speak calmly, listen often, and keep the story simple.  
You’ve got this! 🎉

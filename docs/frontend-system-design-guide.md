# Frontend System Design Interview Guide

This guide distills the key ideas from the Chakde System Design series episode on cracking frontend system design interviews. Use it as a playbook to structure discussions, highlight trade-offs, and demonstrate senior-level thinking during interview rounds.

## Interview Landscape
- **System Design (end-to-end architectural strategy):** Interviewers expect you to articulate how a product should behave, scale, and integrate with the broader ecosystem. *React example: designing an order-management dashboard that stitches together inventory, payments, and fulfillment microservices while planning routing, caching, and deployment pipeline decisions.*
- **Product Sense (product + UX empathy):** You pair engineering judgment with user-centric trade-offs to prioritize features that solve the right problems. *React example: choosing to ship an MVP of Flipkart-style wishlists with optimistic UI updates and simplified filters before attempting advanced personalization.*
- **UI Architecture (structural blueprint for frontends):** Drill into modular boundaries, shared libraries, and collaboration models across multiple teams. *React example: splitting a ride-hailing app’s web console into micro-frontends so the pricing team, support team, and fleet team can ship independently while consuming a shared design system.*
- **Machine Coding / Component Design (implementation-focused LLD):** Rapidly deliver a working feature while demonstrating coding discipline, testing strategy, and UI polish. *React example: building a production-ready autocomplete with debounced API calls, keyboard navigation, and unit tests that mimic a WhatsApp contact search.*

Clarify the round type and expectations up front so you invest the limited time in the right layer of detail.

## Client-Server Architecture Primer
Understanding how the client, server, and data layers relate keeps your front-end proposals grounded in reality. Think of the “samosa stall” analogy from the transcript: as the business scales, responsibilities separate into distinct stations. Modern web stacks follow the same progression.

- **User:** The human with intent (hungry customer).
- **Client:** The interface the user touches—browser tab, mobile app, kiosk (the dining table + menu).
- **API:** The contract that ferries requests/responses between layers (the waiter).
- **Server / Service:** Executes business logic, enforces rules, orchestrates workflows (cash counter, order management).
- **Database / Persistence:** Stores durable state (samosa kitchen + cold storage).

```
User (browser/mobile)
      │  HTTP request (order)
      ▼
Client App ── waiter/API ──► Account Service (auth/billing)
                                │
                                ▼
                            Kitchen Service (business logic)
                                │
                                ▼
                           Database / Cache (inventory)
```

### Tiers in Practice
- **Single-tier (1-tier):** UI, business logic, and data live together (static HTML/PHP file with embedded SQL). Easy to start, hard to scale.
- **Two-tier:** Client talks directly to a database or monolithic service (classic LAMP app, React SPA hitting a single REST server).
- **Three-tier:** Client → API gateway/business service → database. Separation of concerns, caching layers, auth boundaries.
- **N-tier / microservices:** Additional specialized services (payments, search, notification), each exposing APIs. They communicate server-to-server before the client ever sees a response.

| Tier | Restaurant Analogy | Typical Web Stack Example |
|------|--------------------|---------------------------|
| 1-tier | Single stall where cooking, serving, and billing happen at one counter | Static HTML + local SQLite |
| 2-tier | Dining area (client) and kitchen (server) connected by a waiter | React SPA + Express monolith |
| 3-tier | Dining area, billing counter, and kitchen | React SPA → API Gateway → Node service → Postgres |
| N-tier | Dining area, billing, kitchen, cold storage, beverage station, delivery partner | SPA → API Gateway → auth/payment/order/search microservices → DB + cache + queue |

### Request/Response & APIs
- **Request:** Client asks for something (`GET /api/samosas?count=2`).
- **Response:** Server delivers data or an error (JSON payload, HTTP status).
- **API (waiter):** Mediates communication; enforces contracts, validates orders, forwards to the right service.
- **Server-to-server APIs:** Services also call each other. Example: billing service invokes inventory service before confirming the payment.

```ts
// billing.service.ts
export async function chargeAndReserve(userId: string, items: CartItem[]) {
  await inventoryClient.reserve(items);        // server → server call
  const receipt = await paymentClient.charge(userId, items);
  await ordersClient.createOrder(userId, items, receipt);
  return receipt;
}
```

### Front-End vs Back-End Boundaries
- **Front-end:** Everything that ships with the client (React components, CSS, Service Worker, local storage). Its job is to gather inputs, call APIs, render state, and handle interactions.
- **Back-end:** Services, queues, databases, caches, and batch jobs that process, enrich, and persist data.
- In a React SPA, `fetch('/api/orders')` crosses the boundary—everything beyond `/api` is part of the back-end.

### Example: API Call Flow
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
// server/orders.router.ts (Express example)
import { Router } from 'express';
import { getOrdersForUser } from '../services/orders.service';

const router = Router();

router.get('/api/orders', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const orders = await getOrdersForUser(userId); // queries database/cache
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

export default router;
```

In interviews, call out these layers explicitly: *“The client issues a GET `/api/orders`; the API gateway authenticates, calls the orders service, which pulls inventory from Postgres/Redis, then returns JSON. The front-end renders once the promise resolves.”* Clear separation convinces interviewers you can design systems that grow beyond a single “stall.”

## End-to-End Workflow
Treat the session as a collaborative design exercise. Work through these stages deliberately and narrate your thinking.

### 1. Requirement Discovery
- **Align on scope (demand vs supply, B2B vs B2C, device targets):** Demand-side experiences serve end customers, while supply-side experiences help partners or internal operators. B2C (business-to-consumer) flows emphasize conversion and usability; B2B (business-to-business) flows emphasize permissions, data density, and integrations. *React example: for a food-delivery marketplace, deciding whether to design the consumer ordering site (demand) or the restaurant menu manager (supply), and whether the MVP targets desktop dashboards or responsive mobile ordering pages.*
- **Functional requirements (what the product must do):** List the modules, user actions, and workflows that define success. *React example: a software-as-a-service (SaaS) analytics app must let users upload CSV data, visualize key performance indicators (KPIs), and invite teammates; each capability maps to components like `UploadDataset`, `KpiChart`, and `TeamAccessPanel`.*
- **Non-functional requirements (how the product should feel and perform):** Discuss expectations around performance, accessibility, security, offline readiness, and localization. *React example: committing to sub-2s Largest Contentful Paint for a storefront, Web Content Accessibility Guidelines (WCAG)-compliant keyboard navigation for modals, secure session storage for auth tokens, and offline cart persistence via IndexedDB.*
- **Expectation checks (continuous alignment):** Pause regularly to confirm the interviewer’s priorities before diving deeper. *React example: after sketching a checkout flow, ask whether to prioritize payment retries or loyalty-point redemption so the conversation stays relevant.*

### 2. Prioritization and Scoping
- **MVP (Minimum Viable Product) first:** Identify the smallest, usable slice that proves value before planning secondary features. *React example: for an ed-tech classroom, ship a live lecture viewer and basic chat before investing in breakout rooms, analytics dashboards, or theming.*
- **Module focus (depth beats breadth):** Freeze two or three modules to explore deeply instead of skimming everything. *React example: align on covering product listing and cart management, then design components like `ProductCard`, `FilterSidebar`, and `CartSummary` with full data flows.*
- **Avoid the “Pushpa” trap (information dump):** The reference from the film “Pushpa” signals a one-way monologue. Stay conversational and target what the interviewer requests. *React example: rather than reciting every performance technique you know, ask if they care more about Core Web Vitals or about accessibility (a11y) for the cart page.*

### 3. Technology Choices
- **Libraries & frameworks (view-layer engines):** React delivers declarative components and hooks that scale from landing pages to enterprise consoles; Vue pairs HTML templates with reactivity for teams that prefer separation of concerns; Svelte compiles components away for ultra-light bundles. *React example: choosing React for a multi-region travel portal so teams can reuse hooks and Storybook stories built across previous products.*
- **State management (shared data coordination):** React Context keeps cross-cutting settings like themes lightweight; Redux centralizes deterministic state transitions for audit trails; Zustand offers minimal boilerplate stores for local features; TanStack Query (formerly React Query) manages async cache lifecycles; IndexedDB stores large offline datasets in the browser. *React example: combining TanStack Query for server data, Redux for cross-tab auth state, and IndexedDB for offline product catalogs in a retail kiosk.*
- **Project structure (code organization strategies):** The Ducks pattern co-locates Redux logic per feature; feature-driven folders group components, hooks, and tests together; micro-frontends let independent teams deploy separate bundles; monorepos keep shared packages versioned together; clear service boundaries ensure teams know API owners. *React example: a fintech super-app runs in a monorepo where lending, insurance, and rewards live in separate package workspaces but ship through a single shell.*
- **Dependencies (specialized capability accelerators):** SVG and Canvas libraries (e.g., Recharts, react-three-fiber) power analytics and visualization; drag-and-drop kits like `react-beautiful-dnd` enable kanban boards; WebRTC enables real-time audio/video; design systems such as Material UI or Ant Design provide production-grade components with accessibility baked in. *React example: implementing a project management board using React, `react-beautiful-dnd` for task movement, and a custom Material UI theme for brand alignment.*
- **Build tooling (asset bundling and dev experience):** Webpack offers mature code-splitting and plugin ecosystems; Vite uses esbuild (an ultra-fast Go-based bundler) for instant dev server startups; Rollup creates optimized libraries for npm distribution; Parcel favors zero-config builds with sensible defaults. *React example: adopting Vite to speed cold starts for a design system playground while exporting production bundles via Rollup for downstream teams.*

Senior interviewers look for explicit trade-offs rather than defaulting to the tools you already know.

### 4. Component Architecture
- **Component hierarchy (parent-child blueprint):** Map the tree from the app shell to smallest leaf components, distinguishing stateful “container” components from stateless “dumb” components that simply render props. *React example: in an e-commerce single-page application (SPA), `AppShell` hosts `ProductPage`, which nests `FilterSidebar`, a `ProductGrid`, and reusable atoms like `PriceTag` and `AddToCartButton`.*
- **Routing strategy (URL-driven navigation rules):** Plan how routes encode state—modal routes for overlays, deep links for shareable views, query params for filters—and how React Router or Remix will manage transitions. *React example: a SaaS billing console uses `/invoices?status=overdue` for shareable filters and `/invoices/:id#pay` to open a payment modal via route state.*
- **Data sharing patterns (state propagation techniques):** Decide when to pass data through props (“prop drilling”), when to elevate state into Context or dedicated stores, and when to cache data locally. *React example: product filters live in a Context provider so `FilterSidebar` and `ProductGrid` stay in sync, while wishlist state persists in localStorage for returning visitors.*
- **Composability (building blocks that adapt):** Provide theme overrides, “slot” props for custom renderers, and feature flags for progressive rollout so one component serves multiple scenarios. *React example: a `DashboardCard` component accepts a `renderHeader` prop, supports light/dark themes via styled-system tokens, and hides beta analytics charts behind LaunchDarkly flags.*

### 5. Data, APIs, and Protocols
- **Protocols (ways clients talk to servers):** REST models resources with HTTP verbs, GraphQL lets clients request exact fields to cut over-fetching, Server-Sent Events (SSE) push one-way updates, gRPC (Google Remote Procedure Call) and other RPC (remote procedure call) systems use binary protocols for low-latency calls, and WebSockets create bi-directional streams. *React example: using GraphQL for a dashboard so components query only needed metrics, while a WebSocket channel streams live trade updates to a `TickerTape` component.*
- **Response formats (payload shapes):** JSON is human-readable and ubiquitous; Protocol Buffers shrink payloads for bandwidth-sensitive apps; newline-delimited JSON (NDJSON) streams chunks progressively. *React example: a weather SPA consumes Protocol Buffer forecasts decoded in the browser to keep bundle size low on rural 3G connections.*
- **Implementation nuances (interaction patterns):** Infinite scroll can rely on the Intersection Observer API to trigger fetches when components enter view or on throttled manual scroll events; debounced search delays API calls until typing pauses; `AbortController` cancels stale requests; sequence guards ensure late responses don’t overwrite fresh state. *React example: a Airbnb-style listing page uses Intersection Observer to load more homes, debounces location search inputs to 300ms, and aborts previous fetches when users change filters rapidly.*
- **Caching (avoiding redundant work):** The browser HTTP cache stores static assets; service workers pre-cache shell assets for offline use; CDNs serve content from edge locations; API caching layers like Redis reduce database load. *React example: a news progressive web app (PWA) caches article lists through a service worker for subway commuters and leverages Cloudflare CDN to deliver hero images quickly worldwide.*

### 6. Data Modeling and Contracts
- **Endpoint design (URLs + methods):** Pair each resource with an HTTP method (GET for reads, POST for creation, PUT/PATCH for updates, DELETE for removal) and a documented JSON schema. *React example: `GET /api/products?category=electronics` returns a paginated list consumed by `ProductGrid`, while `POST /api/cart/items` adds items the `CartDrawer` displays.*
- **Request shape (query vs body, pagination tokens):** Use query parameters for filters and sorting, request bodies for complex payloads, and cursor tokens for infinite lists. *React example: the `OrderHistory` page passes `?cursor=abc123&status=delivered` to fetch the next batch, while `AddressForm` submits a JSON body with nested street fields.*
- **Error and status standards (communicating failures):** Define response envelopes with `error.code`, localization-ready messages, and precise HTTP status codes (400 for validation, 401 for auth issues, 500 for server errors). *React example: if a payment fails, the checkout flow receives `409 Conflict` with `{ error: { code: "PAYMENT_METHOD_EXPIRED" } }` so React can show a translated banner and prompt for a new card.*
- **Versioning strategy (evolving without breaking clients):** Introduce versioned routes (`/v2/invoices`) or Accept headers to roll out API changes while keeping older clients stable. *React example: migrating a reporting app to `/api/v2/reports` so new widgets can consume richer metrics while legacy dashboards continue polling v1.*

### 7. Component-Level Design
- **Component API contracts (props, events, defaults):** List the inputs (`props`), outputs (callbacks or custom events), and reasonable defaults so other teams consume the component safely. *React example: `DateRangePicker` accepts `value`, `onChange`, and `minDate`, defaulting to the current quarter, and fires `onApply` when the user confirms.*
- **Separation of concerns (presentation vs logic):** Keep visual-only components isolated from data orchestration to improve reuse and testing. *React example: `UserListContainer` fetches subscribers and passes them to a presentational `UserList` component that only renders avatars and names.*
- **Inclusive UX (accessibility, localization, responsiveness):** Ensure Accessible Rich Internet Applications (ARIA) roles communicate structure, keyboard flows mirror mouse interactions, text strings are translatable, and layouts adapt to breakpoints. *React example: an admin modal traps focus, exposes `aria-labelledby`, reads copy from `react-intl`, and switches to a stacked layout on tablets.*
- **Testing strategy (confidence layers):** Combine unit tests for pure functions, component tests with React Testing Library, integration tests via Cypress or Playwright, and visual regression via Storybook. *React example: the design system’s `Button` has Jest snapshot tests, Storybook stories with accessibility checks, and a Cypress smoke test covering checkout submission.*

## High-Level Design (HLD) vs Low-Level Design (LLD)
- **High-Level Design (HLD) – “the big picture”:** Covers requirements mapping, module decomposition, tech stack choices, and contract boundaries. *React example: presenting how a streaming platform’s web app will separate playback, subscriptions, and recommendations across teams, along with CDN, authentication, and observability plans.*
- **Low-Level Design (LLD) – “the implementation blueprint”:** Dives into component APIs, data flow, lifecycle methods, styling approach, and performance tactics. *React example: detailing a `ChatWindow` component with message virtualization, typing indicators via WebSockets, and unit tests for message grouping.*
- **Context switching (right depth at the right time):** Confirm the interviewer’s desired layer so you explore relevant trade-offs first before touching adjacent layers. *React example: if a Google interviewer asks for HLD, stay on architecture until they request hooks or CSS implementation details.*

## Common Functional Modules
- **User management and authentication:** Handle sign-up, login, password reset, session refresh, and role assignments. *React example: using `react-hook-form` with Firebase Auth to manage email + one-time password (OTP) login and JSON Web Token (JWT) refresh for an online learning portal.*
- **Help & support flows:** Provide FAQs, chatbots, ticket submission, and escalation tracking. *React example: embedding Intercom chat in a React admin, then routing escalated tickets to a `SupportInbox` component backed by GraphQL mutations.*
- **Payments, pricing, subscriptions:** Integrate gateways, manage price plans, calculate taxes, and handle invoices. *React example: wiring Stripe Elements into a `CheckoutForm` component with proration logic and monthly billing reminders rendered in `SubscriptionSummary`.*
- **Product catalog (listing, details, reviews):** Surface searchable listings, filterable categories, and rich detail pages with social proof. *React example: building an Etsy-style `ProductGallery` with server-side search, a `ProductDetails` view that lazy-loads high-res imagery, and a `ReviewList` aggregated via TanStack Query.*
- **Cart and checkout:** Maintain cart state, compute price breakdowns, and support add/remove/update actions before purchase. *React example: persisting cart contents in Redux Toolkit with selectors for subtotal, shipping, and taxes, then driving a `CheckoutStepper` with validation at each stage.*
- **Account dashboards and order history:** Show personalized data, settings, and historical records with filtering and export options. *React example: rendering a `ProfileDashboard` with editable preferences and a paginated `OrderHistoryTable` using React Table for sorting and CSV export.*

Use interviewer guidance to decide which modules to flesh out and which to park.

## Non-Functional Considerations
- **Target devices (responsive vs adaptive):** Responsive layouts fluidly adjust to any screen size using CSS grids/flexbox, while adaptive designs serve preset breakpoints with tailored layouts. *React example: a news portal uses responsive Chakra UI components for mobile readers, whereas a bank builds separate adaptive flows for tablet kiosks with larger touch targets.*
- **Performance budgets (Core Web Vitals + optimization):** First Contentful Paint (FCP) measures time to first paint, Largest Contentful Paint (LCP) checks main content visibility, and Time to Interactive (TTI) tracks when the page becomes usable. Apply lazy loading to defer non-critical bundles and optimize images/fonts. *React example: capping the homepage bundle at 200 KB, using React.lazy for campaign banners, and preloading hero images to keep LCP under 2.5 s.*
- **Network resilience (CDN and graceful degradation):** Content Delivery Networks (CDNs) cache assets near users, edge caching serves server-side rendered (SSR) pages quickly, and graceful degradation ensures core flows still work on slow links. *React example: deploying Next.js pages to Vercel’s edge network while falling back to low-res images and skeleton states when a user’s bandwidth drops below 1 Mbps.*
- **Security hygiene (protecting users and data):** Mitigate Cross-Site Scripting (XSS) with escaping and Content Security Policy (CSP) headers, prevent Cross-Site Request Forgery (CSRF) with same-site cookies or tokens, enforce role-based access control (RBAC), and store secrets securely. *React example: sanitizing user reviews with DOMPurify, sending CSP headers via Helmet, validating CSRF tokens on form submissions, and gating admin routes with role-aware route guards.*
- **Offline and resilience (staying usable when disconnected):** Service workers cache shells for offline viewing, retry strategies replay failed mutations, and optimistic updates anticipate success to keep UI snappy. *React example: a grocery PWA queues cart updates in IndexedDB, shows optimistic stock counts, and syncs when connectivity returns.*
- **Observability (seeing real-world behavior):** Structured logging captures events, monitoring tools (Datadog, New Relic) track uptime, product analytics (Amplitude, Mixpanel) show user journeys, and error reporting (Sentry) alerts engineers. *React example: logging checkout steps to Datadog, recording funnel conversions in Amplitude, and capturing stack traces in Sentry when a React boundary catches an error.*
- **Release orchestration (shipping safely):** Continuous Integration/Continuous Delivery (CI/CD) pipelines run automated tests, code quality gates enforce lint/coverage thresholds, and deployment workflows automate promotion between environments. *React example: GitHub Actions runs linting, Jest, and Cypress on every PR before ArgoCD (a GitOps delivery tool) deploys the React container to staging and production clusters.*
- **Experimentation (controlled change rollout):** Feature flags toggle UI paths, A/B testing compares variants with statistical rigor, and staged rollouts gradually expose updates. *React example: using LaunchDarkly to serve a redesigned booking form to 10% of traffic, measuring conversions with Optimizely, and ramping to 100% after positive results.*
- **Internationalization (i18n) and localization (l10n):** Internationalization prepares the app for multiple languages and locales; localization provides translated copy, date/number formats, and right-to-left layouts. *React example: leveraging `react-intl` to externalize strings, loading locale-specific bundles on demand, and mirroring layouts for Arabic-speaking users.*

## Frontend System Design Components
- **Architectural patterns (monolith vs micro-frontend):** A monolithic frontend bundles all features in one codebase, which can slow teams as scope grows; micro-frontends split the UI into independently owned slices delivered via iframes, Web Components, webpack Module Federation, or route-level composition. *React example: exposing a `@payments/checkout-shell` remote via Module Federation so the payments squad deploys independently of the merchandising squad’s React app.*
- **Communication protocols (client ↔ server messaging):** Long polling repeatedly requests updates until fresh data arrives, WebSockets maintain bi-directional real-time channels, and Server-Sent Events (SSE) push one-way updates without client re-requests. *React example: using WebSockets for a collaborative whiteboard so cursor positions stream instantly, while SSE powers low-frequency notification badges and long polling backs an analytics export progress bar.*
- **Availability strategies (staying useful offline):** Treat offline mode as a first-class scenario with cached shells, queued mutations, and read-only fallbacks when APIs go dark. *React example: a travel booking PWA stores search results in IndexedDB via a service worker, shows a cached itinerary list offline, and syncs reservation changes once connectivity resumes.*
- **Accessibility (inclusive interactions):** Support multiple languages, keyboard-only navigation, screen readers, color contrast, and alternative input methods so every user can succeed. *React example: a React Native Web kiosk mirrors airline check-in forms with WCAG-compliant contrast ratios, ARIA labels, and sign-language video help embedded via an accessible modal.*
- **Consistency and design systems (uniform experience):** Cross-browser quirks and OS differences require standardized tokens, components, and documentation. *React example: publishing a design system with Storybook, CSS custom properties, auto-prefixed styles, and polyfilled JS utilities so Chrome, Firefox, Safari, and Edge render the same `PrimaryButton`.*
- **Credibility and trust (search engine optimization):** On-page SEO covers titles, meta descriptions, schema markup, and fast load times; off-page SEO relies on backlinks and paid campaigns to boost discoverability. *React example: a restaurant discovery site pre-renders city pages with Next.js, adds Open Graph tags for social sharing, generates JSON-LD schema, and runs Google Ads to funnel traffic to seasonal campaigns.*
- **Logging and monitoring (observe behavior):** Capture errors, usage patterns, and infrastructure health to prioritize fixes and improvements. *React example: piping client errors to Sentry, product analytics to Amplitude, session replays to LogRocket, and edge metrics to Datadog to spot checkout failures before customers churn.*
- **Client-side data and caching (fast responses):** Combine HTTP caching headers, in-memory stores, service workers, and browser databases to minimize redundant fetches. *React example: caching hero images with immutable cache-control headers, storing GraphQL responses in Apollo’s normalized cache, and persisting cart items in localStorage with versioned migrations.*
- **Security (defense in depth):** Enforce authentication, authorization, origin policies, and secure communication to block spoofing and data theft. *React example: protecting a fintech dashboard with OAuth 2.0 login, role-scoped feature flags, strict CSP headers that disallow unknown scripts, HTTPS everywhere, and signed WebCrypto tokens for API calls.*
- **Performance and optimization (visible speed):** Prioritize above-the-fold rendering, stream resources progressively, and measure impact with Core Web Vitals. *React example: splitting bundles with dynamic imports, precomputing product listings via Incremental Static Regeneration, shipping Brotli-compressed assets over HTTP/2, and surfacing skeleton UIs while data hydrates.*
- **Testing strategy (confidence layers):** Unit tests validate functions, integration tests verify component collaborations, and end-to-end tests assert user journeys. *React example: running Jest for utility hooks, React Testing Library for form validation, and Playwright end-to-end suites that exercise sign-up, purchase, and refund flows nightly.*

## Performance Optimization Deep Dive
Network awareness and runtime discipline separate senior frontend engineers from the pack. These tactics map directly to the “network optimization” layer from the transcript and include React-ready implementations you can adapt immediately.

### Async vs. Defer Scripts
- `async` scripts download in parallel with HTML parsing, pausing parsing only during execution. Perfect for analytics or flag SDKs that do not gate rendering.
- `defer` scripts download alongside parsing but execute after the DOM is parsed, ideal for application bundles and framework runtimes.

```html
<script src="/static/js/main.js" defer></script>
<script src="https://cdn.launchdarkly.com/js/client.min.js" async></script>
```

### Route-Level Code Splitting
- `React.lazy` and `Suspense` keep non-critical routes off the critical path while still offering fallback UI.

```tsx
// src/routes/AppRouter.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Reports = lazy(() => import('../pages/Reports'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Dashboard data-priority="high" />} />
          <Route path="/reports/*" element={<Reports />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Native Lazy Loading Attributes
- Add `loading="lazy"` to below-the-fold images/iframes and pair hero assets with `loading="eager"` plus `fetchpriority="high"` to guarantee early fetches.
- Chrome also recognises `priority="low"` for eager-but-deprioritised assets (e.g., hero carousel frames), while other browsers simply ignore the hint—safe to add defensively.
- Lazy load embeds too: `<iframe loading="lazy">` keeps third-party scripts from blocking interactivity until the user scrolls near them.

```jsx
<img
  src={product.heroImage}
  alt={product.name}
  loading="eager"
  fetchpriority="high"
/>
<img
  src={product.galleryImages[0]}
  alt={`${product.name} side angle`}
  loading="lazy"
  fetchpriority="low"
  referrerPolicy="no-referrer"
/>
<iframe
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  title="Behind the scenes"
  loading="lazy"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
/>
```

### Intersection Observer for Infinite Lists
- Replace scroll event spam with a sentinel node watched by `IntersectionObserver`. Fetch additional data only when the sentinel appears.
- Use the `root` option for scrollable containers (e.g., modals) and tweak `threshold`/`rootMargin` to fire before the user hits the end (e.g., `rootMargin: '400px'` preloads one screen early).

```tsx
// src/hooks/useInfiniteScroll.ts
import { useEffect, useRef } from 'react';

export function useInfiniteScroll(callback: () => void) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) callback();
      },
      { rootMargin: '400px', threshold: 0.25 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [callback]);

  return sentinelRef;
}
```

```tsx
// src/components/ProductGrid.tsx
import { useState, useCallback } from 'react';
import ProductCard from './ProductCard';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

export default function ProductGrid({ initialProducts, fetchNextPage }) {
  const [products, setProducts] = useState(initialProducts);
  const loadMore = useCallback(async () => {
    const next = await fetchNextPage();
    setProducts((prev) => [...prev, ...next]);
  }, [fetchNextPage]);

  const sentinelRef = useInfiniteScroll(loadMore);

  return (
    <div className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      <div ref={sentinelRef} aria-hidden="true" />
    </div>
  );
}
```

### `content-visibility`
- Let the browser lazily render off-screen sections. Combine with `contain-intrinsic-size` to reserve layout space and avoid layout shifts.
- Wrap usage in a feature query to avoid surprising older Safari/Firefox versions: `@supports (content-visibility: auto) { ... }`.
- For variable-height sections, set `contain-intrinsic-block-size` to a conservative estimate so the browser reserves space until actual rendering.

```css
.timeline-section {
  content-visibility: auto;
  contain-intrinsic-size: 800px;
}
```

### Critical CSS and Async Swaps
- Inline above-the-fold CSS, load the rest with `media="print"` plus `onload` swap, or use a build tool (e.g., Critters for Next.js).

```html
<link rel="stylesheet" href="/css/critical.css" />
<link
  rel="stylesheet"
  href="/css/app.css"
  media="print"
  onload="this.media='all'"
/>
<noscript><link rel="stylesheet" href="/css/app.css" /></noscript>
```

### Resource Hinting
- `preconnect` and `dns-prefetch` warm up the connection, `preload` pulls critical assets now, `prefetch` queues likely future routes/resources, and `prerender` pre-navigates entire pages (use sparingly).
- `modulepreload` lets the browser resolve ES module dependency graphs before evaluation, preventing waterfall fetches for dynamic imports.
- Always include `as`, `type`, and `crossorigin` so the browser fully optimises caching and avoids mixed-mode re-downloads.

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="dns-prefetch" href="//www.googletagmanager.com" />
<link rel="preload" href="/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossorigin />
<link rel="prefetch" href="/static/chunks/cart-page.js" as="script" />
<link rel="modulepreload" href="/static/js/dashboard-bootstrap.js" />
<link rel="prerender" href="https://app.example.com/dashboard" />
```

### CDN & Cache-Control Strategy
- Push immutable, fingerprinted assets (`/static/js/main.abc123.js`) to the CDN with long-lived caching (`Cache-Control: public, max-age=31536000, immutable`).
- Use `stale-while-revalidate` and `stale-if-error` for HTML so fallback pages remain instant while the CDN refreshes in the background.
- Separate browser and edge cache lifetimes with `Surrogate-Control` (Fastly, Cloudflare) when you need CDN freshness but strict client behaviour.

```tsx
// src/server/middleware/cacheHeaders.ts
import type { RequestHandler } from 'express';

export const cacheHeaders: RequestHandler = (req, res, next) => {
  if (/\.[a-f0-9]{8,}\.(js|css)$/.test(req.url)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (req.url.endsWith('.svg') || req.url.endsWith('.woff2')) {
    res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader('Surrogate-Control', 'max-age=60, stale-while-revalidate=600');
  }
  next();
};
```

```js
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:all*(js|css|png|jpg|svg|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate, stale-while-revalidate=60' },
        ],
      },
    ];
  },
};
```

### Service Worker Caching
- Use the service worker as an offline-first proxy. Cache shell assets during `install`, update runtime caches during `fetch`, and fall back to an offline page when the network is down.
- Lifecycle quick reference:
  - **install** → pre-cache essentials (call `self.skipWaiting()` if you want the new worker to activate immediately).
  - **activate** → clean old caches and optionally `clients.claim()` so pages controlled by the previous worker switch over without reload.
  - **fetch** → decide between CacheFirst, NetworkFirst, or StaleWhileRevalidate strategies based on request type.
- Libraries like Workbox wrap these patterns with declarative helpers; manual wiring (below) keeps the moving parts explicit.

```ts
// public/service-worker.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('static-v1').then((cache) => cache.addAll(['/index.html', '/offline.html']))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open('dynamic-v1').then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match('/offline.html'));
    })
  );
});
```

```tsx
// src/serviceWorkerRegistration.ts
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').catch((error) => {
        console.error('SW registration failed', error);
      });
    });
  }
}
```

```js
// public/service-worker-workbox.js
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkFirst({ cacheName: 'pages', networkTimeoutSeconds: 3 })
);

registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new StaleWhileRevalidate({ cacheName: 'assets' })
);

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({ cacheName: 'images', matchOptions: { ignoreVary: true } })
);
```

### Rendering Strategies Cheat Sheet
- **CSR (client-side rendering):** Fast iterations, relies on hydration. Pair with skeleton loaders to manage perceived latency.
- **SSR (server-side rendering):** Better SEO/TTFB; React 18 streaming plus partial hydration reduces blocking time.
- **SSG (static site generation):** Build-time HTML for marketing or docs. Keep rebuild cadence to avoid stale data.
- **ISR / On-demand revalidation:** Hybrid (Next.js) that updates pages in the background.

```tsx
// pages/products/[slug].tsx (Next.js)
export async function getStaticPaths() {
  const slugs = await fetchPopularProductSlugs();
  return { paths: slugs.map((slug) => ({ params: { slug } })), fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const product = await fetchProduct(params.slug);
  return { props: { product }, revalidate: 60 };
}
```

### HTTP Compression
- Enable Brotli (`br`) wherever supported, fall back to Gzip (`gzip`) for legacy browsers/CDN nodes.
- Set `Vary: Accept-Encoding` to keep compressed and uncompressed variants distinct in intermediate caches.
- Benchmark with `npx brotli-size build/static/js/main.js` or `gzip-size` during CI to catch asset regressions automatically.

```nginx
gzip on;
gzip_types text/css application/javascript application/json;
brotli on;
brotli_types text/css application/javascript application/json;
```

### Layout Shift Prevention
- Reserve space with intrinsic ratios, batch DOM reads/writes, and use transforms/opacity for animations to stay on the compositor thread.
- Use `font-display: swap` and preloaded font files to avoid FOIT (flash of invisible text) that leads to late layout jumps.
- Reference table for common operations:

| Operation category | Example properties / APIs | Layout? | Paint? | Composite? |
|--------------------|---------------------------|---------|--------|------------|
| Layout (reflow)    | `offsetWidth`, changing `width`, `top`, `font-size`, appending DOM nodes | ✅ | ✅ | ✅ |
| Paint              | `background-color`, `color`, `box-shadow`, `border` | ❌ | ✅ | ✅ |
| Composite only     | `transform`, `opacity`, `filter` | ❌ | ❌ | ✅ |

```tsx
// src/components/FadeInImage.tsx
import { useState } from 'react';
import clsx from 'clsx';

export default function FadeInImage(props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      {...props}
      onLoad={() => setLoaded(true)}
      className={clsx('fade-image', { 'fade-image--visible': loaded })}
      style={{ aspectRatio: props.width / props.height }}
    />
  );
}
```

```css
.fade-image {
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 180ms ease-out, transform 180ms ease-out;
}
.fade-image--visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Web Vitals Telemetry
- Collect Core Web Vitals with the `web-vitals` package and forward them to observability pipelines for real-user monitoring (RUM).
- Add metadata (connection type, user agent, route) so you can slice regressions by cohort.
- Pair RUM with synthetic checks (Lighthouse CI, WebPageTest) to prevent regressions before deploy.

```tsx
// src/reportWebVitals.ts
import { onCLS, onFID, onLCP } from 'web-vitals';

export function reportWebVitals(callback: (metric: { name: string; value: number }) => void) {
  onCLS(callback);
  onFID(callback);
  onLCP(callback);
}
```

```tsx
// src/index.tsx
import { reportWebVitals } from './reportWebVitals';

reportWebVitals(({ name, value }) => {
  navigator.sendBeacon(
    '/metrics',
    JSON.stringify({ name, value, viewport: `${window.innerWidth}x${window.innerHeight}` })
  );
});
```

### Frame Budget & `requestAnimationFrame`
- Aim for ~10 ms of main-thread work per frame to maintain 60 fps (16.7 ms frame budget minus browser overhead).
- Break long tasks into chunks (`queueMicrotask`, `requestIdleCallback`) and schedule DOM reads/writes inside `requestAnimationFrame` to avoid layout thrashing.

```tsx
// src/utils/scheduleLayoutWork.ts
type Measurement = () => number;
type Mutation = (value: number) => void;

export function scheduleLayoutWork(read: Measurement, write: Mutation) {
  requestAnimationFrame(() => {
    const measurement = read();
    requestAnimationFrame(() => write(measurement));
  });
}
```

```tsx
// usage
scheduleLayoutWork(
  () => document.querySelector('.sidebar')!.getBoundingClientRect().height,
  (height) => document.documentElement.style.setProperty('--sidebar-height', `${height}px`)
);
```

### Verify Improvements
- Run Lighthouse locally (`npx lighthouse http://localhost:3000 --view`) or integrate Lighthouse CI with budgets to guard against regressions.
- Use WebPageTest filmstrips/CPU charts to validate that lazy loading, hinting, and compression deliver real perceived speed gains.
- Track Chrome UX Report (CrUX) origin data to ensure improvements reach production users, not just lab tests.

## Asset Optimization Guide
Network gains only shine when assets are disciplined. The playbook below compacts images, videos, fonts, CSS, and JS so critical bytes hit the wire first and heavy work stays off the main thread.

### Images
- **Compression first:** Use lossy for marketing imagery (WebP/AVIF), lossless for UI sprites/icons. CLI options:
  - `sharp` (Node) – convert/resize; `sharp input.jpg -q 65 -o hero.avif`.
  - `squoosh-cli`, `imagemin`, or web services (Kraken, TinyPNG) during CI.
- **Format fallback via `<picture>`:**

```html
<picture>
  <source srcSet="/img/hero@1x.avif 1x, /img/hero@2x.avif 2x" type="image/avif" />
  <source srcSet="/img/hero@1x.webp 1x, /img/hero@2x.webp 2x" type="image/webp" />
  <img src="/img/hero@1x.jpg" alt="Beachfront home" loading="eager" fetchpriority="high" />
</picture>
```

- **Responsive `srcset` + `sizes`:** Let the browser select an appropriate candidate based on DPR and viewport width.

```tsx
<img
  src="/img/card-400.jpg"
  srcSet="/img/card-400.jpg 400w, /img/card-800.jpg 800w, /img/card-1200.jpg 1200w"
  sizes="(max-width: 600px) 90vw, (max-width: 1200px) 45vw, 400px"
  alt={product.name}
  loading="lazy"
/>
```

- **Adaptive media loading:** Use connection hints to downscale on low-end devices.

```ts
export function pickImageVariant(base: string) {
  const connection = navigator.connection;
  const deviceMemory = (navigator as any).deviceMemory ?? 4;
  const fast = connection?.effectiveType?.includes('4g') && !connection.saveData && deviceMemory >= 4;
  return `${base}-${fast ? 'xl' : 'sm'}.webp`;
}
```

- **Blur placeholders / dominant-color fills:** Show a tiny base64 preview until the full asset arrives.

```css
.lazy-image {
  filter: blur(12px);
  transition: filter 200ms ease-out;
}
.lazy-image--ready { filter: blur(0); }
```

- **Sprite sheets for icons:** Combine small PNG/SVG icons into a single asset to reduce requests; use `background-position` to reveal segments.

### Videos
- **Progressive enhancement:** Serve WebM/AV1 first, fall back to MP4/H.264.

```html
<video controls preload="metadata" poster="/video/trailer-poster@2x.jpg">
  <source src="/video/trailer.webm" type="video/webm" />
  <source src="/video/trailer.mp4" type="video/mp4" />
  Sorry, your browser doesn't support embedded videos.
</video>
```

- **Replace GIFs with muted autoplay videos:** Reduce file size ~80% while keeping motion.

```jsx
<video
  src="/video/feature-loop.webm"
  autoPlay
  loop
  muted
  playsInline
  poster="/video/feature-loop-poster.jpg"
  loading="lazy"
/>
```

- **Responsive posters:** Preload resolution-specific posters so hero banners look sharp without blocking video playback.
- **Preload policy:** Use `preload="auto"` only for above-the-fold hero clips; fit everything else with `preload="metadata"` or omit entirely.
- **Streaming pipelines:** For long-form content, prefer HLS/DASH or MSE-based chunking so playback begins after the first segment. If you control the backend, expose byte-range requests.
- **Audio tracks:** Strip audio from previews (`ffmpeg -an`) or deliver language tracks separately (Netflix-style) and stitch via `<track>` or `MediaSource`.

### Fonts
- **`font-display` choices:**
  - `swap` (recommended) – FOUT: render fallback immediately, swap when ready.
  - `optional` – avoid blocking layout on low-quality networks.
  - `block` (default) – FOIT; avoid unless absolutely necessary.
- **Multiple formats:** Serve WOFF2 first, fall back to WOFF or TTF.

```css
@font-face {
  font-family: 'Inter';
  src:
    url('/fonts/Inter.woff2') format('woff2'),
    url('/fonts/Inter.woff') format('woff');
  font-weight: 400;
  font-display: swap;
}
```

- **Subset fonts:** Use `pyftsubset`, `glyphhanger`, or `subset-font` to keep only used glyphs (e.g., remove Cyrillic letters from Latin-only UI).
- **Lazy load fonts with FontFaceObserver:**

```ts
import FontFaceObserver from 'fontfaceobserver';

new FontFaceObserver('Inter', { weight: 600 }).load(null, 3000).then(() => {
  document.documentElement.classList.add('font-inter-loaded');
});
```

- **Data URIs for tiny SVG icons/fonts:** Inline to avoid extra round trips; beware base64 overhead (~33%).

### CSS
- **Critical CSS extraction:** Inline first-fold styles; lazy-load the rest with media swap.

```html
<link rel="stylesheet" href="/css/critical.css" />
<link rel="preload" href="/css/app.css" as="style" onload="this.rel='stylesheet'" />
<noscript><link rel="stylesheet" href="/css/app.css" /></noscript>
```

- **Media-specific bundles:** Split `print.css`, `dark.css`, `tablet.css` etc., and annotate `media="print"` or `media="(max-width: 600px)"` so unused files stay idle.
- **CSS-in-JS or code-splitting:** With libraries like emotion/styled-components, prefer SSR extraction (`renderToPipeableStream`) plus lazy component-level bundles so only used styles ship.
- **Purge unused rules:** Use `@fullhuman/postcss-purgecss`, Tailwind's `content` config, or `cssnano` to strip dead selectors.

### JavaScript
- **Loading strategy cheat sheet:**
  - `<script defer>` – default for app bundles.
  - `<script async>` – analytics/ads; order doesn’t matter.
  - `<script type="module">` – native ESM; treated like `defer`.
  - `<script nomodule>` – fallback for legacy browsers.
- **Dynamic imports + Suspense:** Split large routes or dashboards.

```tsx
const AdminPanel = lazy(() => import('./AdminPanel'));
```

- **Tree shaking & dead code elimination:** Ensure libraries ship ESM (`package.json: "module"`) and avoid wildcard imports (prefer `import { Button } from 'lib'`).
- **Web workers for heavy compute:** Offload CPU-intensive work.

```ts
// primes.worker.ts
self.onmessage = ({ data: limit }) => {
  const primes = calculatePrimes(limit);
  (self as DedicatedWorkerGlobalScope).postMessage(primes);
};

// main thread
const worker = new Worker(new URL('./primes.worker.ts', import.meta.url));
worker.postMessage(1_000_000);
worker.onmessage = ({ data }) => setPrimes(data);
```

- **Idle and animation scheduling:** Use `requestIdleCallback` for non-urgent work (feature flag hydration, analytics) and `requestAnimationFrame` for visual updates (see frame budget helper above).

## Interview Tools to Practice
- **Diagramming canvases (visual architecture drafting):** draw.io and Lucidchart provide drag-and-drop shapes with collaboration; Gliffy embeds in Confluence; Miro offers infinite boards with templates; Microsoft OneNote supports stylus sketches; Google Jamboard (a.k.a. Zenboard) enables multi-slide whiteboarding. *React example: recreating a Netflix-style component hierarchy in Miro before the interview so you can quickly rearrange modules live.*
- **Whiteboarding practice (hand-drawn storytelling):** If onsite, rehearse sketching flows on a physical whiteboard or tablet, focusing on legible labels and steady narration. *React example: drawing the Redux data flow for a cart feature on an iPad to refine how you explain dispatch, reducers, and selectors.*
- **Collaborative coding environments (paired implementation):** Familiarize yourself with tools like CodeSandbox, StackBlitz, or the company’s internal IDE so you can scaffold components rapidly. *React example: pre-building a CodeSandbox starter with ESLint and Testing Library so you can jump straight into implementing a chat widget during a machine coding round.*

Rehearse with your chosen tool so navigation does not slow you down during the interview.

## Mantras for Success
- **Validate expectations (stay aligned):** Ask clarifying questions as priorities evolve. *React example: before detailing caching, confirm whether the interviewer wants to focus on Core Web Vitals or on internationalization so you emphasize the right solution.*
- **Narrate your reasoning (think aloud):** Explain why you choose patterns to reveal your decision process. *React example: describe why you prefer React Query over Redux for server state because the API requires background refetching.*
- **Tackle one slice at a time (structured depth):** Finish the product listing discussion before pivoting to checkout flows. *React example: wrap up how `ProductCard` handles wishlists before diving into the `CartSummary` taxes logic.*
- **Agree on scope before coding (avoid premature dives):** Ensure the interviewer wants LLD before opening an editor. *React example: pause to ask if they expect a working prototype or a high-level diagram before importing React Testing Library.*
- **Iterate openly (embrace feedback loops):** Present an initial component hierarchy, gather reactions, and adjust. *React example: after sketching modules in Miro, tweak the data layer when the interviewer suggests splitting analytics into its own slice.*
- **Explain trade-offs (demonstrate judgment):** Compare options, noting benefits and drawbacks. *React example: outline how server-side rendering improves SEO for product pages but increases infrastructure complexity compared to client-only hydration.*
- **Close with a recap (reinforce clarity):** Summarize decisions, risks, and next steps to end on a confident note. *React example: conclude by reiterating the chosen tech stack, performance plan, and open questions about payment provider integration.*

## Preparation Checklist
- **Run full mock interviews (HLD + LLD reps):** Simulate both architecture and coding rounds with peers to stress-test timing and narrative flow. *React example: spend 60 minutes designing a marketplace in Figma’s FigJam whiteboard, then 90 minutes implementing a pricing widget in CodeSandbox.*
- **Curate reusable artifacts (diagrams + API templates):** Maintain a personal vault of component trees, sequence diagrams, and API contract templates for quick adaptation. *React example: storing a `ProductListing.drawio` diagram and a standard JSON response snippet in Notion to reference during live calls.*
- **Update fundamentals (performance, accessibility, security):** Review current guidance on Core Web Vitals, WCAG 2.2 updates, and the Open Worldwide Application Security Project (OWASP) Top 10 to speak confidently. *React example: revisiting Chrome DevTools performance recordings for an internal dashboard to recall how you fixed a slow LCP.*
- **Collect storytelling ammo (real project anecdotes):** Reflect on projects where you shipped challenging features so you can cite concrete outcomes. *React example: narrating how you refactored a legacy class-based checkout into hooks, cutting bundle size by 30% and improving conversion by 8%.*
- **Track evolving tooling (stay relevant):** Experiment with emerging libraries or bundlers so recommendations are current. *React example: prototyping the same dashboard in React Server Components (RSC) with Next.js 14 and comparing developer experience (DX) to the existing client-side rendered (CSR) build.*

Approach the discussion like a senior engineer partnering with product, design, and backend. Demonstrating structured thinking, empathy for stakeholders, and awareness of trade-offs is the fastest path to a strong hire decision.

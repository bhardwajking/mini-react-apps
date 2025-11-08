# Frontend System Design Mini-Book

**Goal:** help you talk through a frontend system design interview like you are telling a clear story to a friend.  
**Tone:** plain words so even a 10-year-old can follow.  
**Structure:** short sections you can read in any order.

---

## How to Use This Book
1. Read *Key Words* so you can name every part of the story.
2. Follow *The Interview Journey* when you answer questions.
3. Skim *Cheat Sheets* before the interview to keep ideas fresh.
4. Use the *Checklists* while building real projects.

---

## Part 1 – Key Words & Characters

| Word | Think of it as | What it does |
| ---- | -------------- | ------------ |
| **User** | Hungry customer | Wants something done. |
| **Client** | Table + menu (browser/app) | Shows screens, sends clicks. |
| **API** | Waiter | Carries orders and answers. |
| **Server** | Kitchen manager | Follows rules, talks to helpers. |
| **Database** | Food storage | Remembers everything. |
| **Front end** | All code shipped to the client | Draws, listens, talks to APIs. |
| **Back end** | Services, queues, databases | Stores, secures, automates. |

```
User → Client → API → Server → Database
           ↑            ↓
        responses    more APIs
```

### Tiers (Layers) Story
- **1 tier:** stall, everything in one place.
- **2 tier:** client + one server (LAMP, SPA + API).
- **3 tier:** client + API + database.
- **N tier:** many small servers (payments, search, chat, etc.).

### A Tiny API Example
```tsx
// Client: asks for orders
export async function fetchOrders() {
  const res = await fetch('/api/orders', { credentials: 'include' });
  if (!res.ok) throw new Error('Cannot load orders');
  return res.json();
}
```
```ts
// Server: answers with data
router.get('/api/orders', async (req, res, next) => {
  try {
    const orders = await readOrders(req.user!.id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
});
```

When you explain a design, point to each layer so the interviewer knows you see the whole path.

---

## Part 2 – The Interview Journey (Seven Steps)

1. **Say hello and set the stage**  
   “Let me restate the goal…”  
   Ask: user type, device, must-have features.

2. **Gather requirements**  
   - *Functional* (what users do).  
   - *Non-functional* (speed, accessibility, security, offline).  
   Use: “Anything else you expect?”  

3. **Scope and prioritise**  
   Pick a small slice (MVP).  
   Pause: “Is it okay if I focus on product listing + cart first?”

4. **Pick tools on purpose**  
   Call out front-end library, state store, build tool, design system.  
   Explain one trade-off (“I choose React Query over Redux here because…”).

5. **Draw the component tree**  
   List parents → children.  
   Mention routing, shared state, themes, feature flags.

6. **Talk data and APIs**  
   Endpoints (`GET /api/products`, `POST /api/cart`).  
   Shapes (fields, errors, pagination).  
   Mention caching, retries, and how you avoid stale answers.

7. **Wrap up**  
   Summarise: “We built X, chose Y because Z, still need to answer A.”  
   Invite questions.

### High-Level vs Low-Level Design
- **HLD:** big picture, modules, contracts, trade-offs.  
- **LLD:** component props, functions, performance tricks, tests.  
Always ask which level they want before you dive.

---

## Part 3 – Common Module Cheat Sheet

| Module | Must mention |
| ------ | ------------ |
| **Auth** | Sign up, login, reset, tokens, RBAC. |
| **Support** | FAQ, chat, tickets, escalation. |
| **Payments** | Stripe, taxes, invoices, retries. |
| **Catalog** | Filters, search, reviews, images. |
| **Cart/Checkout** | Totals, coupons, edits, confirmation. |
| **Account** | Profile, settings, history export. |

Pick two modules, go deep, park the rest (“nice to have later”).

---

## Part 4 – Optimization Quick Wins

| Area | Easy habits |
| ---- | ----------- |
| **Network** | Compress assets, preload critical files, cache smartly. |
| **Images** | Use `srcset`, lazy-load, pick right format (WebP/AVIF). |
| **Video** | Prefer WebM, preload metadata, mute previews, stream for long content. |
| **Fonts** | Use `font-display: swap`, subset fonts, preload. |
| **CSS** | Inline critical styles, lazy-load the rest, purge unused rules. |
| **JavaScript** | `defer` bundles, code-split, use workers for heavy tasks. |

---

## Part 5 – Asset Playbooks (Short and Sweet)

### Images
1. Compress (Sharp, Squoosh, TinyPNG).  
2. Offer choices:
```html
<picture>
  <source srcset="/hero.avif 1x, /hero@2x.avif 2x" type="image/avif" />
  <source srcset="/hero.webp 1x, /hero@2x.webp 2x" type="image/webp" />
  <img src="/hero.jpg" alt="Beach house" loading="eager" fetchpriority="high" />
</picture>
```
3. Use `srcset` + `sizes` for responsive layouts.  
4. Lazy-load below-the-fold elements (`loading="lazy"`).  
5. Show blur or dominant color placeholder until image loads.

### Video
```html
<video controls preload="metadata" poster="/poster.jpg">
  <source src="/clip.webm" type="video/webm" />
  <source src="/clip.mp4" type="video/mp4" />
</video>
```
- Replace looped GIFs with muted autoplay videos.  
- Only preload fully when the video is above the fold.  
- Strip audio for previews (`ffmpeg -an`).  
- Consider HLS/DASH for long streams.

### Fonts
```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-display: swap;
}
```
- Subset only the glyphs you need.  
- Use FontFaceObserver to switch classes when font loads.  
- Inline tiny SVG icons using data URI, but avoid huge base64 blobs.

### CSS
- Inline critical styles for first paint.  
- Lazy-load the rest:
```html
<link rel="preload" href="/app.css" as="style" onload="this.rel='stylesheet'" />
<noscript><link rel="stylesheet" href="/app.css" /></noscript>
```
- Split by media types (`media="print"`, `media="(max-width:600px)"`).  
- Purge unused selectors with tools like PurgeCSS.

### JavaScript Loading
- Use `<script defer>` for app bundles.  
- Use `<script async>` for analytics/ads.  
- Dynamic import for large screens/routes:
```tsx
const AdminPanel = lazy(() => import('./AdminPanel'));
```
- Consider Worker threads for CPU-heavy work:
```ts
const worker = new Worker(new URL('./math.worker.ts', import.meta.url));
worker.postMessage({ limit: 1_000_000 });
```

---

## Part 6 – Performance Checks

- **Frame budget:** aim for <10 ms work per frame. Batch reads, then writes inside `requestAnimationFrame`.  
- **Core Web Vitals:** FCP, LCP, CLS, INP. Track them in production with `web-vitals`.  
- **Verify changes:** run Lighthouse, WebPageTest filmstrips, monitor CrUX data.  
- **Automation:** add budgets to CI (`lighthouse --budgets`).

---

## Part 7 – Memory Safety Map

| # | Leak Pattern | Fix |
| - | ------------ | --- |
| 1 | Implicit globals (`foo = 1`) | `'use strict'`, always `const/let`. |
| 2 | Forgotten `setInterval` | Store handle, call `clearInterval`. |
| 3 | Listener buildup | Remove before re-adding, or `{ once: true }`. |
| 4 | DOM removed but still referenced | Set variable to `null`, scope carefully. |
| 5 | Heavy closures | Keep closures small, release caches. |
| 6 | Reference cycles | Break links (`delete obj.child`). |
| 7 | Opened windows left hanging | `popup?.close(); popup = null;`. |
| 8 | Promises never settle | Always resolve/reject, add timeouts. |
| 9 | Observers / subscriptions | Call `disconnect()` or `unsubscribe()`. |
|10 | Infinite lists storing everything | Virtualise DOM and cap cached items. |

### Helpful Snippets
```js
// Timeout helper
export function withTimeout(promise, ms) {
  let timer;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Timeout')), ms);
    }),
  ]);
}
```
```ts
// Redux slice with eviction
while (state.ids.length > 200) {
  const evictId = state.ids.shift()!;
  delete state.entities[evictId];
}
```

### Debugging Tips
- Chrome DevTools → Memory tab → Heap snapshots.  
- Performance panel → watch JS heap line.  
- Log `performance.memory.usedJSHeapSize` (Chrome only).  
- Run tests with `node --expose-gc` to catch leaks early.

---

## Part 8 – Tools & Practice

- **Drawing:** draw.io, Miro, Lucidchart, Jamboard.  
- **Whiteboarding:** real whiteboard or tablet practice.  
- **Coding sandboxes:** CodeSandbox, StackBlitz.  
- **Mock interviews:** record yourself, time yourself, swap with friends.  
- **Resource vault:** keep templated diagrams, API contracts, component checklists.

---

## Part 9 – Quick Checklists

### Before the Interview
1. Review requirements ladder (functional + non-functional).  
2. Pick a default tech stack story.  
3. Prepare two deep modules (e.g., catalog + cart).  
4. Rehearse drawing the component tree.  
5. Memorise top optimisation habits.

### During the Interview
1. Clarify scope.  
2. Talk through the seven steps.  
3. Use simple words and analogies.  
4. Mention trade-offs and risks.  
5. Close with a summary and next steps.

### After the Interview
1. Note questions you missed.  
2. Update diagrams or checklists.  
3. Celebrate the learning!

---

## Appendix – Handy Commands

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

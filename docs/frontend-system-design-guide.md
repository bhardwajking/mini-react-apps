# Frontend System Design Interview Guide

This guide distills the key ideas from the Chakde System Design series episode on cracking frontend system design interviews. Use it as a playbook to structure discussions, highlight trade-offs, and demonstrate senior-level thinking during interview rounds.

## Interview Landscape
- **System Design:** Deep dive covering requirements, prioritization, tech choices, component architecture, and API contracts. Common at Microsoft and many large enterprises.
- **Product Sense:** Blends product thinking, UX, and technical depth. Flipkart and numerous startups emphasize this format.
- **UI Architecture:** Focuses on architectural decisions, modularization, and integration patterns. Expect discussion on cross-team collaboration and scalability considerations.
- **Machine Coding / Component Design:** Hands-on implementation of a focused feature (autocomplete, cart, customizable form). Often framed as low-level design (LLD) rounds.

Clarify the round type and expectations up front so you invest the limited time in the right layer of detail.

## End-to-End Workflow
Treat the session as a collaborative design exercise. Work through these stages deliberately and narrate your thinking.

### 1. Requirement Discovery
- Align on scope: demand vs supply side, B2B vs B2C, mobile vs desktop.
- Capture **functional requirements** (modules, capabilities, workflows).
- Capture **non-functional requirements** (performance, accessibility, security, offline support).
- Keep checking back with the interviewer to confirm priorities and expectations.

### 2. Prioritization and Scoping
- Propose an MVP to cover first; label follow-on enhancements.
- Freeze a subset of modules for deep dives (e.g., product listing plus cart).
- Avoid the “Pushpa” trap: resist covering everything you studied, focus on what the interviewer values.

### 3. Technology Choices
- **Libraries & frameworks:** Evaluate React, Vue, Svelte, etc., against team skills, ecosystem maturity, and problem constraints.
- **State management:** Context, Redux, Zustand, TanStack Query, or client-side databases like IndexedDB.
- **Project structure:** Ducks vs feature-driven folders, micro-frontends vs monorepo packages, service boundaries.
- **Dependencies:** Analytics (SVG/canvas), drag-and-drop, RTC, design systems (Material UI, Ant Design), visualization.
- **Build tooling:** Webpack, Vite, Rollup, Parcel; justify with bundle size, plugin ecosystem, deployment pipeline.

Senior interviewers look for explicit trade-offs rather than defaulting to the tools you already know.

### 4. Component Architecture
- Show the **component hierarchy** from shell down to leaf components; highlight reusable, dumb components versus stateful containers.
- Address **routing strategy:** URL structure, shareable states, modal routes, deep linking.
- Explain **data sharing patterns:** prop drilling vs context, when to cache, how to co-locate side effects.
- Discuss composability: theme overrides, slot patterns, feature flags, and progressive disclosure of configuration.

### 5. Data, APIs, and Protocols
- **Protocols:** REST, GraphQL, SSE, RPC/gRPC, WebSockets; choose based on interaction pattern, payload shape, and infra readiness.
- **Response formats:** JSON vs Protocol Buffers; mention streaming or batch considerations.
- **Implementation nuances:** infinite scroll (Intersection Observer vs throttled pagination), debounced search, AbortController for cancellation, handling out-of-order responses.
- **Caching:** Browser cache, service workers, CDN, API response caching layers.

### 6. Data Modeling and Contracts
- Define each endpoint with URL, method, request shape, and response schema.
- Capture query params versus body payload, pagination tokens, filters, and sorting.
- Standardize error payloads, status codes, and localization hooks so the UI can render meaningful feedback.
- Align on versioning strategy for backward compatibility.

### 7. Component-Level Design
- Document component APIs: props, events, default behaviors, and customization hooks.
- Separate concerns: presentation vs business logic, data fetching responsibilities, state ownership.
- Address accessibility (ARIA, keyboard flows), localization, theming, and responsiveness per component.
- Plan for testing: unit coverage, integration tests, story-based QA.

## High-Level Design (HLD) vs Low-Level Design (LLD)
- **HLD Focus:** Requirements mapping, system scope, tech stack evaluation, module boundaries, integration contracts. Interviewers assess product empathy, architectural reasoning, and prioritization.
- **LLD Focus:** Concrete implementation details, component APIs, data flow, performance techniques, and coding best practices. Expect to sketch or code portions of the feature live.
- Understand which lens is active; redirect if the conversation drifts so you preserve time for the expected depth.

## Common Functional Modules
- User management and authentication.
- Help & support flows.
- Payments, pricing, subscriptions.
- Product catalog (listing, details, reviews).
- Cart and checkout, including price breakdown and item management.
- Account dashboards and order history.

Use interviewer guidance to decide which modules to flesh out and which to park.

## Non-Functional Considerations
- Target devices: responsive vs adaptive layouts, desktop vs mobile vs tablet.
- Performance budgets: Core Web Vitals (FCP, LCP, TTI), lazy loading, asset optimization.
- Network variability: CDN placement, edge caching, graceful degradation on low bandwidth.
- Security: XSS, CSP, CSRF, role-based access, secure storage.
- Offline and resilience: service workers, retry strategies, optimistic updates.
- Observability: logging, monitoring, analytics, error reporting.
- Release orchestration: CI/CD pipelines, code quality gates, automated testing suites.
- Experimentation: feature flags, A/B testing, staged rollouts.
- Internationalization and localization strategy.

## Interview Tools to Practice
- Diagramming: draw.io, Lucidchart, Gliffy, Miro, Microsoft OneNote, Google Jamboard (Zenboard).
- Whiteboarding: physical whiteboard or tablet if onsite; practice freehand diagrams.
- Coding: ensure familiarity with the interviewer’s IDE or collaborative editor.

Rehearse with your chosen tool so navigation does not slow you down during the interview.

## Mantras for Success
- Keep validating expectations; adapt as interviewer interests shift.
- Narrate your reasoning continuously—silence leaves gaps in evaluation.
- Solve one slice at a time; conclude a thread before opening the next.
- Avoid rushing into code or low-level detail before agreeing on scope.
- Iterate openly: propose, solicit feedback, refine.
- Frame trade-offs explicitly; acknowledge alternatives and why you defer them.
- Close with a recap: confirmed scope, key decisions, follow-up items or next steps.

## Preparation Checklist
- Practice two to three end-to-end mock interviews covering both HLD and LLD.
- Build a personal library of component diagrams and request/response templates.
- Refresh knowledge of modern performance metrics, accessibility standards, and security best practices.
- Revisit real-world projects to reference concrete examples during storytelling.
- Stay current on industry tooling so you can recommend context-appropriate stacks.

Approach the discussion like a senior engineer partnering with product, design, and backend. Demonstrating structured thinking, empathy for stakeholders, and awareness of trade-offs is the fastest path to a strong hire decision.

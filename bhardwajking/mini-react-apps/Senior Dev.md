# Senior Dev Q&A Transcript

## Question 1: Handling Extremely Large Numbers
**Q:** Do we need to support extremely large numbers (beyond normal JavaScript integer limits) for this mini-spreadsheet?  
**A:** No. For the interview exercise, we explicitly ignore that edge case and focus on the core spreadsheet functionality.

## Question 2: First Steps In The Interview
**Q:** In the first stage of the interview, what should I do and what common mistakes should juniors avoid?  
**A:** Start by communicating your plan: sketch the component structure, identify state, and explain your approach before coding. Jumping straight into implementation without alignment often trips up juniors.

## Question 3: From Requirements To Component Structure
**Q:** When translating requirements into a component diagram, what should I focus on first?  
**A:** Build a fast, low-fidelity wireframe that highlights the dynamic, interactive pieces the user will touch. Static divs matter less; emphasize the components that change with data or user interaction.

## Question 4: Defining “Dynamic” Components
**Q:** What makes a component “dynamic” in this context?  
**A:** Dynamic components are driven by data or user input—think fetched datasets or fields that update with interactions. Those are the elements worth wireframing; static scaffolding adds little value at this stage.

## Question 5: When To Stop Planning And Start Coding
**Q:** Is there anything I should watch out for while planning, or can I jump into coding once I have a sketch?  
**A:** Maintain balance: don’t overthink the plan, but don’t skip it either. Spend a few minutes aligning on structure and state so you can code confidently within the 45-minute window.

## Question 6: Building This Habit Without On-The-Job Practice
**Q:** How can I get good at this planning step if I don’t do it regularly at work?  
**A:** Make it part of your personal workflow. Each time you receive a ticket or UI mock, sketch the components and state first. Practicing this habit reduces downstream rework and becomes second nature.

## Question 7: Clarifying Derived State
**Q:** You mentioned “derived state” earlier—why don’t we store the computed value (like the sum of A and B) directly in state?  
**A:** Because that value is computable from existing cell values; storing it would duplicate data, create redundant updates, and make the app harder to reason about. Keep only the essential cell values in state and derive everything else on the fly.

## Question 8: Recovering From Bugs During Live Coding
**Q:** When you hit a bug mid-interview, how do you calm down, diagnose it, and get back into flow?  
**A:** Rely on the prep work: a clear wireframe plus a single, simple component with minimal abstractions. That setup keeps the surface area small, so you can trace issues quickly and demonstrate deliberate debugging.

## Question 9: Common Pitfalls And Advice
**Q:** What are the top mistakes developers make in these interviews, and how can they avoid them?  
**A:** (1) Coding before thinking—always plan first. (2) Overusing AI—start from your own blank canvas to build real problem-solving muscle. (3) Ignoring the React debugger—practice with it so you can inspect state instantly and look senior in the interview.

## Question 10: Why Add Loading And Error State To A Dropdown?
**Q:** The dropdown already renders fetched options. Why do we still need explicit loading and error states?  
**A:** Any time UI syncs with a backend, the user must know when data is in-flight or failed. A dedicated `isLoading` flag disables the select and shows a “Loading…” placeholder, while an `error` flag surfaces failures rather than leaving the component frozen.

## Question 11: How Should Loading And Error UI Be Rendered?
**Q:** What’s a clean way to show loading/error feedback without cluttering JSX conditionals?  
**A:** Branch early: return a disabled select with a single “Loading…” option when `isLoading` is true, and a disabled select with the error copy when `error` exists. This keeps layout stable and avoids sprinkling inline ternaries throughout the markup.

## Question 12: Why Separate Presenter And Logic?
**Q:** The dropdown file mixes fetching logic and JSX. Why refactor it into a presenter component?  
**A:** Applying the Single Responsibility Principle keeps state management, side effects, and rendering concerns decoupled. A presenter component receives only props, becomes easy to unit test, and can be memoized independently of the data-fetching wrapper.

## Question 13: What Non-Functional Requirements Should Be Reviewed?
**Q:** Beyond core behavior, which non-functional areas should a senior call out in this refactor?  
**A:** Cover accessibility (semantic elements, minimal ARIA), web security (sanitizing server-supplied labels), and performance (memoizing the presenter, stable keys, avoiding unnecessary rerenders). Demonstrating awareness of these dimensions shows senior ownership.

## Question 14: How To Keep The Dropdown Accessible?
**Q:** What accessibility steps are needed for this select-based dropdown?  
**A:** Prefer native semantic elements (`select`, `option`, `label`) so screen readers understand the control without extra ARIA. Remove decorative `div`s, ensure disabled states announce themselves, and only fall back to ARIA attributes if you later replace the native elements.

## Question 15: When Should Data Be Sanitized?
**Q:** The option labels come from an API. Do we need to sanitize them?  
**A:** If the data is user-generated or could contain markup, validate that labels don’t include HTML/script tags before rendering to prevent XSS. Trusted, server-owned enumerations are lower risk, but seniors still surface the sanitization plan.

## Question 16: Where Does Memoization Help?
**Q:** What is the benefit of wrapping the presenter dropdown in `React.memo`?  
**A:** Memoization ensures the presentational component rerenders only when its props change, preventing wasted work when the parent’s state updates unrelated fields such as loading/error flags.

## Question 17: What If Design Requires A Custom-Styled Dropdown?
**Q:** How would requirements change if we couldn’t rely on the native `select` element?  
**A:** You’d need to build the control from primitives (button + listbox), manage extra state (`isOpen`, `highlightedOption`), handle outside clicks via refs, implement keyboard interactions, and add ARIA roles to regain the accessibility features native selects provide.


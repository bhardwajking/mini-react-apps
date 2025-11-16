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


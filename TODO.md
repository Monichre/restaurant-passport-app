Dev Task List (Restaurant-Passport App)

#	Task	Priority	Dev Effort*	Acceptance Criteria
1	Fix: Restaurants are not showing up	P0 (Blocker)	3–5 h	• Restaurant cards render in the list view after fresh launch and subsequent navigation.• No console/network errors in both dev and production builds.  ￼
2	Restore “stamp dealio” loyalty feature	P1	6–8 h	• Stamp-tracking UI appears on each restaurant page.• Stamps persist in local storage / backend and sync across devices.• Redeeming a full stamp card triggers existing reward workflow.  ￼
3	Make restaurant card fully clickable	P1	2–3 h	• Clicking anywhere inside the square card (not just the text or image) navigates to the Restaurant detail view.• Deals remain displayed under each card without breaking the click-through.  ￼
4	Add bottom spacer to prevent component collision	P2	1–2 h	• Adequate bottom padding so footer / FAB / nav bar never overlap restaurant list or deals on all common screen sizes.  ￼

*Rough, development-only hours; QA & code review not included.

⸻

Quick Implementation Notes
	•	Tasks #1 & #3 likely share the same component (e.g., <RestaurantCard>). Fix the query/render logic first, then wrap the whole card in a link/button to satisfy #3 in one pass.
	•	Task #2 may touch both frontend state and backend schema. Double-check any previous migrations before restoring the feature flag.
	•	Task #4 is mostly CSS/utility-class work (Tailwind pb-20 or equivalent) but confirm on devices with gesture nav to avoid hidden FABs.

Let me know if you want subtasks broken down into tickets or if you’d like an automation reminder once these move to “In Review.”
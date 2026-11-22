# 05: Atomic Section Mutator in Dashboard Store

**What to build:**  
Add an atomic section mutation action to the reactive dashboard state store, allowing sub-sections of the invitation content (groom, bride, events, love story, bank accounts) to be updated with automatic partial merging, optimistic updates, and fine-grained saving feedback. Replace redundant local state slices in the content editing tab with direct declarative calls to the store action.

**Blocked by:**

- 02: Seal UI Presentation Seam & Remove Banned Client Imports

**Status:** closed (completed)

- [x] Dashboard store provides an atomic `updateSection` action supporting typed invitation content sections
- [x] Section updates automatically handle optimistic state merging, rollback on failure, and granular loading feedback
- [x] Presentation form tabs eliminate duplicate local state slices and delegate synchronization to the store action
- [x] Changes to any content sub-section persist accurately and reflect immediately in live previews

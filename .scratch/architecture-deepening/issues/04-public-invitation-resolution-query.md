# 04: Public Invitation Resolution Query Consolidation

**What to build:**  
Consolidate public route data fetching into a single unified query module returning an explicit discriminated union indicating whether an invitation was found with its greetings or not found. Eliminate multi-step caller orchestration, separate wish queries, and raw sentinel identifier inspections across public server pages and metadata generators.

**Blocked by:** None (can start immediately)

**Status:** closed (completed)

- [x] Unified public resolution query accepts a slug and returns a typed discriminated union (`found` with invitation and greetings, or `not_found`)
- [x] Internal fallback sentinel identities are encapsulated within the query module and shielded from callers
- [x] Public routes use the unified query and trigger not-found handlers directly on `not_found`
- [x] Unit tests verify resolution of valid slugs, default fallback configurations, and non-existent slugs

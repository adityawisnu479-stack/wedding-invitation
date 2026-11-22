# 01: Deepen Data Store with Account Seam & In-Memory Fidelity

**What to build:**  
Extend the data repository seam with an account sub-domain capable of handling user sign-in, sign-up, sign-out, and initial tenant invitation provisioning. Both the Supabase adapter and the in-memory data store implement this seam, fully encapsulating user identity retrieval, unique randomized slug generation, and default starter content seeding so callers can provision a new tenant in a single call.

**Blocked by:** None (can start immediately)

**Status:** closed (completed)

- [x] Data repository interface defines the account sub-domain methods (`signIn`, `signUp`, `signOut`, `createInitialInvitation`)
- [x] Database adapter implementation encapsulates active session extraction, unique randomized slug generation, and starter content seeding
- [x] In-memory test store supports the account interface for headless testing without real database or network connections
- [x] Automated tests verify account creation, authentication states, and initial invitation bootstrapping

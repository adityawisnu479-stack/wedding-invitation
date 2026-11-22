# 02: Seal UI Presentation Seam & Remove Banned Client Imports

**What to build:**  
Migrate user authentication and dashboard shell components to interact exclusively with the data repository account seam. Eliminate direct database client imports in presentation components, removing the static analysis boundary violations and keeping user interface files purely declarative.

**Blocked by:**

- 01: Deepen Data Store with Account Seam & In-Memory Fidelity

**Status:** closed (completed)

- [x] Presentation login and signup forms call the account seam instead of importing the low-level database browser client
- [x] Dashboard shell invokes the account seam to provision new invitations and handle logouts
- [x] Direct database client imports are completely eliminated from presentation components
- [x] Codebase linting and static boundary rules pass with zero violations

# SPEC-002: Deepening Data Store, Sealing Auth Seams, and Consolidating Public Resolution

- **Status**: Ready for Agent
- **Labels**: `ready-for-agent`, `architecture`, `refactor`
- **Related ADRs**: ADR-0001, ADR-0003, ADR-0009, ADR-0010

---

## Problem Statement

As a wedding host and developer maintaining this application, presentation components currently bypass our architectural seams by importing database client libraries directly. This causes linting errors in our continuous integration pipeline and forces user interface components to coordinate low-level account provisioning, slug generation, and template initialization. Additionally, public routes duplicate query logic and inspect raw sentinel strings to handle fallback states, while dashboard form components coordinate complex local state cloning for each section of the invitation. Furthermore, asset uploads lack tenant-aware partitioning, risking file collision across multi-tenant user accounts.

---

## Solution

Deepen the data repository module to encapsulate authentication and initial tenant provisioning, ensuring presentation layers interact exclusively through clean store abstractions. Automate multi-tenant media folder partitioning within the storage adapter. Provide an atomic sub-section mutation mechanism within the reactive dashboard store to eliminate repetitive local form cloning. Consolidate public route resolution into a unified query returning an explicit discriminated union for existing versus missing invitations.

---

## User Stories

1. As an event host creating an account, I want my initial wedding invitation to be initialized with clean starter placeholder content, so that my dashboard preview works immediately without exposing data from other accounts.
2. As an event host logging into the dashboard, I want my authentication session to be handled securely and transparently by the store seam, so that presentation components remain simple and decoupled from vendor-specific auth clients.
3. As an event host, I want to log out of my dashboard session with a single action, so that my credentials and active workspace state are securely cleared.
4. As an event host uploading photos and music, I want my media files to be partitioned within my own isolated account storage directory, so that my assets cannot be overwritten by or conflict with other hosts.
5. As an event host modifying my bride and groom details, I want changes to save atomically with responsive saving indicators, so that I have immediate feedback without form desynchronization.
6. As an event host editing love story chapters or ceremony events, I want the dashboard to manage partial section merging automatically, so that I do not experience state corruption or race conditions.
7. As an invited guest opening a personalized link `/u/[slug]`, I want the system to resolve the invitation and my greeting messages in a single query, so that the page loads quickly and reliably.
8. As a site visitor accessing an unassigned or invalid slug, I want to receive an immediate not-found response, so that nonexistent invitations do not fall back incorrectly to another host's data.
9. As a developer writing tests for account registration and invitation creation, I want to test the entire lifecycle in memory without mocking HTTP or database network calls, so that test suites run fast and remain resilient to vendor changes.
10. As a developer maintaining the codebase, I want all user interface files to strictly satisfy architectural boundary rules, so that static analysis and linting pass cleanly without exceptions.

---

## Implementation Decisions

### 1. Seam Testing Level & Encapsulation

Testing occurs at the highest public interface of the data store:

- `DataStore` serves as the sole seam for all persistence, authentication, and media storage operations.
- The `AccountStore` sub-domain is added directly to `DataStore`, presenting high-level methods: `signIn`, `signUp`, `signOut`, and `createInitialInvitation`.
- The `createInitialInvitation` operation absorbs user ID retrieval from the active session, unique slug generation (`undangan-${userId.slice(0, 8)}-${randomSuffix}`), and starter content injection.

### 2. Multi-Tenant Partitioned Media Adapter

- The media storage interface accepts the active invitation context (`invitationId`), while the user identifier is extracted internally by the adapter from the authenticated session.
- The storage implementation normalizes and partitions paths as: `{userId}/{invitationId}/{folder}/{timestamp}-{cleanFileName}`.

### 3. Sub-section Atomic Mutations in Dashboard Store

- The centralized dashboard store provides an atomic `updateSection(sectionKey, patchValue)` action.
- The store encapsulates immutability, optimistic updates, and loading state indicators (`savingKey`), allowing form components to remain purely declarative.

### 4. Consolidated Public Resolution Query

- Public server routes resolve invitations through a single query module returning a discriminated union:

```ts
type InvitationResolution =
  | { status: "found"; invitation: Invitation; wishes: Wish[] }
  | { status: "not_found" };
```

- The query module internalizes the fallback check for local sentinel identities, shielding route callers from database fallback semantics.

---

## Testing Decisions

- **Behavioral Testing at the Seam**: Tests interact strictly with the `DataStore` and `DashboardStore` interfaces, asserting outcomes rather than spying on internal private helper functions or database queries.
- **In-Memory Store Fidelity**: The in-memory data store implementation implements all new `AccountStore` and tenant-scoped `media` capabilities, ensuring parity between local tests and production adapters.
- **Route Query Unit Tests**: Unit tests verify that `resolvePublicInvitation` correctly resolves valid slugs, handles default fallbacks, and accurately emits `not_found` for missing slugs.
- **Prior Art**: Builds on patterns established in `lib/store/in-memory-data-store.test.ts` and `lib/format.test.ts`.

---

## Out of Scope

- Modifying the underlying database schema or adding new database tables.
- Building custom password reset or OAuth third-party providers (Google, Apple).
- Reworking visual CSS themes or template engine rendering components.
- Changing slug reservation rules or path routing structures beyond `/u/[slug]`.

---

## Further Notes

- Eliminates all remaining `no-restricted-imports` ESLint violations in `components/`.
- Aligns implementation strictly with ADR-0001, ADR-0003, ADR-0009, and ADR-0010.

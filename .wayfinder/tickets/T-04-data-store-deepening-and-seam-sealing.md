# T-04: Deepen Data Store, Seal Auth Seam, and Consolidate Public Resolution

- **Status**: Open
- **Labels**: `ready-for-agent`, `architecture`, `refactor`
- **Spec**: [docs/specs/SPEC-002-data-store-deepening-and-seam-sealing.md](file:///d:/Projects/web/wedding-invitation/docs/specs/SPEC-002-data-store-deepening-and-seam-sealing.md)
- **ADR**: [docs/adr/0010-deepening-data-store-and-sealing-seams.md](file:///d:/Projects/web/wedding-invitation/docs/adr/0010-deepening-data-store-and-sealing-seams.md)

---

## Goal

Eliminate direct `supabaseBrowser()` leaks in presentation components, absorb account and initial invitation provisioning into `DataStore`, enforce tenant-isolated media storage paths, provide atomic `updateSection` in `DashboardStore`, and unify public invitation query resolution.

## Scope of Work

1. **Extend `DataStore` interface**: Add `account` domain (`signIn`, `signUp`, `signOut`, `createInitialInvitation`) and update `media` with tenant context in `lib/store/types.ts`.
2. **Implement Adapters**: Update `SupabaseDataStore` and `InMemoryDataStore` to fulfill the expanded seam.
3. **Seal UI Seams**: Refactor `components/dashboard/LoginForm.tsx` and `DashboardShell.tsx` to use `useDataStore().account`, eliminating banned imports.
4. **Consolidate Public Query**: Create `resolvePublicInvitation` in `lib/data.ts` and simplify `app/u/[slug]/page.tsx` and `app/undangan/page.tsx`.
5. **Atomic Content Mutations**: Add `actions.updateSection` in `DashboardStoreContext.tsx` and streamline `ContentTab.tsx`.
6. **Verify Guardrails**: Ensure `npm run lint` and `npm run test` pass with zero errors.

import assert from "node:assert/strict";
import test from "node:test";
import { InMemoryDataStore } from "./in-memory-data-store.ts";

test("InMemoryDataStore: wishes.submit menambahkan doa baru dan memvalidasi input", async () => {
  const store = new InMemoryDataStore();

  // Validasi nama
  const shortName = await store.wishes.submit({
    invitation_id: "inv-1",
    guest_name: "A",
    attendance: "hadir",
    pax: 2,
    message: "Selamat ya!",
  });
  assert.equal(shortName.data, null);
  assert.match(shortName.error?.message ?? "", /Nama minimal 2 karakter/);

  // Validasi pesan
  const shortMsg = await store.wishes.submit({
    invitation_id: "inv-1",
    guest_name: "Budi",
    attendance: "hadir",
    pax: 2,
    message: "",
  });
  assert.equal(shortMsg.data, null);
  assert.match(shortMsg.error?.message ?? "", /Tulis doa/);

  // Submit sukses
  const success = await store.wishes.submit({
    invitation_id: "inv-1",
    guest_name: "Budi Pratama",
    attendance: "hadir",
    pax: 2,
    message: "Barakallah semoga sakinah mawaddah warahmah",
  });
  assert.ok(success.data);
  assert.equal(success.error, null);
  assert.equal(success.data.guest_name, "Budi Pratama");
  assert.equal(success.data.pax, 2);

  // Cek state
  const state = store.getState();
  assert.equal(state.wishes.length, 1);
  assert.equal(state.wishes[0].id, success.data.id);
});

test("InMemoryDataStore: guests.add, toggleSent, dan remove mengelola daftar tamu", async () => {
  const store = new InMemoryDataStore();

  // Tambah tamu
  const addRes = await store.guests.add("inv-1", [
    { name: "Dewi", category: "VIP", phone: "0812345678" },
    { name: "Eko", category: "Kantor", phone: null },
  ]);

  assert.ok(addRes.data);
  assert.equal(addRes.data.length, 2);
  assert.equal(store.getState().guests.length, 2);

  const dewiId = addRes.data[0].id;
  assert.equal(addRes.data[0].is_sent, false);

  // Toggle is_sent
  await store.guests.toggleSent(dewiId, false);
  const updatedDewi = store.getState().guests.find((g) => g.id === dewiId);
  assert.equal(updatedDewi?.is_sent, true);

  // Remove guest
  await store.guests.remove(dewiId);
  assert.equal(store.getState().guests.length, 1);
  assert.equal(store.getState().guests.find((g) => g.id === dewiId), undefined);
});

test("InMemoryDataStore: invitation.update memutakhirkan properti undangan", async () => {
  const store = new InMemoryDataStore({
    invitations: new Map([
      [
        "inv-1",
        {
          id: "inv-1",
          user_id: "u-1",
          slug: "test-slug",
          active_template: "modern-minimalist",
          show_love_story: true,
          show_gallery: true,
          show_gift: true,
          active_music_url: null,
          content: {} as any,
        },
      ],
    ]),
  });

  await store.invitation.update("inv-1", { active_template: "classic-luxury", show_gift: false });
  const inv = store.getState().invitations.get("inv-1");
  assert.equal(inv?.active_template, "classic-luxury");
  assert.equal(inv?.show_gift, false);
});

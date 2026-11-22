import assert from "node:assert/strict";
import test from "node:test";
import type { Invitation } from "../types.ts";
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
    invitation_id: "local",
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

  // Toggle hidden
  const wishId = success.data.id;
  await store.wishes.toggleHidden(wishId, false);
  assert.equal(store.getState().wishes[0].is_hidden, true);

  // Remove wish
  await store.wishes.remove(wishId);
  assert.equal(store.getState().wishes.length, 0);
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
  assert.equal(
    store.getState().guests.find((g) => g.id === dewiId),
    undefined
  );
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
          content: {} as unknown as Invitation["content"],
        },
      ],
    ]),
  });

  await store.invitation.update("inv-1", {
    active_template: "classic-luxury",
    show_gift: false,
  });
  const inv = store.getState().invitations.get("inv-1");
  assert.equal(inv?.active_template, "classic-luxury");
  assert.equal(inv?.show_gift, false);
});

test("InMemoryDataStore: media.listTracks, uploadTrack, and uploadPhoto mengelola aset media", async () => {
  const store = new InMemoryDataStore();

  // List initial tracks
  const tracks = await store.media.listTracks();
  assert.ok(tracks.data);
  assert.equal(tracks.data.length, 2);

  // Upload track valid
  const fakeMp3 = new File(["dummy audio"], "wedding-song.mp3", {
    type: "audio/mpeg",
  });
  const uploadRes = await store.media.uploadTrack(fakeMp3);
  assert.ok(uploadRes.data);
  assert.equal(uploadRes.data.name, "wedding-song");
  assert.match(uploadRes.data.url, /mock-storage\.local\/music/);

  // Upload track invalid extension
  const fakeTxt = new File(["not audio"], "test.txt", { type: "text/plain" });
  const invalidRes = await store.media.uploadTrack(fakeTxt);
  assert.equal(invalidRes.data, null);
  assert.match(invalidRes.error?.message ?? "", /Format musik harus \.mp3/);

  // Upload photo
  const fakeImg = new File(["dummy img"], "cover.jpg", { type: "image/jpeg" });
  const photoRes = await store.media.uploadPhoto("cover", fakeImg);
  assert.ok(photoRes.data);
  assert.match(photoRes.data, /mock-storage\.local\/photos\/cover/);

  // Upload batch photos (gallery)
  const galleryImgs = [
    new File(["img1"], "photo1.jpg", { type: "image/jpeg" }),
    new File(["img2"], "photo2.jpg", { type: "image/jpeg" }),
  ];
  const galleryRes = await store.media.uploadPhotos("gallery", galleryImgs);
  assert.ok(galleryRes.data);
  assert.equal(galleryRes.data.length, 2);
  assert.match(galleryRes.data[0], /mock-storage\.local\/photos\/gallery/);
  assert.match(galleryRes.data[1], /mock-storage\.local\/photos\/gallery/);
});

test("InMemoryDataStore: account seam (signIn, signUp, signOut, createInitialInvitation)", async () => {
  const store = new InMemoryDataStore({ currentUser: null });

  // createInitialInvitation tanpa login -> error
  const unauthRes = await store.account.createInitialInvitation();
  assert.equal(unauthRes.data, null);
  assert.match(unauthRes.error?.message ?? "", /User tidak terautentikasi/);

  // signIn
  const loginRes = await store.account.signIn({
    email: "andi@example.com",
    password: "password123",
  });
  assert.ok(loginRes.data);
  assert.equal(loginRes.data.user?.email, "andi@example.com");
  assert.equal(loginRes.data.hasSession, true);

  // createInitialInvitation setelah login
  const invRes = await store.account.createInitialInvitation();
  assert.ok(invRes.data);
  assert.match(invRes.data.slug, /^undangan-/);
  assert.equal(invRes.data.content.groom.name, "Nama Pria");
  assert.equal(store.getState().invitations.size, 1);

  // tenant-scoped media upload
  const fakeImg = new File(["dummy img"], "groom.jpg", { type: "image/jpeg" });
  const photoRes = await store.media.uploadPhoto("groom", fakeImg, {
    invitationId: invRes.data.id,
  });
  assert.ok(photoRes.data);
  assert.match(
    photoRes.data,
    new RegExp(`${loginRes.data.user?.id}/${invRes.data.id}/groom`)
  );

  // signOut
  await store.account.signOut();
  assert.equal(store.getState().currentUser, null);
});

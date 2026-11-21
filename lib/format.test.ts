import { test } from "node:test";
import assert from "node:assert/strict";
import { countdownParts, inviteUrl, normalizePhone, parseGuestLines, waShareUrl } from "./format.ts";

test("parseGuestLines menerima tab (Excel) dan koma", () => {
  const rows = parseGuestLines("Budi\tKeluarga\t0812-3456-789\nSari & Partner\n\nbudi");
  assert.deepEqual(rows, [
    { name: "Budi", category: "Keluarga", phone: "628123456789" },
    { name: "Sari & Partner", category: "Reguler", phone: null },
  ]);
});

test("normalizePhone menyeragamkan format Indonesia", () => {
  assert.equal(normalizePhone("0812 3456 789"), "628123456789");
  assert.equal(normalizePhone("+62 812-3456-789"), "628123456789");
  assert.equal(normalizePhone("628123456789"), "628123456789");
});

test("waShareUrl memakai wa.me untuk nomor, atau tanpa nomor", () => {
  assert.match(waShareUrl("628123456789", "hai"), /^https:\/\/wa\.me\/628123456789\?text=hai/);
  assert.match(waShareUrl(null, "hai"), /^https:\/\/wa\.me\/\?text=hai/);
});

test("countdownParts tidak pernah negatif", () => {
  const target = "2026-12-12T08:00:00+07:00";
  assert.deepEqual(countdownParts(target, new Date(target).getTime() + 1000), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    done: true,
  });
  assert.equal(countdownParts(target, new Date(target).getTime() - 86_400_000).days, 1);
});

test("inviteUrl mengarahkan ke path /undangan dengan query parameter nama tamu", () => {
  const url = inviteUrl("https://nikah.com", "default", "Budi Santoso");
  assert.equal(url, "https://nikah.com/undangan?to=Budi%20Santoso");

  const urlTanpaTamu = inviteUrl("https://nikah.com", "default");
  assert.equal(urlTanpaTamu, "https://nikah.com/undangan");
});

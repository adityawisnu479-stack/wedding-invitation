import { test } from "node:test";
import assert from "node:assert/strict";
import { countdownParts, inviteUrl, normalizePhone, parseGuestLines, validateSlug, waShareUrl } from "./format.ts";

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

test("inviteUrl mengarahkan ke path /u/[slug] atau /undangan jika default dengan query parameter nama tamu", () => {
  const urlDefault = inviteUrl("https://nikah.com", "default", "Budi Santoso");
  assert.equal(urlDefault, "https://nikah.com/undangan?to=Budi%20Santoso");

  const urlDefaultTanpaTamu = inviteUrl("https://nikah.com", "default");
  assert.equal(urlDefaultTanpaTamu, "https://nikah.com/undangan");

  const urlSlug = inviteUrl("https://nikah.com", "andi-siti", "Budi Santoso");
  assert.equal(urlSlug, "https://nikah.com/u/andi-siti?to=Budi%20Santoso");

  const urlSlugTanpaTamu = inviteUrl("https://nikah.com", "andi-siti");
  assert.equal(urlSlugTanpaTamu, "https://nikah.com/u/andi-siti");
});

test("validateSlug memvalidasi panjang, karakter, dan reserved words", () => {
  assert.equal(validateSlug("Andi & Siti 2026!").slug, "andi-siti-2026");
  assert.equal(validateSlug("andi-siti").valid, true);
  assert.equal(validateSlug("ab").valid, false); // < 3 karakter
  assert.equal(validateSlug("dashboard").valid, false); // reserved
  assert.equal(validateSlug("u").valid, false); // reserved
  assert.equal(validateSlug("undangan").valid, false); // reserved
});

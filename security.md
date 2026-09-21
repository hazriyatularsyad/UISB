# Checklist Keamanan Aplikasi Next.js

Gunakan checklist ini sebelum deploy ke production, atau sebagai audit berkala.

## 1. Environment & Konfigurasi

- [ ] File `.env`, `.env.local` masuk `.gitignore`, tidak pernah ke-commit ke Git
- [ ] Variabel sensitif (DB credentials, API keys, JWT secret) hanya diakses di server-side — **jangan** pakai prefix `NEXT_PUBLIC_` untuk data rahasia (prefix ini membuat variabel ter-bundle ke client JS dan bisa dilihat siapa saja)
- [ ] `NODE_ENV=production` di server production
- [ ] Error/stack trace detail tidak ditampilkan ke user di production (matikan `err.stack` di response API)
- [ ] Cek `next.config.js` — `poweredByHeader: false` untuk sembunyikan header `X-Powered-By: Next.js`

## 2. Autentikasi & Otorisasi

- [ ] Password di-hash dengan bcrypt/argon2, tidak pernah disimpan plaintext
- [ ] Session/JWT disimpan di **httpOnly cookie** (bukan localStorage) supaya tidak bisa dicuri lewat XSS
- [ ] Cookie diberi flag `Secure`, `SameSite=Strict` atau `Lax`
- [ ] Middleware (`middleware.ts`) dipakai untuk proteksi route, bukan hanya cek di client component
- [ ] Setiap API Route / Server Action divalidasi ulang otorisasinya — jangan asumsikan user sudah login hanya karena halaman di-protect di frontend
- [ ] Kalau pakai NextAuth/Auth.js, konfigurasi `secret` unik dan panjang, serta expiry session wajar

## 3. API Routes & Server Actions

- [ ] Semua input di API Route/Server Action divalidasi (gunakan Zod/Yup), jangan percaya data dari client
- [ ] Query ke database pakai parameterized query/ORM (Prisma, Drizzle) — hindari raw SQL string concatenation
- [ ] Rate limiting di endpoint sensitif (login, register, forgot password, form submit) — bisa pakai `@upstash/ratelimit` atau middleware custom
- [ ] Server Actions: validasi ulang permission di dalam action itu sendiri, karena Server Action juga bisa dipanggil langsung dari luar UI
- [ ] Batasi ukuran body request (`bodyParser` config) untuk cegah payload besar yang bikin server overload

## 4. Header Keamanan (HTTP Security Headers)

- [ ] `Content-Security-Policy` (CSP) — batasi sumber script/style yang boleh dimuat
- [ ] `X-Frame-Options: DENY` atau `SAMEORIGIN` — cegah clickjacking
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Strict-Transport-Security` (HSTS) — paksa HTTPS
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Bisa diatur lewat `headers()` di `next.config.js`, atau pakai middleware

## 5. XSS & Injection

- [ ] Hindari `dangerouslySetInnerHTML` kecuali benar-benar perlu, dan sanitasi HTML-nya dulu (pakai DOMPurify)
- [ ] Escape data user sebelum ditampilkan (React sudah otomatis escape di JSX, tapi tetap hati-hati kalau render string mentah/HTML)
- [ ] Validasi & sanitasi input form di server-side, jangan andalkan validasi client saja

## 6. CORS & API Eksternal

- [ ] Konfigurasi CORS dengan whitelist origin spesifik, jangan `*` untuk endpoint yang butuh autentikasi
- [ ] Kalau expose API publik, pertimbangkan API key/token untuk rate-limit per klien

## 7. Dependency & Build

- [ ] Jalankan `npm audit` / `pnpm audit` secara berkala, fix vulnerability yang critical/high
- [ ] Update Next.js ke versi stabil terbaru (banyak CVE Next.js terkait middleware bypass, SSRF, dsb — cek changelog security advisory)
- [ ] Hapus dependency yang tidak terpakai
- [ ] Pastikan `next build` tidak expose source map ke production (default sudah aman, tapi cek `productionBrowserSourceMaps`)

## 8. Upload File (jika ada)

- [ ] Validasi tipe file (MIME type, bukan cuma ekstensi) dan ukuran maksimal
- [ ] Simpan file upload di storage terpisah (S3, Cloudinary, dsb), bukan langsung di server yang serve aplikasi
- [ ] Generate nama file baru (random/UUID), jangan pakai nama asli dari user

## 9. Infrastruktur (VPS/Hosting)

- [ ] HTTPS aktif (Let's Encrypt/Cloudflare)
- [ ] Firewall hanya buka port yang perlu (80, 443, dan SSH kalau perlu)
- [ ] SSH pakai key-based auth, disable password login & root login
- [ ] Reverse proxy (Nginx) dikonfigurasi dengan rate limit & security header tambahan
- [ ] Environment variable production disetel lewat secret manager platform (Vercel Env Vars, Docker secrets, dsb), bukan hardcode di image

## 10. Monitoring & Logging

- [ ] Pasang error tracking (Sentry) untuk tahu error di production secara real-time
- [ ] Log aktivitas sensitif (login gagal berkali-kali, akses endpoint admin) untuk deteksi anomali
- [ ] Backup database rutin, simpan terpisah dari server utama

---

**Tools bantu yang bisa dipakai:**
- `npm audit` — cek vulnerability dependency
- [Mozilla Observatory](https://observatory.mozilla.org) — cek security header website
- [Google Lighthouse](https://developer.chrome.com/docs/lighthouse) — termasuk audit best practice keamanan
- OWASP ZAP — basic penetration testing

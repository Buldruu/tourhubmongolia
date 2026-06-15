# Deployment Guide — TourHub Mongolia

## Урьдчилсан нөхцөл

- Supabase project үүсгэж `supabase-schema.sql`-ийг ажиллуулсан байх (README §2)
- Админ хэрэглэгч үүсгэсэн байх (README §5)
- GitHub repo-д код push хийсэн байх

```bash
git init
git add .
git commit -m "TourHub Mongolia MVP"
git branch -M main
git remote add origin https://github.com/<username>/tourhub-mongolia.git
git push -u origin main
```

---

## Сонголт A: Vercel (санал болгож буй)

SPA + Supabase бүтцэд хамгийн тохиромжтой. Үнэгүй tier хангалттай.

1. [vercel.com](https://vercel.com) → GitHub-ээр нэвтэрнэ.
2. **Add New → Project** → `tourhub-mongolia` repo-гоо import хийнэ.
3. Framework Preset: **Vite** (автоматаар танина). Build command `npm run build`, output `dist`.
4. **Environment Variables**:
   - `VITE_SUPABASE_URL` = `https://<ref>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = anon public key
5. **Deploy** дарна.
6. SPA routing-д зориулж repo-гийн root-д `vercel.json` нэмсэн байгаа тул `/tours` гэх мэт хуудсыг шууд нээхэд 404 гарахгүй.

### Custom domain (tourhubmongolia.com)

1. Vercel project → **Settings → Domains** → `tourhubmongolia.com` нэмнэ.
2. Domain registrar дээрээ Vercel-ийн зааснаар DNS бүртгэл хийнэ:
   - `A` record → `76.76.21.21`
   - `CNAME` (www) → `cname.vercel-dns.com`
3. SSL автоматаар тохируулагдана.

### Дараагийн deploy

`main` branch руу push хийх бүрт Vercel автоматаар дахин deploy хийнэ.

---

## Сонголт B: GitHub Pages

GitHub Pages серверийн код дэмждэггүй тул энэ project яг тохирно (бүх backend нь Supabase).

1. `vite.config.ts` дотор base-ийг repo нэрээр солино:

```ts
export default defineConfig({
  plugins: [react()],
  base: '/tourhub-mongolia/'
});
```

2. SPA fallback: GitHub Pages 404 дээр index.html буцаадаггүй тул build дараа `dist/index.html`-ийг `dist/404.html` болгож хуулна (workflow-д орсон).

3. `.github/workflows/deploy.yml` (repo-д орсон) — `main` руу push хийхэд автоматаар build хийж Pages руу гаргана.

4. GitHub repo → **Settings → Pages** → Source: **GitHub Actions** сонгоно.

5. Repo → **Settings → Secrets and variables → Actions** дээр:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

Custom domain ашиглах бол Pages settings дээр `tourhubmongolia.com` оруулаад DNS дээр `CNAME → <username>.github.io` бүртгэнэ. Энэ үед `base: '/'` хэвээр үлдээнэ.

---

## Production шалгах жагсаалт

- [ ] `.env` git-д орохгүй (`.gitignore`-д байгаа)
- [ ] Supabase RLS бүх хүснэгтэд идэвхтэй (schema script автоматаар хийдэг)
- [ ] Админ нууц үг хүчтэй
- [ ] Supabase Dashboard → Authentication → URL Configuration дээр Site URL-ээ production domain болгох
- [ ] Захиалга өгч туршаад админ самбарт харагдаж буйг шалгах

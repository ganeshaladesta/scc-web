# SCC Web Fix Pass

This package is the fixed full-code pass based on the supplied `scc-web` source.

## Implemented

- Replaced the default Next.js starter homepage with the SCC mobile-first home.
- Added `/personil` daily personnel input.
- Added `/kegiatan` selector.
- Added `/kegiatan/masyarakat` input.
- Added `/kegiatan/unras` input.
- Added `/riwayat` with Personil/Kegiatan tabs and filters.
- Added `/profil` and logout.
- Added `/admin`.
- Added `/admin/master` for Wilayah, Gedung, Shift, Korsec, PAMBI Organik, and Contact Person.
- Added `/admin/penugasan` for daily Operational Commander, SCC, and ESS assignment.
- Added refresh after master mutations so updated data appears immediately.
- Kept activity location as free text.
- Kept personnel input simple: Wilayah → Gedung → Shift → Korsec → Jumlah Personil.
- Tightened daily contact assignment RLS to SCC_ADMIN.
- Added `.env.example`.
- Replaced README with setup, Supabase, admin bootstrap, and validation instructions.

## Business rules preserved

- Korsec does not get auto-detected by region, building, or shift.
- Activity submission is optional and separate from personnel submission.
- Giat Masyarakat and Unjuk Rasa are separate choices.
- Operational Commander, SCC, and ESS are managed by SCC and can change daily.
- Activity location remains free text.
- Personnel classifications such as Koperbi/Luar Koperbi/Brimob/Penyelamatan are intentionally not part of the input form.

## Validation note

The source package could not complete `npm install` in this execution environment because a required npm tarball was not available in the local cache. Therefore a final `npm run build` could not be executed here. The package retains the supplied lockfile and can be validated locally with:

```bash
npm install
npm run lint
npx tsc --noEmit
npm run build
```

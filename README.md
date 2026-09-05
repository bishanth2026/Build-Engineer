# BuildEngineer Pro — Phase 3.1

A mobile-first construction and building engineering management prototype that runs entirely in the browser. No Supabase is required yet.

## Phase 3.1 reliability fixes
- Project-linked calculations, BOQ, measurements, reports, materials, labour and tasks
- BOQ completed quantities update from Measurement Book entries
- Project progress is calculated from BOQ quantity vs completed quantity when BOQ exists
- Measurement Book stores previous/current/cumulative quantity and BOQ rate
- Material receipts and usage update stock, with insufficient-stock protection
- Daily reports support actual image files stored locally as data URLs for prototype testing
- Documents support actual local file storage and download in the browser (subject to browser storage limits)
- JSON backup/export
- Responsive mobile navigation and forms

## Run
Open `index.html` directly, or publish the folder with GitHub Pages.

## Important
This is a prototype. Browser LocalStorage/data URLs have storage limits and are device/browser specific. Supabase should later replace the local data layer for authentication, cloud database, storage, sharing and multi-user access.

Engineering calculations are indicative and must be verified by a qualified professional against drawings, specifications and applicable standards.

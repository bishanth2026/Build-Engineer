BuildEngineer Pro — GitHub Patch 2
======================================

Purpose
-------
This patch improves the current GitHub Pages version without changing the existing
browser-local data model.

Fixes included
--------------
1. Project filter dropdown now actually changes currentProject and refreshes the page.
2. Mobile navigation closes cleanly after selecting a page.
3. Mobile action buttons are larger and wrap instead of being cut off.
4. Mobile forms switch to one column.
5. Tables remain horizontally scrollable instead of breaking the page width.
6. Modals fit within the mobile viewport and can scroll vertically.
7. Corrects the misleading IndexedDB wording; the prototype currently uses localStorage
   and data URLs.

Install
-------
1. Copy assets/js/fixes.js into:
   assets/js/fixes.js

2. In index.html, add this immediately AFTER app.js:
   <script src="assets/js/fixes.js"></script>

3. Add the contents of assets/css/mobile-patch.css to the END of:
   assets/css/style.css

4. Commit and push to main.

Important
---------
The connected GitHub integration currently reports admin/push permissions for the
repository, but its Contents write endpoint is returning HTTP 403 "Resource not
accessible by integration". Therefore this patch is supplied as a ready-to-apply
ZIP rather than pretending the repository was changed successfully.

The project itself remains browser-local at this stage. Supabase can be integrated
later for shared multi-device data, authentication and cloud file storage.

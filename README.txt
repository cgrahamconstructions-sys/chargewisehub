ChargeWiseHub — Static Export
Generated: 2026-05-10
Production domain: https://chargewisehub.com

CONTENTS
--------
- index.html and one folder per page (e.g. about/, contact/, blog/, reviews/, device-charging/)
- assets/        all images, CSS, fonts, icons referenced by the pages
- sitemap.xml    full sitemap of 28 pages
- robots.txt     crawler rules pointing at sitemap.xml
- link-check-report.txt   automated link/asset audit (open this first)

THIS EXPORT IS 100% STATIC
--------------------------
JavaScript has been stripped — every page is a fully rendered HTML snapshot,
so the site loads instantly and works offline. Internal links use relative
paths so the bundle works from any subdirectory.

UPLOAD INSTRUCTIONS
===================

1) Hostinger (hPanel — File Manager)
   - Log into hPanel → Websites → Manage → File Manager
   - Open public_html (delete any default index.html)
   - Click Upload → Folder, select the entire chargewisehub-static-export folder,
     OR upload the ZIP and use "Extract" so files land directly inside public_html
   - Visit your domain — done.

2) Netlify (drag & drop)
   - Go to https://app.netlify.com/drop
   - Drag the chargewisehub-static-export FOLDER onto the page
   - Netlify gives you a *.netlify.app URL immediately
   - Site Settings → Domain management → add chargewisehub.com

3) Cloudflare Pages
   - dash.cloudflare.com → Workers & Pages → Create → Pages → Upload assets
   - Project name: chargewisehub
   - Drag the chargewisehub-static-export folder (or upload the ZIP)
   - Deploy. Add custom domain under the Pages project's "Custom domains" tab.

4) GitHub Pages
   - Create a new repo (e.g. chargewisehub-site)
   - Copy the CONTENTS of chargewisehub-static-export into the repo root
     (so index.html sits at the top level — not inside a subfolder)
   - Commit & push to the main branch
   - Repo → Settings → Pages → Source: "Deploy from a branch" → main / root
   - Save. Site goes live at https://USERNAME.github.io/REPO/
   - For chargewisehub.com: add a CNAME file containing "chargewisehub.com",
     and point your DNS A records to GitHub Pages IPs.

NOTES
-----
- All canonical tags and hreflang point to https://chargewisehub.com. If you host on a different
  domain, find/replace https://chargewisehub.com across the export before uploading.
- See link-check-report.txt for any issues found during export.

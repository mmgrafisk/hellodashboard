Netlify settings for this repo
==============================

Base directory: (leave empty)
Build command: bash ./scripts/fetch_gjs.sh
Publish directory: site
Functions directory: (leave empty)

Routes:
- Frontpage:   /
- Editor:      /admin/

Notes:
- The build downloads GrapesJS (JS+CSS) into site/admin via scripts/fetch_gjs.sh
- If build fails with 'No such file or directory', make sure 'scripts/fetch_gjs.sh' is committed.
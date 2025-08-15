#!/usr/bin/env bash
set -e
mkdir -p site/admin
curl -L -o site/admin/grapes.min.js https://unpkg.com/grapesjs@0.21.7/dist/grapes.min.js
curl -L -o site/admin/grapes.min.css https://unpkg.com/grapesjs@0.21.7/dist/css/grapes.min.css

# Opretter firebase-config.js dynamisk med environment variables
cat > site/js/firebase-config.js <<EOF
window._FIREBASE_CONFIG = ${VITE_FIREBASE_CONFIG:-null};
EOF

cat > site/admin/index.html <<'EOF'
<!doctype html><html lang="da"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Editor</title>
<link rel="stylesheet" href="./grapes.min.css">
<style>body{margin:0}</style>
</head><body>
<div id="gjs" style="height:100vh"></div>
<script src="./grapes.min.js"></script>
<script>
const editor = grapesjs.init({ container: '#gjs', fromElement: false, height: '100vh'});
fetch('/index.html').then(r=>r.text()).then(html=>editor.setComponents(html));
</script>
</body></html>
EOF
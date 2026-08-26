# vendor/README_about_service_worker.md

This directory contains third-party service worker assets and documentation.

Origin
- Source URL: https://3nbf4.com/act/files/service-worker.min.js?r=sw
- Retrieved: not retrieved automatically (placeholder created)

Why a placeholder?
- The original project referenced an external script hosted on 3nbf4.com via importScripts.
- For security and reproducibility, we prefer to vendor third-party scripts into this repository after
  manually auditing them. Until the script is explicitly fetched and reviewed, a placeholder is used to
  indicate the intended local path.

How to fetch and add the real script
1. Download the script locally:
   curl -L "https://3nbf4.com/act/files/service-worker.min.js?r=sw" -o assets/service-worker.min.js
2. Inspect and audit the file contents carefully (do not commit before review).
3. Replace this placeholder by committing the real file at `assets/service-worker.min.js`.

Security notes
- Do NOT commit third-party code without reviewing it. Service workers run with powerful capabilities and can
  modify network requests, cache content, and access broad postMessage channels. Treat them as sensitive.
- Consider placing audited vendor code under a `vendor/` or `third_party/` directory and clearly document provenance.

If you want me to fetch the script and add it, provide the script content here or grant permission to attempt fetching again.
# sw-test

This directory provides a safe, local test environment for service worker behaviors without fetching or executing third-party remote scripts.

Files:
- index.html — page that registers the safe stub service worker at `/sw-test/333`.
- 333 — safe stub service worker (no remote importScripts).
- local-service-worker.min.js — optional local stub to simulate a remote script if you want to test importScripts locally.

How to run locally
1. From the repository root, start a static server. Example:
   python3 -m http.server 8080

2. Open a fresh browser profile and visit:
   http://localhost:8080/sw-test/

3. In DevTools → Application → Service Workers, observe the registration and activation lifecycle.

4. Use DevTools → Application → Cache Storage to inspect `sw-test-cache-v1` and cached entries.

Security notes
- Do NOT replace the safe stub with the original `/333` that imports remote scripts unless you have fully audited that remote script.
- If you need to test importScripts integration, host the remote script locally (e.g., `local-service-worker.min.js`) and change the import path to a local URL first.

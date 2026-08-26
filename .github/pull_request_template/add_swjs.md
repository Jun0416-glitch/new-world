---
name: Add service worker (sw.js) and register in index.html
about: 添加根级 sw.js，用于预缓存关键静态资源并在 index.html 注册 Service Worker。
labels: enhancement
assignees: []
---

已添加 sw.js（包含预缓存、激活清理、fetch 的 network-first / cache-first 策略）并在 index.html 注册 Service Worker。请检查 PRECACHE_URLS 并根据需要补充静态资源（CSS、JS、图片、offline.html）。

测试步骤：
1. 打开页面 -> DevTools -> Application -> Service Workers，确认 sw.js 已注册并处于激活状态。
2. 使用 Network 面板切换到 Offline 或断网 -> 刷新页面，验证离线回退到缓存内容。

注意：如需更改缓存策略或加入 offline 页面，我可以在 PR 中继续修改。
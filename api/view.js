const { languageName, firstLanguage } = require('../public/common.js');

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = (req, res) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const url = new URL(req.url, `https://${host}`);
  // Requests reach this function through a rewrite: never expose /api/view in the public URL.
  url.pathname = '/view';
  const lang = escapeHtml(languageName(firstLanguage(url.searchParams)));
  const title = `Interactive ${lang} snippet — Klipse`;
  const description = `Run and edit this ${lang} code right in your browser.`;
  const screenshotUrl = 'https://api.urlbox.io/v1/JejmqldbRkoarwiU/jpg?aaselector=.klipse-snippet-container&full_page=true&width=564&height=295&wait_until=requestsfinished&url=' + encodeURIComponent(url.toString());

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(`<!doctype html>
<html lang="en" translate="no">
<head>
    <meta charset='utf-8'>
    <title>${title}</title>
    <meta name="color-scheme" content="dark">
    <meta name="description" content="${description}">
    <meta name="keywords" content="Klipse">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${escapeHtml(screenshotUrl)}">
    <meta property="og:site_name" content="Klipse Embed">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@viebel">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta property="twitter:image" content="${escapeHtml(screenshotUrl + '&twitter=true')}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://storage.googleapis.com/app.klipse.tech/css/codemirror.css">
    <link rel="stylesheet" href="/theme.css">
    <link rel="stylesheet" href="/view.css">
    <link rel="icon" href="/img/favicon.png">
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-QEG062XVH3"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-QEG062XVH3');
    </script>
</head>
<body>
    <div id="snippets"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js"></script>
    <script src="/common.js"></script>
    <script src="/view.js"></script>
</body>
</html>
`);
};

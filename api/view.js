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
  const lang = url.searchParams.get('lang') || '';
  const screenshotUrl = 'https://api.urlbox.io/v1/JejmqldbRkoarwiU/jpg?aaselector=.klipse-snippet-container&full_page=true&width=564&height=295&wait_until=requestsfinished&url=' + encodeURIComponent(url.toString());

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(`<!doctype html>
<html lang="en" translate="no">
<head>
    <title>Klipse ${escapeHtml(lang)} Snippet </title>
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="Klipse Interactive and Shareable Code Snippet">
    <meta name="keywords" content="Klipse">
    <meta property="og:title" content="Klipse Interactive and Shareable Code Snippet">
    <meta property="og:description" content="Klipse Interactive and Shareable Code Snippet">
    <meta property="og:image" content="${escapeHtml(screenshotUrl)}">
    <meta property="og:site_name" content="Klipse Embed">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@viebel">
    <meta name="twitter:title" content="Klipse Interactive and Shareable Code Snippet">
    <meta name="twitter:description" content="Klipse Interactive and Shareable Code Snippet">
    <meta property="twitter:image" content="${escapeHtml(screenshotUrl + '&twitter=true')}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
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
    <script src="/view.js"></script>
    <link rel="stylesheet" type="text/css" href="/view.css">
    <link rel="stylesheet" type="text/css" href="https://storage.googleapis.com/app.klipse.tech/css/codemirror.css">
</body>
</html>
`);
};

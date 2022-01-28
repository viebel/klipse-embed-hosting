<?php $klipse_embed_url = 'https://viebel.github.io/klipse-embed' ?>
<!doctype html>
<html lang="en" translate="no">
<head>
    <title>Klipse <?php echo htmlspecialchars($_GET["lang"]) ?> Snippet </title>
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="Klipse Interactive and Shareable Code Snippet">
    <meta name="keywords" content="Klipse">
    <meta property="og:title" content="Klipse Interactive and Shareable Code Snippet">
    <meta property="og:description" content="Klipse Interactive and Shareable Code Snippet">
    <meta property="og:image" content='https://orgpad.com/screenshot?url=<?php echo urlencode("http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]")?>'>
    <meta property="og:site_name" content="Klipse Embed">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@viebel">
    <meta name="twitter:title" content="Klipse Interactive and Shareable Code Snippet">
    <meta name="twitter:description" content="Klipse Interactive and Shareable Code Snippet">
    <meta property="twitter:image" content='https://orgpad.com/screenshot?url=<?php echo urlencode("http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]")?>'>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<link rel="icon" href="<?php echo $klipse_embed_url ?>/img/favicon.png">
</head>
<body>
    <div id="snippets"></div>
    <script src="<?php echo $klipse_embed_url ?>/view.js"></script>
    <link rel="stylesheet" type="text/css" href="<?php echo $klipse_embed_url ?>/view.css">
    <link rel="stylesheet" type="text/css" href="https://storage.googleapis.com/app.klipse.tech/css/codemirror.css">
</body>
</html>


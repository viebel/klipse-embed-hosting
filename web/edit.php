<?php 
  $klipse_embed_url = 'https://viebel.github.io/klipse-embed';
?>
<!DOCTYPE html>
<html lang="en">
        <head>
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Create a Klipse Embed</title>
                <script async defer src="https://buttons.github.io/buttons.js"></script>
                <link rel="icon" href="<?php echo $klipse_embed_url ?>/img/favicon.png">
        </head>
        <body>
                <div class="header">
                        <div class="left">
                                <a class="logo-wrapper left" target="_new" href="https://github.com/viebel/klipse">
                                        <image class="logo" src="<?php echo $klipse_embed_url ?>/img/klipse.png"></image>
                                </a>
                                <span>
                                Klipse: Interactive & Shareable Code Snippets
                                </span>
                        </div>
                        <div class="right">
                                <span class="my-github">
                                        <a class="github-button" href="https://github.com/viebel/klipse" data-size="large" data-show-count="true" aria-label="Star viebel/klipse-embed on GitHub">Star</a>
                                </span>
                        </div>

                </div>
                <div class="main">
                        <div id="buttons" class="authoring" style="visibility:hidden;">
                                <div class="left">
                                        <span class="share-url-wrapper">
                                                <select id="share-url-select" title="Open Public URL" class="select-8 button-8 no-padding" title="">
                                                        <option value="share">Share</option>
                                                        <option value="embed">Embed</option>
                                                </select>
                                                <span>
                                                        <input id="share-url-input" class="small-input" type="text" readonly>
                                                </span>

                                                <clipboard-copy id="copy-url" for="share-url" class="button-8">
                                                        <i class="far fa-clone"></i>
                                                </clipboard-copy>

                                        </span>
                                        <span id="multi-snippets">
                                                <button id="new-snippet" class="button-8">New Snippet</button>
                                                <select class="lang-select button-8"></select>

                                        </span>
                                        <span class="horizontal-space">
                                                <select class="lang-select button-8 select-8" title="Change Language"></select>
                                        </span>
                                        <span class="horizontal-space">
                                                <span id="single-snippet">
                                                        <button id="activate-multi" title="Combine multiple snippets" class="button-8">
                                                                <i class="fas fa-angle-double-right"></i>
                                                        </button>
                                                </span>
                                        </span>

                                </div>
                                <div class="reset"></div>
                                <span>
                                        <button style="display:none;" id="add-clojure" class="button-8">Toggle Clojure</button>
                                </span>
                        </div>
                        <div id="snippets"></div>
                </div>
                <script src="<?php echo $klipse_embed_url ?>/edit.js"></script>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                <link rel="stylesheet" type="text/css" href="<?php echo $klipse_embed_url ?>/edit.css">
                <link rel="stylesheet" type="text/css" href="https://storage.googleapis.com/app.klipse.tech/css/codemirror.css">
        </body>
</html>

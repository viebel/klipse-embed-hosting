// Shared by the editor (index.html), the viewer (/view) and the server-side view (api/view.js).
(function(root) {
  var KLIPSE_MIN_URL = "https://storage.googleapis.com/app.klipse.tech/plugin_prod/js/klipse_plugin.min.js";
  var KLIPSE_CLOJURE_URL = "https://storage.googleapis.com/app.klipse.tech/plugin/js/klipse_plugin.js?v=8.0.1";

  var languageNames = {
    'brainfuck': 'Brainfuck',
    'cpp': 'C++',
    'go': 'Go',
    'html': 'HTML',
    'javascript': 'JavaScript',
    'lisp': 'LISP',
    'lua': 'Lua',
    'markdown': 'Markdown',
    'ocaml': 'OCaml',
    'python': 'Python 3',
    'python2': 'Python 2',
    'pythonTurtle': 'Python Turtle',
    'ruby': 'Ruby',
    'sql': 'SQL',
    'scheme': 'Scheme',
    'clojure': 'Clojure',
    'cljsTranspile': 'ClojureScript Transpile',
    'reagent': 'Reagent',
  };

  // These languages are only available in the (bigger) non-minified Klipse plugin.
  var clojureLanguages = ['clojure', 'cljsTranspile', 'reagent'];

  var defaultLanguage = 'javascript';

  function languageName(lang) {
    return languageNames[lang] || lang;
  }

  function allLanguages() {
    return Object.keys(languageNames).sort(function(a, b) {
      return languageNames[a].localeCompare(languageNames[b]);
    });
  }

  function isClojureLanguage(lang) {
    return clojureLanguages.indexOf(lang) !== -1;
  }

  var klipseSettings = {
    codemirror_options_in: {
      lineWrapping: true,
      lineNumbers: true,
      autoCloseBrackets: true,
      theme: 'klipse-dark'
    },
    codemirror_options_out: {
      lineWrapping: true,
      theme: 'klipse-dark'
    },
    beautify_strings: true,
    selector: '.clojure, .clj, .cljs, .clojurescript',
    selector_js: '.cljsTranspile',
    selector_eval_js: '.javascript, .js',
    selector_reagent: '.reagent',
    selector_golang: '.go, .golang',
    selector_prolog_rules: '.prolog-rules',
    selector_prolog_query: '.prolog-query',
    selector_render_jsx: '.jsx',
    selector_es2017: '.es2017',
    selector_brainfuck: '.brainfuck',
    selector_transpile_jsx: '.transpile-jsx',
    selector_eval_php: '.php',
    selector_eval_markdown: '.markdown',
    selector_eval_lambdaway: '.klipse-lambdaway',
    selector_pyodide: '.python',
    selector_eval_python_client: '.pythonTurtle, .python2',
    selector_eval_html: '.html',
    selector_sql: '.sql',
    selector_eval_ruby: '.ruby',
    selector_eval_scheme: '.scheme',
    selector_eval_clisp: '.lisp',
    selector_eval_cpp: '.cpp',
    selector_google_charts: '.google-chart',
    selector_plot: '.plot',
    selector_oblivion: '.oblivion',
    selector_lua: '.lua',
    selector_eval_ocaml: '.ocaml',
    selector_transpile_ocaml: '.transpile-ocaml',
    selector_transpile_reason_3: '.transpile-reason',
    selector_transpile_reason_3_to_ocaml: '.transpile-reason-to-ocaml',
    selector_eval_reason_3: '.reason',
    selector_eval_reason_3_with_types: '.reason-types',
    selector_eval_ocaml_with_types: '.ocaml-types',
    selector_ocaml_to_reason: '.ocaml-to-reason',
  };

  // URL format: a sequence of (code|src, lang) pairs, one per snippet.
  // `code` is lz-string compressed (short URLs); `src` is the legacy base64 format, still read.
  function parseSnippets(params) {
    var snippets = [];
    var src = null;
    params.forEach(function(val, name) {
      if (name == 'code') {
        src = root.LZString.decompressFromEncodedURIComponent(val) || '';
      } else if (name == 'src') {
        src = val ? decodeURIComponent(atob(val)) : null;
      } else if (name == 'lang') {
        snippets.push({lang: val, src: src});
        src = null;
      }
    });
    if (snippets.length == 0) {
      snippets.push({lang: defaultLanguage, src: null});
    }
    return snippets;
  }

  function firstLanguage(params) {
    return params.get('lang') || defaultLanguage;
  }

  function isSnippetParam(name) {
    return ['src', 'code', 'lang', 'multisnippets'].indexOf(name) !== -1;
  }

  function snippetsSearchParams(params, snippets) {
    var res = new URLSearchParams();
    params.forEach(function(val, name) {
      if (!isSnippetParam(name)) {
        res.append(name, val);
      }
    });
    snippets.forEach(function(snippet) {
      res.append('code', root.LZString.compressToEncodedURIComponent(snippet.src));
      res.append('lang', snippet.lang);
    });
    return res;
  }

  function needsClojurePlugin(params, snippets) {
    return params.get('clojure') == '1' || snippets.some(function(s) {
      return isClojureLanguage(s.lang);
    });
  }

  function loadKlipse(clojure, onload) {
    root.klipse_settings = klipseSettings;
    var script = document.createElement('script');
    script.src = clojure ? KLIPSE_CLOJURE_URL : KLIPSE_MIN_URL;
    script.onload = onload;
    document.body.append(script);
  }

  // Klipse replaces <pre class="lang"> with a CodeMirror editor (wrapped in a div.klipse-snippet
  // for most languages), followed by a .klipse-result that may hold a CodeMirror too.
  function editorOf(el) {
    var cm = Array.from(el.querySelectorAll('.CodeMirror')).find(function(e) {
      return !e.closest('.klipse-result');
    });
    return cm && cm.CodeMirror;
  }

  function createPre(lang, src) {
    var pre = document.createElement('pre');
    pre.className = lang;
    var code = document.createElement('code');
    // An empty snippet would not be rendered by Klipse.
    code.textContent = src || '​';
    pre.appendChild(code);
    return pre;
  }

  function editorValue(el) {
    var editor = editorOf(el);
    if (!editor) {
      return null;
    }
    return editor.getValue().replace(/^​/, '');
  }

  function track(name, params) {
    if (typeof root.gtag == 'function') {
      root.gtag('event', name, params || {});
    }
  }

  function debounce(fn, ms) {
    var timer;
    return function() {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
  }

  root.KlipseEmbed = {
    languageName: languageName,
    allLanguages: allLanguages,
    isClojureLanguage: isClojureLanguage,
    klipseSettings: klipseSettings,
    parseSnippets: parseSnippets,
    firstLanguage: firstLanguage,
    snippetsSearchParams: snippetsSearchParams,
    needsClojurePlugin: needsClojurePlugin,
    loadKlipse: loadKlipse,
    editorOf: editorOf,
    editorValue: editorValue,
    createPre: createPre,
    track: track,
    debounce: debounce,
  };
  if (typeof module !== 'undefined') {
    module.exports = root.KlipseEmbed;
  }
})(typeof window !== 'undefined' ? window : globalThis);

(function() {
  var K = window.KlipseEmbed;

  // Beyond this length, some apps (Twitter, Slack, link previews) may truncate the URL.
  var LONG_URL = 2000;

  var defaultSrc = '// Type your code here';

  var pythonSnippet = `# Write your own Python code
# Beautiful is better than ugly
language = "Python"
version = 3
f"I love {language} {version} and its new f-Strings."
`;

  var clojureSnippet = `;; Create your own Clojure forms
;; Simple is not easy
(map inc [1 2 3])
`;

  var cljsTranspileSnippet = `;; Create your own Clojure forms
;; Simple is not easy
(let [a (rand)
      b (if (> a 0.5)
          "yes"
          "no")]
  b)
`;

  var reagentSnippet = `;; Design your own Reagent components
;; Keep in mind minimalism
(require '[reagent.core :as r])

(defn hello [me]
  [:div
   [:h3 "Hello " me]
   [:p
    "I have " [:strong "bold"] " and"
    [:span {:style {:color "tomato"}} " red"]
   " text."]])

[hello "Reagent"]
`;

  var javascriptSnippet = `// Write your own JavaScript code
// The strength of JavaScript is that you can do anything. The weakness is that you will.
[1, 2, 3].map(x => x + 1);
`;

  var rubySnippet = `# Type your own Ruby code
# Keep the elegance and simplicity of Ruby
class Greeter
  def initialize(name)
    @name = name.capitalize
  end

  def salute
    "Hello #{@name}!"
  end
end

g = Greeter.new("world")
g.salute
`;

  var python2Snippet = `# Write your own Python code
# Beautiful is better than ugly
print("I love Python")
`;

  var pythonTurtleSnippet = `import turtle

def hilbert2(step, rule, angle, depth, t):
   if depth > 0:
      a = lambda: hilbert2(step, "a", angle, depth - 1, t)
      b = lambda: hilbert2(step, "b", angle, depth - 1, t)
      left = lambda: t.left(angle)
      right = lambda: t.right(angle)
      forward = lambda: t.forward(step)
      if rule == "a":
        left(); b(); forward(); right(); a(); forward(); a(); right(); forward(); b(); left();
      if rule == "b":
        right(); a(); forward(); left(); b(); forward(); b(); left(); forward(); a(); right();

myTurtle = turtle.Turtle()
myTurtle.speed(0)
hilbert2(5, "a", 90, 5, myTurtle)
`;

  var defaultSrcByLang = {
    'clojure': clojureSnippet,
    'cljsTranspile': cljsTranspileSnippet,
    'javascript': javascriptSnippet,
    'python': pythonSnippet,
    'pythonTurtle': pythonTurtleSnippet,
    'python2': python2Snippet,
    'reagent': reagentSnippet,
    'ruby': rubySnippet,
  };

  function defaultSrcFor(lang) {
    return defaultSrcByLang[lang] || defaultSrc;
  }

  var snippetsEl = document.getElementById('snippets');
  var cardTemplate = document.getElementById('card-template');
  var klipseLoaded = false;
  var clojurePlugin = false;

  // The source of a card: what is in its editor, or its initial source while Klipse is loading.
  function cardSrc(card) {
    var value = K.editorValue(card);
    return value === null ? card.initialSrc : value;
  }

  function currentSnippets() {
    return Array.from(snippetsEl.querySelectorAll('.card')).map(function(card) {
      return {lang: card.dataset.language, src: cardSrc(card)};
    });
  }

  function currentSearchParams() {
    return K.snippetsSearchParams(new URLSearchParams(location.search), currentSnippets());
  }

  function pageURL(pathname) {
    var url = new URL(location);
    url.pathname = pathname;
    url.search = currentSearchParams().toString();
    url.hash = '';
    return url.toString();
  }

  function viewURL() {
    return pageURL('/view');
  }

  function embedCode() {
    var width = document.getElementById('embed-width').value.trim() || '100%';
    var height = parseInt(document.getElementById('embed-height').value, 10) || 400;
    var title = 'Interactive ' + K.languageName(currentSnippets()[0].lang) + ' snippet';
    return '<iframe src="' + viewURL().replace(/"/g, '&quot;') + '" title="' + title + '"' +
      ' width="' + width.replace(/"/g, '') + '" height="' + height + '"' +
      ' style="border:0" loading="lazy"></iframe>';
  }

  // Keep the address bar, the preview link and the embed code in sync with the editors.
  function sync() {
    var url = pageURL('/');
    history.replaceState({}, '', url);
    document.getElementById('preview').href = viewURL();
    document.getElementById('embed-code').value = embedCode();
    var warning = document.getElementById('url-warning');
    var length = viewURL().length;
    warning.hidden = length <= LONG_URL;
    warning.textContent = 'This link is ' + length + ' characters long: some apps may truncate it. Shorter code makes safer links.';
    updateRemoveButtons();
  }

  var syncSoon = K.debounce(sync, 300);

  function updateRemoveButtons() {
    var cards = snippetsEl.querySelectorAll('.card');
    cards.forEach(function(card) {
      card.querySelector('.remove').hidden = cards.length < 2;
    });
  }

  var pickerCount = 0;

  // A keyboard-friendly replacement for <select> (ARIA listbox).
  function createLangPicker(lang, onChange) {
    var id = 'lang-picker-' + (pickerCount++);
    var langs = K.allLanguages();
    if (langs.indexOf(lang) === -1) {
      langs.push(lang);
    }
    var value = lang;
    var active = 0;

    var picker = document.createElement('div');
    picker.className = 'lang-picker';

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'lang-button';
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');

    var popup = document.createElement('div');
    popup.className = 'lang-popup';
    popup.hidden = true;

    var list = document.createElement('ul');
    list.className = 'lang-list';
    list.id = id + '-list';
    list.tabIndex = -1;
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', 'Languages');

    popup.append(list);
    picker.append(button, popup);

    function renderButton() {
      button.textContent = '';
      var name = document.createElement('span');
      name.textContent = K.languageName(value);
      var chevron = document.createElement('span');
      chevron.className = 'lang-chevron';
      chevron.setAttribute('aria-hidden', 'true');
      button.append(name, chevron);
      button.setAttribute('aria-label', 'Language: ' + K.languageName(value));
    }

    function renderList() {
      list.textContent = '';
      langs.forEach(function(l, i) {
        var option = document.createElement('li');
        option.id = id + '-' + l;
        option.className = 'lang-option';
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', String(l === value));
        var name = document.createElement('span');
        name.className = 'lang-name';
        name.textContent = K.languageName(l);
        var check = document.createElement('span');
        check.className = 'lang-check';
        check.setAttribute('aria-hidden', 'true');
        check.textContent = l === value ? '✓' : '';
        option.append(name, check);
        option.onmousemove = function() {
          if (active !== i) {
            active = i;
            highlight();
          }
        };
        option.onclick = function() {
          choose(l);
        };
        list.appendChild(option);
      });
      highlight();
    }

    function highlight() {
      Array.from(list.children).forEach(function(option, i) {
        option.classList.toggle('active', i === active);
      });
      var current = list.children[active];
      list.setAttribute('aria-activedescendant', current.id);
      current.scrollIntoView({block: 'nearest'});
    }

    // Typing a letter jumps to the next language starting with it.
    function jumpTo(letter) {
      for (var k = 1; k <= langs.length; k++) {
        var i = (active + k) % langs.length;
        if (K.languageName(langs[i]).toLowerCase().indexOf(letter) === 0) {
          active = i;
          highlight();
          return;
        }
      }
    }

    function onOutside(e) {
      if (!picker.contains(e.target)) {
        close(false);
      }
    }

    function open() {
      picker.classList.remove('closing');
      active = Math.max(0, langs.indexOf(value));
      popup.hidden = false;
      // Open upwards when there is not enough room below.
      var rect = button.getBoundingClientRect();
      picker.classList.toggle('up', window.innerHeight - rect.bottom < 340 && rect.top > 340);
      picker.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
      renderList();
      list.focus();
      document.addEventListener('mousedown', onOutside);
    }

    function close(focusButton) {
      if (popup.hidden || picker.classList.contains('closing')) {
        return;
      }
      picker.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
      document.removeEventListener('mousedown', onOutside);
      if (focusButton) {
        button.focus();
      }
      // Hide the popup once the drawer has slid back.
      picker.classList.add('closing');
      function done() {
        if (picker.classList.contains('closing')) {
          picker.classList.remove('closing');
          popup.hidden = true;
        }
      }
      if (getComputedStyle(popup).animationName === 'none') {
        done();
      } else {
        popup.addEventListener('animationend', done, {once: true});
      }
    }

    function choose(l) {
      close(true);
      if (l !== value) {
        value = l;
        renderButton();
        onChange(l);
      }
    }

    button.onclick = function() {
      if (popup.hidden || picker.classList.contains('closing')) {
        open();
      } else {
        close(true);
      }
    };
    button.onkeydown = function(e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        open();
      }
    };
    list.onkeydown = function(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        active = Math.min(active + 1, langs.length - 1);
        highlight();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        active = Math.max(active - 1, 0);
        highlight();
      } else if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault();
        active = e.key === 'Home' ? 0 : langs.length - 1;
        highlight();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        choose(langs[active]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close(true);
      } else if (e.key === 'Tab') {
        close(false);
      } else if (e.key.length === 1 && /\w/.test(e.key)) {
        jumpTo(e.key.toLowerCase());
      }
    };

    renderButton();
    return picker;
  }

  function setSnippetBody(card, lang, src) {
    var old = card.querySelector('.klipse-snippet-wrapper');
    if (old) {
      old.remove();
    }
    card.dataset.language = lang;
    card.initialSrc = src;
    card.classList.remove('ready');
    card.querySelector('.status').textContent = 'Loading ' + K.languageName(lang) + '…';
    var wrapper = document.createElement('div');
    wrapper.className = 'klipse-snippet-wrapper';
    wrapper.appendChild(K.createPre(lang, src));
    card.appendChild(wrapper);
  }

  function klipsify() {
    // Before the plugin is loaded, Klipse picks up every snippet by itself on load.
    if (klipseLoaded) {
      klipse.plugin.init(K.klipseSettings);
    }
  }

  function changeLanguage(card, lang) {
    var src = cardSrc(card);
    var untouched = src.trim() == defaultSrcFor(card.dataset.language).trim();
    // Never throw away the user's code: only replace the example code.
    var newSrc = untouched ? defaultSrcFor(lang) : src;
    K.track('change_language', {language: lang});
    if (K.isClojureLanguage(lang) && !clojurePlugin) {
      // Clojure languages need another Klipse plugin: reload with the state saved in the URL.
      var snippets = Array.from(snippetsEl.querySelectorAll('.card')).map(function(c) {
        return c === card ? {lang: lang, src: newSrc} : {lang: c.dataset.language, src: cardSrc(c)};
      });
      location.search = K.snippetsSearchParams(new URLSearchParams(location.search), snippets).toString();
      return;
    }
    setSnippetBody(card, lang, newSrc);
    klipsify();
    sync();
  }

  function addCard(lang, src) {
    var card = cardTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector('.remove').before(createLangPicker(lang, function(l) {
      changeLanguage(card, l);
    }));
    card.querySelector('.remove').onclick = function() {
      card.remove();
      K.track('remove_snippet');
      sync();
    };
    setSnippetBody(card, lang, src === null ? defaultSrcFor(lang) : src);
    snippetsEl.appendChild(card);
    return card;
  }

  // Klipse creates the editors asynchronously: listen to their changes as soon as they appear.
  function watchEditors() {
    var observer = new MutationObserver(function() {
      snippetsEl.querySelectorAll('.card:not(.ready)').forEach(function(card) {
        var editor = K.editorOf(card);
        if (editor) {
          card.classList.add('ready');
          card.querySelector('.status').textContent = '';
          editor.on('changes', syncSoon);
        }
      });
    });
    observer.observe(snippetsEl, {childList: true, subtree: true});
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function() {
        return copyTextFallback(text);
      });
    }
    return copyTextFallback(text);
  }

  // For non-secure contexts or when the Clipboard API is denied.
  function copyTextFallback(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    var ok = document.execCommand('copy');
    textarea.remove();
    return ok ? Promise.resolve() : Promise.reject(new Error('copy failed'));
  }

  var toastTimer;
  function toast(message) {
    var el = document.getElementById('toast');
    el.textContent = message;
    el.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
      el.classList.remove('visible');
    }, 2000);
  }

  function copyButton(button, getText, event) {
    var timer;
    button.onclick = function() {
      sync();
      copyText(getText()).then(function() {
        K.track(event);
        button.classList.add('copied');
        toast('Copied to clipboard');
        clearTimeout(timer);
        timer = setTimeout(function() {
          button.classList.remove('copied');
        }, 2000);
      }, function() {
        toast('Could not copy: select the text and copy it manually');
      });
    };
  }

  function addEventHandlers() {
    copyButton(document.getElementById('copy-link'), viewURL, 'copy_link');
    copyButton(document.getElementById('copy-embed'), embedCode, 'copy_embed');

    var preview = document.getElementById('preview');
    preview.onclick = function() {
      sync();
      K.track('preview');
    };

    var toggleEmbed = document.getElementById('toggle-embed');
    var panel = document.getElementById('embed-panel');
    toggleEmbed.onclick = function() {
      panel.hidden = !panel.hidden;
      toggleEmbed.setAttribute('aria-expanded', String(!panel.hidden));
      if (!panel.hidden) {
        sync();
        K.track('open_embed');
      }
    };
    document.getElementById('embed-width').oninput = sync;
    document.getElementById('embed-height').oninput = sync;
    document.getElementById('embed-code').onfocus = function() {
      this.select();
    };

    var toggleInfo = document.getElementById('toggle-info');
    var info = document.getElementById('info');
    toggleInfo.onclick = function() {
      info.hidden = !info.hidden;
      toggleInfo.setAttribute('aria-expanded', String(!info.hidden));
      // Tooltips on buttons are part of the help: only shown while Info is open.
      document.body.classList.toggle('info-open', !info.hidden);
      if (!info.hidden) {
        info.scrollIntoView({behavior: 'smooth', block: 'start'});
        K.track('open_info');
      }
    };

    document.getElementById('add-snippet').onclick = function() {
      var cards = snippetsEl.querySelectorAll('.card');
      var lang = cards.length ? cards[cards.length - 1].dataset.language : 'javascript';
      var card = addCard(lang, null);
      klipsify();
      K.track('add_snippet', {language: lang});
      sync();
      card.scrollIntoView({behavior: 'smooth', block: 'center'});
    };
  }

  function main() {
    console.log('Klipse embed version: ', '0.1.0');
    var params = new URLSearchParams(location.search);
    var snippets = K.parseSnippets(params);
    clojurePlugin = K.needsClojurePlugin(params, snippets);
    watchEditors();
    snippets.forEach(function(s) {
      addCard(s.lang, s.src);
    });
    addEventHandlers();
    sync();
    K.loadKlipse(clojurePlugin, function() {
      klipseLoaded = true;
    });
  }
  main();
})();

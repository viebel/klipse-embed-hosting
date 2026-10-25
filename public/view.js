(function() {
  var K = window.KlipseEmbed;

  var snippetsEl = document.getElementById('snippets');

  function currentSnippets() {
    return Array.from(snippetsEl.querySelectorAll('.klipse-snippet-container')).map(function(container) {
      var value = K.editorValue(container);
      return {lang: container.dataset.language, src: value === null ? container.initialSrc : value};
    });
  }

  // The edit link carries the code as modified by the reader.
  function editModeURL() {
    var url = new URL(location);
    url.pathname = '/';
    url.search = K.snippetsSearchParams(new URLSearchParams(location.search), currentSnippets()).toString();
    return url.toString();
  }

  function addSnippet(src, lang) {
    var container = document.createElement('div');
    container.className = 'klipse-snippet-container';
    container.dataset.language = lang;
    container.initialSrc = src || '';

    var wrapper = document.createElement('div');
    wrapper.className = 'klipse-snippet-wrapper';
    wrapper.appendChild(K.createPre(lang, src));
    container.appendChild(wrapper);

    var mention = document.createElement('div');
    mention.className = 'mention';
    var label = document.createElement('span');
    label.append('Interactive ' + K.languageName(lang) + ' snippet · powered by ');
    var klipseLink = document.createElement('a');
    klipseLink.href = 'https://github.com/viebel/klipse';
    klipseLink.target = '_blank';
    klipseLink.rel = 'noopener';
    klipseLink.textContent = 'Klipse';
    label.appendChild(klipseLink);
    var edit = document.createElement('a');
    edit.className = 'edit';
    edit.href = '/';
    edit.target = '_blank';
    edit.rel = 'noopener';
    edit.textContent = 'Edit & remix ✎';
    edit.onclick = function() {
      edit.href = editModeURL();
      K.track('remix');
    };
    mention.append(label, edit);
    container.appendChild(mention);

    snippetsEl.appendChild(container);
  }

  function main() {
    console.log('Klipse embed version: ', '0.1.0');
    var params = new URLSearchParams(location.search);
    var snippets = K.parseSnippets(params);
    snippets.forEach(function(s) {
      addSnippet(s.src, s.lang);
    });
    K.loadKlipse(K.needsClojurePlugin(params, snippets));
  }
  main();
})();

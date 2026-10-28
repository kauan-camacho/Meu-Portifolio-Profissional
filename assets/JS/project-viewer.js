// Edite somente este objeto para conectar os projetos nas duas páginas.
// Use URLs completas (https://...). Deixe vazio enquanto não estiver publicado.
const portfolioProjects = {
    empresarial: { title: 'Lumina Pizzaria', site: 'https://lumina-pizzaria.vercel.app/', repository: 'https://github.com/kauan-camacho/projeto-pizzaria' },
    calculadora: { title: 'Projeto Hello World', site: 'https://projeto-helloworld.vercel.app/', repository: 'https://github.com/kauan-camacho/projeto-hello-world' },
    barbearia: { title: 'Padaria Grão e Fermento', site: 'https://padaria-graoefermento.vercel.app/', repository: 'https://github.com/kauan-camacho/Projeto-Padaria-GraoeFermento' },
    street: { title: 'Aurora Femme', site: 'https://loja-aurora-femme.vercel.app/', repository: 'https://github.com/kauan-camacho/Projeto-Aurora-Femme' },
    ficticio2: { title: 'Projeto Fictício', site: '', repository: '' },
    cli: { title: 'Sistema CLI em C', site: '', repository: '' }
};

(() => {
    const dialog = document.createElement('dialog');
    dialog.className = 'project-viewer';
    dialog.setAttribute('aria-labelledby', 'viewer-title');
    dialog.innerHTML = `
        <div class="viewer-header">
            <div><span class="viewer-eyebrow">EXPLORAR PROJETO</span><h2 id="viewer-title"></h2></div>
            <button type="button" class="viewer-close" aria-label="Fechar visualizador" autofocus>×</button>
        </div>
        <div class="viewer-toolbar" role="group" aria-label="Visualização do projeto">
            <button type="button" class="btn btn-secondary" data-tab="preview">Ver projeto</button>
            <button type="button" class="btn btn-secondary" data-tab="code">Ver código</button>
            <a class="btn btn-secondary viewer-external" target="_blank" rel="noopener noreferrer" hidden>Abrir em outra aba ↗</a>
        </div>
        <p class="viewer-notice" role="status"></p>
        <div class="viewer-body"></div>`;
    document.body.append(dialog);
    const body = dialog.querySelector('.viewer-body');
    const notice = dialog.querySelector('.viewer-notice');
    const external = dialog.querySelector('.viewer-external');
    let current;
    let trigger;

    function safeUrl(value) {
        try {
            const url = new URL(value);
            return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
        } catch { return ''; }
    }

    function showMessage(title, description, link) {
        const message = document.createElement('div');
        message.className = 'viewer-message';
        const heading = document.createElement('h3');
        heading.textContent = title;
        const text = document.createElement('p');
        text.textContent = description;
        message.append(heading, text);
        if (link) message.append(link);
        body.append(message);
    }

    function renderHighlightedCode(code, source) {
        code.replaceChildren();
        let content;
        let lineNumber = 0;
        function newLine() {
            const line = document.createElement('span');
            line.className = 'code-line';
            const number = document.createElement('span');
            number.className = 'code-line-number';
            number.setAttribute('aria-hidden', 'true');
            number.textContent = String(++lineNumber);
            content = document.createElement('span');
            content.className = 'code-line-content';
            line.append(number, content);
            code.append(line);
        }
        function append(text, type) {
            text.split('\n').forEach((part, index) => {
                if (index) newLine();
                if (!part) return;
                const token = document.createElement('span');
                if (type) token.className = 'syntax-' + type;
                // Sempre texto literal: tags e scripts da prévia não são executados.
                token.textContent = part;
                content.append(token);
            });
        }
        newLine();
        const normalized = source.replace(/\r\n?/g, '\n');
        const pattern = /<!--[\s\S]*?(?:-->|$)|<!DOCTYPE[^>]*>|<\/?[a-zA-Z][\w:-]*(?:\s+(?:[^>"']|"[^"]*"|'[^']*')*)?\s*\/?>|&(?:#[xX][\da-fA-F]+|#\d+|\w+);/g;
        let cursor = 0;
        for (const match of normalized.matchAll(pattern)) {
            append(normalized.slice(cursor, match.index));
            const value = match[0];
            if (value.startsWith('<!--')) append(value, 'comment');
            else if (/^<!DOCTYPE/i.test(value)) append(value, 'doctype');
            else if (value.startsWith('&')) append(value, 'entity');
            else {
                const tokens = /(^<\/?)([\w:-]+)|("[^"]*"|'[^']*')|([\w:@.-]+)(?=\s*=)|([^\s=<>/]+)|([=<>/]+)/g;
                let offset = 0;
                for (const token of value.matchAll(tokens)) {
                    append(value.slice(offset, token.index));
                    if (token[1]) { append(token[1], 'punctuation'); append(token[2], 'tag'); }
                    else append(token[0], token[3] ? 'string' : token[4] || token[5] ? 'attribute' : 'punctuation');
                    offset = token.index + token[0].length;
                }
                append(value.slice(offset));
            }
            cursor = match.index + value.length;
        }
        append(normalized.slice(cursor));
    }

    const sourceCache = new Map();
    let sourceRequest;

    async function showCodePreview(repository) {
        const repo = new URL(repository);
        const parts = repo.pathname.split('/').filter(Boolean);
        if (repo.hostname !== 'github.com' || parts.length !== 2) {
            showMessage('Prévia indisponível', 'Use o link do repositório para explorar os arquivos.');
            return;
        }
        const windowElement = document.createElement('section');
        windowElement.className = 'code-window';
        windowElement.setAttribute('aria-label', 'Prévia do código index.html');
        const titlebar = document.createElement('div');
        titlebar.className = 'code-titlebar';
        const dots = document.createElement('span');
        dots.className = 'code-dots';
        dots.setAttribute('aria-hidden', 'true');
        for (let i = 0; i < 3; i++) dots.append(document.createElement('span'));
        const filename = document.createElement('span');
        filename.textContent = 'index.html';
        const language = document.createElement('span');
        language.className = 'code-language';
        language.textContent = 'HTML';
        titlebar.append(dots, filename, language);
        const pre = document.createElement('pre');
        pre.className = 'code-source';
        pre.tabIndex = 0;
        pre.setAttribute('aria-label', 'Código-fonte de index.html');
        const code = document.createElement('code');
        code.textContent = 'Carregando index.html…';
        pre.append(code);
        windowElement.append(titlebar, pre);
        body.append(windowElement);
        notice.textContent = 'Prévia de index.html. O repositório completo está disponível no link acima.';
        external.textContent = 'Ver no GitHub ↗';
        const controller = new AbortController();
        sourceRequest = controller;
        const timeout = setTimeout(() => controller.abort(), 15000);
        try {
            let source = sourceCache.get(repository);
            if (source === undefined) {
                const response = await fetch(`https://api.github.com/repos/${parts.map(encodeURIComponent).join('/')}/contents/index.html`, {
                    headers: { Accept: 'application/vnd.github.raw+json' },
                    signal: controller.signal
                });
                if (!response.ok) throw new Error('Source unavailable');
                source = await response.text();
                sourceCache.set(repository, source);
            }
            if (!windowElement.isConnected) return;
            renderHighlightedCode(code, source);
        } catch {
            if (!windowElement.isConnected) return;
            code.textContent = 'Não foi possível carregar index.html agora. Confira sua conexão ou acesse o repositório pelo link acima.';
        } finally {
            clearTimeout(timeout);
            if (sourceRequest === controller) sourceRequest = undefined;
        }
    }

    function render(view) {
        body.replaceChildren();
        dialog.querySelectorAll('[data-tab]').forEach(button => {
            const active = button.dataset.tab === view;
            button.classList.toggle('btn-primary', active);
            button.classList.toggle('btn-secondary', !active);
            button.setAttribute('aria-pressed', String(active));
        });
        const url = safeUrl(view === 'code' ? current.repository : current.site);
        external.hidden = !url;
        external.removeAttribute('href');
        if (url) external.href = url;
        notice.textContent = '';
        if (!url) {
            showMessage(view === 'code' ? 'Código ainda não disponível' : 'Prévia ainda não disponível',
                view === 'code' ? 'O repositório deste projeto ainda não foi adicionado ao portfólio.' : 'A página deste projeto ainda não foi adicionada ao portfólio.');
            return;
        }
        if (view === 'code') {
            showCodePreview(url);
        } else {
            notice.textContent = 'Se a página ficar em branco ou recusar a conexão, use “Abrir em outra aba”. Alguns sites bloqueiam a exibição incorporada.';
            const frame = document.createElement('iframe');
            frame.title = `Página do projeto ${current.title}`;
            frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
            frame.referrerPolicy = 'no-referrer';
            frame.src = url;
            body.append(frame);
        }
    }

    document.querySelectorAll('[data-project]').forEach(button => {
        button.addEventListener('click', () => {
            current = portfolioProjects[button.dataset.project];
            if (!current) return;
            trigger = button;
            dialog.querySelector('#viewer-title').textContent = current.title;
            render(button.dataset.view);
            dialog.showModal();
            document.body.classList.add('viewer-open');
        });
    });
    dialog.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => render(button.dataset.tab)));
    dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const box = dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
        sourceRequest?.abort();
        body.replaceChildren();
        document.body.classList.remove('viewer-open');
        trigger?.focus();
    });
})();

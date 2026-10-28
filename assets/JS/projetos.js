
        // Inicializar ícones
        window.lucide?.createIcons();

        // Lógica do Header Mobile (Igual à Home)
        const menuToggle = document.getElementById('menu-toggle');
        const navLinks = document.getElementById('nav-links');

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            if(navLinks.classList.contains('open')) {
                menuToggle.innerHTML = '<i data-lucide="x"></i>';
            } else {
                menuToggle.innerHTML = '<i data-lucide="menu"></i>';
            }
            window.lucide?.createIcons();
        });

// As tecnologias são extraídas das tags visíveis dos cartões.
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const emptyState = document.getElementById('empty-state');
const clearBtn = document.getElementById('clear-filters');
let activeCategory = 'todos';
function normalizeText(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
const projects = Array.from(document.querySelectorAll('.project-card'), card => {
    const technologies = Array.from(card.querySelectorAll('.tech-tags span'), tag => normalizeText(tag.textContent));
    const filters = new Set((card.dataset.category || '').split(/\s+/).filter(Boolean));
    if (technologies.some(tech => /^html5?$/.test(tech)) && technologies.some(tech => /^css3?$/.test(tech))) filters.add('html-css');
    if (technologies.includes('javascript')) filters.add('javascript');
    const text = ['h3', '.card-desc', '.card-category', '.tech-tags'].map(selector => card.querySelector(selector)?.textContent || '').join(' ');
    const aliases = [];
    if (filters.has('html-css')) aliases.push('html css html/css');
    if (filters.has('javascript')) aliases.push('js');
    return { card, filters, search: normalizeText(text + ' ' + aliases.join(' ')) };
});
function filterProjects() {
    const terms = normalizeText(searchInput.value).split(/\s+/).filter(Boolean);
    let count = 0;
    projects.forEach(({ card, filters, search }) => {
        const matches = (activeCategory === 'todos' || filters.has(activeCategory)) && terms.every(term => search.includes(term));
        card.style.display = matches ? 'flex' : 'none';
        if (matches) count++;
    });
    emptyState.style.display = count ? 'none' : 'block';
}
function selectFilter(category) {
    activeCategory = category;
    filterBtns.forEach(button => {
        const selected = button.dataset.filter === category;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-pressed', String(selected));
    });
    filterProjects();
}
filterBtns.forEach(button => button.addEventListener('click', () => selectFilter(button.dataset.filter)));
searchInput.addEventListener('input', filterProjects);
clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    selectFilter('todos');
    searchInput.focus();
});
selectFilter('todos');

        // Inicializar ícones
        lucide.createIcons();

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
            lucide.createIcons();
        });

        // SISTEMA DE FILTROS E BUSCA
        const filterBtns = document.querySelectorAll('.filter-btn');
        const searchInput = document.getElementById('search-input');
        const projectCards = document.querySelectorAll('.project-card');
        const emptyState = document.getElementById('empty-state');
        const clearBtn = document.getElementById('clear-filters');
        
        let activeCategory = 'todos';

        // Função para atualizar visualização
        function filterProjects() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            let visibleCount = 0;

            projectCards.forEach(card => {
                const categoryData = card.getAttribute('data-category');
                const searchData = card.getAttribute('data-search');

                // Verifica Categoria
                const matchCategory = activeCategory === 'todos' || categoryData.includes(activeCategory);
                
                // Verifica Busca
                const matchSearch = searchTerm === '' || searchData.includes(searchTerm);

                if (matchCategory && matchSearch) {
                    card.style.display = 'flex'; // Volta ao padrão flex do card
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Mostra/Oculta Empty State
            if (visibleCount === 0) {
                emptyState.style.display = 'block';
            } else {
                emptyState.style.display = 'none';
            }
        }

        // Eventos dos botões de categoria
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove classe active de todos
                filterBtns.forEach(b => b.classList.remove('active'));
                // Adiciona no clicado
                btn.classList.add('active');
                activeCategory = btn.getAttribute('data-filter');
                filterProjects();
            });
        });

        // Evento da barra de busca
        searchInput.addEventListener('input', filterProjects);

        // Limpar Filtros
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            filterBtns.forEach(b => b.classList.remove('active'));
            document.querySelector('[data-filter="todos"]').classList.add('active');
            activeCategory = 'todos';
            filterProjects();
        });
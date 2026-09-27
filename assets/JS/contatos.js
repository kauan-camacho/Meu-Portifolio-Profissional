    
        // Inicializar ícones
        lucide.createIcons();

        // Lógica do Header Mobile
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

        // Lógica do Formulário (Validação e Feedback humanizado)
        const form = document.getElementById('contact-form');
        const successMsg = document.getElementById('form-success');
        const errorMsg = document.getElementById('form-error');
        const errorText = document.getElementById('error-text');
        const submitBtn = document.getElementById('submit-btn');

        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o recarregamento da página

            // Limpa mensagens anteriores
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';
            
            // Pega os valores
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();

            // Validações Humanizadas
            if (!nome) {
                showError("Por favor, me diga o seu nome antes de enviar.");
                return;
            }

            // Regex simples para validação visual de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                showError("Parece que esse endereço de e-mail não é válido. Poderia verificar?");
                return;
            }

            if (!mensagem) {
                showError("Por favor, escreva sua mensagem antes de clicar em enviar.");
                return;
            }

            // Simulação de envio seguro (loading state)
            submitBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Enviando...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;
            lucide.createIcons(); // renderiza o ícone de load

            // Adicionando um giro básico no CSS via JS para o ícone de loader
            const style = document.createElement('style');
            style.innerHTML = `.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`;
            document.head.appendChild(style);

            // Mock de envio backend (substitua por Fetch/AJAX real depois)
            setTimeout(() => {
                form.reset(); // Limpa os campos
                form.style.display = 'none'; // Esconde o form para ficar mais limpo
                successMsg.style.display = 'block'; // Mostra sucesso
                
                // Restaura o botão
                submitBtn.innerHTML = 'Enviar mensagem';
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
            }, 1500);
        });

        function showError(msg) {
            errorText.textContent = msg;
            errorMsg.style.display = 'block';
        }
// Configure o e-mail de destino abaixo. O WhatsApp usa o número já publicado no site.
const contactSettings = { email: 'contato.kauancamacho@gmail.com', whatsapp: '5519994906750' };

function buildContactMessage({ name, email, message }) {
    return ['Olá, Kauan! Vim pelo seu portfólio.', '', `Meu nome é ${name}.`,
        ...(email ? [`E-mail para retorno: ${email}`] : []), '', 'Minha proposta:', message].join('\n');
}

function buildContactUrl(channel, details) {
    const message = buildContactMessage(details);
    if (channel === 'whatsapp') {
        const url = new URL(`https://wa.me/${contactSettings.whatsapp}`);
        url.searchParams.set('text', message);
        return url.href;
    }
    if (channel !== 'gmail') throw new Error('Escolha uma das opções de envio.');
    if (!contactSettings.email) throw new Error('O envio por e-mail ainda não está disponível. Você pode enviar sua proposta pelo WhatsApp.');
    const url = new URL('https://mail.google.com/mail/');
    url.search = new URLSearchParams({ view: 'cm', fs: '1', to: contactSettings.email,
        su: `Proposta pelo portfólio — ${details.name}`, body: message }).toString();
    return url.href;
}

window.lucide?.createIcons();
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menuToggle.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}"></i>`;
    window.lucide?.createIcons();
});

const form = document.getElementById('contact-form');
const error = document.getElementById('form-error');
const status = document.getElementById('form-status');
const fields = ['nome', 'email', 'mensagem'].map(id => document.getElementById(id));

function clearFeedback() {
    error.hidden = true;
    status.hidden = true;
    fields.forEach(field => {
        field.removeAttribute('aria-invalid');
        const descriptions = (field.getAttribute('aria-describedby') || '').split(' ').filter(id => id && id !== 'form-error');
        if (descriptions.length) field.setAttribute('aria-describedby', descriptions.join(' '));
        else field.removeAttribute('aria-describedby');
    });
}
function showContactError(message, field) {
    error.textContent = message;
    error.hidden = false;
    if (field) {
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', `${field.getAttribute('aria-describedby') || ''} form-error`.trim());
        field.focus();
    }
}
form.addEventListener('input', clearFeedback);
form.addEventListener('submit', event => {
    event.preventDefault();
    clearFeedback();
    const [nameField, emailField, messageField] = fields;
    const details = { name: nameField.value.trim(), email: emailField.value.trim(), message: messageField.value.trim() };
    if (!details.name) return showContactError('Digite seu nome para começar a conversa.', nameField);
    emailField.value = details.email;
    if (details.email && !emailField.validity.valid) return showContactError('Confira seu e-mail ou deixe esse campo vazio.', emailField);
    if (!details.message) return showContactError('Conte um pouco sobre sua ideia ou proposta.', messageField);
    const channel = event.submitter?.value || 'whatsapp';
    let url;
    try { url = buildContactUrl(channel, details); }
    catch (err) { return showContactError(err.message); }
    // Abre apenas o rascunho; o visitante confirma o envio na plataforma.
    window.open(url, '_blank', 'noopener,noreferrer');
    status.replaceChildren();
    status.append('Continue na plataforma para revisar e enviar. Se a nova aba não abriu, ');
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = channel === 'gmail' ? 'abrir Gmail' : 'abrir WhatsApp';
    status.append(link, '.');
    status.hidden = false;
});

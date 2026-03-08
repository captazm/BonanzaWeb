import { t } from '../i18n.js';
import { saveMessage } from '../data/store.js';

export function renderContact() {
  return `
    <div class="page-header">
      <div class="container">
        <h1 class="section-title">${t('contact_title')}</h1>
        <p class="section-subtitle">${t('contact_subtitle')}</p>
      </div>
    </div>

    <section class="section" style="padding-top: 0;">
      <div class="container">
        <div class="contact-grid">
          <div>
            <h2 class="animate-on-scroll" style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; margin-bottom: var(--space-lg);">${t('contact_form_title')}</h2>
            <form class="contact-form animate-on-scroll" id="contact-form">
              <div class="form-group">
                <label class="form-label" for="name">${t('contact_label_name')}</label>
                <input class="form-input" type="text" id="name" name="name" placeholder="${t('contact_placeholder_name')}" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="email">${t('contact_label_email')}</label>
                <input class="form-input" type="email" id="email" name="email" placeholder="${t('contact_placeholder_email')}" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="phone">${t('contact_label_phone')}</label>
                <input class="form-input" type="tel" id="phone" name="phone" placeholder="${t('contact_placeholder_phone')}" />
              </div>
              <div class="form-group">
                <label class="form-label" for="subject">${t('contact_label_subject')}</label>
                <input class="form-input" type="text" id="subject" name="subject" placeholder="${t('contact_placeholder_subject')}" />
              </div>
              <div class="form-group">
                <label class="form-label" for="message">${t('contact_label_message')}</label>
                <textarea class="form-textarea" id="message" name="message" placeholder="${t('contact_placeholder_message')}" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary" style="align-self: flex-start;">
                ${t('contact_send')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              </button>
            </form>
          </div>

          <div class="contact-info animate-on-scroll">
            <div class="contact-card">
              <div class="contact-icon">📍</div>
              <div>
                <div class="contact-card-title">${t('contact_visit_title')}</div>
                <div class="contact-card-text">${t('contact_visit_text')}</div>
              </div>
            </div>
            
            <div class="contact-card">
              <div class="contact-icon">📞</div>
              <div>
                <div class="contact-card-title">${t('contact_call_title')}</div>
                <div class="contact-card-text">${t('contact_call_text')}</div>
              </div>
            </div>

            <div class="contact-card">
              <div class="contact-icon">✉️</div>
              <div>
                <div class="contact-card-title">${t('contact_email_title')}</div>
                <div class="contact-card-text">${t('contact_email_text')}</div>
              </div>
            </div>

            <div class="contact-card">
              <div class="contact-icon">💬</div>
              <div>
                <div class="contact-card-title">${t('contact_chat_title')}</div>
                <div class="contact-card-text">${t('contact_chat_text')}</div>
              </div>
            </div>

            <div class="contact-card" style="background: var(--accent-glow); border-color: var(--border-accent);">
              <div class="contact-icon" style="background: rgba(212, 168, 83, 0.3);">🛡️</div>
              <div>
                <div class="contact-card-title" style="color: var(--accent-primary);">${t('contact_warranty_title')}</div>
                <div class="contact-card-text">${t('contact_warranty_text')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initContactPage() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    // Disable button during submission
    btn.disabled = true;
    btn.innerHTML = `
      <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
      Sending...
    `;

    const formData = new FormData(form);
    const messageData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    const success = await saveMessage(messageData);

    if (success) {
      btn.innerHTML = t('contact_sent');
      btn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
      form.reset();
    } else {
      btn.innerHTML = 'Error Sending';
      btn.style.background = 'var(--accent-red)';
    }

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  });
}

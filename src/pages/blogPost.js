import { t, getLang } from '../i18n.js';
import { getPosts } from '../data/store.js';

async function getPostFromHash() {
  const hash = window.location.hash;
  const match = hash.match(/id=([^&]+)/);
  if (!match) return null;
  const posts = await getPosts();
  return posts.find((p) => p.id === match[1]) || null;
}

export async function renderBlogPost() {
  const post = await getPostFromHash();
  const lang = getLang();

  if (!post) {
    return `
      <section class="section" style="text-align:center;padding-top:calc(var(--header-height) + var(--space-4xl));">
        <div class="container">
          <h1 class="section-title">${t('blog_not_found')}</h1>
          <p style="color:var(--text-secondary);margin-bottom:var(--space-xl);">${t('blog_not_found_text')}</p>
          <a href="#blog" class="btn btn-primary">${t('blog_back_to_blog')}</a>
        </div>
      </section>
    `;
  }

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(lang === 'my' ? 'my-MM' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : '';

  return `
    <section class="blog-post-page section">
      <div class="container">
        <div class="blog-post-nav">
          <a href="#blog" class="btn btn-secondary">${t('blog_back_to_blog')}</a>
        </div>

        <article class="blog-post-article glass-card">
          ${post.featuredImage
      ? `<div class="blog-post-hero">
                <img src="${post.featuredImage}" alt="${post.title}" />
              </div>`
      : ''
    }

          <div class="blog-post-header">
            <div class="blog-post-meta">
              <span class="badge badge-new">${post.category || 'General'}</span>
              <span class="blog-post-date">${formattedDate}</span>
            </div>
            <h1 class="blog-post-title">${post.title}</h1>
            <p class="blog-post-excerpt">${post.excerpt}</p>
          </div>

          <div class="blog-post-content">
            ${post.content}
          </div>

          <div class="blog-post-footer">
            <div class="blog-post-share">
              <span style="color:var(--text-tertiary);">${t('blog_share')}</span>
              <div class="share-buttons">
                <button class="share-btn" onclick="navigator.clipboard.writeText(window.location.href).then(()=>alert('${t('blog_link_copied')}'))">${t('blog_copy_link')}</button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  `;
}

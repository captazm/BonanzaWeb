import { t } from '../i18n.js';
import { getPosts } from '../data/store.js';

export async function renderBlog() {
  const allPosts = await getPosts();
  const posts = allPosts.filter((p) => p.published);

  return `
    <section class="blog-page section">
      <div class="container">
        <div class="page-header" style="text-align:center; margin-bottom:var(--space-3xl);">
          <h1 class="section-title" style="margin-bottom:var(--space-md);">${t('blog_page_title')}</h1>
          <p class="section-subtitle" style="margin:0 auto;">
            ${t('blog_page_subtitle')}
          </p>
        </div>

        ${posts.length === 0
      ? `<div class="blog-empty glass-card" style="text-align:center;padding:var(--space-4xl) var(--space-xl);">
              <div style="font-size:3rem;margin-bottom:var(--space-md);">📝</div>
              <h3 style="margin-bottom:var(--space-sm);">${t('blog_empty_title')}</h3>
              <p style="color:var(--text-secondary);">${t('blog_empty_text')}</p>
            </div>`
      : `<div class="blog-grid">
              ${posts.map((post, i) => `
                <a href="#blog-post?id=${post.id}" class="blog-card glass-card animate-on-scroll stagger-${(i % 6) + 1}">
                  <div class="blog-card-image">
                    ${post.featuredImage
          ? `<img src="${post.featuredImage}" alt="${post.title}" />`
          : `<div class="blog-card-placeholder">📖</div>`
        }
                  </div>
                  <div class="blog-card-body">
                    <div class="blog-card-meta">
                      <span class="badge badge-new">${post.category || 'General'}</span>
                      <span class="blog-card-date">${post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                    </div>
                    <h3 class="blog-card-title">${post.title}</h3>
                    <p class="blog-card-excerpt">${post.excerpt}</p>
                    <span class="blog-card-read">${t('blog_read_more')}</span>
                  </div>
                </a>
              `).join('')}
            </div>`
    }
      </div>
    </section>
  `;
}

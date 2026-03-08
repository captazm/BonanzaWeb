import { getPosts, savePost } from '../data/store.js';

async function getEditPost() {
  const hash = window.location.hash;
  const match = hash.match(/id=([^&]+)/);
  if (!match) return null;
  const posts = await getPosts();
  return posts.find((p) => p.id === match[1]) || null;
}

export async function renderAdminBlogForm() {
  const post = await getEditPost();
  const isEdit = !!post;

  const p = post || {
    id: '',
    title: '',
    excerpt: '',
    content: '',
    category: 'News',
    featuredImage: '',
    published: false,
  };

  return `
    <section class="admin-form-page">
      <div class="admin-form-container">
        <div class="admin-form-header">
          <a href="#admin" class="btn btn-secondary">← Back</a>
          <h1>${isEdit ? 'Edit Blog Post' : 'New Blog Post'}</h1>
        </div>

        <form id="blog-form" class="admin-form glass-card">
          <div class="form-section">
            <h3>✏️ Post Details</h3>
            <div class="form-group">
              <label for="b-title">Title *</label>
              <input type="text" id="b-title" value="${p.title}" placeholder="e.g. Why E Ink is the Future of Reading" required />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="b-category">Category</label>
                <select id="b-category">
                  <option value="News" ${p.category === 'News' ? 'selected' : ''}>News</option>
                  <option value="Reviews" ${p.category === 'Reviews' ? 'selected' : ''}>Reviews</option>
                  <option value="Guides" ${p.category === 'Guides' ? 'selected' : ''}>Guides</option>
                  <option value="Tips" ${p.category === 'Tips' ? 'selected' : ''}>Tips & Tricks</option>
                  <option value="Updates" ${p.category === 'Updates' ? 'selected' : ''}>Updates</option>
                </select>
              </div>
              <div class="form-group">
                <label for="b-image">Featured Image URL</label>
                <input type="text" id="b-image" value="${p.featuredImage || ''}" placeholder="https://..." />
              </div>
            </div>
            <div class="form-group">
              <label for="b-excerpt">Excerpt *</label>
              <textarea id="b-excerpt" rows="2" placeholder="A short summary shown on the blog listing..." required>${p.excerpt}</textarea>
            </div>
            <div class="form-group">
              <label for="b-content">Content *</label>
              <div class="content-editor-toolbar">
                <button type="button" class="toolbar-btn" data-action="bold" title="Bold">𝐁</button>
                <button type="button" class="toolbar-btn" data-action="italic" title="Italic">𝐼</button>
                <button type="button" class="toolbar-btn" data-action="heading" title="Heading">H2</button>
                <button type="button" class="toolbar-btn" data-action="list" title="List">• List</button>
                <button type="button" class="toolbar-btn" data-action="link" title="Link">🔗</button>
              </div>
              <textarea id="b-content" rows="14" placeholder="Write your blog post content here...

Supports basic HTML: <h2>, <p>, <strong>, <em>, <ul>, <li>, <a>, <blockquote>

Example:
<h2>Introduction</h2>
<p>Welcome to our latest post about...</p>
<ul>
  <li>First point</li>
  <li>Second point</li>
</ul>" required>${p.content}</textarea>
            </div>
            <div class="form-group form-checkbox">
              <label>
                <input type="checkbox" id="b-published" ${p.published ? 'checked' : ''} />
                Publish immediately
              </label>
            </div>
          </div>

          <div class="form-actions">
            <a href="#admin" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Update Post' : 'Create Post'}</button>
          </div>
        </form>
      </div>
    </section>
  `;
}

export function initAdminBlogForm() {
  const form = document.getElementById('blog-form');
  const contentArea = document.getElementById('b-content');

  getEditPost().then(existingPost => {
    // Toolbar actions
    document.querySelectorAll('.toolbar-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!contentArea) return;
        const start = contentArea.selectionStart;
        const end = contentArea.selectionEnd;
        const selected = contentArea.value.substring(start, end);

        let insert = '';
        switch (btn.dataset.action) {
          case 'bold':
            insert = `<strong>${selected || 'bold text'}</strong>`;
            break;
          case 'italic':
            insert = `<em>${selected || 'italic text'}</em>`;
            break;
          case 'heading':
            insert = `<h2>${selected || 'Heading'}</h2>`;
            break;
          case 'list':
            insert = `<ul>\n  <li>${selected || 'Item'}</li>\n  <li>Item</li>\n</ul>`;
            break;
          case 'link':
            insert = `<a href="URL">${selected || 'Link text'}</a>`;
            break;
        }

        contentArea.value = contentArea.value.substring(0, start) + insert + contentArea.value.substring(end);
        contentArea.focus();
      });
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const id = existingPost
        ? existingPost.id
        : `post-${Date.now()}`;

      const post = {
        id,
        title: document.getElementById('b-title').value,
        excerpt: document.getElementById('b-excerpt').value,
        content: document.getElementById('b-content').value,
        category: document.getElementById('b-category').value,
        featuredImage: document.getElementById('b-image').value,
        published: document.getElementById('b-published').checked,
        createdAt: existingPost?.createdAt || new Date().toISOString(),
      };

      await savePost(post);
      window.location.hash = '#admin';
    });
  });
}

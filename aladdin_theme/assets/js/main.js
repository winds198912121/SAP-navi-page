/**
 * Aladdin SAP Panda — Main JavaScript
 *
 * 標準WordPressテーマ用JS。React SPAと同じAPIを利用。
 * フロントエンドの対話機能を提供。
 */

(function() {
  'use strict';

  // -------------------------------------------------------
  //  Settings from WordPress
  // -------------------------------------------------------
  const ALADDIN = window.ALADDIN_DATA || {};
  const REST_URL = ALADDIN.restUrl || '/wp-json/sap/v1/';

  // -------------------------------------------------------
  //  Utility: API Request
  // -------------------------------------------------------
  async function apiRequest(endpoint, options = {}) {
    const url = REST_URL + endpoint;
    const headers = { 'Content-Type': 'application/json', ...options.headers };

    // JWT Token from cookie
    const token = getCookie('aladdin_token');
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    try {
      const res = await fetch(url, { headers, ...options });
      const data = await res.json();
      if (data.success && data.data !== undefined) return data.data;
      if (!data.success) throw new Error(data.message || 'API error');
      return data;
    } catch (err) {
      console.error('[Aladdin] API Error:', err);
      throw err;
    }
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  // -------------------------------------------------------
  //  DOM Ready
  // -------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function() {
    initSearchToggle();
    initMobileMenu();
    initQuiz();
    initReactions();
    initCaseTicker();
    initContentLock();
    initAuthForms();
  });

  // -------------------------------------------------------
  //  1. Search Toggle
  // -------------------------------------------------------
  function initSearchToggle() {
    const toggle = document.querySelector('.search-toggle');
    const searchBox = document.getElementById('header-search');
    if (!toggle || !searchBox) return;

    toggle.addEventListener('click', function() {
      const isVisible = searchBox.style.display !== 'none';
      searchBox.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) {
        searchBox.querySelector('input')?.focus();
      }
    });

    document.addEventListener('click', function(e) {
      if (!e.target.closest('.site-header')) {
        searchBox.style.display = 'none';
      }
    });
  }

  // -------------------------------------------------------
  //  2. Mobile Menu
  // -------------------------------------------------------
  function initMobileMenu() {
    const openBtn = document.querySelector('.mobile-menu-toggle');
    const closeBtn = document.querySelector('.mobile-menu-close');
    const overlay = document.getElementById('mobile-menu-overlay');
    const panel = document.getElementById('mobile-menu-panel');
    if (!openBtn || !panel) return;

    function open() {
      panel.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      panel.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
  }

  // -------------------------------------------------------
  //  3. Quiz Interaction
  // -------------------------------------------------------
  function initQuiz() {
    const container = document.getElementById('quiz-container');
    if (!container) return;

    const quizDataEl = document.getElementById('quiz-data');
    if (!quizDataEl) return;

    let quizData;
    try {
      quizData = JSON.parse(quizDataEl.textContent);
    } catch(e) {
      return;
    }

    renderQuiz(container, quizData);
  }

  function renderQuiz(container, quiz) {
    // Question
    const questionDiv = document.createElement('div');
    questionDiv.className = 'quiz-question';
    questionDiv.textContent = quiz.question || '今日のクイズ';
    container.appendChild(questionDiv);

    // Options
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'quiz-options';

    const options = quiz.options || [];
    options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.dataset.index = idx;

      btn.addEventListener('click', function() {
        if (container.dataset.answered) return;
        container.dataset.answered = 'true';

        const isCorrect = (idx === quiz.correctIndex);

        // Mark selected
        optionsDiv.querySelectorAll('.quiz-option').forEach((b, i) => {
          b.disabled = true;
          if (i === quiz.correctIndex) b.classList.add('correct');
          if (i === idx && !isCorrect) b.classList.add('wrong');
          if (i === idx) b.classList.add('selected');
        });

        // Show result
        const resultDiv = document.createElement('div');
        resultDiv.className = 'quiz-result';
        resultDiv.innerHTML = `
          <div class="quiz-result-icon">${isCorrect ? '🎉' : '😅'}</div>
          <div class="quiz-result-text">${isCorrect ? '正解！' : '不正解'}</div>
          <div class="quiz-result-detail">${quiz.explanation || ''}</div>
        `;
        container.appendChild(resultDiv);

        // Submit answer
        apiRequest('quizzes/' + quiz.id + '/answer', {
          method: 'POST',
          body: JSON.stringify({ answer: idx }),
        }).catch(() => {});
      });

      optionsDiv.appendChild(btn);
    });

    container.appendChild(optionsDiv);
  }

  // -------------------------------------------------------
  //  4. Article Reactions
  // -------------------------------------------------------
  function initReactions() {
    const container = document.getElementById('reactions-container');
    if (!container) return;

    const dataEl = document.getElementById('reactions-data');
    if (!dataEl) return;

    let reactions;
    try {
      reactions = JSON.parse(dataEl.textContent);
    } catch(e) {
      return;
    }

    const articleId = container.dataset.articleId;
    const emojis = ['👍', '❤️', '😊', '🔥'];
    const types = ['like', 'love', 'smile', 'fire'];

    emojis.forEach((emoji, idx) => {
      const btn = document.createElement('button');
      btn.className = 'reaction-btn';
      btn.innerHTML = `
        <span class="reaction-emoji">${emoji}</span>
        <span class="reaction-count">${reactions[types[idx]] || 0}</span>
      `;

      btn.addEventListener('click', function() {
        const countEl = this.querySelector('.reaction-count');
        const current = parseInt(countEl.textContent);

        apiRequest('articles/' + articleId + '/react', {
          method: 'POST',
          body: JSON.stringify({ type: types[idx] }),
        }).then(data => {
          if (data && data.count !== undefined) {
            countEl.textContent = data.count;
          } else {
            countEl.textContent = current + (this.classList.contains('active') ? -1 : 1);
          }
        }).catch(() => {
          countEl.textContent = current + (this.classList.contains('active') ? -1 : 1);
        });

        this.classList.toggle('active');
      });

      container.appendChild(btn);
    });
  }

  // -------------------------------------------------------
  //  5. Case Ticker (marquee)
  // -------------------------------------------------------
  function initCaseTicker() {
    const ticker = document.querySelector('.case-ticker-track');
    if (!ticker) return;

    // Clone items for infinite scroll
    const items = ticker.children;
    if (items.length === 0) return;

    for (let i = 0; i < items.length; i++) {
      const clone = items[i].cloneNode(true);
      ticker.appendChild(clone);
    }
  }

  // -------------------------------------------------------
  //  6. Content Lock (logged-out partial content)
  // -------------------------------------------------------
  function initContentLock() {
    const lockedEls = document.querySelectorAll('.content-locked');
    if (lockedEls.length === 0) return;

    // If user is logged in, remove lock
    if (ALADDIN.isUserLoggedIn) {
      lockedEls.forEach(el => el.classList.remove('content-locked'));
      return;
    }
  }

  // -------------------------------------------------------
  //  7. Auth Forms (Login / Register)
  // -------------------------------------------------------
  function initAuthForms() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const email = formData.get('email');
        const password = formData.get('password');
        const errorEl = this.querySelector('.form-error-message');
        const submitBtn = this.querySelector('button[type="submit"]');

        if (errorEl) errorEl.textContent = '';
        if (submitBtn) submitBtn.disabled = true;

        try {
          const data = await apiRequest('auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });

          if (data && data.token) {
            // Set cookie via redirect (or the PHP backend handles it)
            window.location.href = '/profile';
          }
        } catch (err) {
          if (errorEl) errorEl.textContent = err.message || 'ログインに失敗しました';
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const errorEl = this.querySelector('.form-error-message');
        const submitBtn = this.querySelector('button[type="submit"]');

        if (errorEl) errorEl.textContent = '';
        if (submitBtn) submitBtn.disabled = true;

        try {
          const data = await apiRequest('auth/register', {
            method: 'POST',
            body: JSON.stringify({
              email: formData.get('email'),
              password: formData.get('password'),
              display_name: formData.get('display_name') || '',
            }),
          });

          if (data && data.token) {
            window.location.href = '/profile';
          }
        } catch (err) {
          if (errorEl) errorEl.textContent = err.message || '登録に失敗しました';
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }

    // Logout
    const logoutBtn = document.getElementById('mobile-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        document.cookie = 'aladdin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.href = '/';
      });
    }
  }

})();

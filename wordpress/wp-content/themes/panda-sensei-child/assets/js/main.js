/**
 * SAP Panda Sensei — Main JavaScript
 *
 * Next.js版のインタラクションを再現:
 * - ユーザードロップダウン
 * - モバイルメニュー
 * - 検索ショートカット (⌘K)
 * - クイズ選択
 * - ログアウト
 *
 * @package Panda_Sensei_Child
 */

(function () {
    'use strict';

    const PANDA = window.PANDA_DATA || {};
    const BODY = document.body;

    // ================================================================
    //  1. ユーザードロップダウン
    // ================================================================
    const userBtn = document.getElementById('user-menu-btn');
    const dropdown = document.getElementById('user-dropdown');

    if (userBtn && dropdown) {
        userBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = dropdown.style.display !== 'none';
            dropdown.style.display = isOpen ? 'none' : 'block';
            const chevron = userBtn.querySelector('.user-chevron');
            if (chevron) {
                chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (!userBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
                const chevron = userBtn.querySelector('.user-chevron');
                if (chevron) chevron.style.transform = 'rotate(0deg)';
            }
        });
    }

    // ================================================================
    //  2. モバイルメニュー
    // ================================================================
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    const mobileClose = document.getElementById('mobile-menu-close');

    function openMobileMenu() {
        if (!mobileOverlay) return;
        mobileOverlay.style.display = 'block';
        BODY.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (!mobileOverlay) return;
        mobileOverlay.style.display = 'none';
        BODY.style.overflow = '';
    }

    if (mobileBtn) {
        mobileBtn.addEventListener('click', openMobileMenu);
    }
    if (mobileClose) {
        mobileClose.addEventListener('click', closeMobileMenu);
    }
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function (e) {
            if (e.target === mobileOverlay) {
                closeMobileMenu();
            }
        });
    }

    // ================================================================
    //  3. 検索ショートカット (⌘K / Ctrl+K)
    // ================================================================
    document.addEventListener('keydown', function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            const searchUrl = PANDA.homeUrl ? PANDA.homeUrl + '/search' : '/search';
            window.location.href = searchUrl;
        }
    });

    // ================================================================
    //  4. クイズ選択
    // ================================================================
    window.pandaQuizSelect = function (el, index) {
        var container = el.closest('.quiz-card');
        if (!container) return;

        var options = container.querySelectorAll('.quiz-opt');
        var explainEl = container.querySelector('#quiz-explain') ||
                        container.querySelector('.quiz-explain');

        // Disable all options
        options.forEach(function (opt) {
            opt.disabled = true;
            opt.style.cursor = 'default';
        });

        // Remove previous selections
        options.forEach(function (opt) {
            opt.classList.remove('selected', 'correct', 'wrong');
            var check = opt.querySelector('.check');
            if (check) check.style.display = 'none';
        });

        // Mark selected
        el.classList.add('selected');

        // Get correct answer from data attribute or quiz JSON
        var quizData = container.dataset.quiz;
        var correctIndex = 0;

        if (quizData) {
            try {
                var q = JSON.parse(quizData);
                correctIndex = q.correct ?? q.answer ?? 0;
            } catch (e) {}
        }

        // Show correct/wrong
        if (index === correctIndex) {
            el.classList.add('correct');
            var check = el.querySelector('.check');
            if (check) {
                check.style.display = 'inline';
                check.textContent = '✓';
            }
            // Highlight correct option if user chose wrong
        } else {
            el.classList.add('wrong');
            var wrongCheck = el.querySelector('.check');
            if (wrongCheck) {
                wrongCheck.style.display = 'inline';
                wrongCheck.textContent = '✗';
            }
            // Show the correct answer
            options[correctIndex].classList.add('show-correct');
            var correctCheck = options[correctIndex].querySelector('.check');
            if (correctCheck) {
                correctCheck.style.display = 'inline';
                correctCheck.textContent = '✓';
            }
        }

        // Show explanation
        if (explainEl) {
            explainEl.style.display = 'flex';
        }
    };

    // ================================================================
    //  5. ログアウト (Cookie削除＋リダイレクト)
    // ================================================================
    var logoutBtn = document.getElementById('user-logout-btn');
    var mobileLogoutBtn = document.getElementById('mobile-logout-btn');

    function handleLogout() {
        // Delete the aladdin_token cookie
        document.cookie = 'aladdin_token=; path=/; max-age=0';
        // Redirect to home
        window.location.href = PANDA.homeUrl || '/';
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', handleLogout);
    }

    // ================================================================
    //  6. モバイルボトムナビ — アクティブ表示
    // ================================================================
    var mobNavItems = document.querySelectorAll('.mob-nav-item');
    mobNavItems.forEach(function (item) {
        var href = item.getAttribute('href');
        if (href && window.location.pathname.startsWith(new URL(href, location.origin).pathname)) {
            item.classList.add('mob-active');
        }
    });

    // ================================================================
    //  7. ページ内リンクスムーススクロール
    // ================================================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ================================================================
    //  8. カラーテーマ切り替え (data-theme on html)
    // ================================================================
    // クッキーに保存されたテーマを復元
    var savedTheme = getCookie('panda_theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    function getCookie(name) {
        var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
        return m ? decodeURIComponent(m[1]) : null;
    }

})();

/**
 * IB Prep - client-side helpers + metadata dictionaries.
 *
 * NOTE:
 * - Site is mostly static HTML; this file exists because `_includes/footer_custom.html`
 *   references `/assets/js/quiz.js`.
 * - We also publish a simple set of "dicts" (maps) so content can be categorized
 *   consistently across the project.
 */
(function () {
  'use strict';

  /**
   * 3-category taxonomy (requested):
   * 1) IB Core (Must-Have)
   * 2) Role / Sector Track (Choose)
   * 3) Interview Packaging (Behavioral + Practice)
   */
  var IB_PREP_CATEGORIES = {
    ib_core: {
      key: 'ib_core',
      label: 'IB Core (Must-Have)',
      order: 1
    },
    role_sector_track: {
      key: 'role_sector_track',
      label: 'Role / Sector Track (Choose)',
      order: 2
    },
    interview_packaging: {
      key: 'interview_packaging',
      label: 'Interview Packaging (Behavioral + Practice)',
      order: 3
    }
  };

  /**
   * Module metadata dictionary (paths are site-relative).
   * Counts exclude `index.html`, `start-here.html`, and `glossary.html` pages.
   */
  var IB_PREP_MODULES = {
    accounting: {
      slug: 'accounting',
      title: 'Accounting Fundamentals',
      category: 'ib_core',
      index_href: '/finance-prep/accounting/index.html',
      core_lessons_count: 39
    },
    valuation: {
      slug: 'valuation',
      title: 'Valuation',
      category: 'ib_core',
      index_href: '/finance-prep/valuation/index.html',
      core_lessons_count: 15
    },
    modeling: {
      slug: 'modeling',
      title: 'Excel Modeling Lab',
      category: 'ib_core',
      index_href: '/finance-prep/modeling/index.html',
      core_lessons_count: 7
    },
    mna: {
      slug: 'mna',
      title: 'M&A Modeling',
      category: 'ib_core',
      index_href: '/finance-prep/mna/index.html',
      core_lessons_count: 8
    },
    lbo: {
      slug: 'lbo',
      title: 'LBO Modeling',
      category: 'role_sector_track',
      index_href: '/finance-prep/lbo/index.html',
      core_lessons_count: 15
    },
    capital_markets: {
      slug: 'capital-markets',
      title: 'Capital Markets',
      category: 'role_sector_track',
      index_href: '/finance-prep/capital-markets/index.html',
      core_lessons_count: 6
    },
    rx: {
      slug: 'rx',
      title: 'Restructuring (Rx)',
      category: 'role_sector_track',
      index_href: '/finance-prep/rx/index.html',
      core_lessons_count: 5
    },
    tech: {
      slug: 'tech',
      title: 'Tech / TMT Valuation',
      category: 'role_sector_track',
      index_href: '/finance-prep/tech/index.html',
      core_lessons_count: 14
    },
    market: {
      slug: 'market',
      title: 'Market Awareness',
      category: 'role_sector_track',
      index_href: '/finance-prep/market/index.html',
      core_lessons_count: 14
    },
    behavioral: {
      slug: 'behavioral',
      title: 'Behavioral Prep',
      category: 'interview_packaging',
      index_href: '/finance-prep/behavioral/index.html',
      core_lessons_count: 3
    },
    cases: {
      slug: 'cases',
      title: 'Real Deal Cases',
      category: 'interview_packaging',
      index_href: '/finance-prep/cases/index.html',
      core_lessons_count: 1
    }
  };

  // Publish dicts for future use (console/debug/automation).
  window.IB_PREP = window.IB_PREP || {};
  window.IB_PREP.CATEGORIES = IB_PREP_CATEGORIES;
  window.IB_PREP.MODULES = IB_PREP_MODULES;

  /**
   * UX helper:
   * Many pages already use inline `onclick="this.classList.toggle('revealed')"`
   * for `.answer-box`. This adds progressive enhancement so new pages can omit inline JS.
   */
  document.addEventListener('click', function (e) {
    var target = e.target;
    if (!target || !target.closest) return;
    var answerBox = target.closest('.answer-box');
    if (!answerBox) return;
    answerBox.classList.toggle('revealed');
  });

  /**
   * MCQ Quiz engine (A/B/C/D):
   * - Works with existing markup:
   *   `.mcq-quiz .drill-card` contains:
   *     - `p.question`
   *     - an options `<ul>` with `<li><strong>A)</strong> ...</li>` etc
   *     - an `.answer-box` that includes "Doğru:" and the correct letter (A-D)
   * - Adds:
   *   - click-to-select options
   *   - immediate feedback (correct/incorrect)
   *   - score display per quiz section
   *   - reset + shuffle buttons (if present in `.mcq-controls`)
   */
  function parseCorrectLetter(answerBox) {
    if (!answerBox) return null;
    var text = (answerBox.textContent || '').replace(/\s+/g, ' ').trim();
    var m = text.match(/Doğru:\s*([A-D])/i);
    return m ? m[1].toUpperCase() : null;
  }

  function getOptionLetter(li) {
    if (!li) return null;
    var strong = li.querySelector('strong');
    if (!strong) return null;
    var t = (strong.textContent || '').trim(); // "A)" etc
    var m = t.match(/^([A-D])/i);
    return m ? m[1].toUpperCase() : null;
  }

  function setScore(quizEl) {
    var scoreEl = quizEl.querySelector('[data-mcq-score]');
    if (!scoreEl) return;
    var cards = quizEl.querySelectorAll('.drill-card');
    var total = 0;
    var correct = 0;
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      if (!card.querySelector('ul')) continue;
      total++;
      if (card.getAttribute('data-mcq-result') === 'correct') correct++;
    }
    scoreEl.textContent = correct + ' / ' + total;
  }

  function resetQuiz(quizEl) {
    var cards = quizEl.querySelectorAll('.drill-card');
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      card.removeAttribute('data-mcq-result');
      var lis = card.querySelectorAll('ul li');
      for (var j = 0; j < lis.length; j++) {
        lis[j].classList.remove('mcq-selected', 'mcq-correct', 'mcq-wrong');
      }
      var answerBox = card.querySelector('.answer-box');
      if (answerBox) answerBox.classList.remove('revealed');
    }
    setScore(quizEl);
  }

  function shuffleQuiz(quizEl) {
    var cards = Array.prototype.slice.call(quizEl.querySelectorAll('.drill-card'));
    // Only shuffle cards that actually look like MCQ cards (have <ul>)
    var mcqCards = [];
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].querySelector('ul')) mcqCards.push(cards[i]);
    }
    for (var k = mcqCards.length - 1; k > 0; k--) {
      var r = Math.floor(Math.random() * (k + 1));
      var tmp = mcqCards[k];
      mcqCards[k] = mcqCards[r];
      mcqCards[r] = tmp;
    }
    // Insert shuffled cards after controls/title (keep other nodes intact)
    var anchor = quizEl.querySelector('.mcq-controls');
    var insertAfter = anchor || quizEl.querySelector('h3') || null;
    for (var x = 0; x < mcqCards.length; x++) {
      if (insertAfter && insertAfter.nextSibling) {
        quizEl.insertBefore(mcqCards[x], insertAfter.nextSibling);
      } else {
        quizEl.appendChild(mcqCards[x]);
      }
      insertAfter = mcqCards[x];
    }
  }

  function initMcqQuiz(quizEl) {
    // Wire up controls if present
    var controls = quizEl.querySelector('.mcq-controls');
    if (controls) {
      var resetBtn = controls.querySelector('[data-mcq-reset]');
      var shuffleBtn = controls.querySelector('[data-mcq-shuffle]');
      if (resetBtn) {
        resetBtn.addEventListener('click', function (e) {
          e.preventDefault();
          resetQuiz(quizEl);
        });
      }
      if (shuffleBtn) {
        shuffleBtn.addEventListener('click', function (e) {
          e.preventDefault();
          shuffleQuiz(quizEl);
          resetQuiz(quizEl);
        });
      }
    }

    // Option click delegation
    quizEl.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var li = t.closest('ul li');
      if (!li) return;
      var card = li.closest('.drill-card');
      if (!card || !quizEl.contains(card)) return;

      var optionsUl = card.querySelector('ul');
      if (!optionsUl) return;

      // If already answered, ignore further clicks (forces "test" behavior)
      if (card.getAttribute('data-mcq-result')) return;

      var chosen = getOptionLetter(li);
      if (!chosen) return;
      var answerBox = card.querySelector('.answer-box');
      var correctLetter = parseCorrectLetter(answerBox);
      if (!correctLetter) return;

      // Mark selection
      var lis = optionsUl.querySelectorAll('li');
      for (var i = 0; i < lis.length; i++) {
        lis[i].classList.remove('mcq-selected', 'mcq-correct', 'mcq-wrong');
      }
      li.classList.add('mcq-selected');

      if (chosen === correctLetter) {
        li.classList.add('mcq-correct');
        card.setAttribute('data-mcq-result', 'correct');
      } else {
        li.classList.add('mcq-wrong');
        // highlight correct
        for (var j = 0; j < lis.length; j++) {
          if (getOptionLetter(lis[j]) === correctLetter) {
            lis[j].classList.add('mcq-correct');
            break;
          }
        }
        card.setAttribute('data-mcq-result', 'wrong');
      }

      // Reveal answer explanation
      if (answerBox) answerBox.classList.add('revealed');
      setScore(quizEl);
    });

    // Initial score
    setScore(quizEl);
  }

  function initAllMcqQuizzes() {
    var quizzes = document.querySelectorAll('.mcq-quiz');
    for (var i = 0; i < quizzes.length; i++) initMcqQuiz(quizzes[i]);
  }

  /**
   * Exam builder:
   * Build a single combined quiz by fetching pages and extracting `.mcq-quiz .drill-card` nodes.
   * Usage: add container `.mcq-quiz[data-exam="core-statements"]` and call `data-exam-pages` list.
   */
  function buildExamFromPages(quizEl) {
    var pagesAttr = quizEl.getAttribute('data-exam-pages');
    if (!pagesAttr) return;
    var pages = pagesAttr.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    if (!pages.length) return;

    var targetCardsHost = quizEl.querySelector('[data-exam-cards]');
    if (!targetCardsHost) return;

    Promise.all(
      pages.map(function (p) {
        return fetch(p, { cache: 'no-cache' })
          .then(function (r) { return r.text(); })
          .then(function (html) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html');
            var section = doc.querySelector('.mcq-quiz');
            if (!section) return [];
            return Array.prototype.slice.call(section.querySelectorAll('.drill-card'));
          })
          .catch(function () { return []; });
      })
    ).then(function (lists) {
      var cards = [];
      for (var i = 0; i < lists.length; i++) cards = cards.concat(lists[i]);
      // Append cloned cards
      for (var j = 0; j < cards.length; j++) {
        targetCardsHost.appendChild(cards[j].cloneNode(true));
      }
      // Init quiz after we injected content
      initMcqQuiz(quizEl);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initAllMcqQuizzes();
    var exams = document.querySelectorAll('.mcq-quiz[data-exam="core-statements"]');
    for (var i = 0; i < exams.length; i++) buildExamFromPages(exams[i]);
  });
})();



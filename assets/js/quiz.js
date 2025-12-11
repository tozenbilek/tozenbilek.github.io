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
})();



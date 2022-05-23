import View from './view.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline'); // selecting which button is clicked
      if (!btn) return; // clicked outside the button

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // 1. Page 1 & there are other pages
    if (currPage === 1 && numPages > 1) {
      return this._nextPgButtonMarkup(currPage + 1);
    }

    // 2. Last page
    if (currPage === numPages && numPages > 1) {
      return this._prevPgButtonMarkup(currPage - 1);
    }

    // 3. Some other page
    if (currPage < numPages) {
      return `${this._nextPgButtonMarkup(
        currPage + 1
      )}${this._prevPgButtonMarkup(currPage - 1)}`;
    }

    // 4. Page 1 & there are no other pages
    if (currPage === 1 && currPage === numPages) {
      return '';
    }
  }

  _prevPgButtonMarkup(pageNum) {
    return `
        <button data-goto=${pageNum} class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${pageNum}</span>
        </button>
      `;
  }
  _nextPgButtonMarkup(pageNum) {
    return `
        <button data-goto=${pageNum} class="btn--inline pagination__btn--next">
            <span>Page ${pageNum}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
  }
}

export default new ResultsView();

import View from './view.js';
import icons from 'url:../../img/icons.svg';

// will generate only one preview ele
// is the child view of bookmarks view and results view
class PreviewView extends View {
  _parentElement = '';

  _generateMarkup(bookmark) {
    const id = window.location.hash.slice(1);

    return `
      <li class="preview">
          <a class="preview__link ${
            this._data.id === id ? 'preview__link--active' : '' // checking cur recipe id with the one on the url; if matched display it active
          }" href="#${this._data.id}">
              <figure class="preview__fig">
                  <img src="${this._data.image}" alt="${this._data.title}" />
              </figure>
              <div class="preview__data">
                  <h4 class="preview__title">${this._data.title}</h4>
                  <p class="preview__publisher">${this._data.publisher}</p>
                  
                  <div class="preview__user-generated ${
                    this._data.key ? '' : 'hidden'
                  }">
                    <svg>
                    <use href="${icons}#icon-user"></use>
                    </svg>
                  </div>
              </div>
          </a>
      </li>
    `;
  }
}

export default new PreviewView();

// <div class="recipe__info">
//   <svg class="recipe__info-icon ${
//     this._data.key ? '' : 'hidden'
//   }">
//   <use href="${icons}#icon-users"></use>
//   </svg>
// </div>

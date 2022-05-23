import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the recived object to the DOM
   * @param {Object | Object[]} data The data to be rendered(eg recipe)
   * @param {Boolean} [render=true] If false, create a render string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View Instance
   * @author Partibha
   * @todo Finiesh Implementation
   */
  render(data, render = true) {
    // if there is no data returned or empty array is returned
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;

    // 1. creating new markup with updated data
    const newMarkup = this._generateMarkup();

    // converting markup of type str into DOM obj; living in memory
    // DOM which does not live on the pg but lives in the memory
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    // 2. actual current DOM elements on the page
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));

    // 3. comparing new markup with the old version & upadating only the changed data
    newElements.forEach((newEle, i) => {
      const curEle = currElements[i];

      // UPDATES changed TEXT
      // loops checks for ele that contains text directly
      if (
        !newEle.isEqualNode(curEle) &&
        newEle.firstChild?.nodeValue.trim() !== ''
      ) {
        // the value of nodeValue will be null if node is an element & if it is text then we get the content of the text node
        curEle.textContent = newEle.textContent;
      }

      // UPDATES changed ATTRIBUTES
      if (!newEle.isEqualNode(curEle))
        Array.from(newEle.attributes).forEach(attr =>
          curEle.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    this._parentElement.innerHTML = ''; // removing initial default message from the recipe container
  }

  // funs called in another files are part of public API hence not protected
  renderSpinner() {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

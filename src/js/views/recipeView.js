import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';

class recipeView {
  // whatever view we are calling the methods on, will know the parent ele to act on, just call the method using view
  #parentElement = document.querySelector('.recipe'); // private ele
  #data;

  render(data) {
    this.#data = data;
    const markup = this.#generateMarkup();
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  #clear() {
    this.#parentElement.innerHTML = ''; // removing initial default message from the recipe container
  }

  renderSpinner = function () {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;

    this.#parentElement.innerHTML = '';
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  #generateMarkup() {
    return `
        <figure class="recipe__fig">
            <img src=${this.#data.image} alt=${
      this.#data.title
    } class="recipe__img" />
            <h1 class="recipe__title">
                <span>${this.#data.title}</span>
            </h1>
        </figure>

        <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this.#data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this.#data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
            <button class="btn--tiny btn--increase-servings">
                <svg>
                <use href="src/img/icons.svg#icon-minus-circle"></use>
                </svg>
            </button>
            <button class="btn--tiny btn--increase-servings">
                <svg>
                <use href="src/img/icons.svg#icon-plus-circle"></use>
                </svg>
            </button>
            </div>
        </div>

        <div class="recipe__user-generated">
            <svg>
            <use href="src/img/icons.svg#icon-user"></use>
            </svg>
        </div>
        <button class="btn--round">
            <svg class="">
            <use href="src/img/icons.svg#icon-bookmark-fill"></use>
            </svg>
        </button>
        </div>

        <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
            ${
              this.#data.ingredients
                .map(
                  // map returns new array with each element as below markup
                  ingredient => this.#generateMarkupIngredient(ingredient)
                )
                .join('') // converting array of str into big string
            }            
        </ul>
        </div>

        <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">The Pioneer Woman</span>. Please check out
            directions at their website.
        </p>
        <a
            class="btn--small recipe__btn"
            href=${this.#data.sourceUrl}
            target="_blank"
        >
            <span>Directions</span>
            <svg class="search__icon">
            <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
        </a>
        </div>
    `;
  }

  #generateMarkupIngredient(ingredient) {
    return `
        <li class="recipe__ingredient">
                <svg class="recipe__icon">
                <use href="src/img/icons.svg#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${
                  ingredient.quantity
                    ? new Fraction(ingredient.quantity).toString()
                    : ''
                }</div>
                <div class="recipe__description">
                <span class="recipe__unit">${ingredient.unit}</span>
                ${ingredient.description}
                </div>
        </li>
    `;
  }
}

export default new recipeView();

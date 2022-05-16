import 'core-js/stable'; // for polyfilling everything else
import 'regenerator-runtime/runtime'; // for polyfilling async/await
import * as model from './model.js';
import recipeView from './views/recipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 1. Loading Recipe
    await model.loadRecipe(id); // loadRecipe() is async fun hence returns a promise, state obj is updated

    //2. Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    alert(err);
    console.log(err);
  }
};

['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);

// window.addEventListener('hashchange', controlRecipes); // event is trigerred once the hash is changed
// window.addEventListener('load', controlRecipes); // event is trigerred after the pg is loaded

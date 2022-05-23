import 'core-js/stable'; // for polyfilling everything else
import 'regenerator-runtime/runtime'; // for polyfilling async/await
import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchQuery from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// maintains the state of the project on browser
// if (module.hot) {
//   module.hot.accept();
// }

// renders the recipe selected from the list
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0. Update results view & bookmarks view to marked selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1. Loading Recipe
    await model.loadRecipe(id); // loadRecipe() is async fun hence returns a promise, state obj is updated

    // 2. Rendering Recipe
    recipeView.render(model.state.recipe);
    console.log(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

// called when str is searched on search bar; renders the initial searched 10 results
const controlSearchResults = async function () {
  try {
    // load spinner
    resultsView.renderSpinner();
    // 1. get search query
    const query = searchQuery.getQuery();
    if (!query) return;

    // 2. load search results
    await model.loadSearchResults(query); // updated the state var for query parameter and results

    // 3. render initial pg (page 1) results
    resultsView.render(model.getSearchResultsPage());

    // 4. render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// called when clicked on next/prev button on search results list
const controlPagination = function (goToPage) {
  // 1. render new results
  // getSearchResultsPage() - updates the current page in state var & returns data for the requested pg
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2. render new pagination buttons
  paginationView.render(model.state.search);
};

const conrtolServings = function (newServings) {
  // 1. Update the recipe servings(in state)
  model.updateServings(newServings);

  // 2. Update the recipe view
  // recipeView.render(model.state.recipe);
  // will only update text and attributes in the DOM; without rerendering the entire view
  recipeView.update(model.state.recipe);
};

// controller for adding a new bookmark
const controlAddBookmark = function () {
  // 1. Bookmark/(Remove from bookmarks) current recipe
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Update the pg to display recipe as bookmarked
  recipeView.update(model.state.recipe);

  // 3. render the bookmark view
  bookmarksView.render(model.state.bookmarks);
};

// rendering the bookmarks with bookmarks stored in local storage
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// called to upload the recipe added by user
const controlAddRecipe = async function (newRecipe) {
  try {
    // 0. Show loading spinner
    addRecipeView.renderSpinner();

    // 1. Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // 2. Render the new recipe data to UI
    recipeView.render(model.state.recipe);

    // 3. Display success message
    addRecipeView.renderMessage();

    // 4. Render bookmark view; not updating because we want to insert new ele
    bookmarksView.render(model.state.bookmarks);

    // 5. Change ID in url
    // history-> API in browser
    // pushState(state, title, url) -> allows us to change the URL without reloading the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // 6. Close the form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err);
  }
};

const init = function () {
  // publisher subscriber model
  bookmarksView.addHandler(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(conrtolServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchQuery.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

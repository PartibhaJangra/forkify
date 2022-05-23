// import { async } from 'regenerator-runtime';
import { API_KEY, API_URL, RES_PER_PAGE } from './config';
import { AJAX } from './helpers.js';

// controller will grab the recipe from here
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // if recipe.key is present; then add key: recipe.key to obj
  };
};

// fetching the recipe data from the forkify API
// loadRecipe doesn't return anything, manipulates the state obj
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);
    // checking if curr recipe is in bookmark[]; then marking as bookmarked
    // bookmarked prop helps in bookmarking and removing from bookmarks
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err; // error will be handled in controller
  }
};

// will be called by controller, hence controller will tell what to search for
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    // { return {}}; otherwise js will consider {} as a block of code and not an obj
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }), // if recipe.key is present; then add key: recipe.key to obj
      };
    });

    // whenever we search for a new query, reload the result page to pg1
    state.search.page = 1;
  } catch (err) {
    throw err; // handled in controller
  }
};

// gets the data for the page requested from the state var
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // dafault 10 - amt of result returned
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings; // updating new servings value in the state obj
};

// store bookmarks in local storage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// fun receives a recipe and add that recipe as a bookmark
// Tip: When we want to add something we get the entire data
export const addBookmark = function (recipe) {
  // 1. Add bookmark to the state obj
  state.bookmarks.push(recipe);

  // 2. Mark current recipe as bookmark; allows to display current recipe as bookmarked in the recipe view
  // state.recipe.bookmarked -> adding new property to recipe obj
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

// when we want to delete something we get the id
export const deleteBookmark = function (id) {
  // 1. delete recipe from the bookmark array
  const index = state.bookmarks.findIndex(ele => ele.id === id);
  state.bookmarks.splice(index, 1);

  // 2. mark bookmarked property at recipe as false
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

// getting bookmarks data out from the local storage
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

// for debugging purpose
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();

// send request to API for uploading the recipe
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(ele => ele.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please enter ingredients in correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err; // handled in controller
  }
};

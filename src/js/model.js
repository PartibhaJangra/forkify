import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { getJSON } from './helpers.js';

// controller will grab the recipe from here
export const state = {
  recipe: {},
};

// fetching the recipe data from the forkify API
// loadRecipe doesn't return anything, manipulates the state obj
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(recipe);
  } catch (err) {
    console.error(`${err} --- in Model`);
  }
};

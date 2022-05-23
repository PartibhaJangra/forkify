import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  // update state.bookmarks from local storage as soon as the page loads
  addHandler(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // return string of template
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }

  // we are making view to call the previewView._generateMarkup() instead of calling previewView._generateMarkup()
  // directly in map. Because this._data will be set inside view.render()
}

export default new BookmarksView();

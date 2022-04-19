/* exported data */

var data = {
  searchText: null,
  searchResults: []
};

var previousData = JSON.parse(localStorage.getItem('user-data'));

if (previousData === null) {
  localStorage.setItem('user-data', JSON.stringify(data));
}

function handleBeforeUnload(event) {
  event.preventDefaul();
  localStorage.setItem('user-data', JSON.stringify(data));
}

window.addEventListener('beforeunload', handleBeforeUnload);

var $body = document.querySelector('body');
var $searchBar = document.querySelector('.search-bar');
var $searchForm = document.querySelector('#search');

$body.addEventListener('submit', handleSearchSubmit);

function handleSearchSubmit(event) {
  event.preventDefault();
  if (event.target === $searchForm) {
    data.search = $searchBar.value;
    getAnimeByName(data.search);
  }
}

function getAnimeByName(search) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v4/anime?q=' + search + '&limit=6');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
  });
  xhr.send();
}

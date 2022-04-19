var $body = document.querySelector('body');
var $searchBar = document.querySelector('.search-bar');
var $searchForm = document.querySelector('#search');

$body.addEventListener('submit', handleSearchSubmit);

function handleSearchSubmit(event) {
  data.searchResults = [];
  event.preventDefault();
  if (event.target === $searchForm) {
    data.searchText = $searchBar.value;
    getAnimeByName(data.searchText);
  }
}

function getAnimeByName(search) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v4/anime?q=' + search + '&limit=6');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var searchData = xhr.response;
    for (var i = 0; i < searchData.data.length; i++) {
      var useableData = {};
      useableData.imageUrl = searchData.data[i].images.jpg;
      useableData.titleEnglish = searchData.data[i].title_english;
      useableData.titleJapanese = searchData.data[i].title;
      useableData.type = searchData.data[i].type;
      useableData.episodes = searchData.data[i].episodes;
      data.searchResults.push(useableData);
    }
  });
  xhr.send();
}

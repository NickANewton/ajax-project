var $body = document.querySelector('body');
var $searchBar = document.querySelector('.search-bar');
var $searchForm = document.querySelector('#search');
var $searchImgNodeList = document.querySelectorAll('.image');
var $searchH4NodeList = document.querySelectorAll('.h4');
var $searchP1NodeList = document.querySelectorAll('.p1');
var $searchP2NodeList = document.querySelectorAll('.p2');
var $searchP3NodeList = document.querySelectorAll('.p3');

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
      useableData.imageUrl = searchData.data[i].images.jpg.image_url;
      useableData.titleEnglish = searchData.data[i].title_english;
      useableData.title = searchData.data[i].title;
      useableData.type = searchData.data[i].type;
      useableData.summary = searchData.data[i].synopsis;
      useableData.episodes = searchData.data[i].episodes;
      data.searchResults.push(useableData);
    }
    for (var e = 0; e < data.searchResults.length; e++) {
      $searchImgNodeList[e].setAttribute('src', data.searchResults[e].imageUrl);
      $searchH4NodeList[e].textContent = data.searchResults[e].titleEnglish;
      if (data.searchResults[e].titleEnglish === null) {
        $searchH4NodeList[e].textContent = data.searchResults[e].title;
      }
      $searchP1NodeList[e].textContent = data.searchResults[e].summary;
      var periodAfter140 = data.searchResults[e].summary.indexOf('.', 140);
      var periodFirst = data.searchResults[e].summary.indexOf('.');
      if (data.searchResults[e].summary.length > 140) {
        $searchP1NodeList[e].textContent = data.searchResults[e].summary.slice(0, periodAfter140 + 1) + '..';
        if (periodAfter140 > 160) {
          $searchP1NodeList[e].textContent = data.searchResults[e].summary.slice(0, periodFirst + 1) + '..';
        } if (periodFirst > 140) {
          $searchP1NodeList[e].textContent = data.searchResults[e].summary.slice(0, 140) + '...';
          if (data.searchResults[e].summary.charAt(140) === '.' || data.searchResults[e].summary.charAt(140) === ' ') {
            $searchP1NodeList[e].textContent = data.searchResults[e].summary.slice(0, 139) + '...';
          }
        }
      }

      $searchP2NodeList[e].textContent = data.searchResults[e].type;
      $searchP3NodeList[e].textContent = data.searchResults[e].episodes;
    }
  });
  xhr.send();
}

var $body = document.querySelector('body');
var $searchBar = document.querySelector('.search-bar');
var $searchForm = document.querySelector('#search');
var $ul = document.querySelector('ul');

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
      $ul.appendChild(searchResults(data.searchResults[e]));
    }
  });
  xhr.send();
}

function searchResults(results) {
  var $liSearch = document.createElement('li');
  var $imgSearch = document.createElement('img');
  var $divSearch = document.createElement('div');
  var $h4Search = document.createElement('h4');
  var $p1Search = document.createElement('p');
  var $p2Search = document.createElement('p');
  var $span1Search = document.createElement('span');
  var $p3Search = document.createElement('p');
  var $span2Search = document.createElement('span');

  $liSearch.classList.add('col-half', 'desktop-display-flex', 'mb-13', 'li-styles-all', 'font-size-12');
  $imgSearch.classList.add('col-half', 'desktop-margin-0-10', 'border-radius-5', 'box-shadow');
  $divSearch.classList.add('col-half');
  $h4Search.classList.add('font-work-sans', 'font-size-16');
  $p1Search.classList.add('mt-8');
  $p2Search.classList.add('mt-12');
  $span1Search.classList.add('font-work-sans', 'font-size-16');
  $span2Search.classList.add('font-work-sans', 'font-size-16');

  $imgSearch.setAttribute('src', results.imageUrl);
  $h4Search.textContent = results.titleEnglish;
  if ($h4Search.textContent === '') {
    $h4Search.textContent = results.title;
  }

  $p1Search.textContent = results.summary.slice(0, 140) + '...';
  $span1Search.textContent = 'Type: ';
  $p2Search.textContent = results.type;
  $span2Search.textContent = 'Episodes: ';
  $p3Search.textContent = results.episodes;

  $liSearch.appendChild($imgSearch);
  $liSearch.appendChild($divSearch);
  $divSearch.appendChild($h4Search);
  $divSearch.appendChild($p1Search);
  $divSearch.appendChild($p2Search);
  $span1Search.appendChild($p2Search);
  $divSearch.appendChild($p3Search);
  $span2Search.appendChild($p3Search);

  return $liSearch;
}

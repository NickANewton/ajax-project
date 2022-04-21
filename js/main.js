var $body = document.querySelector('body');
var $searchBar = document.querySelector('.search-bar');
var $searchForm = document.querySelector('#search');
var $ul = document.querySelector('ul');

$body.addEventListener('submit', handleSearchSubmit);

function handleSearchSubmit(event) {
  event.preventDefault();
  data.searchResults = [];
  if (event.target === $searchForm) {
    data.searchText = $searchBar.value;
    getAnimeByName(data.searchText);
  }
}

function getAnimeByName(search) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v4/anime?q=' + search + '&sfw=true&limit=20');
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
    while ($ul.firstChild) {
      $ul.removeChild($ul.firstChild);
    }
    for (var e = 0; e < data.searchResults.length; e++) {
      $ul.appendChild(searchResults(data.searchResults[e]));
    }
  });
  xhr.send();
}

function searchResults(results) {
  var $liAnimeSearch = document.createElement('li');
  var $animeImg = document.createElement('img');
  var $divAnimeSearch = document.createElement('div');
  var $animeTitleH4 = document.createElement('h4');
  var $animeSummaryP = document.createElement('p');
  var $divType = document.createElement('div');
  var $animeTypeHeadingH4 = document.createElement('h4');
  var $animeTypeSpan = document.createElement('span');
  var $divNumberOfEp = document.createElement('div');
  var $numberOfEpHeadingH4 = document.createElement('h4');
  var $numberOfEpSpan = document.createElement('span');

  $liAnimeSearch.classList.add('col-half', 'desktop-display-flex', 'mb-13', 'li-styles-all', 'font-size-12');
  $animeImg.classList.add('col-half', 'desktop-margin-0-10', 'border-radius-5', 'box-shadow');
  $divAnimeSearch.classList.add('col-half');
  $animeTitleH4.classList.add('font-work-sans', 'font-size-16');
  $animeSummaryP.classList.add('mt-8');
  $animeTypeHeadingH4.classList.add('font-work-sans', 'font-size-16', 'inline');
  $animeTypeSpan.classList.add('mt-12', 'inline');
  $numberOfEpHeadingH4.classList.add('font-work-sans', 'font-size-16', 'inline');
  $numberOfEpSpan.classList.add('mt-8', 'inline');
  $divType.classList.add('mt-8');

  $animeImg.setAttribute('src', results.imageUrl);

  $animeTitleH4.textContent = results.titleEnglish;
  if (results.titleEnglish === null) {
    $animeTitleH4.textContent = results.title;
  }

  $animeSummaryP.textContent = results.summary;
  if (results.summary === null) {
    $animeSummaryP.textContent = 'No Summary Available.';
  }
  if ($animeSummaryP.textContent.length > 140) {
    var spaceAfter140 = results.summary.indexOf(' ', 140);
    $animeSummaryP.textContent = results.summary.slice(0, spaceAfter140) + '...';
  }

  $animeTypeHeadingH4.textContent = 'Type: ';
  $animeTypeSpan.textContent = results.type;
  $numberOfEpHeadingH4.textContent = 'Episodes: ';
  $numberOfEpSpan.textContent = results.episodes;

  $liAnimeSearch.appendChild($animeImg);
  $liAnimeSearch.appendChild($divAnimeSearch);
  $divAnimeSearch.appendChild($animeTitleH4);
  $divAnimeSearch.appendChild($animeSummaryP);
  $divType.appendChild($animeTypeHeadingH4);
  $divType.appendChild($animeTypeSpan);
  $divAnimeSearch.appendChild($divType);
  $divNumberOfEp.appendChild($numberOfEpHeadingH4);
  $divNumberOfEp.appendChild($numberOfEpSpan);
  $divAnimeSearch.appendChild($divNumberOfEp);

  return $liAnimeSearch;
}

window.addEventListener('DOMContentLoaded', handleUloadEvent);

function handleUloadEvent(event) {
  for (var e = 0; e < data.searchResults.length; e++) {
    $ul.appendChild(searchResults(data.searchResults[e]));
  }
}

// for (var e = 0; e < data.searchResults.length; e++) {
//   $searchImgNodeList[e].setAttribute('src', data.searchResults[e].imageUrl);
//   $searchH4NodeList[e].textContent = data.searchResults[e].titleEnglish;
//   if (data.searchResults[e].titleEnglish === null) {
//     $searchH4NodeList[e].textContent = data.searchResults[e].title;
//   }
//   $searchP1NodeList[e].textContent = data.searchResults[e].summary;
//   var spaceAfter140 = data.searchResults[e].summary.indexOf(' ', 140);
//   var periodFirst = data.searchResults[e].summary.indexOf('.');
//   if (data.searchResults[e].summary.length > 140) {
//     $searchP1NodeList[e].textContent = data.searchResults[e].summary.slice(0, spaceAfter140 - 1) + '...';
//     if (periodAfter140 > 160) {
//       $searchP1NodeList[e].textContent = data.searchResults[e].summary.slice(0, periodFirst + 1) + '..';
//     } if (periodFirst > 140) {
//       $searchP1NodeList[e].textContent = data.searchResults[e].summary.slice(0, 140) + '...';
//       if (data.searchResults[e].summary.charAt(140) === '.' || data.searchResults[e].summary.charAt(140) === ' ') {
//         $searchP1NodeList[e].textContent = data.searchResults[e].summary.slice(0, 139) + '...';
//       }
//     }
//   }
// $searchP2NodeList[e].textContent = data.searchResults[e].type;
// $searchP3NodeList[e].textContent = data.searchResults[e].episodes;

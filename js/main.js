var $body = document.querySelector('body');
var $searchBar = document.querySelector('.search-bar');
var $searchForm = document.querySelector('#searchForm');
var $reviewForm = document.querySelector('#review');
var $ul = document.querySelector('ul');
var $reviewTitle = document.querySelector('#review-title');
var $reviewText = document.querySelector('#review-text');
var $viewNodeList = document.querySelectorAll('.view');
var $searchDiv = document.querySelector('#search');
var $animeImgReview = document.querySelector('#animeImgReview');
var $animeTitleReview = document.querySelector('#animeTitleReview');
var $starIconNodeList = document.querySelectorAll('.star');
var $starDiv = document.querySelector('#starDiv');
var btnId = -1;

$body.addEventListener('submit', handleSearchSubmit);

function handleSearchSubmit(event) {
  event.preventDefault();
  if (event.target === $searchForm) {
    data.searchText = $searchBar.value;
    getAnimeByName(data.searchText);
  }
  if (event.target === $reviewForm) {
    var reviewRating = getRating();
    var form = {
      reviewTitle: $reviewTitle.value,
      reviewText: $reviewText.value,
      reviewID: data.nextReviewId,
      animeImg: $animeImgReview.getAttribute('src'),
      animeTitle: $animeTitleReview.textContent,
      reviewRating: reviewRating
    };
    viewSwap('search');
    data.reviews.unshift(form);
    data.nextReviewId++;
    $reviewForm.reset();
  }
}

function getAnimeByName(search) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v4/anime?q=' + search + '&sfw=true&limit=20');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    data.searchResults = [];
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
    btnId = -1;
    for (var e = 0; e < data.searchResults.length; e++) {
      $ul.appendChild(searchResults(data.searchResults[e]));
    }
  });
  xhr.send();
}

function searchResults(results) {
  btnId++;
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
  var $reviewBtn = document.createElement('button');

  $liAnimeSearch.classList.add('col-half', 'desktop-display-flex', 'mb-13', 'li-styles-all', 'font-size-12');
  $animeImg.classList.add('col-half', 'desktop-margin-0-10', 'border-radius-5', 'box-shadow');
  $divAnimeSearch.classList.add('col-half', 'display-flex', 'space-between', 'flex-column', 'align-center', 'desktop-align-left');
  $animeTitleH4.classList.add('font-work-sans', 'font-size-16');
  $animeTypeHeadingH4.classList.add('font-work-sans', 'font-size-16', 'inline');
  $animeTypeSpan.classList.add('mt-12', 'inline');
  $numberOfEpHeadingH4.classList.add('font-work-sans', 'font-size-16', 'inline');
  $numberOfEpSpan.classList.add('mt-8', 'inline');
  $divType.classList.add('mt-8');
  $reviewBtn.classList.add('button-styles-all', 'box-shadow', 'mt-8', 'review-btn');
  $reviewBtn.dataset.id = btnId;

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
  $reviewBtn.textContent = 'REVIEW';

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
  $divAnimeSearch.appendChild($reviewBtn);

  return $liAnimeSearch;
}

window.addEventListener('DOMContentLoaded', handleUloadEvent);

function handleUloadEvent(event) {
  for (var e = 0; e < data.searchResults.length; e++) {
    $ul.appendChild(searchResults(data.searchResults[e]));
  }
  viewSwap(data.view);
}

function viewSwap(view) {
  for (var i = 0; i < $viewNodeList.length; i++) {
    if (view === $viewNodeList[i].getAttribute('data-view')) {
      $viewNodeList[i].classList.remove('hidden');
      data.view = $viewNodeList[i].getAttribute('data-view');
    } else {
      $viewNodeList[i].classList.add('hidden');
    }
  }
}

$searchDiv.addEventListener('click', showNewReview);

function showNewReview(event) {
  if (event.target.textContent === 'REVIEW') {
    getCurrentAnime(event.target);
    viewSwap('review-form');
  }
}

function getCurrentAnime(reviewButton) {
  var currentBtnId = reviewButton.getAttribute('data-id');
  currentBtnId = Number(currentBtnId);
  $animeImgReview.setAttribute('src', data.searchResults[currentBtnId].imageUrl);
  $animeTitleReview.textContent = data.searchResults[currentBtnId].titleEnglish;
  if (data.searchResults[currentBtnId].titleEnglish === null) {
    $animeTitleReview.textContent = data.searchResults[currentBtnId].title;
  }
}

$starDiv.addEventListener('click', setRating);

function setRating(event) {
  if (event.target.matches('i')) {
    var currentStarId = event.target.getAttribute('data-star-id');
    for (var i = 1; i < $starIconNodeList.length; i++) {
      if (i <= currentStarId) {
        $starIconNodeList[i].classList.replace('far', 'fas');
      } else {
        $starIconNodeList[i].classList.replace('fas', 'far');
      }
    }
  }
}

function getRating() {
  var starCount = 1;
  for (var i = 1; i < $starIconNodeList.length; i++) {
    if ($starIconNodeList[i].classList.contains('fas')) {
      starCount++;
    }
  }
  return starCount;
}

var $body = document.querySelector('body');
var $searchBar = document.querySelector('.search-bar');
var $searchForm = document.querySelector('#searchForm');
var $reviewForm = document.querySelector('#reviewForm');
var $ulAnimeResults = document.querySelector('#anmieResultsUl');
var $ulReviews = document.querySelector('#reviewUl');
var $reviewTitle = document.querySelector('#review-title');
var $reviewText = document.querySelector('#review-text');
var $viewNodeList = document.querySelectorAll('.view');
var $animeImgReview = document.querySelector('#animeImgReview');
var $animeTitleReview = document.querySelector('#animeTitleReview');
var $starIconNodeList = document.querySelectorAll('.star');
var $starDiv = document.querySelector('#starDiv');
var btnId = -1;
var $iconFooterNodeList = document.querySelectorAll('.icon-footer');
var $reviewsPage = document.querySelector('#reviews');
var $h3NewReview = document.querySelector('#h3NewReview');
var $footer = document.querySelector('#footer');
var $leftArrow = document.querySelector('#leftArrow');
var $header = document.querySelector('#header');

$body.addEventListener('submit', handleSearchSubmit);

function handleSearchSubmit(event) {
  event.preventDefault();
  if (event.target === $searchForm) {
    data.searchText = $searchBar.value;
    getAnimeByName(data.searchText);
  }
  if (event.target === $reviewForm) {
    var reviewRating = getRating();
    if (!data.editing) {
      var form = {
        reviewTitle: $reviewTitle.value,
        reviewText: $reviewText.value,
        reviewID: data.nextReviewId,
        animeImg: $animeImgReview.getAttribute('src'),
        animeTitle: $animeTitleReview.textContent,
        reviewRating: reviewRating
      };
      $ulReviews.prepend(getReviews(form));
      viewSwap('reviews');
      data.reviews.unshift(form);
      data.nextReviewId++;
      $reviewForm.reset();
    }
    data.editing.reviewTitle = $reviewTitle.value;
    data.editing.reviewText = $reviewText.value;
    data.editing.reviewRating = reviewRating;
    var editingID = data.editing.reviewID;
    var $currentLi = document.querySelector('[data-review-id="' + editingID + '"]');
    $currentLi.replaceWith(getReviews(data.editing));
    viewSwap('reviews');
    data.editing = null;
    $h3NewReview.textContent = 'New Review';
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
    while ($ulAnimeResults.firstChild) {
      $ulAnimeResults.removeChild($ulAnimeResults.firstChild);
    }
    btnId = -1;
    for (var e = 0; e < data.searchResults.length; e++) {
      $ulAnimeResults.appendChild(searchResults(data.searchResults[e]));
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
  var $reviewAnchor = document.createElement('a');

  $liAnimeSearch.classList.add('col-half', 'desktop-display-flex', 'mb-13', 'li-styles-all', 'font-size-12');
  $animeImg.classList.add('col-half', 'desktop-margin-0-10', 'border-radius-5', 'box-shadow');
  $divAnimeSearch.classList.add('col-half', 'display-flex', 'space-between', 'flex-column', 'align-center', 'desktop-align-left');
  $animeTitleH4.classList.add('font-work-sans', 'font-size-16');
  $animeTypeHeadingH4.classList.add('font-work-sans', 'font-size-16', 'inline');
  $animeTypeSpan.classList.add('mt-12', 'inline');
  $numberOfEpHeadingH4.classList.add('font-work-sans', 'font-size-16', 'inline');
  $numberOfEpSpan.classList.add('mt-8', 'inline');
  $divType.classList.add('mt-8');
  $reviewAnchor.classList.add('button-styles-all', 'box-shadow', 'mt-8', 'review-btn', 'font-roboto', 'mobile-text-center', 'padding-8', 'text-decor-none');
  $reviewAnchor.dataset.reviewBtnId = btnId;
  $reviewAnchor.dataset.view = 'review-form';
  $reviewAnchor.setAttribute('href', '#');

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
  $reviewAnchor.textContent = 'REVIEW';

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
  $divAnimeSearch.appendChild($reviewAnchor);

  return $liAnimeSearch;
}

window.addEventListener('DOMContentLoaded', handleUloadEvent);

function handleUloadEvent(event) {
  for (var i = 0; i < data.searchResults.length; i++) {
    $ulAnimeResults.appendChild(searchResults(data.searchResults[i]));
  }
  for (var e = 0; e < data.reviews.length; e++) {
    $ulReviews.appendChild(getReviews(data.reviews[e]));
  }
  if (data.reviewAnimeId !== null) {
    $animeImgReview.setAttribute('src', data.searchResults[data.reviewAnimeId].imageUrl);
    $animeTitleReview.textContent = data.searchResults[data.reviewAnimeId].titleEnglish;
    if (data.searchResults[data.reviewAnimeId].titleEnglish === null) {
      $animeTitleReview.textContent = data.searchResults[data.reviewAnimeId].title;
    }
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

function getCurrentAnime(reviewButton) {
  var currentBtnId = reviewButton.getAttribute('data-review-btn-id');
  data.reviewAnimeId = currentBtnId;
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
    for (var i = 0; i < $starIconNodeList.length; i++) {
      if (i <= currentStarId) {
        $starIconNodeList[i].classList.replace('far', 'fas');
      } else {
        $starIconNodeList[i].classList.replace('fas', 'far');
      }
    }
  }
}

function getRating() {
  var starCount = 0;
  for (var i = 0; i < $starIconNodeList.length; i++) {
    if ($starIconNodeList[i].classList.contains('fas')) {
      starCount++;
    }
  }
  return starCount;
}

function getReviews(form) {
  var $liReview = document.createElement('li');
  var $editDivReview = document.createElement('div');
  var $editIconReview = document.createElement('i');
  var $imgDivReview = document.createElement('div');
  var $imgReview = document.createElement('img');
  var $textDivReview = document.createElement('div');
  var $h4AnimeTitleReview = document.createElement('h4');
  var $starDivReview = document.createElement('div');
  var $h3RatingReview = document.createElement('h3');
  var $h3TitleReivew = document.createElement('h3');
  var $pTextReview = document.createElement('p');

  $liReview.classList.add('col-full', 'desktop-display-flex', 'mb-13', 'li-styles-all', 'font-size-12', 'background-white', 'border-radius-5', 'box-shadow', 'padding-12');
  $liReview.dataset.reviewId = form.reviewID;
  $editDivReview.classList.add('display-flex', 'justify-right');
  $imgDivReview.classList.add('col-half', 'display-flex', 'justify-center', 'align-center');
  $imgReview.classList.add('desktop-margin-0-10', 'border-radius-5', 'box-shadow', 'mobile-review-img', 'desktop-review-img', 'desktop-width-auto');
  $textDivReview.classList.add('col-half', 'desktop-display-flex', 'flex-column', 'space-between', 'mt-12');
  $h4AnimeTitleReview.classList.add('font-work-sans', 'font-size-16', 'mobile-text-center', 'desktop-text-left');
  $starDivReview.classList.add('mt-12', 'mb-13', 'mobile-text-center', 'desktop-text-left');
  $h3RatingReview.classList.add('font-work-sans', 'font-size-16', 'mt-12');
  $h3TitleReivew.classList.add('font-work-sans', 'font-size-16', 'mt-15');
  $pTextReview.classList.add('mt-8', 'lh-18');
  $editIconReview.classList.add('fas', 'fa-pen', 'font-size-26');

  $imgReview.setAttribute('src', form.animeImg);
  $h4AnimeTitleReview.textContent = form.animeTitle;
  $h3TitleReivew.textContent = form.reviewTitle;
  $h3RatingReview.textContent = 'Rating';
  $pTextReview.textContent = form.reviewText;

  // $liReview.appendChild($editDivReview);

  $liReview.appendChild($imgDivReview);
  $imgDivReview.appendChild($imgReview);
  $liReview.appendChild($textDivReview);
  $textDivReview.append($editIconReview);
  $textDivReview.appendChild($h4AnimeTitleReview);
  $textDivReview.appendChild($starDivReview);

  $starDivReview.appendChild($h3RatingReview);

  if (form.reviewRating === 0) {
    $h3RatingReview.textContent = 'No Rating Given';
  }

  for (var i = 0; i < form.reviewRating; i++) {
    var $newStar = document.createElement('i');
    $newStar.classList.add('fas', 'fa-star', 'fa-2x');
    $starDivReview.appendChild($newStar);
  }

  $textDivReview.appendChild($h3TitleReivew);
  $textDivReview.appendChild($pTextReview);

  return $liReview;
}

$body.addEventListener('click', handleAnchorClick);

function handleAnchorClick(event) {
  var anchorDataView = event.target.getAttribute('data-view');
  if (event.target.matches('a') || event.target.parentNode.matches('a')) {
    for (var e = 0; e < $starIconNodeList.length; e++) {
      $starIconNodeList[e].classList.replace('fas', 'far');
    }

    $reviewText.value = '';
    $reviewTitle.value = '';

    for (var i = 0; i < $iconFooterNodeList.length; i++) {
      if ($iconFooterNodeList[i].getAttribute('data-view') === anchorDataView) {
        $iconFooterNodeList[i].classList.replace('icon-grey', 'icon-blue');
      } else {
        $iconFooterNodeList[i].classList.add('icon-blue', 'icon-grey');
      }
    }
    viewSwap(anchorDataView);
    if (data.view === 'review-form') {
      hideNavBar();
      getCurrentAnime(event.target);
    }
  }
}

$reviewsPage.addEventListener('click', editIconClickEvent);

function editIconClickEvent(event) {
  var liDataReviewId = event.target.closest('li').getAttribute('data-review-id');
  liDataReviewId = Number(liDataReviewId);
  if (event.target.matches('i')) {
    viewSwap('review-form');
    getEntryData(liDataReviewId);
    renderEditForm(data.editing);
    hideNavBar();
  }
}

function getEntryData(reviewID) {
  for (var i = 0; i < data.reviews.length; i++) {
    if (reviewID === data.reviews[i].reviewID) {
      data.editing = data.reviews[i];
    }
  }
}

function renderEditForm(review) {
  $h3NewReview.textContent = 'Edit Review';
  $animeImgReview.setAttribute('src', review.animeImg);
  $animeTitleReview.value = review.animeTitle;
  $reviewTitle.value = review.reviewTitle;
  $reviewText.value = review.reviewText;

  for (var e = 0; e < data.editing.reviewRating; e++) {
    $starIconNodeList[e].classList.replace('far', 'fas');
  }
}

$header.addEventListener('click', backArrowClick);

function backArrowClick(event) {
  if (event.target.matches('i')) {
    if ($h3NewReview.textContent === 'New Review') {
      viewSwap('search');
    } else if ($h3NewReview.textContent === 'Edit Review') {
      viewSwap('reviews');
    }
    $footer.classList.remove('hidden');
    $leftArrow.classList.add('hidden');
  }
}

function hideNavBar() {
  $footer.classList.add('hidden');
  $leftArrow.classList.remove('hidden');
}

const $body = document.querySelector('body');
const $searchBar = document.querySelector('.search-bar');
const $searchForm = document.querySelector('#searchForm');
const $reviewForm = document.querySelector('#reviewForm');
const $ulAnimeResults = document.querySelector('#anmieResultsUl');
const $ulReviews = document.querySelector('#reviewUl');
const $reviewTitle = document.querySelector('#review-title');
const $reviewText = document.querySelector('#review-text');
const $viewNodeList = document.querySelectorAll('.view');
const $animeImgReview = document.querySelector('#animeImgReview');
const $animeTitleReview = document.querySelector('#animeTitleReview');
const $starIconNodeList = document.querySelectorAll('.star');
const $starDiv = document.querySelector('#starDiv');
let btnId = -1;
const $iconFooterNodeList = document.querySelectorAll('.icon-footer');
const $reviewsPage = document.querySelector('#reviews');
const $h3NewReview = document.querySelector('#h3NewReview');
const $footer = document.querySelector('#footer');
const $leftArrow = document.querySelector('#leftArrow');
const $noReviews = document.querySelector('#noReviews');
const $loadRing = document.querySelector('#loadRing');
const $noResults = document.querySelector('#noResults');
const $requestFailed = document.querySelector('#failed');
const $pleaseSearch = document.querySelector('#pleaseSearch');

$body.addEventListener('submit', handleSearchSubmit);

function handleSearchSubmit(event) {
  event.preventDefault();
  if (event.target === $searchForm) {
    data.searchText = $searchBar.value;
    getAnimeByName(data.searchText);
  }
  if (event.target === $reviewForm) {
    const reviewRating = getRating();
    if (!data.editing) {
      const form = {
        reviewTitle: $reviewTitle.value,
        reviewText: $reviewText.value,
        reviewID: data.nextReviewId,
        animeImg: $animeImgReview.getAttribute('src'),
        animeTitle: $animeTitleReview.textContent,
        reviewRating: reviewRating
      };
      $ulReviews.prepend(getReviews(form));
      data.reviews.unshift(form);
      data.nextReviewId++;
      footerNavView('search');
      footerNavButtons('reviews');
    } else {
      data.editing.reviewTitle = $reviewTitle.value;
      data.editing.reviewText = $reviewText.value;
      data.editing.reviewRating = reviewRating;
      $footer.classList.remove('hidden');
      const editingID = data.editing.reviewID;
      const $currentLi = document.querySelector('[data-review-id="' + editingID + '"]');
      $currentLi.replaceWith(getReviews(data.editing));
      footerNavButtons('reviews');
      data.editing = null;
      $h3NewReview.textContent = 'New Review';
    }
    viewSwap('reviews');
    $reviewForm.reset();
  }
}

function handleError(event) {
  $requestFailed.classList.remove('hidden');
  removeSearchResults();
}

function getAnimeByName(search) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v4/anime?q=' + search + '&sfw=true&limit=20');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    data.searchResults = [];
    const searchData = xhr.response;

    if (searchData.data.length === 0) {
      $noResults.classList.remove('hidden');
      removeSearchResults();
    } else {
      $noResults.classList.add('hidden');
      for (let i = 0; i < searchData.data.length; i++) {
        const useableData = {};
        useableData.imageUrl = searchData.data[i].images.jpg.image_url;
        useableData.titleEnglish = searchData.data[i].title_english;
        useableData.title = searchData.data[i].title;
        useableData.type = searchData.data[i].type;
        useableData.summary = searchData.data[i].synopsis;
        useableData.episodes = searchData.data[i].episodes;
        data.searchResults.push(useableData);
      }
      removeSearchResults();
      btnId = -1;
      for (let e = 0; e < data.searchResults.length; e++) {
        $ulAnimeResults.appendChild(searchResults(data.searchResults[e]));
      }
    }
    $loadRing.classList.add('hidden');
  });
  xhr.send();
  xhr.addEventListener('error', handleError);
  $loadRing.classList.remove('hidden');
}

function removeSearchResults() {
  while ($ulAnimeResults.firstChild) {
    $ulAnimeResults.removeChild($ulAnimeResults.firstChild);
  }
}

function searchResults(results) {
  btnId++;
  const $liAnimeSearch = document.createElement('li');
  const $animeImg = document.createElement('img');
  const $divAnimeSearch = document.createElement('div');
  const $animeTitleH4 = document.createElement('h4');
  const $animeSummaryP = document.createElement('p');
  const $divType = document.createElement('div');
  const $animeTypeHeadingH4 = document.createElement('h4');
  const $animeTypeSpan = document.createElement('span');
  const $divNumberOfEp = document.createElement('div');
  const $numberOfEpHeadingH4 = document.createElement('h4');
  const $numberOfEpSpan = document.createElement('span');
  const $reviewAnchor = document.createElement('a');

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
    const spaceAfter140 = results.summary.indexOf(' ', 140);
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

  $pleaseSearch.classList.add('hidden');

  return $liAnimeSearch;
}

window.addEventListener('DOMContentLoaded', handleUloadEvent);

function handleUloadEvent(event) {
  for (let i = 0; i < data.searchResults.length; i++) {
    $ulAnimeResults.appendChild(searchResults(data.searchResults[i]));
  }
  for (let e = 0; e < data.reviews.length; e++) {
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
  footerNavButtons(data.view);
  footerNavView(data.view);
  if (data.formStatus === 'edit') {
    renderEditForm(data.editing);
  }
}

function viewSwap(view) {
  for (let i = 0; i < $viewNodeList.length; i++) {
    if (view === $viewNodeList[i].getAttribute('data-view')) {
      $viewNodeList[i].classList.remove('hidden');
      data.view = $viewNodeList[i].getAttribute('data-view');
    } else {
      $viewNodeList[i].classList.add('hidden');
    }
  }
}

function getCurrentAnime(reviewButton) {
  data.currentAnime = reviewButton;
  data.formStatus = 'new';
  $h3NewReview.textContent = 'New Review';
  const currentBtnId = reviewButton.getAttribute('data-review-btn-id');
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
    const currentStarId = event.target.getAttribute('data-star-id');
    for (let i = 0; i < $starIconNodeList.length; i++) {
      if (i <= currentStarId) {
        $starIconNodeList[i].classList.replace('far', 'fas');
      } else {
        $starIconNodeList[i].classList.replace('fas', 'far');
      }
    }
  }
}

function getRating() {
  let starCount = 0;
  for (let i = 0; i < $starIconNodeList.length; i++) {
    if ($starIconNodeList[i].classList.contains('fas')) {
      starCount++;
    }
  }
  return starCount;
}

function getReviews(form) {
  const $liReview = document.createElement('li');
  const $editDivReview = document.createElement('div');
  const $editIconReview = document.createElement('i');
  const $containerDiv = document.createElement('div');
  const $imgDivReview = document.createElement('div');
  const $imgReview = document.createElement('img');
  const $textDivReview = document.createElement('div');
  const $h4AnimeTitleReview = document.createElement('h4');
  const $starDivReview = document.createElement('div');
  const $h3RatingReview = document.createElement('h3');
  const $h3TitleReivew = document.createElement('h3');
  const $pTextReview = document.createElement('p');

  $liReview.classList.add('col-full', 'mb-13', 'li-styles-all', 'font-size-12', 'background-white', 'border-radius-5', 'box-shadow', 'padding-12');
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
  $editIconReview.classList.add('fas', 'fa-pen', 'font-size-23', 'absolute-positioning');
  $containerDiv.classList.add('desktop-display-flex');

  $imgReview.setAttribute('src', form.animeImg);
  $h4AnimeTitleReview.textContent = form.animeTitle;
  $h3TitleReivew.textContent = form.reviewTitle;
  $h3RatingReview.textContent = 'Rating';
  $pTextReview.textContent = form.reviewText;

  $liReview.appendChild($editDivReview);
  $editDivReview.appendChild($editIconReview);
  $liReview.appendChild($containerDiv);
  $containerDiv.appendChild($imgDivReview);
  $imgDivReview.appendChild($imgReview);
  $containerDiv.appendChild($textDivReview);
  $textDivReview.appendChild($h4AnimeTitleReview);
  $textDivReview.appendChild($starDivReview);

  $starDivReview.appendChild($h3RatingReview);

  if (form.reviewRating === 0) {
    $h3RatingReview.textContent = 'No Rating Given';
  }

  for (let i = 0; i < form.reviewRating; i++) {
    const $newStar = document.createElement('i');
    $newStar.classList.add('fas', 'fa-star', 'fa-2x');
    $starDivReview.appendChild($newStar);
  }

  $textDivReview.appendChild($h3TitleReivew);
  $textDivReview.appendChild($pTextReview);

  $noReviews.classList.add('hidden');

  return $liReview;
}

$body.addEventListener('click', handleAnchorClick);

function handleAnchorClick(event) {
  const anchorDataView = event.target.getAttribute('data-view');
  if (event.target.matches('a') || event.target.parentNode.matches('a')) {
    viewSwap(anchorDataView);
    for (let e = 0; e < $starIconNodeList.length; e++) {
      $starIconNodeList[e].classList.replace('fas', 'far');
    }

    $reviewText.value = '';
    $reviewTitle.value = '';

    if (data.view === 'review-form') {
      data.currentAnime = event.target;
      getCurrentAnime(data.currentAnime);
    }
    footerNavButtons(anchorDataView);
    footerNavView(data.view);
  }
}

function footerNavButtons(anchorDataView) {
  for (let i = 0; i < $iconFooterNodeList.length; i++) {
    if ($iconFooterNodeList[i].getAttribute('data-view') === anchorDataView) {
      $iconFooterNodeList[i].classList.replace('icon-grey', 'icon-blue');
    } else {
      $iconFooterNodeList[i].classList.add('icon-blue', 'icon-grey');
    }
  }
}

function footerNavView(dataView) {
  if (dataView === 'review-form') {
    $footer.classList.add('hidden');
    if (data.formStatus === 'new') {
      $leftArrow.classList.remove('hidden');
    } else {
      $leftArrow.classList.add('hidden');
    }
  }
  if (dataView === 'search') {
    $footer.classList.remove('hidden');
    $leftArrow.classList.add('hidden');
  }
}

$reviewsPage.addEventListener('click', editIconClickEvent);

function editIconClickEvent(event) {
  let liDataReviewId = event.target.closest('li').getAttribute('data-review-id');
  liDataReviewId = Number(liDataReviewId);
  if (event.target.matches('i')) {
    viewSwap('review-form');
    getEntryData(liDataReviewId);
    renderEditForm(data.editing);
    $footer.classList.add('hidden');
  }
}

function getEntryData(reviewID) {
  for (let i = 0; i < data.reviews.length; i++) {
    if (reviewID === data.reviews[i].reviewID) {
      data.editing = data.reviews[i];
    }
  }
}

function renderEditForm(review) {
  $h3NewReview.textContent = 'Edit Review';
  data.formStatus = 'edit';
  $animeImgReview.setAttribute('src', review.animeImg);
  $animeTitleReview.value = review.animeTitle;
  $reviewTitle.value = review.reviewTitle;
  $reviewText.value = review.reviewText;

  for (let e = 0; e < data.editing.reviewRating; e++) {
    $starIconNodeList[e].classList.replace('far', 'fas');
  }
}

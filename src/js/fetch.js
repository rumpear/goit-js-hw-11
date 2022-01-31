import throttle from 'lodash.throttle';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import imgCardsTpl from '../templates/img-cards.hbs';
import PixabayApiService from './PixabayApi';

const refs = {
  gallery: document.querySelector('.gallery'),
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);

refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
refs.loadMoreBtn.hidden = true;

let gallery = new SimpleLightbox('.gallery a');
const pixabayApi = new PixabayApiService();

const scrollThrottled = throttle(infiniteScroll, 500);

async function onSearch(e) {
  e.preventDefault();
  cleanupRender();

  pixabayApi.query = e.currentTarget.elements.searchQuery.value.trim();
  pixabayApi.resetPage();

  if (!pixabayApi.query) {
    cleanupRender();
    refs.loadMoreBtn.hidden = true;
    // refs.searchForm.elements.search.disabled = true;
    return;
  }

  try {
    const { totalHits, hits } = await pixabayApi.fetchImg();
    // console.log(totalHits, hits);

    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again',
      );
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images`);
    renderImg(hits);
  } catch (error) {
    // console.log(error);
  }

  window.addEventListener('scroll', scrollThrottled);
}

async function onLoadMoreClick() {
  // * catch doesnt work
  const { hits } = await pixabayApi.fetchImg();

  try {
    renderImg(hits);

    if (hits.length < 40) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results");
      // refs.loadMoreBtn.hidden = true;
      window.removeEventListener('scroll', scrollThrottled);
    }
  } catch {
    // console.log(error);
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results");
    window.removeEventListener('scroll', scrollThrottled);
    return;
  }

  // * work
  // pixabayApi
  //   .fetchImg()
  //   .then(({ hits }) => {
  //     // console.log(hits.length);
  //     renderImg(hits);

  //     if (hits.length < 40) {
  //       Notiflix.Notify.info("We're sorry, but you've reached the end of search results");
  //       // refs.loadMoreBtn.hidden = true;
  //       window.removeEventListener('scroll', scrollThrottled);
  //     }
  //   })
  //   .catch(() => {
  //     Notiflix.Notify.info("We're sorry, but you've reached the end of search results");
  //     window.removeEventListener('scroll', scrollThrottled);
  //     return;
  //   });
}

function renderImg(hits) {
  const markup = hits.map(imgCardsTpl).join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
  // console.log(markup);
  // smoothFn();
}

function cleanupRender() {
  refs.gallery.innerHTML = '';
}

function infiniteScroll() {
  const documentRect = document.documentElement.getBoundingClientRect();

  console.log('top', documentRect.top);
  console.log('bottom', documentRect.bottom);
  console.log('clientHeight', document.documentElement.clientHeight);
  if (documentRect.bottom < document.documentElement.clientHeight + 500) {
    onLoadMoreClick();
  }
}

// * smooth
// function smoothFn() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }

// * scrolls
// function scrollHandler() {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
//   console.log('scrollTop', scrollTop);
//   console.log('scrollHeight', scrollHeight);
//   console.log('clientHeight', clientHeight);
//   if (clientHeight + scrollTop >= scrollHeight - 5) {
//     onLoadMoreClick();
//   }
// }

// function checkPosition() {
//   // Нам потребуется знать высоту документа и высоту экрана.
//   const height = document.body.offsetHeight;
//   const screenHeight = window.innerHeight;

//   // Они могут отличаться: если на странице много контента,
//   // высота документа будет больше высоты экрана (отсюда и скролл).

//   // Записываем, сколько пикселей пользователь уже проскроллил.
//   const scrolled = window.scrollY;

//   // Обозначим порог, по приближении к которому
//   // будем вызывать какое-то действие.
//   // В нашем случае — четверть экрана до конца страницы.
//   const threshold = height - screenHeight / 4;

//   // Отслеживаем, где находится низ экрана относительно страницы.
//   const position = scrolled + screenHeight;

//   if (position >= threshold) {
//     // Если мы пересекли полосу-порог, вызываем нужное действие.
//     onLoadMoreClick();
//     console.log('load');
//   }
// }

// window.addEventListener('resize', checkPosition);

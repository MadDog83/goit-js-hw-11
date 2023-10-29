import NewsApiService from './pix_app.js';
import notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const pixApiService = new NewsApiService('40208073-fe15c78bde1673dee4f2a3659');

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('#gallery'),
  loadMoreBtn: document.querySelector('#load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);

// Функція для обробки події надсилання форми
async function onSearch(e) { 
  
    e.preventDefault();
    clearGallery();
  
    const query = e.currentTarget.elements.searchQuery.value;
  
    // Перевірка на пустий рядок
    if (query.trim() === '') {
  
      notiflix.Notify.failure('Please enter a valid search query.');
      return;
    }
 
    pixApiService.query = query;
  
    // Скидання номера сторінки до одиниці
    pixApiService.resetPage();
  
    refs.loadMoreBtn.classList.add('is-hidden');
  
    // Виконання запиту до API для першої сторінки результатів
    try { 
      const images = await pixApiService.fetchImages(); 
  
      // Перевірка на наявність результатів
      if (images.length === 0) {
        
        notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
        return;
      }
  
      renderGallery(images);
      notiflix.Notify.success(`Hooray! We found ${pixApiService.totalHits} images.`);
  
      // Показати кнопку "load more", якщо зображень не менше 40
      if (images.length >= 40) {
        refs.loadMoreBtn.classList.remove('is-hidden');
      }
      
    } catch (error) { 
      console.error(error);
    }
  }

// Функція для очищення галереї
function clearGallery() {
  refs.gallery.innerHTML = '';
}

function renderGallery(images) {
  const markup = images
    .map(
      image => `
    <div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b> ${image.likes}
        </p>
        <p class="info-item">
          <b>Views</b> ${image.views}
        </p>
        <p class="info-item">
          <b>Comments</b> ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b> ${image.downloads}
        </p>
      </div>
    </div>
  `,
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

refs.loadMoreBtn.addEventListener('click', onLoadMore);
async function onLoadMore() { 
  
  try { 
    const images = await pixApiService.fetchImages(); 
    
    // Виконання запиту до API для наступної сторінки результатів
    renderGallery(images);

    scrollToNewElements();

    // Обчислення максимальної кількості сторінок
    const maxPages = Math.ceil(pixApiService.totalHits / pixApiService.perPage);
    
    // Приховати кнопку "load more" і показати повідомлення, якщо досягнуто кінця результатів
    if (pixApiService.page == maxPages || images.length < 40) {
      refs.loadMoreBtn.classList.add('is-hidden');
      notiflix.Notify.failure(
      'Were sorry, but youve reached the end of search results.'
      );
    }
  } catch (error) { 
    console.error(error);
  }
}

function scrollToNewElements() {
    
  const galleryItemsCount = refs.gallery.children.length;

  if (galleryItemsCount > 0 && galleryItemsCount >= pixApiService.perPage) {
    const lastItemBeforeClick = refs.gallery.children[galleryItemsCount - pixApiService.perPage];
    lastItemBeforeClick.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }
}

/* function scrollToNewElements() {
  const galleryItemsCount = refs.gallery.children.length;

  if (galleryItemsCount > 0 && galleryItemsCount >= pixApiService.perPage) {
    const lastItemBeforeClick = refs.gallery.children[galleryItemsCount - pixApiService.perPage];
    const { height: cardHeight } = lastItemBeforeClick.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  }
} */

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

  // Встановлення значення поля введення як ключового слова для пошуку
  pixApiService.query = query;

  refs.loadMoreBtn.classList.add('is-hidden');

  // Виконання запиту до API для першої сторінки результатів
  try { 
    const images = await pixApiService.fetchImages(); 

    // Перевірка на наявність результатів
    if (images.length === 0) {
      // Показ сповіщення про відсутність результатів
      notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      return;
    }

    renderGallery(images);

    // Показати повідомлення про кількість знайдених зображень
    notiflix.Notify.success(`Hooray! We found ${pixApiService.totalHits} images.`);

    // Показати кнопку завантажити більше
    refs.loadMoreBtn.classList.remove('is-hidden');
  } catch (error) { 
    console.error(error);
  }
}

// Функція для очищення галереї
function clearGallery() {
  refs.gallery.innerHTML = '';
}

function renderGallery(images) {
  // Створення розмітки за допомогою шаблону
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

  // Додавання розмітки до галереї
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

// Додавання обробника події до кнопки завантажити більше
refs.loadMoreBtn.addEventListener('click', onLoadMore);

// Функція для обробки події кліку на кнопку завантажити більше
async function onLoadMore() { 
  
  try { 
    const images = await pixApiService.fetchImages(); 

    // Перевірка, чи є ще зображення для завантаження
    if (images.length > 0) {
      
      renderGallery(images);

      scrollToNewElements();
    } else {
      
      refs.loadMoreBtn.classList.add('is-hidden');
      notiflix.Notify.info(
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

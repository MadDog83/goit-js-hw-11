// Імпорт класу NewsApiService з файлу pix_app.js
import NewsApiService from './pix_app.js';
import notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

// Створення екземпляру класу NewsApiService з унікальним ключем доступу до API
const pixApiService = new NewsApiService('40208073-fe15c78bde1673dee4f2a3659');

// Отримання посилань на елементи DOM
const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('#gallery'),
  loadMoreBtn: document.querySelector('#load-more'),
};

// Додавання слухача подій на форму пошуку
refs.searchForm.addEventListener('submit', onSearch);

// Функція обробки події сабміту форми
function onSearch(e) {
  // Запобігання перезавантаження сторінки
  e.preventDefault();

  // Очищення галереї від попередніх результатів
  clearGallery();

  // Отримання значення поля вводу
  const query = e.currentTarget.elements.searchQuery.value;

  // Перевірка на пустий рядок
  if (query.trim() === '') {
    // Показ повідомлення про помилку
    notiflix.Notify.failure('Please enter a valid search query.');
    return;
  }

  // Встановлення значення поля вводу як ключового слова для пошуку
  pixApiService.query = query;

  // Сховати кнопку завантаження більше
  refs.loadMoreBtn.classList.add('is-hidden');

  // Виконати запит до API за першою сторінкою результатів
  pixApiService.fetchImages().then(images => {
    // Перевірка на наявність результатів
    if (images.length === 0) {
      // Показ повідомлення про відсутність результатів
      notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      return;
    }

    // Рендер розмітки карток зображень у галереї
    renderGallery(images);

    // Показати кнопку завантаження більше
    refs.loadMoreBtn.classList.remove('is-hidden');
  });
}

// Функція очищення галереї
function clearGallery() {
  refs.gallery.innerHTML = '';
}

// Функція рендеру розмітки карток зображень
function renderGallery(images) {
  // Створення розмітки за шаблоном
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

// Додавання слухача подій на кнопку завантаження більше
refs.loadMoreBtn.addEventListener('click', onLoadMore);

// Функція обробки події кліку на кнопку
function onLoadMore() {
  // Виконати запит до API за наступною сторінкою результатів
  pixApiService.fetchImages().then(images => {
    // Рендер розмітки карток зображень у галереї
    renderGallery(images);

    // Прокрутити сторінку до нових елементів
    scrollToNewElements();
  });
}
// Функція прокрутки сторінки
function scrollToNewElements() {
    // Отримати кількість елементів у галереї
    const galleryItemsCount = refs.gallery.children.length;
  
    // Перевірити, чи галерея не порожня і чи кількість елементів не менша за 41
    if (galleryItemsCount > 0 && galleryItemsCount >= 41) {
      // Отримати посилання на останній елемент, який був до кліку на кнопку
      const lastItemBeforeClick = refs.gallery.children[galleryItemsCount - 41];
  
      // Прокрутити сторінку до цього елементу з плавним переходом
      lastItemBeforeClick.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }
  

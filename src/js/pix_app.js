
import axios from 'axios';

// Створення класу NewsApiService для виконання запитів до API сайту Pixabay
export default class NewsApiService {
  constructor(apiKey) {
    // Встановлення початкових значень полів класу
    this.apiKey = apiKey;
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
    this.totalHits = null;
  }

  // Метод для виконання запиту до API і повернення масиву зображень
  async fetchImages() {
    // Створення об'єкта параметрів запиту
    const params = {
      key: this.apiKey,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.perPage,
    };

    try {
      // Отримання відповіді з API за допомогою методу get і передача параметрів
      const response = await axios.get('https://pixabay.com/api/', { params });

      // Отримання даних з відповіді
      const data = response.data;

      // Збереження загальної кількості зображень, які відповідають критерію пошуку
      this.totalHits = data.totalHits;

      // Збільшення номера сторінки на одиницю для наступного запиту
      this.incrementPage();

      // Повернення масиву зображень 
      return data.hits;
    } catch (error) {
      // Виведення помилки у консоль
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

  
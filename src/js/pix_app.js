// Імпорт бібліотеки axios
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
    // Створення рядка запиту з параметрами
    const url = `https://pixabay.com/api/?key=${this.apiKey}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`;

    // Виконання запиту за допомогою бібліотеки axios і синтаксису async/await
    const response = await axios.get(url);

    // Отримання даних з відповіді
    const data = response.data;

    // Збереження загальної кількості зображень, які відповідають критерію пошуку
    this.totalHits = data.totalHits;

    // Збільшення номера сторінки на одиницю для наступного запиту
    this.incrementPage();

    // Повернення масиву зображень з даними
    return data.hits;
  }

  // Метод для збільшення номера сторінки на одиницю
  incrementPage() {
    this.page += 1;
  }

  // Метод для скидання номера сторінки до початкового значення
  resetPage() {
    this.page = 1;
  }

  // Геттер і сеттер для поля searchQuery
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

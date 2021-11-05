const DATA_URL = 'https://pixabay.com/api/';
const API_KEY = '24123899-30dafe3a116d297502be19e37'; //мой
// const API_KEY = '21882924-40498065f1aa5022828b315f8'; // чужой

export default class ApiServie {
  constructor() {
    this.searchQuery = 'fl';
    this.page = 1;
    this.perPage = 12;
    this.imgType = 'photo';
    this.orientation = 'horizontal'
  }
    
  async toGetData() {  // получаем ответ в data на запрос по url
    try {
      // формируем url строку http запроса
      const url = `${DATA_URL}?image_type=${this.imgType}&orientation=${this.orientation}&q=${this.searchQuery}&page=${this.page}&per_page=${this.perPage}&key=${API_KEY}`;

      const response = await fetch(url); // получаем ответ от сервера
      // console.log(response)
      const data = await response.json(); // преобразуем в JSON
      this.page += 1;
      return data.hits; // возвращаем полученные данные
}
    catch (error) {
      console.log(error);
    }
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

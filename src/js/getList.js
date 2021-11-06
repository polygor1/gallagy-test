const DATA_URL = 'https://pixabay.com/api/';
const API_KEY = '24123899-30dafe3a116d297502be19e37'; //мой

export default async function getList(searshDate) {
  try {
    const url = `${DATA_URL}?image_type=${searshDate.imgType}&orientation=${searshDate.orient}&q=${searshDate.query}&page=${searshDate.page}&per_page=${searshDate.perPage}&key=${API_KEY}`;
    const response = await fetch(url); // получаем ответ от сервера
    const data = await response.json(); // преобразуем в JSON
    return data.hits; // возвращаем полученные данные
  }
  catch (error) {
    console.log(error);
  }
}

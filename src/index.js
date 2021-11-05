import './sass/main.scss';
const debounce = require('lodash.debounce');

import error from './js/pnotify';
import {refs} from './js/refs';
import imgTemplate from './template/imgCard';
import getList from './js/getList';
// import LoadMoreBtn from './js/loadMoreBtn';

// const loadMoreBtn = new LoadMoreBtn({
//   selector: '[data-action="load-more"]',
//   hidden: true,
// });

// const element = document.getElementById('load-more-button');
let countPage = 1;
// ========= main start ===========

// Вводим строку в input и ждем
refs.input.addEventListener('input',
  debounce(getSearchString, 750),
);
// ========= main end =============

// Проверяем значение с инпута 
function getSearchString(event) {
// убираем пробелы
  let inputValue = event.target.value.trim();
// если пустая строка - ругаемся
  if (!inputValue) {
    clearContent();
    errorRequest('Invalid request. Please try again');
    return;
  };
// если норм лезем искать по списку в сети и получаем array или ругаемся
  clearScreen();
  getList({
    query: inputValue,
    page: 1,
    perPage : 12,
    imgType : 'photo',
    orient: 'horizontal',
  })
    .then(array => showResult(array))
    .catch(error => errorRequest(error));
  
};
console.log('ales!')
// Выводим значение 
function showResult(array) {
    // Добавляем новую разметку для элементов
  displayTemplate(array);

  window.addEventListener("scroll", function(){

    const block = document.getElementById('infinite-scroll');
    // console.log(block)
    let y = 0;
    const contentHeight = block.offsetHeight; // высота блока контента вместе с границами
    let yOffset       = window.pageYOffset;   // текущее положение скролбара
    let window_height = window.innerHeight;   // высота внутренней области окна документа
    y = Math.max(y, Math.ceil(yOffset + window_height));
    
    // если пользователь достиг конца
    if (y >= contentHeight) {  
      // countPage += 1;
      // getList({
      //           query: inputValue,
      //           page: countPage,
      //           perPage : 12,
      //           imgType : 'photo',
      //           orient : 'horizontal',
      // })
      // .then(array => showResult(array, inputValue))
      // .catch(error => errorRequest(error));
      // console.log('>>',array)//загружаем новое содержимое 


      // displayTemplate(array);
    }
  });
};

function displayTemplate(array) {
  const markup = imgTemplate(array);
  refs.elementContainer.insertAdjacentHTML('beforeend', markup);
}
// Создаем разметку для элемента по шаблону из .hbs
function showContentsElement(array) {
  // window.addEventListener('keydown', onKeyPress);
  // window.addEventListener('click', onOverlayClick);


};
// сообщние об ошибке
function errorRequest(message){
  error({
    title: '', 
    text: message, 
    delay: 2500,  
  }); 
};
// чистка экрана
function clearScreen() {
  refs.gallaryList.innerHTML = '';
  refs.elementContainer.innerHTML = '';
}
// чистка контента
function clearContent() {
  countPage = 1;
  refs.input.value = '';
  refs.gallaryList.innerHTML = '';
  refs.elementContainer.innerHTML = '';  
};
// вываливание по ESC
function onKeyPress(event) {
  switch (event.code) {
    case 'Escape': {
      clearContent();
      break;
      // можно еще case добавить
    };
  }
};
// вываливание по клику мышкой на экране
function onOverlayClick(event) {
  const target = event.target;
  if (target.classList.value === "screen__overlay") {
    clearContent();
  }
};
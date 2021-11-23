import './sass/main.scss';
const debounce = require('lodash.debounce');
const throttle = require('lodash.throttle');

import error from './js/pnotify';
import {refs} from './js/refs';
import imgTemplate from './template/imgCard';
import beautiSpinner from './template/spiner';
import getList from './js/getList';
import { pull } from 'lodash';

// import {spin} from './js/spiner';
// console.log(spin)

const lightBoxModal = document.querySelector(".js-lightbox");
const closeModalBtn = lightBoxModal.querySelector('[data-action="close-lightbox"]');

let allImg = '';
let ansver = true;
let viewModal = false;
let searshDate = {
      query: '',
      page: 1,
      perPage : 12,
      imgType : 'photo',
      orient : 'horizontal',
};
let countTarget = 0;

// ========= main start ===========

searshInput.focus();
window.addEventListener('keydown', onKeyPress);
// Вводим строку в input и ждем
refs.input.addEventListener('input',
  debounce(getSearchString, 750),
);
// почти бесконечный scroll 
window.addEventListener("scroll", throttle(() => {
  const block = document.getElementById('infinite-scroll');
  const contentHeight = block.offsetHeight; // высота блока контента вместе с границами
  let y = 0;  
  let yOffset = window.pageYOffset;   // текущее положение скролбара
  let window_height = window.innerHeight;   // высота внутренней области окна документа
  y = Math.max(y, Math.ceil(yOffset + window_height)); // шаманство
  // если доскролил до конца загруженного массива
  if (searshDate.page <= 1) return; // если всего одна страница в результатах поиска
  if (y >= contentHeight && ansver) { // если больше одной страницы и предыдущий ответ не был пуст
    getList({ ...searshDate })
    .then(array => showResult(array))
    .catch(error => errorRequest(error));
  }
}, 750), ); //задержка после достижения конца загруженного массива

console.log('Ales gut!') // шЮтка ;-)

// ========= main end =============

// Проверяем значение с инпута 
function getSearchString(event) {
// убираем пробелы // не убираем - поиск по фразе
  let inputValue = event.target.value;
    // .trim();
// если пустая строка - ругаемся
  if (!inputValue) {
    clearContent();
    errorRequest('Invalid request. Please try again');
    return;
  };
// если норм лезем искать по БД в сети и получаем array или ругаемся
  searshDate.query = inputValue;
  searshDate.page = 1;
  clearScreen();
  getList({ ...searshDate })
    .then(array => showResult(array))
    .catch(error => errorRequest(error));
};

// Выводим значение 
function showResult(array) {
  if (array.length === 0) {
    ansver = false; // если ничего не пришло в ответе
    return
  };
  console.log('page =', searshDate.page) // номер листа в ответе

  // Добавляем новую разметку для элементов галлереи
  const markup = imgTemplate(array);
  refs.elementContainer.insertAdjacentHTML('beforeend', markup);
  
  // Добавляем индикатор задержки загрузки
  const onLoadGallery = document.querySelectorAll('.gallery__item');
  delayIndicator(onLoadGallery, "photo-card", 'photo-img')

  searshDate.page += 1; // макароны
  ansver = true;

  // слушаем клик по галлерее
  refs.galleryList.addEventListener("click", onOpenModal);
};

// Индикатор задержки загрузки
function delayIndicator(array, classConteiner, classImg) {
  console.log(array)
  array.forEach(element => {

  // console.log(element)
    
    // если разметки нет то
    if (!element.getElementsByClassName('delay-indicator')[0]) { 
      // вставляем разметку индикатора в HTML 
      const cardItem = element.getElementsByClassName(classConteiner)[0];

      // console.log(cardItem)

      cardItem.insertAdjacentHTML('afterbegin', beautiSpinner());

      const delayIndicator = element.getElementsByClassName('delay-indicator')[0];
      const imgPhoto = element.getElementsByClassName(classImg)[0];

      delayIndicator.classList.remove('is-hidden'); // показываем индикатор
      imgPhoto.onload = function () { // ловим событие окончания загрузки
        delayIndicator.classList.add('is-hidden'); // посмотрели и хватит
      };
    };
  });
};

// сообщение об ошибке
function errorRequest(message){
  error({
    title: '', 
    text: message, 
    delay: 2500,  
  }); 
};

// чистка экрана
function clearScreen() {
  refs.galleryList.innerHTML = '';
  refs.elementContainer.innerHTML = '';
};

// чистка контента
function clearContent() {
  searshDate.page = 1;
  refs.input.value = '';
  refs.galleryList.innerHTML = '';
  refs.elementContainer.innerHTML = '';  
};

// ======== light modal ==========

// выковыривание данных для показа
function lightBoxImgView(arrayImg, number) {
  lightBoxImg(arrayImg[number].dataset.source, arrayImg[number].alt);
};

// показ картинки
function lightBoxImg(original, description) {
  const imgView = document.querySelector(".lightbox__image");
  imgView.setAttribute('src', original);
  imgView.setAttribute('alt', description);

  delayIndicator(document.querySelectorAll(".lightbox"), 'lightbox__content', 'lightbox__image');
};

// открытие модалки для увеличенного показа
function onOpenModal(event) {
  event.preventDefault();
  viewModal = true;
  const target = event.target;
  const numberTarget = [...refs.galleryList.childNodes].indexOf(target.parentNode.parentNode, 0);
  countTarget = numberTarget / 2;
  if (target.nodeName !== "IMG") return;
  closeModalBtn.addEventListener('click', onCloseModal);
  lightBoxModal.addEventListener('click', onOverlayClick);
  lightBoxModal.classList.add('is-open');

  allImg = refs.galleryList.querySelectorAll(".photo-img");

  lightBoxImgView(allImg, countTarget);
};

// закрытие модалки
function onCloseModal() {
  viewModal = false;
  allImg = '';
  lightBoxImg('', '');
  lightBoxModal.removeEventListener('click', onOverlayClick);
  closeModalBtn.removeEventListener('click', onCloseModal);
  lightBoxModal.classList.remove('is-open');
};

// клик мимо картинки
function onOverlayClick(event) {
  const target = event.target;
  if (target.classList.value === "lightbox__overlay") {
    onCloseModal();
  }
};

// обработка клавиатуры
function onKeyPress(event) {
  switch (event.code) {
    case 'Escape': {
      if (viewModal) {
        searshInput.focus();
        onCloseModal()
      } else {
        clearContent();
        clearScreen();
      };
      break;
    };
    case 'ArrowLeft': {
      if (viewModal) {
        if (countTarget <= 0) countTarget = allImg.length;
        countTarget -= 1;
        lightBoxImgView(allImg, countTarget);
        break;
      };
    };
    case 'ArrowRight': {
      if (viewModal) {
        if (countTarget >= allImg.length - 1) countTarget = -1;
        countTarget += 1;
        lightBoxImgView(allImg, countTarget);
        break;
      };
    };
  };
};


import './sass/main.scss';
const debounce = require('lodash.debounce');
const throttle = require('lodash.throttle');

import error from './js/pnotify';
import {refs} from './js/refs';
import imgTemplate from './template/imgCard';
import getList from './js/getList';

const lightBoxModal = document.querySelector(".js-lightbox");
const closeModalBtn = lightBoxModal.querySelector('[data-action="close-lightbox"]');

let allImg = '';

let searshDate = {
      query: '',
      page: 1,
      perPage : 12,
      imgType : 'photo',
      orient : 'horizontal',
};

let countTarget = 0;

// ========= main start ===========

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
  if (searshDate.page <= 1) return;
  if (y >= contentHeight) {
    getList({ ...searshDate })
    .then(array => showResult(array))
    .catch(error => errorRequest(error));
  }
}, 750), ); //задержка после достижения конца загруженного массива

console.log('Ales gut!')

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
  searshDate.query = inputValue;
  searshDate.page = 1;
  clearScreen();
  getList({ ...searshDate })
    .then(array => showResult(array))
    .catch(error => errorRequest(error));
};

// Выводим значение 
function showResult(array) {
  if (array.length === 0) return;
  // console.log('page =', searshDate.page)
  // Добавляем новую разметку для элементов
  const markup = imgTemplate(array);
  refs.elementContainer.insertAdjacentHTML('beforeend', markup);
  searshDate.page += 1;
  // слушаем клик по галлерее
  refs.galleryList.addEventListener("click", onOpenModal);
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
  refs.galleryList.innerHTML = '';
  refs.elementContainer.innerHTML = '';
}
// чистка контента
function clearContent() {
  searshDate.page = 1;
  refs.input.value = '';
  refs.galleryList.innerHTML = '';
  refs.elementContainer.innerHTML = '';  
};

// ======== light modal ==========

function lightBoxImg(original, description) {
  const imgView = document.querySelector(".lightbox__image");
  imgView.setAttribute('src', original);
  imgView.setAttribute('alt', description);
};

function lightBoxImgView(arrayImg, number) {
  lightBoxImg(arrayImg[number].dataset.source, arrayImg[number].alt);
};

function onOpenModal(event) {
  event.preventDefault();
  const target = event.target;
  const numberTarget = [...refs.galleryList.childNodes].indexOf(target.parentNode.parentNode, 0);
  countTarget = numberTarget / 2;
  if (target.nodeName !== "IMG") return;
  window.addEventListener('keydown', onKeyPress);
  closeModalBtn.addEventListener('click', onCloseModal);
  lightBoxModal.addEventListener('click', onOverlayClick);
  lightBoxModal.classList.add('is-open');

  allImg = refs.galleryList.querySelectorAll(".photo-img");

  lightBoxImgView(allImg, countTarget);
};

function onCloseModal() {
  allImg = '';
  lightBoxImg('', '');
  window.removeEventListener('keydown', onKeyPress);
  lightBoxModal.removeEventListener('click', onOverlayClick);
  closeModalBtn.removeEventListener('click', onCloseModal);
  lightBoxModal.classList.remove('is-open');
};

function onOverlayClick(event) {
  const target = event.target;
  if (target.classList.value === "lightbox__overlay") {
    onCloseModal();
  }
};

function onKeyPress(event) {
  switch (event.code) {
    case 'Escape': {
      onCloseModal();
      break;
    };
    case 'ArrowLeft': {
      if (countTarget <= 0) countTarget = allImg.length;
      countTarget -= 1;
      break;
    };
    case 'ArrowRight': {
      if (countTarget >= allImg.length - 1) countTarget = -1;
      countTarget += 1;
      break;
    };
  };
  lightBoxImgView(allImg, countTarget);
};
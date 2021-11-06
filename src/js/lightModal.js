// galleryList.addEventListener("click", onOpenModal);

// const allImg = galleryList.querySelectorAll(".gallery__image");
// const lightBoxModal = document.querySelector(".js-lightbox");
// const closeModalBtn = lightBoxModal.querySelector('[data-action="close-lightbox"]');

// let countTarget = 0;

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
  const numberTarget = [...galleryList.childNodes].indexOf(target.parentNode.parentNode, 0);
  countTarget = numberTarget;
  if (target.nodeName !== "IMG") return;
  window.addEventListener('keydown', onKeyPress);
  closeModalBtn.addEventListener('click', onCloseModal);
  lightBoxModal.addEventListener('click', onOverlayClick);
  lightBoxModal.classList.add('is-open');
  lightBoxImgView(allImg, numberTarget);
};

function onCloseModal() {
  lightBoxImg("", "")
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
      if (countTarget > 0) countTarget -= 1;
      break;
    };
    case 'ArrowRight': {
      if (countTarget < allImg.length - 1) countTarget += 1;
      break;
    };
    case 'ArrowDown': {
      if (countTarget <= 0) countTarget = allImg.length;
      countTarget -= 1;
      break;
    };
    case 'ArrowUp': {
      if (countTarget >= allImg.length - 1) countTarget = -1;
      countTarget += 1;
      break;
    };
  };
  lightBoxImgView(allImg, countTarget);
};
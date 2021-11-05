window.addEventListener("scroll", function(){

    const block = document.getElementById('infinite-scroll');
    // var counter = 1;
    
    const contentHeight = block.offsetHeight;      // 1) высота блока контента вместе с границами
    let yOffset       = window.pageYOffset;      // 2) текущее положение скролбара
    let window_height = window.innerHeight;      // 3) высота внутренней области окна документа
    let y             = yOffset + window_height;
    
    // если пользователь достиг конца
    if(y >= contentHeight)
    {
        //загружаем новое содержимое в элемент
        // block.innerHTML = block.innerHTML + "<div>Случайный текст или еще, что то</div>";
    }
});
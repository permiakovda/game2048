// Елси js не сработал на сайте то нужно показать соответствующее уведомление.
// если js сработал, то просто убираем класс no-js с body


document.addEventListener('DOMContentLoaded', function () {
    // Ссылка на body с классом .no-js
    const bodyElem = document.querySelector('.no-js');

    // Отключить класс .no-js т.к. js подключен
    bodyElem.classList.remove('no-js');

    // убрать ненужный элемент с классом no-js-infoblock
    const noJsInfoblock = document.querySelector('.no-js-infoblock');

    noJsInfoblock.remove();
});

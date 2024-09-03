// app.js
import { Modal, Visit, VisitDentist, VisitCardiologist, VisitTherapist } from './classes.js';

document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('authButton');
    const preloader = document.getElementById('preloader');
    const visitBoard = document.getElementById('visitBoard');
    const modal = new Modal('myModal');
    function showPreloader() {
        preloader.removeAttribute('hidden');
    }

    function hidePreloader() {
        preloader.setAttribute('hidden', '');
    }


    authButton.addEventListener('click', () => {
        // Логіка авторизації
        showPreloader();
        // Після успішної авторизації:
        authButton.textContent = 'Створити візит';
        hidePreloader();
    });



    authButton.addEventListener('click', () => {
        const modal = new Modal();
        modal.show();
    });
    // Показати модальне вікно
    modal.show();

    // Додати обробник події для закриття
    document.querySelector('.close').addEventListener('click', () => {
        modal.hide();
    });

    // Приклад додаткової логіки, наприклад при натисканні на кнопку:
    document.getElementById('authButton').addEventListener('click', () => {
        modal.show();
    });
    // Функції для фільтрації та роботи з картками будуть тут

    // Завантаження карток після авторизації
    // Наприклад:
    // fetchCards();
});

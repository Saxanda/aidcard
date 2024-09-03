// app.js
import {Modal, Visit, VisitDentist, VisitCardiologist, VisitTherapist} from './classes.js';
import {AuthModal} from './AuthModal.js';


document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('authButton');
    const createVisitButton = document.getElementById('createVisitButton');
    const logOutButton = document.getElementById('logOutButton');

    const preloader = document.getElementById('preloader');
    const visitBoard = document.getElementById('visitBoard');
    const modal = new Modal('modal');
    function showPreloader() {
        preloader.removeAttribute('hidden');
    }

    function hidePreloader() {
        preloader.setAttribute('hidden', '');
    }


    authButton.addEventListener('click', async () => {
        showPreloader();
        try {
            const authModalInstance = new AuthModal();
            await authModalInstance.show();
        } catch (error) {
            console.error('Error rendering the authorization modal:', error);
        } finally {
            hidePreloader();
        }
    });


    createVisitButton.addEventListener('click', () => {
        const modal = new Modal();
        modal.show();
    });

    // Показати модальне вікно
    // modal.show();

    // Додати обробник події для закриття
    document.querySelector('.close').addEventListener('click', () => {
        modal.hide();
    });

    // Додаткова логіка з модальним вікном
    document.getElementById('authButton').addEventListener('click', () => {
        modal.show();
    });
    // Функції для фільтрації та роботи з картками будуть тут

    // Завантаження карток після авторизації
    // Наприклад:
    // fetchCards();
});

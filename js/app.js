// app.js
import {Modal, Visit, VisitDentist, VisitCardiologist, VisitTherapist} from './classes.js';
import {AuthModal} from './AuthModal.js';
import { setupFilters } from './filter.js';

document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('authButton');
    const createVisitButton = document.getElementById('createVisitButton');
    const logOutButton = document.getElementById('logOutButton');

    const preloader = document.getElementById('preloader');
    const visitBoard = document.getElementById('visitBoard');

    let currentCardId = null; //
    let visits = []; // Змінна для зберігання візитів

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

    // Функція для відображення карток
    function renderVisits(filteredVisits) {
        visitBoard.innerHTML = ''; // Очищуємо старий список
        if (filteredVisits.length === 0) {
            visitBoard.innerHTML = '<p>No visits found.</p>';
        } else {
            filteredVisits.forEach(cardData => {
                createCardOnBoard(cardData);
            });
        }
    }

    createVisitButton.addEventListener('click', () => {
        const modal = new Modal();
        modal.show();
    });

    // Функції для фільтрації та роботи з картками будуть тут

    // Завантаження карток після авторизації
    // Наприклад:
    loadCards();

});

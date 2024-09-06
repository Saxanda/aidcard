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
    const modal = new Modal('modal');
    const token = '4ad26a78-dd59-4adb-8346-251c76da7daf';
    let currentCardId = null;

    function showPreloader() {
        preloader.removeAttribute('hidden');
    }

    function hidePreloader() {
        preloader.setAttribute('hidden', '');
    }

    async function loadCards() {
        showPreloader();
        visitBoard.innerHTML = '';
        try {
            const response = await fetch("https://ajax.test-danit.com/api/v2/cards", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const cards = await response.json();
    
            cards.forEach(cardData => {
                createCardOnBoard(cardData);
            });
            
            setupFilters();
            
        } catch (error) {
            console.error('Error loading cards:', error);
        } finally {
            hidePreloader();
        }
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


    logOutButton.addEventListener('click', () => {
        document.querySelector('.main').classList.toggle('main--hidden');
        const navButtons = document.querySelectorAll('#authButton, #signUpButton, #createVisitButton, #logOutButton');
        navButtons.forEach(btn => btn.classList.toggle('button--hidden'));
    });

    createVisitButton.addEventListener('click', () => {
        modal.show();
    });

    document.querySelector('.close').addEventListener('click', () => {
        modal.hide();
    });

    document.getElementById('authButton').addEventListener('click', () => {
        modal.show();
    });

    document.getElementById('doctor').addEventListener('change', (event) => {
        const doctorType = event.target.value;
        const specificFields = document.getElementById('specificFields');
        specificFields.innerHTML = ''; 

        if (doctorType === 'cardiologist') {
            specificFields.innerHTML = `
                <label for="bloodPressure">Тиск:</label>
                <input type="text" id="bloodPressure" name="bloodPressure" required>

                <label for="bmi">Індекс маси тіла:</label>
                <input type="text" id="bmi" name="bmi" required>

                <label for="heartDiseases">Перенесені захворювання:</label>
                <textarea id="heartDiseases" name="heartDiseases" required></textarea>

                <label for="age">Вік:</label>
                <input type="number" id="age" name="age" required>
            `;
        } else if (doctorType === 'dentist') {
            specificFields.innerHTML = `
                <label for="lastVisitDate">Дата останнього відвідування:</label>
                <input type="date" id="lastVisitDate" name="lastVisitDate" required>
            `;
        } else if (doctorType === 'therapist') {
            specificFields.innerHTML = `
                <label for="age">Вік:</label>
                <input type="number" id="age" name="age" required>
            `;
        }
    });

    // Валідація даних форми перед відправкою
    document.getElementById('visitForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        // Валідація тиску (повинно бути числом і перебувати в діапазоні від 50 до 160)
        if (data.doctor === 'cardiologist') {
            const bloodPressure = parseInt(data.bloodPressure, 10);
            if (isNaN(bloodPressure) || bloodPressure < 50 || bloodPressure > 160) {
                alert('Введіть коректний тиск (від 50 до 160).');
                return;
            }

            const bmi = parseFloat(data.bmi);
            if (isNaN(bmi) || bmi <= 0) {
                alert('Введіть коректний ІМТ.');
                return;
            }
        }

        // Валідація віку (повинно бути числом більше 0)
        if (data.age && (isNaN(data.age) || parseInt(data.age, 10) <= 0)) {
            alert('Введіть коректний вік.');
            return;
        }

        let visit;
        switch (data.doctor) {
            case 'cardiologist':
                visit = new VisitCardiologist(
                    data.doctor,
                    data.purpose,
                    data.description,
                    data.urgency,
                    data.fullName,
                    data.bloodPressure,
                    data.bmi,
                    data.heartDiseases,
                    data.age
                );
                break;
            case 'dentist':
                visit = new VisitDentist(
                    data.doctor,
                    data.purpose,
                    data.description,
                    data.urgency,
                    data.fullName,
                    data.lastVisitDate
                );
                break;
            case 'therapist':
                visit = new VisitTherapist(
                    data.doctor,
                    data.purpose,
                    data.description,
                    data.urgency,
                    data.fullName,
                    data.age
                );
                break;
            default:
                visit = new Visit(
                    data.doctor,
                    data.purpose,
                    data.description,
                    data.urgency,
                    data.fullName
                );
        }

        if (currentCardId) {
            fetch(`https://ajax.test-danit.com/api/v2/cards/${currentCardId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(visit)
            })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                updateCardOnBoard(response);
                modal.hide();
            })
            .catch(error => console.error('Error:', error));
        } else {
            fetch("https://ajax.test-danit.com/api/v2/cards", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(visit)
            })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                createCardOnBoard(response);
                modal.hide();
            })
            .catch(error => console.error('Error:', error));
        }
    });

    function createCardOnBoard(cardData) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = cardData.id;
        card.setAttribute('draggable', 'true');  // Додаємо можливість перетягування

        const additionalInfo = `
            <div class="more-info hidden">
                <p><strong>Опис:</strong> ${cardData.description}</p>
                <p><strong>Терміновість:</strong> ${cardData.urgency}</p>
                <p><strong>ПІБ:</strong> ${cardData.fullName}</p>
                ${cardData.doctor === 'cardiologist' ? `
                    <p><strong>Тиск:</strong> ${cardData.bloodPressure}</p>
                    <p><strong>Індекс маси тіла:</strong> ${cardData.bmi}</p>
                    <p><strong>Перенесені захворювання:</strong> ${cardData.heartDiseases}</p>
                    <p><strong>Вік:</strong> ${cardData.age}</p>
                ` : ''}
                ${cardData.doctor === 'dentist' ? `
                    <p><strong>Дата останнього відвідування:</strong> ${cardData.lastVisitDate}</p>
                ` : ''}
                ${cardData.doctor === 'therapist' ? `
                    <p><strong>Вік:</strong> ${cardData.age}</p>
                ` : ''}
            </div>
        `;

        card.innerHTML = `
            <h3>${cardData.fullName}</h3>
            <p>${cardData.doctor}</p>
            ${additionalInfo}
            <button class="show-more">Показати більше</button>
            <button class="edit">Редагувати</button>
            <button class="delete">Видалити</button>
        `;
        visitBoard.appendChild(card);
    }

    function updateCardOnBoard(cardData) {
        const card = document.querySelector(`.card[data-id="${cardData.id}"]`);
        if (card) {
            const additionalInfo = `
                <div class="more-info hidden">
                    <p><strong>Опис:</strong> ${cardData.description}</p>
                    <p><strong>Терміновість:</strong> ${cardData.urgency}</p>
                    <p><strong>ПІБ:</strong> ${cardData.fullName}</p>
                    ${cardData.doctor === 'cardiologist' ? `
                        <p><strong>Тиск:</strong> ${cardData.bloodPressure}</p>
                        <p><strong>Індекс маси тіла:</strong> ${cardData.bmi}</p>
                        <p><strong>Перенесені захворювання:</strong> ${cardData.heartDiseases}</p>
                        <p><strong>Вік:</strong> ${cardData.age}</p>
                    ` : ''}
                    ${cardData.doctor === 'dentist' ? `
                        <p><strong>Дата останнього відвідування:</strong> ${cardData.lastVisitDate}</p>
                    ` : ''}
                    ${cardData.doctor === 'therapist' ? `
                        <p><strong>Вік:</strong> ${cardData.age}</p>
                    ` : ''}
                </div>
            `;
            card.innerHTML = `
                <h3>${cardData.fullName}</h3>
                <p>${cardData.doctor}</p>
                ${additionalInfo}
                <button class="show-more">Показати більше</button>
                <button class="edit">Редагувати</button>
                <button class="delete">Видалити</button>
            `;
        }
    }

    visitBoard.addEventListener('click', (event) => {
        const card = event.target.closest('.card');
        if (card) {
            const cardId = card.dataset.id;

            if (event.target.classList.contains('delete')) {
                if (confirm('Ви впевнені, що хочете видалити цю картку?')) {
                    fetch(`https://ajax.test-danit.com/api/v2/cards/${cardId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                    })
                    .then(response => {
                        if (response.ok) {
                            card.remove();
                        } else {
                            console.error('Failed to delete card');
                        }
                    })
                    .catch(error => console.error('Error:', error));
                }
            } else if (event.target.classList.contains('edit')) {
                fetch(`https://ajax.test-danit.com/api/v2/cards/${cardId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                })
                .then(response => response.json())
                .then(cardData => {
                    document.getElementById('doctor').value = cardData.doctor;
                    document.getElementById('purpose').value = cardData.purpose;
                    document.getElementById('description').value = cardData.description;
                    document.getElementById('urgency').value = cardData.urgency;
                    document.getElementById('fullName').value = cardData.fullName;

                    const specificFields = document.getElementById('specificFields');
                    specificFields.innerHTML = '';

                    if (cardData.doctor === 'cardiologist') {
                        specificFields.innerHTML = `
                            <label for="bloodPressure">Тиск:</label>
                            <input type="text" id="bloodPressure" name="bloodPressure" value="${cardData.bloodPressure}" required>

                            <label for="bmi">Індекс маси тіла:</label>
                            <input type="text" id="bmi" name="bmi" value="${cardData.bmi}" required>

                            <label for="heartDiseases">Перенесені захворювання:</label>
                            <textarea id="heartDiseases" name="heartDiseases" required>${cardData.heartDiseases}</textarea>

                            <label for="age">Вік:</label>
                            <input type="number" id="age" name="age" value="${cardData.age}" required>
                        `;
                    } else if (cardData.doctor === 'dentist') {
                        specificFields.innerHTML = `
                            <label for="lastVisitDate">Дата останнього відвідування:</label>
                            <input type="date" id="lastVisitDate" name="lastVisitDate" value="${cardData.lastVisitDate}" required>
                        `;
                    } else if (cardData.doctor === 'therapist') {
                        specificFields.innerHTML = `
                            <label for="age">Вік:</label>
                            <input type="number" id="age" name="age" value="${cardData.age}" required>
                        `;
                    }

                    modal.show();
                    currentCardId = cardId;
                })
                .catch(error => console.error('Error:', error));
            } else if (event.target.classList.contains('show-more')) {
                const moreInfo = card.querySelector('.more-info');
                moreInfo.classList.toggle('hidden');
                event.target.textContent = moreInfo.classList.contains('hidden') ? 'Показати більше' : 'Сховати';
            }
        }
    });


    visitBoard.addEventListener('dragstart', (event) => {
        if (event.target.classList.contains('card')) {
            event.target.classList.add('dragging');
        }
    });

    visitBoard.addEventListener('dragend', (event) => {
        if (event.target.classList.contains('card')) {
            event.target.classList.remove('dragging');
        }
    });

    visitBoard.addEventListener('dragover', (event) => {
        event.preventDefault();
        const afterElement = getDragAfterElement(visitBoard, event.clientY);
        const draggingCard = document.querySelector('.dragging');
        if (afterElement == null) {
            visitBoard.appendChild(draggingCard);
        } else {
            visitBoard.insertBefore(draggingCard, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    loadCards(); // Завантаження карток при старті сторінки
});

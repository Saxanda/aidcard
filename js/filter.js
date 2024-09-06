export function setupFilters() {
    const searchInput = document.getElementById('search');
    const doctorFilter = document.getElementById('doctorFilter');
    const urgencyFilter = document.getElementById('urgencyFilter');
    const visitBoard = document.getElementById('visitBoard');

    searchInput.addEventListener('input', applyFilters);
    doctorFilter.addEventListener('change', applyFilters);
    urgencyFilter.addEventListener('change', applyFilters);

    function applyFilters() {
        const searchText = searchInput.value.toLowerCase();
        const selectedDoctor = doctorFilter.value;
        const selectedUrgency = urgencyFilter.value;

        const cards = visitBoard.querySelectorAll('.card');

        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const urgency = card.querySelector('.more-info').querySelectorAll('p')[1]?.textContent.toLowerCase();
            const doctor = card.querySelector('p').textContent.toLowerCase();

            const matchesSearch = title.includes(searchText) || description.includes(searchText);
            const matchesDoctor = selectedDoctor === 'all' || doctor.includes(selectedDoctor);
            const matchesUrgency = selectedUrgency === 'all' || urgency.includes(selectedUrgency);

            if (matchesSearch && matchesDoctor && matchesUrgency) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

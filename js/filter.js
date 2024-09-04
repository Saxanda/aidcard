export function setupFilters(visits, renderVisits) {
    const searchInput = document.getElementById('search');
    const statusFilter = document.getElementById('statusFilter');
    const urgencyFilter = document.getElementById('urgencyFilter');

    // всі фільтри
    function applyFilters() {
        let filteredVisits = visits;

        // пошук у заголовку або описі
        const searchTerm = searchInput.value.toLowerCase();
        filteredVisits = filteredVisits.filter(visit => {
            return visit.title.toLowerCase().includes(searchTerm) ||
                visit.description.toLowerCase().includes(searchTerm);
        });

        // статусом
        const selectedStatus = statusFilter.value;
        if (selectedStatus !== 'all') {
            filteredVisits = filteredVisits.filter(visit => visit.status === selectedStatus);
        }

        // терміновість
        const selectedUrgency = urgencyFilter.value;
        if (selectedUrgency !== 'all') {
            filteredVisits = filteredVisits.filter(visit => visit.urgency === selectedUrgency);
        }

        // Вивести фільтр
        renderVisits(filteredVisits);
    }

    // застосувати фільтр
    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    urgencyFilter.addEventListener('change', applyFilters);
}

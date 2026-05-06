document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search for an app...';
    searchInput.id = 'searchBar';
    document.body.insertBefore(searchInput, document.querySelector('.buttons-here'));

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const imgButtons = document.querySelectorAll('.imgbutton');

        imgButtons.forEach(function(button) {
            const altText = button.alt.toLowerCase();
            const parent = button.closest('a');

            if (altText.includes(query)) {
                parent.style.display = '';
            } else {
                parent.style.display = 'none';
            }
        });
    });
});

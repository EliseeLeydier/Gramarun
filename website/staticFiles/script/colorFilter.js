function applyColorFilter(type) {
    let body = document.body;
    body.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (type !== 'reset') {
        body.classList.add(type);
    }
    localStorage.setItem('colorFilter', type);
}

// Appliquer le filtre lors du chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    let filterType = localStorage.getItem('colorFilter');
    if (filterType) {
        applyColorFilter(filterType);
    }
});
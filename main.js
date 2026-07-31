// main.js

// Inicializar Animaciones AOS
AOS.init({
    once: true,
    offset: 50 
});

// Lógica del menú hamburguesa
const btnMenu = document.getElementById('btn-menu');
const menuLinks = document.getElementById('menu-links');
const icon = btnMenu.querySelector('i');
const menuItems = document.querySelectorAll('.menu-item');

// Abrir/Cerrar menú al tocar el botón
btnMenu.addEventListener('click', () => {
    menuLinks.classList.toggle('hidden');
    menuLinks.classList.toggle('flex');
    
    // Cambiar ícono a "X" (cerrar) o "hamburguesa" (abrir)
    if (menuLinks.classList.contains('flex')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Cerrar menú automáticamente al seleccionar una opción (solo en móvil)
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        if(window.innerWidth < 768) {
            menuLinks.classList.add('hidden');
            menuLinks.classList.remove('flex');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    let navbar = document.querySelector('.navbar');
    let menuBtn = document.querySelector('#menu-btn');

    menuBtn.onclick = () => {
        navbar.classList.toggle('active');
    }

    window.onscroll = () => {
        navbar.classList.remove('active');
    }
});
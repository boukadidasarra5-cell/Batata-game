const starsDiv = document.querySelector('.stars');
const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

for (let i = 0; i < 50; i++) {
    const star = document.createElement('div');
    star.style.position = 'absolute';
    star.style.width = '2px';
    star.style.height = '2px';
    star.style.background = 'white';
    star.style.borderRadius = '50%';
    star.style.top = Math.random() * window.innerHeight + 'px';
    star.style.left = Math.random() * window.innerWidth + 'px';
    star.style.opacity = Math.random();
    starsDiv.appendChild(star);
}

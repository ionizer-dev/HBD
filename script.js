let slides, current = 0, timer;
let isPaused = false;
const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff'];


window.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('bgMusic');
    if (!music) return;

    music.load();

    const musicStatus = sessionStorage.getItem('musicActive');
    if (musicStatus === 'true') {
        music.play().catch(() => {
            document.addEventListener('click', () => {
                music.play();
                sessionStorage.setItem('musicActive', 'true');
            }, { once: true });
        });
    }
});


function startExperience() {
    const music = document.getElementById('bgMusic');
    if (music) {
        music.play().catch(e => console.log('Play blocked:', e));
        sessionStorage.setItem('musicActive', 'true');
    }
    window.location.href = "calendar.html";
}


function toggleMusic() {
    const music = document.getElementById('bgMusic');
    if (!music) return;

    if (music.paused) {
        music.play();
        sessionStorage.setItem('musicActive', 'true');
    } else {
        music.pause();
        sessionStorage.setItem('musicActive', 'false');
    }
}


function launchConfetti() {
    for (let i = 0; i < 100; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = (2 + Math.random() * 3) + 's';
        document.body.appendChild(piece);
    }
}


function endCelebration() {
    const overlay = document.getElementById('celebrationOverlay');
    const mainContent = document.getElementById('mainContent');

    if (overlay && mainContent) {
        overlay.classList.add('fade-out');
        setTimeout(() => {
            overlay.style.display = 'none';
            mainContent.style.display = 'block';
            startSlideshow();
        }, 1000);
    }
}


function startSlideshow() {
    slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        showSlide(0);
        resetTimer();
    }
}

function showSlide(i) {
    slides.forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });

    current = i;
    slides[current].classList.add('active');
    slides[current].style.display = 'block';

    const caption = document.getElementById('caption');
    if (caption) {
        caption.textContent = slides[current].dataset.caption || 'A special memory...';
    }

   
    const dots = document.querySelectorAll('.dot');
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
}

function moveSlide(dir) {
    current += dir;

    if (current >= slides.length) {
        window.location.href = "message.html";
        return;
    }

    if (current < 0) {
        current = 0;
    }

    showSlide(current);
    resetTimer();
}

function resetTimer() {
    clearInterval(timer);
    if (!isPaused) {
        timer = setInterval(() => moveSlide(1), 10000); // 6 seconds per slide
    }
}

function togglePause() {
    isPaused = !isPaused;
    const pauseBtn = document.getElementById('pauseBtn');

    if (isPaused) {
        clearInterval(timer);
        if (pauseBtn) pauseBtn.textContent = '▶ Play';
    } else {
        if (pauseBtn) pauseBtn.textContent = '⏸ Pause';
        resetTimer();
    }
}


function buildDots() {
    const dotsContainer = document.getElementById('dots');
    if (!dotsContainer) return;

    slides = document.querySelectorAll('.slide');
    dotsContainer.innerHTML = '';

    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (idx === 0 ? ' active' : '');
        dot.onclick = () => {
            showSlide(idx);
            resetTimer();
        };
        dotsContainer.appendChild(dot);
    });
}



window.onload = () => {
    if (document.getElementById('celebrationOverlay')) {
        buildDots();
        launchConfetti();

        const music = document.getElementById('bgMusic');
        if (music) {
            music.load();
        }

        
        setTimeout(() => {
            const overlay = document.getElementById('celebrationOverlay');
            if (overlay) {
                overlay.classList.add('fade-out');
                setTimeout(() => {
                    overlay.style.display = 'none';
                    document.getElementById('mainContent').style.display = 'block';
                    startSlideshow();

                    // Play music after overlay is gone
                    if (music) {
                        music.currentTime = 0;
                        music.play().catch(e => console.log('Play blocked:', e));
                        sessionStorage.setItem('musicActive', 'true');
                    }
                }, 800);
            }
        }, 3500);
    }
};

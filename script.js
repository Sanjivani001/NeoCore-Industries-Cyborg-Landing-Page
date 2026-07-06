// ===============================
// NeoCore Industries
// script.js
// ===============================

const header = document.querySelector('.site-header');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');
const stats = document.querySelectorAll('.stat[data-target]');
const revealElements = document.querySelectorAll('.reveal');
let countersStarted = false;

const smoothScroll = (event) => {
    if (!event.target.matches('a[href^="#"]')) return;
    event.preventDefault();
    const href = event.target.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
};

document.addEventListener('click', smoothScroll);

const updateYear = () => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
};

const handleHeaderScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
};

const updateActiveNav = () => {
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);

        if (scrollPosition >= top && scrollPosition < top + height) {
            navLinks.forEach((link) => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
};

const animateCounters = () => {
    if (countersStarted) return;
    stats.forEach((stat) => {
        const target = Number(stat.dataset.target);
        const valueElement = stat.querySelector('h2');
        const suffix = valueElement.textContent.includes('%') ? '%' : valueElement.textContent.includes('/7') ? '/7' : '';
        let count = 0;
        const duration = 1600;
        const step = Math.max(1, Math.round(target / (duration / 16)));

        const updateValue = () => {
            count += step;
            if (count >= target) {
                count = target;
                valueElement.textContent = `${count}${suffix}`;
            } else {
                valueElement.textContent = `${count}${suffix}`;
                requestAnimationFrame(updateValue);
            }
        };

        updateValue();
    });
    countersStarted = true;
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            if (entry.target.classList.contains('stats')) {
                animateCounters();
            }
            if (entry.target.classList.contains('stat')) {
                entry.target.classList.add('reveal-visible');
            }
        }
    });
}, {
    threshold: 0.15,
});

revealElements.forEach((element) => revealObserver.observe(element));
stats.forEach((stat) => revealObserver.observe(stat));

window.addEventListener('scroll', () => {
    handleHeaderScroll();
    updateActiveNav();
});

updateYear();
handleHeaderScroll();
updateActiveNav();
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinksUl = document.querySelector('nav .nav-links');

    // --- Mobile Menu Toggle ---
    mobileMenuToggle.addEventListener('click', () => {
        const isMenuOpen = navLinksUl.classList.toggle('open');
        mobileMenuToggle.classList.toggle('active'); // For the X animation

        if (isMenuOpen) {
            mobileMenuToggle.setAttribute('aria-label', 'Close navigation menu');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
        } else {
            mobileMenuToggle.setAttribute('aria-label', 'Open navigation menu');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // --- Smooth Scrolling for all anchor links in the nav ---
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // If mobile menu is open, close it when a link is clicked
            if (navLinksUl.classList.contains('open')) {
                navLinksUl.classList.remove('open');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-label', 'Open navigation menu');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }

            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = header.offsetHeight;
                // getBoundingClientRect().top is relative to the viewport
                const elementPosition = targetElement.getBoundingClientRect().top;
                // We need the position relative to the document, adjusted for the header
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Highlight Active Navigation Link on Scroll ---
    const sections = document.querySelectorAll('main section[id]');
    const mainNavLinks = document.querySelectorAll('nav .nav-links a');

    const highlightNav = () => {
        let currentSectionId = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            // Add a 1px buffer to ensure the correct section is highlighted
            const sectionTop = section.offsetTop - header.offsetHeight - 1;
            if (scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        mainNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNav);
    // Initial call to set the correct link on page load (e.g., if refreshed on a section)
    highlightNav();

    // --- Animate Skills on Scroll using Intersection Observer ---
    const skillsContainer = document.querySelector('.skills-container');

    const observerOptions = {
        root: null, // observing relative to the viewport
        rootMargin: '0px',
        threshold: 0.2 // trigger when 20% of the container is visible
    };

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skills = entry.target.querySelectorAll('.skill');
                skills.forEach((skill, index) => {
                    // Stagger the animation by adding a delay to each skill
                    skill.style.transitionDelay = `${index * 100}ms`;
                    skill.classList.add('visible');
                });
                observer.unobserve(entry.target); // Stop observing once the animation has run
            }
        });
    }, observerOptions);

    if (skillsContainer) {
        skillsObserver.observe(skillsContainer);
    }
});
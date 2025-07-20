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

    // --- Header Scroll Effect ---
    const handleHeaderScroll = () => {
        // Add .scrolled class to header when user scrolls more than 50px
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

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

    // --- Combined scroll event handler for performance ---
    const onScroll = () => {
        handleHeaderScroll();
        highlightNav();
    };

    window.addEventListener('scroll', onScroll);
    // Initial call to set correct states on page load (e.g., if refreshed on a section)
    onScroll();
    // --- Animate Skills on Scroll using Intersection Observer ---
    const skillCards = document.querySelectorAll('.skill-card');

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // When a card comes into view, add the 'is-visible' class which triggers the CSS animation
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Stop observing the card so the animation only happens once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the card is visible
    });

    // Attach the observer to each skill card
    skillCards.forEach(card => {
        skillsObserver.observe(card);
    });

    // --- View More Projects Button ---
    const viewMoreBtn = document.getElementById('view-more-projects-btn');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent the link from navigating
            const hiddenProjects = document.querySelectorAll('.project-card.hidden');
            hiddenProjects.forEach(project => {
                project.classList.remove('hidden');
            });
            // Hide the button after it's clicked
            viewMoreBtn.style.display = 'none';
        });
    }
});
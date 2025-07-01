// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
// Event slider functionality
let currentEventIndex = 0;
const totalEvents = 3;

function updateEventSlider() {
    const slides = document.querySelector('.event-slides');
    const indicators = document.querySelectorAll('.indicator');
    const slider = document.querySelector('.event-slider');
    const currentSlide = document.querySelectorAll('.event-slide')[currentEventIndex];
    
    if (slides) {
        slides.style.transform = `translateX(-${currentEventIndex * 33.333}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index === currentEventIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        // Adjust container height to match current slide
        if (currentSlide && slider) {
            const slideHeight = currentSlide.scrollHeight;
            const minHeight = 450;
            const finalHeight = Math.max(slideHeight, minHeight);
            slider.style.height = finalHeight + 'px';
        }
    }
}

function nextEvent() {
    currentEventIndex = (currentEventIndex + 1) % totalEvents;
    updateEventSlider();
}

function previousEvent() {
    currentEventIndex = (currentEventIndex - 1 + totalEvents) % totalEvents;
    updateEventSlider();
}

function goToEvent(index) {
    currentEventIndex = index;
    updateEventSlider();
}

// Touch/swipe functionality
let startX = 0;
let startY = 0;
let distX = 0;
let distY = 0;
let threshold = 100; // minimum distance for swipe
let restraint = 100; // maximum distance perpendicular to swipe direction
let allowedTime = 500; // maximum time allowed to travel that distance
let elapsedTime = 0;
let startTime = 0;

function handleTouchStart(e) {
    const touchobj = e.changedTouches[0];
    startX = touchobj.pageX;
    startY = touchobj.pageY;
    startTime = new Date().getTime();
}

function handleTouchEnd(e) {
    const touchobj = e.changedTouches[0];
    distX = touchobj.pageX - startX;
    distY = touchobj.pageY - startY;
    elapsedTime = new Date().getTime() - startTime;
    
    if (elapsedTime <= allowedTime) {
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
            if (distX > 0) {
                // Swipe right - go to previous event
                previousEvent();
            } else {
                // Swipe left - go to next event
                nextEvent();
            }
        }
    }
}

// Initialize event slider
document.addEventListener('DOMContentLoaded', function() {
    const eventSlider = document.querySelector('.event-slider');
    
    if (eventSlider) {
        // Add touch event listeners
        eventSlider.addEventListener('touchstart', handleTouchStart, { passive: true });
        eventSlider.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Add keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (document.querySelector('.event-slider:hover') || document.activeElement.closest('.event-slider')) {
                if (e.key === 'ArrowLeft') {
                    previousEvent();
                } else if (e.key === 'ArrowRight') {
                    nextEvent();
                }
            }
        });
        
        // Auto-play functionality (optional)
        let autoPlayInterval;
        
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                nextEvent();
            }, 5000); // Change slide every 5 seconds
        }
        
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }
        
        // Start auto-play
        startAutoPlay();
        
        // Pause auto-play on hover
        eventSlider.addEventListener('mouseenter', stopAutoPlay);
        eventSlider.addEventListener('mouseleave', startAutoPlay);
        
        // Pause auto-play on touch
        eventSlider.addEventListener('touchstart', stopAutoPlay);
        eventSlider.addEventListener('touchend', () => {
            setTimeout(startAutoPlay, 3000); // Resume after 3 seconds
        });
        
        // Recalculate heights on window resize
        window.addEventListener('resize', function() {
            updateEventSlider();
        });
    }
    
    // Initialize slider position and height
    updateEventSlider();
});

// Function to manually recalculate all slide heights (useful if content is dynamically updated)
function recalculateSlideHeights() {
    const slides = document.querySelectorAll('.event-slide');
    const slider = document.querySelector('.event-slider');
    
    if (slides.length > 0 && slider) {
        let maxHeight = 450; // minimum height
        
        slides.forEach(slide => {
            const slideHeight = slide.scrollHeight;
            maxHeight = Math.max(maxHeight, slideHeight);
        });
        
        slider.style.height = maxHeight + 'px';
    }
}
// Form submission handling with Formspree
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-form');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'sending...';
    submitBtn.disabled = true;
    
    // Submit to Formspree
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            form.reset();
        } else {
            throw new Error('Form submission failed');
        }
    }).catch(error => {
        showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
    }).finally(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
});

// Enhanced scroll effects for header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const scrolled = window.scrollY > 100;
    
    if (scrolled) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.backdropFilter = 'blur(20px)';
        header.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(20px)';
        header.style.borderBottom = '1px solid rgba(0, 0, 0, 0.05)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements and observe them
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.mission-card, .service-card, .team-card, .event-card, .opportunity-card');
    
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Parallax effect for floating elements
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.float-item');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
});

// Card tilt effect
document.querySelectorAll('.mission-card, .service-card, .team-card, .event-card').forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        this.style.transform = 'translateY(-10px) rotateX(5deg) rotateY(5deg)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function(e) {
        this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
    
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
});

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4ecdc4, #45b7d1)' : 
                   type === 'error' ? 'linear-gradient(135deg, #ff6b6b, #ff8a80)' : 
                   'linear-gradient(135deg, #667eea, #764ba2)'};
        color: white;
        padding: 15px 20px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-weight: 600;
        font-size: 0.9rem;
        max-width: 300px;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add some interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Add click effects to buttons
    document.querySelectorAll('.btn, .event-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Dynamic logo color change based on scroll position
window.addEventListener('scroll', function() {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const hue = scrollPercent * 360;
    
    const logoBackground = document.querySelector('.logo-bg');
    if (logoBackground) {
        logoBackground.style.background = `linear-gradient(135deg, 
            hsl(${hue}, 70%, 60%), 
            hsl(${(hue + 60) % 360}, 70%, 60%), 
            hsl(${(hue + 120) % 360}, 70%, 60%), 
            hsl(${(hue + 180) % 360}, 70%, 60%))`;
    }
});

// Add loading animation for page
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
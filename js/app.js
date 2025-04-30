document.addEventListener('DOMContentLoaded', function() {
  // High contrast toggle
  const contrastToggle = document.getElementById('contrast-toggle');
  if (contrastToggle) {
    // Check for saved preference
    if (localStorage.getItem('highContrast') === 'true') {
      document.body.classList.add('high-contrast');
      contrastToggle.textContent = 'Normal Mode';
    }
    
    contrastToggle.addEventListener('click', function() {
      document.body.classList.toggle('high-contrast');
      const isHighContrast = document.body.classList.contains('high-contrast');
      this.textContent = isHighContrast ? 'Normal Mode' : 'High Contrast';
      localStorage.setItem('highContrast', isHighContrast);
      
      // Add animation feedback
      this.classList.add('animate__animated', 'animate__pulse');
      setTimeout(() => {
        this.classList.remove('animate__animated', 'animate__pulse');
      }, 500);
    });
  }
  
  // Skip to content functionality
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.getElementById('main');
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        
        // Smooth scroll
        window.scrollTo({
          top: target.offsetTop - 20,
          behavior: 'smooth'
        });
        
        setTimeout(() => target.removeAttribute('tabindex'), 1000);
      }
    });
  }
  
  // Add hover effects to restaurant cards
  const cards = document.querySelectorAll('.restaurant-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const stars = this.querySelector('.rating-stars');
      if (stars) {
        stars.style.animation = 'pulse 0.8s infinite, float 3s ease-in-out infinite';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      const stars = this.querySelector('.rating-stars');
      if (stars) {
        stars.style.animation = 'pulse 2s infinite, float 4s ease-in-out infinite';
      }
    });
  });
});
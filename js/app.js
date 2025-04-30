document.addEventListener('DOMContentLoaded', function() {
  // High contrast toggle
  const contrastToggle = document.getElementById('contrast-toggle');
  if (contrastToggle) {
    contrastToggle.addEventListener('click', function() {
      document.body.classList.toggle('high-contrast');
      localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
      
      // Update button text
      const isHighContrast = document.body.classList.contains('high-contrast');
      this.textContent = isHighContrast ? 'Toggle Normal View' : 'Toggle High Contrast';
    });
    
    // Check for saved preference
    if (localStorage.getItem('highContrast') === 'true') {
      document.body.classList.add('high-contrast');
      contrastToggle.textContent = 'Toggle Normal View';
    }
  }
  
  // Skip link functionality
  const skipLink = document.querySelector('[href="#main"]');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.getElementById('main');
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        setTimeout(() => target.removeAttribute('tabindex'), 1000);
      }
    });
  }
  
  // Add hover effects to cards
  const cards = document.querySelectorAll('.restaurant-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.querySelector('.rating-stars').style.animation = 'pulse 0.8s infinite';
    });
    
    card.addEventListener('mouseleave', function() {
      this.querySelector('.rating-stars').style.animation = 'pulse 2s infinite';
    });
  });
});
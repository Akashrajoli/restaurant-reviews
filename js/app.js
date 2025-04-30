document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  
  // Check for saved theme preference
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.textContent = 'Light Mode';
  }
  
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    
    // Update button text
    this.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Add animation
    this.classList.add('animate__animated', 'animate__pulse');
    setTimeout(() => {
      this.classList.remove('animate__animated', 'animate__pulse');
    }, 500);
  });

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
});
// Add to your existing app.js

// Star Rating Animation
function animateStars() {
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, index) => {
    star.style.animationDelay = `${index * 0.1}s`;
  });
}

// Review Form Toggle
function setupReviewForm() {
  const reviewBtn = document.getElementById('write-review-btn');
  const reviewForm = document.getElementById('review-form-container');
  
  if (reviewBtn && reviewForm) {
    reviewBtn.addEventListener('click', () => {
      reviewForm.style.display = reviewForm.style.display === 'none' ? 'block' : 'none';
      reviewBtn.textContent = reviewForm.style.display === 'none' ? 'Write a Review' : 'Cancel';
    });
  }

  // Star Rating Input
  const starInputs = document.querySelectorAll('.star-input');
  starInputs.forEach(star => {
    star.addEventListener('click', function() {
      const value = parseInt(this.getAttribute('data-value'));
      
      // Update visual display
      starInputs.forEach((s, i) => {
        if (i < value) {
          s.classList.add('active');
          s.textContent = '★';
        } else {
          s.classList.remove('active');
          s.textContent = '☆';
        }
      });
    });
  });
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
  // Your existing code...
  
  animateStars();
  setupReviewForm();
});
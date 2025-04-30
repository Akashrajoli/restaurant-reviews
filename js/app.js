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
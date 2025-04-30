// Theme Toggle
function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  const icon = themeToggle.querySelector('i');
  
  // Check for saved theme preference
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    icon.classList.replace('bi-moon-fill', 'bi-sun-fill');
    themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i> Light Mode';
  }
  
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    
    // Update icon and text
    if (isDark) {
      icon.classList.replace('bi-moon-fill', 'bi-sun-fill');
      themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i> Light Mode';
    } else {
      icon.classList.replace('bi-sun-fill', 'bi-moon-fill');
      themeToggle.innerHTML = '<i class="bi bi-moon-fill"></i> Dark Mode';
    }
    
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// Skip Link
function setupSkipLink() {
  const skipLink = document.querySelector('.skip-link');
  if (!skipLink) return;
  
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('main');
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
      window.scrollTo({
        top: target.offsetTop - 20,
        behavior: 'smooth'
      });
      setTimeout(() => target.removeAttribute('tabindex'), 1000);
    }
  });
}

// Review System (only on restaurant page)
function setupReviewSystem() {
  const reviewFormContainer = document.getElementById('review-form-container');
  if (!reviewFormContainer) return;
  
  const reviews = JSON.parse(localStorage.getItem('restaurantReviews')) || {};
  const restaurantId = '1'; // Using a fixed ID for this demo
  
  // DOM Elements
  const reviewBtn = document.getElementById('write-review-btn');
  const cancelBtn = document.getElementById('cancel-review');
  const form = document.getElementById('review-form');
  const reviewsContainer = document.getElementById('reviews-container');
  
  // Sample reviews if none exist
  if (!reviews[restaurantId]) {
    reviews[restaurantId] = [
      {
        name: "Sarah Johnson",
        rating: 5,
        text: "The handmade pasta was exceptional, and the staff was very accommodating to my gluten-free needs. The ambiance is perfect for a romantic evening.",
        date: "March 15, 2023"
      },
      {
        name: "Michael Chen",
        rating: 4,
        text: "Great wine selection and the truffle pasta was divine. The noise level was a bit high in the main dining area, but they happily moved us to the quieter section when we asked.",
        date: "February 28, 2023"
      }
    ];
    localStorage.setItem('restaurantReviews', JSON.stringify(reviews));
  }
  
  // Load existing reviews
  renderReviews(reviews[restaurantId]);
  
  // Toggle review form
  reviewBtn.addEventListener('click', () => {
    reviewFormContainer.style.display = reviewFormContainer.style.display === 'none' ? 'block' : 'none';
    reviewBtn.innerHTML = reviewFormContainer.style.display === 'none' ? 
      '<i class="bi bi-pencil-square"></i> Write a Review' : 
      '<i class="bi bi-x-circle"></i> Cancel';
  });
  
  cancelBtn.addEventListener('click', () => {
    reviewFormContainer.style.display = 'none';
    reviewBtn.innerHTML = '<i class="bi bi-pencil-square"></i> Write a Review';
    form.reset();
    resetStarRating();
  });
  
  // Star rating input
  const starInputs = document.querySelectorAll('.star-input');
  let selectedRating = 0;
  
  starInputs.forEach(star => {
    star.addEventListener('click', function() {
      selectedRating = parseInt(this.getAttribute('data-value'));
      updateStarRating(selectedRating);
    });
  });
  
  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const spinner = document.getElementById('submit-spinner');
    const submitText = document.querySelector('.submit-text');
    
    // Show loading state
    submitText.textContent = 'Submitting...';
    spinner.classList.remove('d-none');
    submitBtn.disabled = true;
    
    // Simulate submission
    setTimeout(() => {
      const reviewData = {
        name: document.getElementById('reviewer-name').value.trim(),
        rating: selectedRating,
        text: document.getElementById('review-text').value.trim(),
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
      
      // Validate
      if (!reviewData.name || !reviewData.text || !reviewData.rating) {
        alert('Please fill all required fields');
        submitText.textContent = 'Submit Review';
        spinner.classList.add('d-none');
        submitBtn.disabled = false;
        return;
      }
      
      // Add to reviews
      reviews[restaurantId].unshift(reviewData);
      localStorage.setItem('restaurantReviews', JSON.stringify(reviews));
      
      // Reset form
      form.reset();
      resetStarRating();
      reviewFormContainer.style.display = 'none';
      reviewBtn.innerHTML = '<i class="bi bi-pencil-square"></i> Write a Review';
      
      // Render new review
      renderReviews(reviews[restaurantId]);
      
      // Reset button state
      submitText.textContent = 'Submit Review';
      spinner.classList.add('d-none');
      submitBtn.disabled = false;
      
      // Show success
      const successAlert = document.createElement('div');
      successAlert.className = 'alert alert-success mt-3';
      successAlert.textContent = 'Thank you for your review!';
      reviewsContainer.prepend(successAlert);
      setTimeout(() => successAlert.remove(), 3000);
    }, 800);
  });
  
  // Helper functions
  function updateStarRating(rating) {
    starInputs.forEach((star, index) => {
      if (index < rating) {
        star.textContent = '★';
        star.classList.add('active');
      } else {
        star.textContent = '☆';
        star.classList.remove('active');
      }
    });
  }
  
  function resetStarRating() {
    selectedRating = 0;
    starInputs.forEach(star => {
      star.textContent = '☆';
      star.classList.remove('active');
    });
  }
  
  function renderReviews(reviewsArray) {
    reviewsContainer.innerHTML = '';
    
    if (!reviewsArray || reviewsArray.length === 0) {
      reviewsContainer.innerHTML = `
        <div class="text-center py-4">
          <i class="bi bi-chat-square-text display-6 text-muted mb-3"></i>
          <p class="text-muted">No reviews yet. Be the first to review!</p>
        </div>
      `;
      return;
    }
    
    reviewsArray.forEach((review, index) => {
      const reviewElement = document.createElement('div');
      reviewElement.className = `review-card ${index === 0 ? 'new-review' : ''}`;
      reviewElement.innerHTML = `
        <div class="review-header">
          <h5 class="h6 mb-0">${review.name}</h5>
          <div class="review-rating" aria-label="${review.rating} out of 5 stars">
            ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
          </div>
        </div>
        <div class="review-date">${review.date}</div>
        <div class="review-content">${review.text}</div>
      `;
      reviewsContainer.appendChild(reviewElement);
    });
  }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
  setupThemeToggle();
  setupSkipLink();
  setupReviewSystem();
});
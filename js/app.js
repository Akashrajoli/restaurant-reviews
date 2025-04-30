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

// Review System
function setupReviewSystem() {
  const reviewFormContainer = document.getElementById('review-form-container');
  if (!reviewFormContainer) return;
  
  // Initialize reviews if not exists
  if (!localStorage.getItem('restaurantReviews')) {
    localStorage.setItem('restaurantReviews', JSON.stringify({
      '1': [ // Using restaurant ID '1' for Pasta Paradiso
        {
          name: "Sarah Johnson",
          rating: 5,
          text: "The handmade pasta was exceptional, and the staff was very accommodating to my gluten-free needs. The ambiance is perfect for a romantic evening.",
          date: new Date('2023-03-15').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        },
        {
          name: "Michael Chen",
          rating: 4,
          text: "Great wine selection and the truffle pasta was divine. The noise level was a bit high in the main dining area, but they happily moved us to the quieter section when we asked.",
          date: new Date('2023-02-28').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        }
      ]
    }));
  }
  
  const reviews = JSON.parse(localStorage.getItem('restaurantReviews'));
  const restaurantId = '1'; // Fixed ID for Pasta Paradiso
  
  // DOM Elements
  const reviewBtn = document.getElementById('write-review-btn');
  const cancelBtn = document.getElementById('cancel-review');
  const form = document.getElementById('review-form');
  const reviewsContainer = document.getElementById('reviews-container');
  
  // Star rating elements
  const starInputs = document.querySelectorAll('.star-input');
  let selectedRating = 0;
  
  // Load existing reviews
  renderReviews();
  
  // Event Listeners
  reviewBtn.addEventListener('click', toggleReviewForm);
  cancelBtn.addEventListener('click', cancelReview);
  
  starInputs.forEach(star => {
    star.addEventListener('click', function() {
      selectedRating = parseInt(this.getAttribute('data-value'));
      updateStarRating(selectedRating);
    });
  });
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    submitReview();
  });
  
  // Functions
  function toggleReviewForm() {
    const isVisible = reviewFormContainer.style.display === 'block';
    reviewFormContainer.style.display = isVisible ? 'none' : 'block';
    reviewBtn.innerHTML = isVisible ? 
      '<i class="bi bi-pencil-square"></i> Write a Review' : 
      '<i class="bi bi-x-circle"></i> Cancel';
  }
  
  function cancelReview() {
    reviewFormContainer.style.display = 'none';
    reviewBtn.innerHTML = '<i class="bi bi-pencil-square"></i> Write a Review';
    form.reset();
    resetStarRating();
  }
  
  function updateStarRating(rating) {
    starInputs.forEach((star, index) => {
      star.textContent = index < rating ? '★' : '☆';
      star.classList.toggle('active', index < rating);
    });
  }
  
  function resetStarRating() {
    selectedRating = 0;
    starInputs.forEach(star => {
      star.textContent = '☆';
      star.classList.remove('active');
    });
  }
  
  function submitReview() {
    const submitBtn = form.querySelector('button[type="submit"]');
    const spinner = document.getElementById('submit-spinner');
    const submitText = document.querySelector('.submit-text');
    
    // Show loading state
    submitText.textContent = 'Submitting...';
    spinner.classList.remove('d-none');
    submitBtn.disabled = true;
    
    // Get form data
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
    renderReviews();
    
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
  }
  
  function renderReviews() {
    const currentReviews = JSON.parse(localStorage.getItem('restaurantReviews'))[restaurantId];
    reviewsContainer.innerHTML = '';
    
    if (!currentReviews || currentReviews.length === 0) {
      reviewsContainer.innerHTML = `
        <div class="text-center py-4">
          <i class="bi bi-chat-square-text display-6 text-muted mb-3"></i>
          <p class="text-muted">No reviews yet. Be the first to review!</p>
        </div>
      `;
      return;
    }
    
    currentReviews.forEach((review, index) => {
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
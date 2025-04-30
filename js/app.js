// Sample data
const restaurants = [
  {
    id: 1,
    name: "Pasta Paradise",
    image: "../images/pasta.jpg",
    address: "123 Main St, Anytown",
    description: "Authentic Italian cuisine with gluten-free options available.",
    rating: 4,
    accessibility: {
      wheelchair: true,
      brailleMenu: false,
      largePrintMenu: true,
      quietArea: false
    },
    reviews: [
      {
        user: "Jane D.",
        rating: 5,
        comment: "Great food and excellent wheelchair access!",
        date: "4/25/2023"
      }
    ]
  },
  {
    id: 2,
    name: "Burger Barn",
    image: "../images/burger.jpg",
    address: "456 Oak Ave, Anytown",
    description: "Classic American burgers with vegan options.",
    rating: 3,
    accessibility: {
      wheelchair: true,
      brailleMenu: true,
      largePrintMenu: true,
      quietArea: true
    },
    reviews: []
  }
];

// Feature labels
const featureLabels = {
  wheelchair: "Wheelchair accessible",
  brailleMenu: "Braille menu available",
  largePrintMenu: "Large print menu available",
  quietArea: "Quiet dining area available"
};

let currentRestaurant = null;

document.addEventListener('DOMContentLoaded', function() {
  // Check which page we're on
  if (document.getElementById('restaurant-list')) {
    loadRestaurants();
  } else if (document.getElementById('restaurant-name')) {
    loadRestaurantDetails();
  }
});

function loadRestaurants() {
  const container = document.getElementById('restaurant-list');
  
  restaurants.forEach(restaurant => {
    const card = document.createElement('div');
    card.className = 'col-md-6 mb-4';
    card.innerHTML = `
      <div class="card h-100" role="article" aria-labelledby="rest-${restaurant.id}-title">
        <img src="${restaurant.image}" class="card-img-top" 
             alt="${restaurant.name} restaurant" aria-hidden="false">
        <div class="card-body">
          <h3 id="rest-${restaurant.id}-title" class="h5 card-title">${restaurant.name}</h3>
          <div class="rating mb-2" role="img" aria-label="Rating: ${restaurant.rating} out of 5 stars">
            <span class="visually-hidden">Rating: ${restaurant.rating} out of 5 stars</span>
            <span aria-hidden="true">${'★'.repeat(restaurant.rating)}${'☆'.repeat(5 - restaurant.rating)}</span>
          </div>
          <p class="card-text">${restaurant.description}</p>
          <a href="restaurant.html?id=${restaurant.id}" class="btn btn-primary">
            View Details
          </a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function loadRestaurantDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));
  const restaurant = restaurants.find(r => r.id === id);
  
  if (!restaurant) {
    // Handle error case
    return;
  }
  
  currentRestaurant = restaurant;
  
  // Set basic info
  document.getElementById('restaurant-name').textContent = restaurant.name;
  document.getElementById('restaurant-image').src = restaurant.image;
  document.getElementById('restaurant-image').alt = `${restaurant.name} restaurant`;
  document.getElementById('restaurant-address').textContent = restaurant.address;
  document.getElementById('restaurant-description').textContent = restaurant.description;
  
  // Set rating
  const ratingElement = document.querySelector('.rating');
  ratingElement.setAttribute('aria-label', `Rating: ${restaurant.rating} out of 5 stars`);
  ratingElement.querySelector('.visually-hidden').textContent = `Rating: ${restaurant.rating} out of 5 stars`;
  ratingElement.querySelector('span[aria-hidden="true"]').innerHTML = 
    '★'.repeat(restaurant.rating) + '☆'.repeat(5 - restaurant.rating);
  
  // Set accessibility features
  const featuresList = document.getElementById('accessibility-features');
  featuresList.innerHTML = '';
  for (const [feature, available] of Object.entries(restaurant.accessibility)) {
    if (available) {
      const li = document.createElement('li');
      li.textContent = featureLabels[feature] || feature;
      featuresList.appendChild(li);
    }
  }
  
  // Load reviews
  displayReviews(restaurant.reviews);
  
  // Set up review form
  setupReviewForm();
}

function displayReviews(reviews) {
  const container = document.getElementById('reviews-container');
  container.innerHTML = '';
  
  if (reviews.length === 0) {
    container.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
    return;
  }
  
  reviews.forEach(review => {
    const reviewElement = document.createElement('div');
    reviewElement.className = 'card mb-3';
    reviewElement.innerHTML = `
      <div class="card-body">
        <h4 class="h6 card-title">${review.user}</h4>
        <div class="rating mb-2" role="img" aria-label="Rated ${review.rating} out of 5">
          <span class="visually-hidden">Rated ${review.rating} out of 5</span>
          <span aria-hidden="true">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
        </div>
        <p class="card-text">${review.comment}</p>
        <small class="text-muted">${review.date}</small>
      </div>
    `;
    container.appendChild(reviewElement);
  });
}

function setupReviewForm() {
  const form = document.getElementById('review-form');
  const stars = document.querySelectorAll('.rating-star');
  let selectedRating = 0;

  // Star rating selection
  stars.forEach(star => {
    star.addEventListener('click', function() {
      const rating = parseInt(this.getAttribute('data-rating'));
      selectedRating = rating;
      
      // Update visual selection
      stars.forEach((s, index) => {
        if (index < rating) {
          s.classList.add('selected');
          s.textContent = '★';
          s.setAttribute('aria-label', `${rating} stars selected`);
        } else {
          s.classList.remove('selected');
          s.textContent = '☆';
          s.setAttribute('aria-label', `${index+1} stars`);
        }
      });
    });
  });

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('reviewer-name').value.trim();
    const comment = document.getElementById('review-comment').value.trim();
    
    if (!name || !comment) {
      alert('Please fill in all fields');
      return;
    }
    
    if (!selectedRating) {
      alert('Please select a rating');
      return;
    }
    
    // Create new review object
    const newReview = {
      user: name,
      rating: selectedRating,
      comment: comment,
      date: new Date().toLocaleDateString()
    };
    
    // Add to current restaurant's reviews
    if (currentRestaurant) {
      if (!currentRestaurant.reviews) {
        currentRestaurant.reviews = [];
      }
      currentRestaurant.reviews.unshift(newReview);
      
      // Save to localStorage
      saveRestaurant(currentRestaurant);
      
      // Refresh reviews display
      displayReviews(currentRestaurant.reviews);
      
      // Reset form
      form.reset();
      stars.forEach(star => {
        star.classList.remove('selected');
        star.textContent = '☆';
      });
      selectedRating = 0;
    }
  });
}

function saveRestaurant(restaurant) {
  // In a real app, you would send to a server
  // For demo, we'll use localStorage
  const restaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
  const index = restaurants.findIndex(r => r.id === restaurant.id);
  
  if (index >= 0) {
    restaurants[index] = restaurant;
  } else {
    restaurants.push(restaurant);
  }
  
  localStorage.setItem('restaurants', JSON.stringify(restaurants));
}
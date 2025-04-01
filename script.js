document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav')) {
            navMenu.classList.remove('active');
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                navMenu.classList.remove('active');
            }
        });
    });

    // Booking Form Validation
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const destination = document.getElementById('destination').value;
            const checkin = document.getElementById('checkin').value;
            const checkout = document.getElementById('checkout').value;
            
            if (!destination || !checkin || !checkout) {
                alert('Please fill in all required fields');
                return;
            }

            // Validate dates
            const checkinDate = new Date(checkin);
            const checkoutDate = new Date(checkout);
            const today = new Date();

            if (checkinDate < today) {
                alert('Check-in date cannot be in the past');
                return;
            }

            if (checkoutDate <= checkinDate) {
                alert('Check-out date must be after check-in date');
                return;
            }

            // If validation passes, you can submit the form
            alert('Booking submitted successfully!');
            bookingForm.reset();
        });
    }

    // Dynamic header background on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.background = 'var(--white)';
        }
    });

    // Initialize date inputs with min date
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        input.min = today;
    });

    // Destination cards hover effect
    const cards = document.querySelectorAll('.destination-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Existing code...

    // Handle booking buttons
    const bookButtons = document.querySelectorAll('.book-now');
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const destination = this.dataset.destination;
            const price = this.dataset.price;
            
            // Add loading state
            this.innerHTML = 'Processing... <span class="loading-spinner"></span>';
            this.disabled = true;

            // Simulate loading (remove in production)
            setTimeout(() => {
                // Redirect to payment page with parameters
                const params = new URLSearchParams({
                    destination: destination,
                    price: price,
                    date: getTomorrowDate(), // Helper function
                    guests: '2' // Default value
                });
                window.location.href = `payment.html?${params.toString()}`;
            }, 800);
        });
    });

    // Helper function to get tomorrow's date
    function getTomorrowDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }

    // Add smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Update payment page if we're on it
    if (window.location.pathname.includes('payment.html')) {
        updatePaymentDetails();
    }
});

// Function to update payment page details
function updatePaymentDetails() {
    const params = new URLSearchParams(window.location.search);
    const destination = params.get('destination');
    const price = params.get('price');
    const date = params.get('date');
    const guests = params.get('guests');

    // Update booking summary
    if (document.getElementById('destinationName')) {
        document.getElementById('destinationName').textContent = 
            destination.charAt(0).toUpperCase() + destination.slice(1);
    }

    if (document.getElementById('tripDates')) {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        document.getElementById('tripDates').textContent = formattedDate;
    }

    if (document.getElementById('guestCount')) {
        document.getElementById('guestCount').textContent = `${guests} Guests`;
    }

    // Update prices
    if (document.getElementById('basePrice')) {
        document.getElementById('basePrice').textContent = `$${price}`;
        const taxes = Math.round(price * 0.2);
        const total = parseInt(price) + taxes;
        document.getElementById('taxes').textContent = `$${taxes}`;
        document.getElementById('totalPrice').textContent = `$${total}`;
        
        // Update payment button text
        const payButton = document.querySelector('.payment-button .button-text');
        if (payButton) {
            payButton.textContent = `Pay $${total}`;
        }
    }
    document.addEventListener('DOMContentLoaded', function() {
        // Package data
        const packages = [
            {
                id: 1,
                title: "Luxury Maldives Escape",
                type: "luxury",
                duration: "7 days",
                price: 2499,
                rating: 4.9,
                image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800",
                location: "Maldives",
                included: ["5-Star Resort", "All Meals", "Water Activities", "Spa Treatment"]
            },
            {
                id: 2,
                title: "Swiss Alps Adventure",
                type: "adventure",
                duration: "8 days",
                price: 1899,
                rating: 4.8,
                image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
                location: "Switzerland",
                included: ["Guided Hiking", "Cable Car Pass", "Mountain Lodge", "Equipment"]
            },
            // Add more packages...
        ];
    
        function createPackageCard(pkg) {
            return `
                <div class="package-card" data-type="${pkg.type}">
                    <div class="package-image">
                        <img src="${pkg.image}" alt="${pkg.title}">
                        <div class="package-badge">${pkg.type}</div>
                    </div>
                    <div class="package-content">
                        <h3 class="package-title">${pkg.title}</h3>
                        <div class="package-details">
                            <span class="package-detail">
                                <i class="fas fa-clock"></i>
                                ${pkg.duration}
                            </span>
                            <span class="package-detail">
                                <i class="fas fa-star"></i>
                                ${pkg.rating}
                            </span>
                            <span class="package-detail">
                                <i class="fas fa-map-marker-alt"></i>
                                ${pkg.location}
                            </span>
                        </div>
                        <div class="package-included">
                            ${pkg.included.map(item => `
                                <span><i class="fas fa-check"></i> ${item}</span>
                            `).join('')}
                        </div>
                        <div class="package-price">
                            From $${pkg.price}
                        </div>
                        <button class="package-btn" onclick="viewPackage(${pkg.id})">
                            View Details
                        </button>
                    </div>
                </div>
            `;
        }
    
        // Filter functionality
        const filterButtons = document.querySelectorAll('.filter-btn');
        const packagesGrid = document.querySelector('.packages-grid');
    
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
    
                const filterValue = button.getAttribute('data-filter');
                
                // Filter packages
                const filteredPackages = filterValue === 'all' 
                    ? packages 
                    : packages.filter(pkg => pkg.type === filterValue);
    
                // Update packages grid
                packagesGrid.innerHTML = filteredPackages
                    .map(pkg => createPackageCard(pkg))
                    .join('');
    
                // Add animation to new cards
                const cards = packagesGrid.querySelectorAll('.package-card');
                cards.forEach((card, index) => {
                    card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
                });
            });
        });
    
        // Initial load of all packages
        packagesGrid.innerHTML = packages
            .map(pkg => createPackageCard(pkg))
            .join('');
    });
    
    // View package details function
    function viewPackage(id) {
        // Implement package detail view functionality
        console.log(`Viewing package ${id}`);
        // You can add modal or redirect to detail page
    }
}
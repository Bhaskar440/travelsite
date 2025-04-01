document.addEventListener('DOMContentLoaded', function() {
    // Initialize Stripe
    const stripe = Stripe('your_publishable_key'); // Replace with your Stripe key
    const elements = stripe.elements();

    // Create card element
    const card = elements.create('card', {
        style: {
            base: {
                fontSize: '16px',
                color: '#32325d',
                fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#dc3545',
                iconColor: '#dc3545'
            }
        }
    });

    // Mount card element
    card.mount('#card-element');

    // Handle real-time validation errors
    card.addEventListener('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });

    // Handle form submission
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const submitButton = form.querySelector('button');
        const spinner = submitButton.querySelector('.spinner');
        const buttonText = submitButton.querySelector('.button-text');

        // Disable form and show loading state
        submitButton.disabled = true;
        spinner.classList.remove('hidden');
        buttonText.classList.add('hidden');

        try {
            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: 'card',
                card: card,
                billing_details: {
                    name: document.getElementById('cardholder-name').value,
                    email: document.getElementById('email').value
                }
            });

            if (error) {
                throw error;
            }

            // Here you would typically send the paymentMethod.id to your server
            // and complete the payment there
            
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            showSuccessMessage();

        } catch (error) {
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = error.message;
            
            // Reset button state
            submitButton.disabled = false;
            spinner.classList.add('hidden');
            buttonText.classList.remove('hidden');
        }
    });

    function showSuccessMessage() {
        const container = document.querySelector('.payment-form-container');
        container.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle" style="font-size: 48px; color: #28a745; margin-bottom: 1rem;"></i>
                <h2>Payment Successful!</h2>
                <p>Your booking has been confirmed. Check your email for details.</p>
                <a href="index.html" class="btn btn-primary" style="margin-top: 1rem;">Return to Home</a>
            </div>
        `;
    }

    // Update booking summary based on URL parameters
    function updateBookingSummary() {
        const params = new URLSearchParams(window.location.search);
        
        if (params.has('destination')) {
            document.getElementById('destinationName').textContent = params.get('destination');
        }
        if (params.has('dates')) {
            document.getElementById('tripDates').textContent = params.get('dates');
        }
        if (params.has('guests')) {
            document.getElementById('guestCount').textContent = params.get('guests');
        }
        if (params.has('price')) {
            const price = parseFloat(params.get('price'));
            const taxes = price * 0.2; // 20% taxes
            const total = price + taxes;
            
            document.getElementById('basePrice').textContent = `$${price.toFixed(2)}`;
            document.getElementById('taxes').textContent = `$${taxes.toFixed(2)}`;
            document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}`;
            document.querySelector('.button-text').textContent = `Pay $${total.toFixed(2)}`;
        }
    }

    updateBookingSummary();
});
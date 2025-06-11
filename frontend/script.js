// Function to calculate price based on word count
function calculatePrice(text) {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount <= 0) return 0;
  if (wordCount <= 100) return 7;
  if (wordCount <= 200) return 14;
  if (wordCount <= 1000) return 25;
  return -1; // exceeds limit
}

// Update price dynamically when user types
document.getElementById('opinionForm').addEventListener('input', function () {
  const opinion = document.getElementById('opinion').value;
  const price = calculatePrice(opinion);

  if (price === -1) {
    document.getElementById('priceText').textContent = "Max 1000 words allowed.";
  } else {
    document.getElementById('priceText').textContent = `Total Price: ₹${price}`;
  }
});

// Handle Razorpay Payment
document.getElementById('rzp-button1').addEventListener('click', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const opinion = document.getElementById('opinion').value.trim();
  const price = calculatePrice(opinion);

  if (price === -1) {
    alert("Maximum 1000 words allowed.");
    return;
  }

  const amountInPaise = price * 100;

  const options = {
    key: "YOUR_KEY_ID", // Replace with your actual Razorpay key
    amount: amountInPaise.toString(),
    currency: "INR",
    name: "Your Website Name",
    description: "Submission Payment",
    handler: async function (response) {
      const data = {
        type: document.getElementById('type').value,
        topic: document.getElementById('topic').value,
        reason: document.getElementById('reason').value,
        opinion: opinion,
        name: name,
        email: email,
        price: price
      };

      try {
        const res = await fetch('/api/save-opinion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (res.ok) {
          alert('Your opinion has been submitted!');
          document.getElementById('opinionForm').reset();
          document.getElementById('priceText').textContent = 'Total Price: ₹0';
        } else {
          const errorData = await res.json();
          alert(`Submission error: ${errorData.error || 'Something went wrong.'}`);
        }
      } catch (err) {
        alert('Network error.');
      }
    },
    prefill: {
      name: name,
      email: email,
      contact: "9000090000"
    },
    theme: {
      color: "#3399cc"
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
});

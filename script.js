// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking a link
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.classList.remove('active');
    });
  });

  // Contact Form Handling with Formspree
  const contactForm = document.querySelector('form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      
      // Disable button and show loading state
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      
      // Remove any existing messages
      const existingSuccess = document.querySelector('.form-success');
      const existingError = document.querySelector('.form-error');
      if (existingSuccess) existingSuccess.remove();
      if (existingError) existingError.remove();
      
      try {
        // Using Formspree - replace 'YOUR_FORM_ID' with actual Formspree form ID
        // Sign up at https://formspree.io to get your form ID
        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          // Show success message
          const successMsg = document.createElement('div');
          successMsg.className = 'form-success';
          successMsg.style.display = 'block';
          successMsg.textContent = 'Thank you for your message! We\'ll get back to you soon.';
          contactForm.appendChild(successMsg);
          
          // Reset form
          contactForm.reset();
          
          // Remove success message after 5 seconds
          setTimeout(() => {
            successMsg.style.display = 'none';
          }, 5000);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        // Show error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'form-error';
        errorMsg.style.display = 'block';
        errorMsg.textContent = 'Oops! There was a problem sending your message. Please try calling us directly at (647) 719-0089.';
        contactForm.appendChild(errorMsg);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
          errorMsg.style.display = 'none';
        }, 5000);
      } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Gallery image lightbox (simple implementation)
  const galleryImages = document.querySelectorAll('.gallery-grid img');
  
  galleryImages.forEach(img => {
    img.addEventListener('click', function() {
      // Create lightbox overlay
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        cursor: pointer;
      `;
      
      const lightboxImg = document.createElement('img');
      lightboxImg.src = this.src;
      lightboxImg.alt = this.alt;
      lightboxImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
      `;
      
      lightbox.appendChild(lightboxImg);
      document.body.appendChild(lightbox);
      
      // Close lightbox on click
      lightbox.addEventListener('click', function() {
        document.body.removeChild(lightbox);
      });
      
      // Close on escape key
      const closeOnEscape = function(e) {
        if (e.key === 'Escape') {
          if (document.body.contains(lightbox)) {
            document.body.removeChild(lightbox);
          }
          document.removeEventListener('keydown', closeOnEscape);
        }
      };
      document.addEventListener('keydown', closeOnEscape);
    });
  });

  // Add fade-in animation to elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe service cards and feature elements
  document.querySelectorAll('.service-card, .feature').forEach(element => {
    observer.observe(element);
  });
});
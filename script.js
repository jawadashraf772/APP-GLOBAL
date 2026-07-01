// Initialize scroll reveal
const revealElements = document.querySelectorAll('.reveal, .fade-up, .fade-in');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Optional: Only reveal once
        }
    });
};

const revealOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));

// Number counter animation
const counters = document.querySelectorAll('.counter');
const counterCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = +entry.target.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    entry.target.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    entry.target.innerText = target;
                }
            };
            updateCounter();
            observer.unobserve(entry.target);
        }
    });
};
const counterObserver = new IntersectionObserver(counterCallback, { threshold: 0.5 });
counters.forEach(counter => counterObserver.observe(counter));

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all others
        faqItems.forEach(other => other.classList.remove('active'));
        
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Mobile menu toggle functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

if (mobileMenuBtn && mobileMenuOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Terminal Typing Effect
const codeElement = document.getElementById('running-code');
if (codeElement) {
    const codeSnippet = `
<span class="comment">// Initialize Global Core Node</span>
<span class="keyword">import</span> { Server } <span class="keyword">from</span> <span class="string">'@app-global/core'</span>;
<span class="keyword">import</span> cluster <span class="keyword">from</span> <span class="string">'cluster'</span>;

<span class="keyword">const</span> PORT = process.env.PORT || <span class="function">8080</span>;

<span class="keyword">if</span> (cluster.isPrimary) {
  <span class="function">console.log</span>(<span class="string">\`Primary \${process.pid} is running\`</span>);
  <span class="comment">// Fork workers for high performance</span>
  <span class="keyword">for</span> (<span class="keyword">let</span> i = 0; i < require('os').cpus().length; i++) {
    cluster.<span class="function">fork</span>();
  }
} <span class="keyword">else</span> {
  <span class="keyword">const</span> app = <span class="keyword">new</span> <span class="function">Server</span>({
    cluster: <span class="keyword">true</span>,
    secure: <span class="keyword">true</span>,
    scaling: <span class="string">'auto'</span>
  });

  app.<span class="function">listen</span>(PORT, () => {
    <span class="function">console.log</span>(<span class="string">\`Worker \${process.pid} listening on port \${PORT}\`</span>);
  });
}
`;
    
    let i = 0;
    // We type out HTML so we need to be careful with tags. 
    // For simplicity, we just inject the raw HTML instantly in a real app, 
    // or simulate typing by revealing characters and parsing HTML.
    // Let's do a simple character reveal while rendering HTML.
    
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = codeSnippet.trim();
    
    let textNodes = [];
    function getTextNodes(node) {
        if (node.nodeType === 3) {
            textNodes.push(node);
        } else {
            for (let child of node.childNodes) {
                getTextNodes(child);
            }
        }
    }
    getTextNodes(tempDiv);
    
    // Instead of complex parsing, let's just use innerHTML for syntax highlighting, 
    // and just do a simple line-by-line reveal using a CSS animation or simple JS delay
    codeElement.innerHTML = '';
    const lines = codeSnippet.trim().split('\n');
    let lineIndex = 0;
    
    function typeLine() {
        if (lineIndex < lines.length) {
            codeElement.innerHTML += lines[lineIndex] + '\n';
            lineIndex++;
            setTimeout(typeLine, Math.random() * 300 + 100); // Random delay between lines
        } else {
            // Loop it
            setTimeout(() => {
                codeElement.innerHTML = '';
                lineIndex = 0;
                typeLine();
            }, 5000);
        }
    }
    
    setTimeout(typeLine, 1000);
}

// Webhook Integration for Lead Form
const leadForm = document.getElementById('lead-form');
const submitBtn = document.getElementById('submit-btn');

if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Change button state
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;

        // Gather form data
        const formData = new FormData(leadForm);
        const data = Object.fromEntries(formData.entries());

        const webhookURL = 'https://services.leadconnectorhq.com/hooks/Fq8CTISLRihxLpcQ1wBN/webhook-trigger/1be1337d-2289-46cb-8d50-c75cbd0fbc80';

        // Fire the webhook request in the background (keepalive ensures it completes even if page redirects)
        fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            keepalive: true
        }).catch(error => console.error('Error submitting form:', error));

        // Immediately redirect to thank-you page without waiting for server response
        window.location.href = 'thank-you.html';
    });
}

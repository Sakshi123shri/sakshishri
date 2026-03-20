// public/script.js

// ================= Scroll Animation =================
const sections = document.querySelectorAll("section");
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.2 });

sections.forEach(sec => observer.observe(sec));


// ================= Contact Form =================
const contactForm = document.querySelector("#contactForm");

contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
        alert("Please fill all fields ❗");
        return;
    }

    try {
        // Send data to Node.js backend
        const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message })
        });

        const data = await res.json();

        if (data.success) {
            alert("Message sent successfully ✅");
            contactForm.reset();
        } else {
            alert("Failed to send message ❌");
        }

    } catch (err) {
        console.error("Server error:", err);
        alert("Server error ❌");
    }
});
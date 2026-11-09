// Update the footer year and provide a clear demo response for the contact form.
document.querySelectorAll("#year").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.querySelector("#form-status");
    status.textContent = "Thanks! This demo form is validated, but it is not connected to an email service yet.";
  });
}

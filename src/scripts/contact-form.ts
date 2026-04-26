const forms = document.querySelectorAll<HTMLFormElement>("[data-contact-form]");

forms.forEach((form) => {
  const status = form.querySelector<HTMLElement>(".contact-status");
  const fields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea"));

  function markField(input: HTMLInputElement | HTMLTextAreaElement, hasError: boolean) {
    const field = input.closest<HTMLElement>(".contact-field");
    field?.classList.toggle("has-error", hasError);
    if (hasError) {
      input.setAttribute("aria-invalid", "true");
    } else {
      input.removeAttribute("aria-invalid");
    }
  }

  fields.forEach((input) => {
    input.addEventListener("input", () => {
      if (input.value.trim()) markField(input, false);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const values = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim()
    };

    fields.forEach((input) => markField(input, !input.value.trim()));

    if (!values.name || !values.email || !values.message) {
      if (status) status.textContent = "Please complete all fields.";
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error("Contact request failed.");
      }

      form.reset();
      if (status) status.textContent = "Message sent successfully.";
    } catch {
      if (status) status.textContent = "Message could not be sent. Please try again.";
    }
  });
});

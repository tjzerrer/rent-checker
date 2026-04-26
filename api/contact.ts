export default async function handler(request: any, response: any) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, email, message } = request.body ?? {};
  if (!name || !email || !message) {
    response.status(400).json({ error: "Missing required fields" });
    return;
  }

  const formData = new URLSearchParams();
  formData.set("name", String(name));
  formData.set("email", String(email));
  formData.set("message", String(message));
  formData.set("_subject", "Rent Checker contact form");
  formData.set("_captcha", "false");

  const submitResponse = await fetch("https://formsubmit.co/ajax/tonyzerrer@gmail.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    body: formData
  });

  if (!submitResponse.ok) {
    response.status(502).json({ error: "Message could not be sent" });
    return;
  }

  response.status(200).json({ ok: true });
}

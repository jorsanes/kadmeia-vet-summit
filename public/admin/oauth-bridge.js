(function () {
  function persist(token) {
    if (!token || typeof token !== "string") return;

    // Formatos aceptados por distintas versiones / forks
    const authPayload = JSON.stringify({ token, provider: "github" });
    const userPayload = JSON.stringify({ token, provider: "github" });

    try {
      localStorage.setItem("decap-cms-auth", authPayload);     // Decap (algunos setups)
      localStorage.setItem("netlify-cms-auth", authPayload);   // Compat Netlify CMS
      localStorage.setItem("netlify-cms-user", userPayload);   // Decap/Netlify recientes
    } catch (e) {
      console.error("No se pudo guardar la credencial:", e);
      return;
    }

    try { sessionStorage.removeItem("netlify-cms.lastLogin"); } catch (_) {}

    // Forzamos un pequeño refresh si el overlay no desaparece solo
    setTimeout(() => {
      if (!document.querySelector('[data-testid="collection-page"]')) location.reload();
    }, 800);
  }

  window.addEventListener("message", (e) => {
    try {
      const data = e.data;

      // Formato legacy usado por nuestro provider
      const prefix = "authorization:github:success:";
      if (typeof data === "string" && data.indexOf(prefix) === 0) {
        persist(data.slice(prefix.length));
        return;
      }

      // Formato objeto (por si en el futuro lo usas)
      if (data && typeof data === "object" && data.token && data.provider === "github") {
        persist(String(data.token));
        return;
      }
    } catch (err) {
      console.error("OAuth bridge error:", err);
    }
  });

  console.log("KADMEIA OAuth Bridge listo - esperando token…");

  // Si ya había token guardado, intenta “despertar” al CMS:
  try {
    const cached = localStorage.getItem("netlify-cms-user") || localStorage.getItem("decap-cms-auth");
    if (cached) console.log("Token en caché detectado.");
  } catch {}
})();

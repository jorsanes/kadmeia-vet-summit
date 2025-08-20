// KADMEIA OAuth Bridge
// Recibe el mensaje del provider y guarda el token
// en TODAS las claves que Decap/Netlify pueden usar.

(function () {
  const LEGACY_PREFIX = "authorization:github:success:";

  function persistToken(token) {
    if (!token || typeof token !== "string") return;

    // Payloads compatibles
    const authPayload = JSON.stringify({ token, provider: "github" });
    const userPayload = JSON.stringify({ token, provider: "github" });

    try {
      // Claves que miran distintas versiones de Decap/Netlify
      localStorage.setItem("netlify-cms-user", userPayload);
      localStorage.setItem("netlify-cms-auth", authPayload);
      localStorage.setItem("decap-cms-auth", authPayload);
    } catch (e) {
      console.error("[OAuthBridge] No se pudo guardar la credencial:", e);
      return;
    }

    // Limpieza menor
    try { sessionStorage.removeItem("netlify-cms.lastLogin"); } catch (_) {}

    // Si la UI no avanza sola, recarga suavemente
    setTimeout(() => {
      if (!document.querySelector('[data-testid="collection-page"]')) location.reload();
    }, 800);
  }

  window.addEventListener("message", (e) => {
    try {
      const { data } = e;

      // Formato legacy (string) usado por el provider clásico
      if (typeof data === "string" && data.indexOf(LEGACY_PREFIX) === 0) {
        const token = data.slice(LEGACY_PREFIX.length);
        persistToken(token);
        return;
      }

      // Formato objeto (por compatibilidad futura)
      if (data && typeof data === "object" && data.token && data.provider === "github") {
        persistToken(String(data.token));
        return;
      }
    } catch (err) {
      console.error("[OAuthBridge] Error procesando el mensaje:", err);
    }
  });

  console.log("🔑 KADMEIA OAuth Bridge listo — esperando token del popup…");
})();

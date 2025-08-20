// KADMEIA OAuth Bridge
// - Recibe el token del provider (formato legacy: "authorization:github:success:<token>")
// - Lo guarda donde Decap espera y, si hace falta, recarga.

(function () {
  function storeToken(token) {
    if (!token || typeof token !== "string") return;
    const payload = JSON.stringify({ token, provider: "github" });

    try {
      localStorage.setItem("decap-cms-auth", payload);
      localStorage.setItem("netlify-cms-auth", payload);
    } catch (e) {
      console.error("No se pudo guardar la credencial:", e);
      return;
    }

    try { sessionStorage.removeItem("netlify-cms.lastLogin"); } catch (_) {}

    // Si Decap no navega solo, recargamos en ~1s
    setTimeout(() => {
      if (!document.querySelector('[data-testid="collection-page"]')) location.reload();
    }, 1200);
  }

  window.addEventListener("message", (e) => {
    try {
      const data = e.data;

      // 1) Formato legacy (principal)
      if (typeof data === "string" && data.indexOf("authorization:github:success:") === 0) {
        const token = data.slice("authorization:github:success:".length);
        storeToken(token);
        return;
      }

      // 2) (por compatibilidad futura) Objeto moderno
      if (data && typeof data === "object" && data.token && data.provider === "github") {
        storeToken(String(data.token));
        return;
      }
    } catch (err) {
      console.error("OAuth bridge error:", err);
    }
  });

  console.log("%cKADMEIA OAuth Bridge listo", "color:#1E2A38;font-weight:bold", "- esperando token…");
})();

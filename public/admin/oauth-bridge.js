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
    // No forzamos reload inmediato: dejamos que Decap procese primero.
    // Si no cambiara de vista en 1.2s, recargamos.
    setTimeout(() => {
      if (!document.querySelector('[data-testid="collection-page"]')) location.reload();
    }, 1200);
  }

  window.addEventListener("message", (e) => {
    try {
      const data = e.data;
      // 1) Legacy string (principal en esta versión)
      if (typeof data === "string" && data.indexOf("authorization:github:success:") === 0) {
        const token = data.slice("authorization:github:success:".length);
        storeToken(token);
        return;
      }
      // 2) Objeto moderno (por si en algún momento volvemos a enviarlo)
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


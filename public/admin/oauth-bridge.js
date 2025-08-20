/*  KADMEIA OAuth Bridge
    - Acepta formato objeto { token, provider:'github' } y string legacy "authorization:github:success:<token>"
    - Persiste credencial donde Decap/Netlify CMS la esperan
    - Corta la propagación del evento para evitar errores en listeners internos
    - Recarga el /admin para completar login
*/

(function () {
  function storeToken(token) {
    if (!token || typeof token !== "string") return;
    const payload = JSON.stringify({ token, provider: "github" });

    // Claves aceptadas por Decap (compat con Netlify CMS)
    try {
      localStorage.setItem("decap-cms-auth", payload);
      localStorage.setItem("netlify-cms-auth", payload);
    } catch (e) {
      console.error("No se pudo guardar la credencial en localStorage:", e);
      return;
    }

    // Limpia residuos de sesiones antiguas
    try {
      sessionStorage.removeItem("netlify-cms.lastLogin");
    } catch (_) {}

    // Recarga para que Decap coja la credencial
    location.reload();
  }

  window.addEventListener(
    "message",
    (e) => {
      try {
        // Evita que otros listeners (los de Decap) procesen este mismo evento y lloren en consola
        if (e && typeof e.stopImmediatePropagation === "function") {
          e.stopImmediatePropagation();
        }

        const data = e.data;

        // 1) Objeto moderno { token, provider:'github' }
        if (data && typeof data === "object" && data.token && data.provider === "github") {
          storeToken(String(data.token));
          return;
        }

        // 2) Cadena legacy "authorization:github:success:<token>"
        if (typeof data === "string" && data.indexOf("authorization:github:success:") === 0) {
          const token = data.slice("authorization:github:success:".length);
          storeToken(token);
          return;
        }
      } catch (err) {
        console.error("OAuth bridge error:", err);
      }
    },
    // useCapture=true para interceptar antes que otros listeners
    true
  );

  console.log(
    "%cKADMEIA OAuth Bridge listo",
    "color:#1E2A38;font-weight:bold",
    "- esperando token desde el provider…"
  );
})();

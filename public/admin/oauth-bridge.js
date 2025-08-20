// KADMEIA OAuth Bridge — versión completa
// 1) Recibe el token del provider por postMessage
// 2) Obtiene el perfil del usuario en GitHub
// 3) Persiste en TODAS las claves que Decap/Netlify usan con el "user object" completo

(function () {
  const LEGACY_PREFIX = "authorization:github:success:";

  async function buildUserPayload(token) {
    try {
      // Pedimos datos mínimos del usuario (login, name, avatar)
      const res = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
      });
      if (!res.ok) throw new Error(`GitHub user fetch failed: ${res.status}`);
      const u = await res.json();

      // Formato que Decap/Netlify CMS reconocen como sesión
      return {
        token,                         // el gho_****
        provider: "github",
        login: "github",               // <- importante
        backendName: "github",         // <- importante
        user: {
          login: u.login || "",
          name: u.name || u.login || "",
          avatar_url: u.avatar_url || "",
          html_url: u.html_url || "",
          id: u.id || undefined,
        },
        use_open_authoring: false,
      };
    } catch (e) {
      console.warn("[OAuthBridge] No se pudo obtener el perfil, se usará mínimo:", e);
      return {
        token,
        provider: "github",
        login: "github",
        backendName: "github",
        user: {},
        use_open_authoring: false,
      };
    }
  }

  async function persistToken(token) {
    if (!token || typeof token !== "string") return;

    const full = await buildUserPayload(token);
    const userStr = JSON.stringify(full);
    const authStr = JSON.stringify({ token, provider: "github" });

    try {
      // Claves que miran distintas versiones de Decap/Netlify
      localStorage.setItem("netlify-cms-user", userStr);
      localStorage.setItem("netlify-cms-auth", authStr);
      localStorage.setItem("decap-cms-auth", authStr);
    } catch (e) {
      console.error("[OAuthBridge] No se pudo guardar la credencial:", e);
      return;
    }

    try { sessionStorage.removeItem("netlify-cms.lastLogin"); } catch (_) {}

    // Opcional: notificar como si viniera del popup (algunas builds lo escuchan)
    try {
      window.postMessage(`${LEGACY_PREFIX}${token}`, window.origin);
    } catch {}

    // Si la UI no avanza sola, recarga
    setTimeout(() => {
      if (!document.querySelector('[data-testid="collection-page"]')) location.reload();
    }, 800);
  }

  window.addEventListener("message", (e) => {
    try {
      const { data } = e;

      if (typeof data === "string" && data.indexOf(LEGACY_PREFIX) === 0) {
        const token = data.slice(LEGACY_PREFIX.length);
        persistToken(token);
        return;
      }
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

// KADMEIA OAuth Bridge — compat máxima con Decap/Netlify
(function () {
  const LEGACY_PREFIX = "authorization:github:success:";

  async function buildUserPayload(token) {
    try {
      const r = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
      });
      const u = r.ok ? await r.json() : {};
      return {
        token,
        provider: "github",
        login: "github",
        backendName: "github",
        user: {
          login: u.login || "",
          name: u.name || u.login || "",
          avatar_url: u.avatar_url || "",
          html_url: u.html_url || "",
          id: u.id,
        },
        use_open_authoring: false,
      };
    } catch {
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

  function fireStorage(key, value) {
    try {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: value,
          oldValue: null,
          storageArea: window.localStorage,
          url: window.location.href,
        })
      );
    } catch {}
  }

  async function persistToken(token) {
    if (!token) return;

    const userObj = await buildUserPayload(token);
    const userStr = JSON.stringify(userObj);
    const authStr = JSON.stringify({ token, provider: "github" });

    try {
      // Variantes que consultan distintas builds
      localStorage.setItem("netlify-cms-user", userStr);
      localStorage.setItem("netlify-cms.user", userStr);
      localStorage.setItem("decap-cms.user", userStr);

      localStorage.setItem("netlify-cms-auth", authStr);
      localStorage.setItem("decap-cms-auth", authStr);

      // Notifica cambios
      ["netlify-cms-user", "netlify-cms.user", "decap-cms.user"].forEach((k) =>
        fireStorage(k, userStr)
      );
    } catch (e) {
      console.error("[OAuthBridge] No se pudo guardar la credencial:", e);
      return;
    }

    // Reload suave por si la UI no avanza sola
    setTimeout(() => location.reload(), 400);
  }

  window.addEventListener("message", (e) => {
    try {
      const d = e.data;
      if (typeof d === "string" && d.indexOf(LEGACY_PREFIX) === 0) {
        return persistToken(d.slice(LEGACY_PREFIX.length));
      }
      if (d && typeof d === "object" && d.token && d.provider === "github") {
        return persistToken(String(d.token));
      }
    } catch (err) {
      console.error("[OAuthBridge] Error procesando el mensaje:", err);
    }
  });

  console.log("🔑 KADMEIA OAuth Bridge listo — esperando token del popup…");
})();

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

    console.log("🔄 Persistiendo token y datos de usuario...");
    const userObj = await buildUserPayload(token);
    const userStr = JSON.stringify(userObj);
    const authStr = JSON.stringify({ token, provider: "github" });

    try {
      // Limpiar datos anteriores para evitar conflictos
      const oldKeys = Object.keys(localStorage).filter(k => 
        k.includes('netlify-cms') || k.includes('decap-cms')
      );
      oldKeys.forEach(k => localStorage.removeItem(k));

      // Guardar datos frescos
      localStorage.setItem("netlify-cms-user", userStr);
      localStorage.setItem("netlify-cms.user", userStr);
      localStorage.setItem("decap-cms.user", userStr);
      localStorage.setItem("netlify-cms-auth", authStr);
      localStorage.setItem("decap-cms-auth", authStr);

      console.log("✅ Credenciales guardadas:", { 
        user: userObj.user.login, 
        token: token.substring(0, 12) + "..." 
      });

      // Notificar cambios vía storage events
      ["netlify-cms-user", "netlify-cms.user", "decap-cms.user"].forEach((k) =>
        fireStorage(k, userStr)
      );

      // Enviar mensaje de autorización a Decap CMS
      const authMessage = `${LEGACY_PREFIX}${token}`;
      window.postMessage(authMessage, window.location.origin);
      console.log("📤 Mensaje de autorización enviado a Decap CMS");

    } catch (e) {
      console.error("[OAuthBridge] Error guardando credencial:", e);
      return;
    }

    // NO hacer reload automático - dejar que el autotest maneje la carga
    console.log("🎯 Token persistido sin reload - esperando autotest...");
  }

  let lastTokenProcessed = null;

  window.addEventListener("message", (e) => {
    // Ignorar mensajes que vienen de la propia ventana para evitar bucles
    if (e.source === window) {
      return;
    }

    try {
      const d = e.data;
      let token = null;

      if (typeof d === "string" && d.indexOf(LEGACY_PREFIX) === 0) {
        token = d.slice(LEGACY_PREFIX.length);
      } else if (d && typeof d === "object" && d.token && d.provider === "github") {
        token = String(d.token);
      }

      // Evitar procesar el mismo token repetidamente
      if (token && token !== lastTokenProcessed) {
        lastTokenProcessed = token;
        return persistToken(token);
      }
    } catch (err) {
      console.error("[OAuthBridge] Error procesando el mensaje:", err);
    }
  });

  console.log("🔑 KADMEIA OAuth Bridge listo — esperando token del popup…");
})();

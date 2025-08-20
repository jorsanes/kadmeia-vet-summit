// KADMEIA OAuth Bridge
// - Recibe el token del provider (formato legacy: "authorization:github:success:<token>")
// - Lo guarda donde Decap espera y, si hace falta, recarga.

(function () {
  let messageCount = 0;
  let tokenReceived = false;

  function storeToken(token) {
    if (!token || typeof token !== "string") {
      console.warn("⚠️ Token inválido recibido:", token);
      return;
    }
    
    if (tokenReceived) {
      console.log("🔄 Token ya procesado, ignorando duplicado");
      return;
    }
    
    tokenReceived = true;
    console.log("🔑 Procesando token de GitHub:", token.substring(0, 10) + "...");
    
    const payload = JSON.stringify({ token, provider: "github" });

    try {
      localStorage.setItem("decap-cms-auth", payload);
      localStorage.setItem("netlify-cms-auth", payload);
      console.log("✅ Token guardado en localStorage");
    } catch (e) {
      console.error("❌ No se pudo guardar la credencial:", e);
      return;
    }

    try { 
      sessionStorage.removeItem("netlify-cms.lastLogin"); 
      console.log("🗑️ Limpiado sessionStorage");
    } catch (_) {}

    // Re-enviar el mensaje a Decap para que procese el token
    console.log("📤 Re-enviando mensaje de autorización a Decap CMS...");
    const authMessage = `authorization:github:success:${token}`;
    window.postMessage(authMessage, window.location.origin);
    
    // También disparar evento personalizado por si Decap lo escucha
    window.dispatchEvent(new CustomEvent('decap-cms-auth', { 
      detail: { token, provider: "github" } 
    }));
    
    console.log("✅ Token procesado, Decap debería iniciar sesión automáticamente");
  }

  function resendExistingToken() {
    try {
      const existingAuth = localStorage.getItem("decap-cms-auth");
      if (existingAuth) {
        const parsed = JSON.parse(existingAuth);
        if (parsed.token && parsed.provider === "github") {
          console.log("🔄 Re-enviando token existente a Decap...");
          const authMessage = `authorization:github:success:${parsed.token}`;
          window.postMessage(authMessage, window.location.origin);
          window.dispatchEvent(new CustomEvent('decap-cms-auth', { 
            detail: parsed 
          }));
          return true;
        }
      }
    } catch (e) {
      console.log("🔍 Error procesando token existente:", e);
    }
    return false;
  }

  window.addEventListener("message", (e) => {
    messageCount++;
    console.log(`📨 Mensaje ${messageCount} de ${e.origin}:`, e.data);
    
    try {
      const data = e.data;

      // 1) Formato legacy (principal)
      if (typeof data === "string" && data.indexOf("authorization:github:success:") === 0) {
        const token = data.slice("authorization:github:success:".length);
        console.log("🎯 Token GitHub detectado (formato legacy)");
        storeToken(token);
        return;
      }

      // 2) (por compatibilidad futura) Objeto moderno
      if (data && typeof data === "object" && data.token && data.provider === "github") {
        console.log("🎯 Token GitHub detectado (formato objeto)");
        storeToken(String(data.token));
        return;
      }
      
      // Log otros mensajes para debug
      if (data && typeof data === "string" && data.includes("authorization")) {
        console.log("🔍 Mensaje de autorización no reconocido:", data);
      }
    } catch (err) {
      console.error("❌ OAuth bridge error:", err);
    }
  });

  // Diagnóstico inicial
  console.log("%cKADMEIA OAuth Bridge listo", "color:#1E2A38;font-weight:bold", "- esperando token…");
  
  // Verificar si ya hay un token guardado y re-enviarlo
  try {
    const existingAuth = localStorage.getItem("decap-cms-auth");
    if (existingAuth) {
      console.log("🔍 Token existente encontrado:", existingAuth.substring(0, 50) + "...");
      // Re-enviar token existente después de un pequeño delay
      setTimeout(() => {
        if (resendExistingToken()) {
          console.log("🚀 Token existente re-enviado a Decap CMS");
        }
      }, 500);
    } else {
      console.log("🔍 No hay token previo en localStorage");
    }
  } catch (e) {
    console.log("🔍 Error leyendo localStorage:", e);
  }

  // Exponer funciones para debug
  window.kadmeiaAuth = {
    resendToken: resendExistingToken,
    clearAuth: () => {
      localStorage.removeItem("decap-cms-auth");
      localStorage.removeItem("netlify-cms-auth");
      sessionStorage.removeItem("netlify-cms.lastLogin");
      console.log("🗑️ Autenticación limpiada");
      location.reload();
    }
  };
})();

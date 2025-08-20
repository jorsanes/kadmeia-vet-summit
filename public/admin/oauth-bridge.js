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

    // Si Decap no navega solo, recargamos en ~1.5s
    console.log("⏳ Esperando a que Decap procese el token...");
    setTimeout(() => {
      if (!document.querySelector('[data-testid="collection-page"]')) {
        console.log("🔄 Recargando página para activar sesión");
        location.reload();
      } else {
        console.log("✅ Decap ya mostró la interfaz del CMS");
      }
    }, 1500);
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
  
  // Verificar si ya hay un token guardado
  try {
    const existingAuth = localStorage.getItem("decap-cms-auth");
    if (existingAuth) {
      console.log("🔍 Token existente encontrado:", existingAuth.substring(0, 50) + "...");
    } else {
      console.log("🔍 No hay token previo en localStorage");
    }
  } catch (e) {
    console.log("🔍 Error leyendo localStorage:", e);
  }
})();

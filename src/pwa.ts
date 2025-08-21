// src/pwa.ts
import { registerSW } from "virtual:pwa-register";

export function setupPWA() {
  // auto-update y eventos silenciosos (si quieres UI, añadimos toasts luego)
  registerSW({
    immediate: true,
    onNeedRefresh() {
      // Aquí podríamos mostrar un toast 'Nueva versión disponible'
    },
    onOfflineReady() {
      // Aquí podríamos mostrar un toast 'Listo para uso offline'
    },
  });
}
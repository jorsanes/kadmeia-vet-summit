// src/pwa.ts
import { registerSW } from 'virtual:pwa-register';
import { toast } from 'sonner';

export function setupPWA() {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      const t = toast.message('Hay una nueva versión disponible', {
        description: 'Actualiza para obtener mejoras.',
        action: {
          label: 'Actualizar',
          onClick: () => updateSW(true),
        },
      });
      // opcional: auto-cerrar a los 15s
      setTimeout(() => toast.dismiss(t), 15000);
    },
    onOfflineReady() {
      toast.success('Listo para uso offline');
    },
  });
}
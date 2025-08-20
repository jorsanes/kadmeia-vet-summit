import { useEffect } from 'react';

const Admin = () => {
  useEffect(() => {
    // Redirect to the static admin page with longer delay
    const redirectToAdmin = () => {
      const adminUrl = window.location.origin + '/admin/index.html';
      window.location.replace(adminUrl);
    };
    
    // Longer delay to ensure complete page load
    const timeoutId = setTimeout(redirectToAdmin, 500);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Redirigiendo al panel de administración...
        </h1>
        <p className="text-muted-foreground text-sm">
          Si no se redirige automáticamente, 
          <a 
            href="/admin/index.html" 
            className="text-primary hover:underline ml-1"
          >
            haga clic aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default Admin;
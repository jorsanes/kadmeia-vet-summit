import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the static admin page
    window.location.href = '/admin/';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-4">
          Redirigiendo al panel de administración...
        </h1>
        <p className="text-muted-foreground">
          Si no se redirige automáticamente, 
          <a 
            href="/admin/" 
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
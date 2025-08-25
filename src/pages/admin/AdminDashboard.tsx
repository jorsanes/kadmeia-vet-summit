import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Briefcase, 
  Edit, 
  Settings, 
  BarChart3,
  Users,
  Mail,
  BookOpen,
  Layers
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const adminSections = [
    {
      title: 'Editor de Páginas',
      description: 'Edita el contenido de las páginas principales (Inicio, Servicios, Sobre)',
      icon: Edit,
      path: '/content-manager?tab=landing',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Blog',
      description: 'Gestiona artículos del blog, categorías y publicaciones',
      icon: FileText,
      path: '/admin/blog',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Casos de Estudio',
      description: 'Administra casos de éxito y estudios de clientes',
      icon: Briefcase,
      path: '/admin/cases',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Contenido General',
      description: 'Editor MDX para páginas adicionales y contenido mixto',
      icon: BookOpen,
      path: '/admin/content',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Mensajes de Contacto',
      description: 'Revisa mensajes enviados a través del formulario de contacto',
      icon: Mail,
      path: '/admin/messages',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Suscriptores Newsletter',
      description: 'Gestiona la lista de suscriptores del newsletter',
      icon: Users,
      path: '/admin/subscribers',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Panel de Administración
        </h1>
        <p className="text-muted-foreground">
          Gestiona todo el contenido de KADMEIA desde este panel centralizado
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Layers className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Páginas Principales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">--</p>
                <p className="text-xs text-muted-foreground">Artículos Blog</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">--</p>
                <p className="text-xs text-muted-foreground">Casos de Estudio</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">--</p>
                <p className="text-xs text-muted-foreground">Mensajes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section, index) => {
          const IconComponent = section.icon;
          
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl ${section.bgColor} flex items-center justify-center mb-4`}>
                  <IconComponent className={`h-6 w-6 ${section.color}`} />
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  {section.description}
                </p>
                <Button asChild className="w-full">
                  <Link to={section.path}>
                    Acceder
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Help Section */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">¿Necesitas ayuda?</h3>
          <p className="text-muted-foreground mb-4">
            Si tienes dudas sobre cómo utilizar alguna de estas herramientas, consulta la documentación o contacta con soporte técnico.
          </p>
          <div className="space-x-2">
            <Button variant="outline" asChild>
              <Link to="/admin/help">
                Ver Documentación
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/contacto">
                Contactar Soporte
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
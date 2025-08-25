import { supabase } from '@/integrations/supabase/client';

export interface EditablePage {
  id: string;
  page_key: string;
  lang: string;
  content: any;
  last_modified: string;
  created_at: string;
}

export interface EditableSection {
  id: string;
  content: any;
  type: 'hero' | 'section' | 'card' | 'text';
}

// Get editable content for a page
export async function getEditablePageContent(pageKey: string, lang: string = 'es'): Promise<EditablePage | null> {
  try {
    const { data, error } = await supabase
      .from('editable_pages')
      .select('*')
      .eq('page_key', pageKey)
      .eq('lang', lang)
      .maybeSingle();

    if (error) {
      console.error('Error fetching editable page:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching editable page:', error);
    return null;
  }
}

// Save editable content for a page
export async function saveEditablePageContent(
  pageKey: string, 
  lang: string, 
  content: any
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('editable_pages')
      .upsert({
        page_key: pageKey,
        lang: lang,
        content: content,
        last_modified: new Date().toISOString()
      }, {
        onConflict: 'page_key,lang'
      });

    if (error) {
      console.error('Error saving editable page:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving editable page:', error);
    return false;
  }
}

// Get all editable pages for admin
export async function getAllEditablePages(): Promise<EditablePage[]> {
  try {
    const { data, error } = await supabase
      .from('editable_pages')
      .select('*')
      .order('page_key', { ascending: true })
      .order('lang', { ascending: true });

    if (error) {
      console.error('Error fetching all editable pages:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching all editable pages:', error);
    return [];
  }
}

// Default content structure for different page types
export const getDefaultPageContent = (pageKey: string, lang: string = 'es') => {
  const isEnglish = lang === 'en';
  
  const defaults = {
    home: {
      hero: {
        type: 'hero',
        title: isEnglish ? 'Veterinary consulting and technology, frictionless.' : 'Consultoría y tecnología veterinaria, sin fricción.',
        subtitle: isEnglish ? 'We integrate AI, processes and business for measurable results.' : 'Integramos IA, procesos y negocio para resultados medibles.',
        cta_primary: isEnglish ? "Let's talk" : 'Hablemos',
        cta_secondary: isEnglish ? 'See services' : 'Ver servicios'
      },
      whatWeDo: {
        type: 'section',
        title: isEnglish ? 'What we do' : 'Qué hacemos',
        subtitle: isEnglish ? 'Specialized solutions that transform the veterinary sector' : 'Soluciones especializadas que transforman el sector veterinario',
        services: [
          {
            title: isEnglish ? 'Market Bridge' : 'Market bridge',
            description: isEnglish ? 'Market access, pricing, channel strategy, OEM/Distribution agreements.' : 'Acceso a mercado, pricing, estrategia de canal, acuerdos OEM/Distribución.'
          },
          {
            title: isEnglish ? 'AI & software for clinics' : 'IA & software para clínicas',
            description: isEnglish ? 'Distribution/implementation of clinical AI (radiology, workflows), PACS, report automation.' : 'Distribución/implantación de IA clínica (radiología, flujos), PACS, automatización de informes.'
          },
          {
            title: isEnglish ? 'No-Code Automation' : 'Automatización No-Code',
            description: isEnglish ? 'Make/n8n workflow design, PIMS integrations, CRM, email, dashboards.' : 'Diseño de flujos Make/n8n, integraciones con PIMS, CRM, email, dashboards.'
          }
        ]
      }
    },
    services: {
      header: {
        type: 'hero',
        title: isEnglish ? 'Our Services' : 'Nuestros servicios',
        subtitle: isEnglish ? 'Specialized solutions that transform the veterinary sector through science, technology and practical innovation.' : 'Soluciones especializadas que transforman el sector veterinario a través de la ciencia, la tecnología y la innovación práctica.'
      }
    },
    about: {
      header: {
        type: 'hero',
        title: isEnglish ? 'About KADMEIA' : 'Sobre KADMEIA',
        subtitle: isEnglish ? 'We were born to be the bridge between veterinary science, business opportunities and technological solutions that really work.' : 'Nacimos para ser el puente entre la ciencia veterinaria, las oportunidades de negocio y las soluciones tecnológicas que realmente funcionan.'
      },
      mission: {
        type: 'section',
        title: isEnglish ? 'Clear, rigorous and human' : 'Clara, rigurosa y humana',
        content: isEnglish ? 'The veterinary sector evolves rapidly, but the gap between technological innovation and its practical application remains enormous. At KADMEIA we close that gap with solid roots in veterinary science and a technological look towards the future.' : 'El sector veterinario evoluciona rápidamente, pero la brecha entre la innovación tecnológica y su aplicación práctica sigue siendo enorme. En KADMEIA cerramos esa brecha con raíces sólidas en la ciencia veterinaria y una mirada tecnológica hacia el futuro.'
      }
    }
  };

  return defaults[pageKey as keyof typeof defaults] || {};
};
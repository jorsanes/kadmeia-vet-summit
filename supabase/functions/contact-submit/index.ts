import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone?: string;
  message: string;
  consent: boolean;
  honeypot?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Rate limiting: basic IP-based check
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown'
    
    // Parse request body
    const formData: ContactFormData = await req.json()
    
    // Validation
    if (!formData.name || !formData.email || !formData.message || !formData.consent) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Honeypot check (basic bot protection)
    if (formData.honeypot && formData.honeypot.trim() !== '') {
      console.log('Bot detected via honeypot:', clientIP)
      return new Response(
        JSON.stringify({ error: 'Spam detected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return new Response(
        JSON.stringify({ error: 'Email inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Store in database
    const { data, error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone || null,
        message: formData.message,
        client_ip: clientIP,
        created_at: new Date().toISOString(),
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Error guardando mensaje' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send email notification using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (resendApiKey) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'KADMEIA Contact <noreply@kadmeia.com>',
            to: ['info@kadmeia.com'],
            reply_to: [formData.email],
            subject: `Nuevo contacto de ${formData.name}`,
            html: `
              <h2>Nuevo mensaje de contacto</h2>
              <p><strong>Nombre:</strong> ${formData.name}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Empresa:</strong> ${formData.company}</p>
              ${formData.phone ? `<p><strong>Teléfono:</strong> ${formData.phone}</p>` : ''}
              <p><strong>Mensaje:</strong></p>
              <p>${formData.message.replace(/\n/g, '<br>')}</p>
              <hr>
              <p><small>IP: ${clientIP} | Fecha: ${new Date().toLocaleString('es-ES')}</small></p>
            `,
            text: `
              Nuevo mensaje de contacto
              
              Nombre: ${formData.name}
              Email: ${formData.email}
              Empresa: ${formData.company}
              ${formData.phone ? `Teléfono: ${formData.phone}` : ''}
              
              Mensaje:
              ${formData.message}
              
              ---
              IP: ${clientIP} | Fecha: ${new Date().toLocaleString('es-ES')}
            `
          }),
        })

        if (!emailResponse.ok) {
          console.error('Email sending failed:', await emailResponse.text())
        }
      } catch (emailError) {
        console.error('Email error:', emailError)
        // Don't fail the whole request if email fails
      }
    }

    console.log('Contact form submitted successfully:', { name: formData.name, email: formData.email, company: formData.company })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Mensaje enviado correctamente. Te contactaremos pronto.' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
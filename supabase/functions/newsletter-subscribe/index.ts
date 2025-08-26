import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NewsletterSubscriptionData {
  email: string;
  honeypot?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('cf-connecting-ip') || 
                    req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown'

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Rate limiting: max 5 subscriptions per 10 minutes per IP
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
    
    const { data: recentSubmissions, error: rateLimitError } = await supabase
      .from('api_throttle')
      .select('request_count')
      .eq('ip_address', clientIP)
      .eq('endpoint', 'newsletter-subscribe')
      .gte('window_start', tenMinutesAgo)

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError)
    } else {
      const totalRequests = recentSubmissions?.reduce((sum, record) => sum + record.request_count, 0) || 0
      
      if (totalRequests >= 5) {
        console.log(`Rate limit exceeded for IP: ${clientIP}`)
        return new Response(
          JSON.stringify({ error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' }),
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

    // Record this request for rate limiting
    await supabase
      .from('api_throttle')
      .insert({
        ip_address: clientIP,
        endpoint: 'newsletter-subscribe',
        window_start: new Date().toISOString(),
        request_count: 1
      })
    
    // Parse request body
    const formData: NewsletterSubscriptionData = await req.json()
    
    // Validation
    if (!formData.email) {
      return new Response(
        JSON.stringify({ error: 'Email es requerido' }),
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


    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id, unsubscribed')
      .eq('email', formData.email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Database check error:', checkError)
      return new Response(
        JSON.stringify({ error: 'Error verificando suscripción' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (existingSubscriber) {
      if (existingSubscriber.unsubscribed) {
        // Reactivate subscription
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({ unsubscribed: false, client_ip: clientIP })
          .eq('email', formData.email)

        if (updateError) {
          console.error('Database update error:', updateError)
          return new Response(
            JSON.stringify({ error: 'Error reactivando suscripción' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
      // Email already subscribed and active
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Ya estás suscrito a nuestro newsletter.' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Store new subscription in database
    const { data, error: dbError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: formData.email,
        client_ip: clientIP,
        confirmed: true, // Auto-confirm for now
        created_at: new Date().toISOString(),
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Error guardando suscripción' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send webhook notification to MAKE.com for automation
    const makeWebhookUrl = Deno.env.get('MAKE_NEWSLETTER_WEBHOOK_URL')
    const makeSecret = Deno.env.get('MAKE_WEBHOOK_SECRET')
    if (makeWebhookUrl) {
      try {
        const webhookResponse = await fetch(makeWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Make-Secret': makeSecret || 'kad-2025',
          },
          body: JSON.stringify({
            event_type: 'newsletter_subscription',
            timestamp: new Date().toISOString(),
            data: {
              email: formData.email,
              client_ip: clientIP,
              date: new Date().toLocaleString('es-ES'),
              status: 'new'
            }
          }),
        })

        if (!webhookResponse.ok) {
          console.error('MAKE webhook failed:', await webhookResponse.text())
        } else {
          console.log('MAKE webhook sent successfully')
        }
      } catch (webhookError) {
        console.error('MAKE webhook error:', webhookError)
        // Don't fail the whole request if webhook fails
      }
    }

    console.log('Newsletter subscription successful')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: '¡Gracias! Te has suscrito correctamente a nuestro newsletter.' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
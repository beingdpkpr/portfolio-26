import emailjs from '@emailjs/browser'

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string | undefined
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  as string | undefined

if (PUBLIC_KEY) {
  emailjs.init({ publicKey: PUBLIC_KEY })
}

export function isEmailJSConfigured(): boolean {
  return Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY)
}

export interface EmailPayload {
  from_name: string
  from_email: string
  message: string
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error('EmailJS environment variables are not configured.')
  }

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out after 12s')), 12_000)
  )

  await Promise.race([
    emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        from_name:  payload.from_name,
        from_email: payload.from_email,
        message:    payload.message,
        sent_at:    new Date().toISOString(),
        page_url:   window.location.href,
      }
    ),
    timeoutPromise,
  ])
}

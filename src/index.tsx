import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors())

// API Route for contact form
app.post('/api/contact', async (c) => {
  try {
    const body = await c.req.json()
    console.log('New Contact Form Submission:', body)
    
    return c.json({ 
      success: true, 
      message: 'Inquiry received' 
    })
  } catch (err) {
    console.error('Error processing form:', err)
    return c.json({ success: false, message: 'Invalid data' }, 400)
  }
})

// Fallback to static assets
app.get('/*', (c) => {
  return c.env.ASSETS.fetch(c.req.raw)
})

export default app
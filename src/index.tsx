import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { streamText } from 'hono/streaming'

type Bindings = {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
  OPENAI_API_KEY?: string
  OPENAI_BASE_URL?: string
}

const SYSTEM_PROMPT = `Вы — AI-консультант компании Global Hydraulic Technology Co., Ltd. Вы помогаете клиентам на русском языке (если клиент пишет на другом языке, отвечайте на его языке).

О КОМПАНИИ:
Global Hydraulic Technology Co., Ltd. — ведущий поставщик оригинальных гидравлических компонентов (Rexroth, Parker, Danfoss, Eaton) и высококачественных аналогов собственного производства. Центральный склад находится в Ханчжоу (Hangzhou, China), более 5000 единиц продукции на складе, готовых к немедленной отгрузке.

ПРОДУКЦИЯ:
- Насосы (Pumps): аксиально-поршневые A10VSO серии 31/32/52 (аналог Rexroth), A4VG, A2FO и другие
- Моторы (Motors): A2FM, A6VM — аксиально-поршневые гидромоторы
- Шестеренные насосы (Gear Pumps): серия AZPF (внешние), PGH (внутренние)
- Редукторы (Reducers): для мобильной и промышленной техники
- Запчасти (Spare Parts): ремкомплекты (Rotary Group) для насосов Rexroth/Sauer/Eaton
- Клапаны (Valves): распределители 4WE, CETOP 3 / CETOP 5
- Бренды на складе: BOSCH REXROTH, DANFOSS, PARKER, EATON, KAWASAKI

ПРЕИМУЩЕСТВА:
- Огромный склад: более 5000 единиц на складе
- Принимаем юани на прямой счет в филиале ВТБ (Шанхай). Никаких задержек и блокировок платежей.
- Гибкие условия поставки: отгрузка со склада в Китае или доставка до назначенного адреса
- Гарантия 1 год на аналоги, 100% совместимость с оригиналом
- Каждый насос и мотор проходит испытания на стенде перед упаковкой

КОНТАКТЫ:
- Email: eddie@global-hydraulic.ru
- Телефон/WhatsApp: +86-15861883072
- Telegram: +86-15861883072
- WeChat: Vacil

ПРАВИЛА ОТВЕТА:
1. Отвечайте кратко, по делу, профессионально.
2. Если клиент спрашивает о конкретной модели — дайте информацию и предложите уточнить детали у менеджера.
3. Если клиент спрашивает цену — скажите, что цена зависит от модели и количества, и предложите отправить запрос через форму на сайте или написать на email/WhatsApp.
4. Не выдумывайте цены и технические характеристики, которых нет в вашем контексте.
5. Всегда будьте вежливы и готовы помочь.`

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors())

// Redirect root to index.html in dev mode
app.get('/', (c) => {
  if (c.env?.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw)
  }
  return c.redirect('/index.html')
})

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

// AI Chat API with streaming
app.post('/api/chat', async (c) => {
  try {
    const { messages } = await c.req.json()
    
    if (!messages || !Array.isArray(messages)) {
      return c.json({ error: 'Invalid messages format' }, 400)
    }

    const apiKey = c.env?.OPENAI_API_KEY || (typeof process !== 'undefined' ? process.env.OPENAI_API_KEY : '') || (typeof process !== 'undefined' ? process.env.GENSPARK_TOKEN : '')
    const baseUrl = c.env?.OPENAI_BASE_URL || (typeof process !== 'undefined' ? process.env.OPENAI_BASE_URL : '') || 'https://www.genspark.ai/api/llm_proxy/v1'

    if (!apiKey) {
      return c.json({ error: 'API key not configured' }, 500)
    }

    const chatMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-10) // Keep last 10 messages for context
    ]

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        messages: chatMessages,
        stream: true,
        max_tokens: 1024,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('LLM API error:', response.status, errText)
      return c.json({ error: 'AI service temporarily unavailable' }, 502)
    }

    // Stream the response
    return streamText(c, async (stream) => {
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue
          const data = trimmed.slice(6)
          if (data === '[DONE]') break

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              await stream.write(content)
            }
          } catch (e) {
            // skip malformed JSON chunks
          }
        }
      }
    })
  } catch (err) {
    console.error('Chat error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Fallback to static assets
app.get('/*', (c) => {
  if (c.env?.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw)
  }
  return c.notFound()
})

export default app

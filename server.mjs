import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import yaml from 'js-yaml';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load API config
const configPath = path.join(os.homedir(), '.genspark_llm.yaml');
let apiKey = process.env.OPENAI_API_KEY || process.env.GENSPARK_TOKEN || '';
let baseUrl = process.env.OPENAI_BASE_URL || 'https://www.genspark.ai/api/llm_proxy/v1';

if (fs.existsSync(configPath)) {
  try {
    const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
    if (config?.openai?.api_key) {
      // Handle ${GENSPARK_TOKEN} variable substitution
      apiKey = config.openai.api_key.replace(/\$\{(\w+)\}/g, (_, key) => process.env[key] || '');
    }
    if (config?.openai?.base_url) baseUrl = config.openai.base_url;
  } catch (e) { /* ignore */ }
}

console.log('API Key loaded:', apiKey ? `${apiKey.slice(0, 8)}...` : 'NOT SET');
console.log('Base URL:', baseUrl);

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
5. Всегда будьте вежливы и готовы помочь.`;

const app = express();
app.use(express.json());

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Smart fallback responses when LLM API is unavailable
function sendFallbackResponse(userMsg, res) {
  const msg = userMsg.toLowerCase();
  let reply = '';

  if (msg.includes('насос') || msg.includes('pump') || msg.includes('a10vso') || msg.includes('a4vg') || msg.includes('a2fo')) {
    reply = 'У нас на складе в Ханчжоу имеются аксиально-поршневые насосы:\n\n- **A10VSO** серии 31/32/52 (аналог Rexroth)\n- **A4VG** — для гидростатических трансмиссий\n- **A2FO** — насосы фиксированного рабочего объёма\n- **Шестеренные насосы** серии AZPF, PGH\n\nДля уточнения наличия и цены конкретной модели свяжитесь с нами:\nWhatsApp: +86-15861883072\nEmail: eddie@global-hydraulic.ru';
  } else if (msg.includes('мотор') || msg.includes('motor') || msg.includes('a2fm') || msg.includes('a6vm')) {
    reply = 'Мы поставляем гидромоторы:\n\n- **A2FM** — аксиально-поршневые с фиксированным рабочим объёмом\n- **A6VM** — регулируемые гидромоторы\n\nВсе моторы проходят испытания на стенде перед отгрузкой. Гарантия 1 год.\n\nWhatsApp: +86-15861883072\nEmail: eddie@global-hydraulic.ru';
  } else if (msg.includes('цен') || msg.includes('стоим') || msg.includes('price') || msg.includes('сколько')) {
    reply = 'Цена зависит от модели, серии и количества. Мы предлагаем конкурентные цены благодаря прямым поставкам со склада в Ханчжоу.\n\nОтправьте запрос с указанием модели и количества:\nWhatsApp: +86-15861883072\nEmail: eddie@global-hydraulic.ru\n\nОтвет в течение 24 часов!';
  } else if (msg.includes('доставк') || msg.includes('отгруз') || msg.includes('deliver') || msg.includes('shipping')) {
    reply = 'Условия поставки:\n\n- Отгрузка со склада в Ханчжоу (Китай)\n- Доставка до назначенного адреса в Китае\n- Более 5000 единиц на складе, готовых к немедленной отгрузке\n\nWhatsApp: +86-15861883072';
  } else if (msg.includes('оплат') || msg.includes('платёж') || msg.includes('payment') || msg.includes('втб') || msg.includes('юан')) {
    reply = 'Способы оплаты:\n\nПринимаем юани на прямой счёт в филиале ВТБ (Шанхай). Никаких задержек и блокировок платежей.\n\nWhatsApp: +86-15861883072\nEmail: eddie@global-hydraulic.ru';
  } else if (msg.includes('бренд') || msg.includes('brand') || msg.includes('марк') || msg.includes('производител')) {
    reply = 'Мы поставляем оригинальное оборудование ведущих производителей:\n\n- **BOSCH REXROTH**\n- **DANFOSS**\n- **PARKER**\n- **EATON**\n- **KAWASAKI**\n\nТакже предлагаем высококачественные аналоги собственного производства с гарантией 1 год.';
  } else if (msg.includes('клапан') || msg.includes('valve') || msg.includes('4we') || msg.includes('распределител')) {
    reply = 'В наличии гидроклапаны и распределители:\n\n- **4WE** серии — распределители CETOP 3 / CETOP 5\n- Аналоги Rexroth, полная совместимость\n\nДля уточнения модели:\nWhatsApp: +86-15861883072\nEmail: eddie@global-hydraulic.ru';
  } else if (msg.includes('запчаст') || msg.includes('parts') || msg.includes('ремкомплект') || msg.includes('rotary')) {
    reply = 'Предлагаем запасные части и ремкомплекты (Rotary Group) для насосов:\n\n- Rexroth\n- Sauer-Danfoss\n- Eaton\n\nВсе запчасти на складе в Ханчжоу.\n\nWhatsApp: +86-15861883072\nEmail: eddie@global-hydraulic.ru';
  } else if (msg.includes('контакт') || msg.includes('связ') || msg.includes('contact') || msg.includes('телефон') || msg.includes('email') || msg.includes('whatsapp')) {
    reply = 'Наши контакты:\n\nEmail: eddie@global-hydraulic.ru\nТелефон/WhatsApp: +86-15861883072\nTelegram: +86-15861883072\nWeChat: Vacil\n\nЦентральный склад: Hangzhou, China\nОтветим на ваш запрос в течение 24 часов!';
  } else if (msg.includes('привет') || msg.includes('здравствуй') || msg.includes('hello') || msg.includes('hi')) {
    reply = 'Здравствуйте! Я AI-консультант Global Hydraulic. Чем могу помочь?\n\nМогу рассказать о:\n- Насосах, моторах, клапанах\n- Наличии на складе\n- Условиях оплаты и доставки\n- Контактах менеджера';
  } else if (msg.includes('гарант') || msg.includes('warranty') || msg.includes('качеств')) {
    reply = 'Гарантия качества:\n\n- **Гарантия 1 год** на аналоги собственного производства\n- **100% совместимость** с оригинальными компонентами\n- Каждый насос и мотор проходит **испытания на стенде** перед отгрузкой\n- Полные комплекты документов и фотоотчёты\n\nWhatsApp: +86-15861883072';
  } else if (msg.includes('редуктор') || msg.includes('reducer')) {
    reply = 'Поставляем редукторы для мобильной и промышленной техники.\n\nДля уточнения модели и наличия:\nWhatsApp: +86-15861883072\nEmail: eddie@global-hydraulic.ru';
  } else {
    reply = 'Спасибо за ваш вопрос! Я помогу вам найти нужную информацию.\n\nGlobal Hydraulic — поставщик оригинальной гидравлики (Rexroth, Parker, Danfoss, Eaton, Kawasaki) и качественных аналогов. Более 5000 единиц на складе в Ханчжоу.\n\nДля детальной консультации свяжитесь с менеджером:\nWhatsApp: +86-15861883072\nEmail: eddie@global-hydraulic.ru\n\nОтветим в течение 24 часов!';
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(reply);
}

// Chat API
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages' });
    }

    if (!apiKey) {
      return sendFallbackResponse(messages[messages.length - 1]?.content || '', res);
    }

    const chatMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-10)
    ];

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
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('LLM API error:', response.status, errText);
      // Fallback to predefined responses
      return sendFallbackResponse(messages[messages.length - 1]?.content || '', res);
    }

    // Stream the response
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') break;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            res.write(content);
          }
        } catch (e) { /* skip */ }
      }
    }

    res.end();
  } catch (err) {
    console.error('Chat error:', err);
    if (!res.headersSent) {
      return sendFallbackResponse(req.body?.messages?.slice(-1)?.[0]?.content || '', res);
    } else {
      res.end();
    }
  }
});

// Contact form API
app.post('/api/contact', (req, res) => {
  console.log('Contact form:', req.body);
  res.json({ success: true, message: 'Inquiry received' });
});

// SPA fallback
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

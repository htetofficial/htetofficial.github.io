/**
 * Htet Official — Telegram Bot (Serverless Cloudflare Worker Webhook)
 * Free 24/7 Edge Hosting on Cloudflare Workers
 * 
 * Setup:
 * 1. Create a Worker at https://workers.cloudflare.com
 * 2. Paste this code into Worker editor
 * 3. Add Environment Variable in Worker Settings:
 *    BOT_TOKEN = "your_telegram_bot_token_from_botfather"
 *    WEBAPP_URL = "https://htetofficialgithubio.vercel.app"
 * 4. Set Telegram Webhook:
 *    curl -F "url=https://<your-worker-name>.<your-subdomain>.workers.dev" https://api.telegram.org/bot<BOT_TOKEN>/setWebhook
 */

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Htet Official Telegram Webhook is active.', { status: 200 });
    }

    const token = env.BOT_TOKEN;
    const webappUrl = env.WEBAPP_URL || 'https://htetofficialgithubio.vercel.app';

    if (!token) {
      return new Response('BOT_TOKEN missing in environment', { status: 500 });
    }

    try {
      const update = await request.json();
      await handleUpdate(update, token, webappUrl);
      return new Response('OK', { status: 200 });
    } catch (err) {
      return new Response('Error: ' + err.message, { status: 200 });
    }
  }
};

async function handleUpdate(update, token, webappUrl) {
  if (update.message) {
    await handleMessage(update.message, token, webappUrl);
  } else if (update.inline_query) {
    await handleInlineQuery(update.inline_query, token, webappUrl);
  }
}

async function handleMessage(msg, token, webappUrl) {
  const chatId = msg.chat.id;
  const text = (msg.text || '').trim();
  const userName = msg.from ? (msg.from.first_name || 'မိတ်ဆွေ') : 'မိတ်ဆွေ';

  if (text.startsWith('/start')) {
    const welcomeText = 
      `🌸 <b>မင်္ဂလာပါ ${userName} ရှင့်၊</b>\n\n` +
      `<b>ထက် (Htet)</b> ၏ တရားဝင် Telegram Official Bot နှင့် Mini App မှ နွေးထွေးစွာ ကြိုဆိုပါသည်ရှင်။\n\n` +
      `🇲🇲 <b>မြန်မာနိုင်ငံတွင်းမှ မိတ်ဆွေများအတွက်:</b>\n` +
      `Telegram Mini App အား <b>VPN မလိုဘဲ တိုက်ရိုက်အသုံးပြုနိုင်သော Vercel Node</b> ဖြင့် ချိတ်ဆက်ထားပေးပါသဖြင့် လွယ်ကူလျင်မြန်စွာ ဖွင့်လှစ်နိုင်ပါသည်ရှင်။\n\n` +
      `🕊️ <b>ဒေါ်အောင်ဆန်းစုကြည် ၈၁ နှစ်ပြည့် မွေးနေ့ဂုဏ်ပြုလွှာနှင့် Freedom from Fear</b> စာတမ်းများကိုလည်း ` +
      `အောက်ပါခလုတ်များဖြင့် ချက်ချင်း ဖတ်ရှု/နားဆင်နိုင်ပါပြီရှင်။`;

    const keyboard = {
      inline_keyboard: [
        [{ text: '🚀 Htet Mini App ဖွင့်ရန် (VPN မလို Vercel)', web_app: { url: webappUrl } }],
        [
          { text: '🌐 ဘာသာပြန်စတူဒီယို', web_app: { url: `${webappUrl}/translate.html` } },
          { text: '📚 အဘိဓာန်', web_app: { url: `${webappUrl}/dictionary.html` } }
        ],
        [
          { text: '🕊️ Freedom from Fear', web_app: { url: `${webappUrl}/article.html?id=aung-san-suu-kyi-freedom-from-fear-1990-mm` } },
          { text: '🎂 မွေးနေ့ဂုဏ်ပြုလွှာ', web_app: { url: `${webappUrl}/article.html?id=daw-aung-san-suu-kyi-81st-birthday-tribute` } }
        ],
        [
          { text: '📢 Telegram: @htetmmofficial', url: 'https://t.me/htetmmofficial' },
          { text: '📚 Library: @ideahublibrary', url: 'https://t.me/ideahublibrary' }
        ]
      ]
    };

    await sendTelegram('sendMessage', token, {
      chat_id: chatId,
      text: welcomeText,
      parse_mode: 'HTML',
      reply_markup: keyboard
    });
  } else if (text.startsWith('/app') || text.startsWith('/mini')) {
    await sendTelegram('sendMessage', token, {
      chat_id: chatId,
      text: '🚀 <b>Htet Official Telegram Mini App</b>\n\nမြန်မာနိုင်ငံတွင်းမှ VPN မလိုဘဲ တိုက်ရိုက်ဖွင့်နိုင်သော Vercel Node ဖြင့် ချိတ်ဆက်ထားပါသည်ရှင်။',
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Mini App မျက်နှာပြည့် ဖွင့်မည် (VPN မလို)', web_app: { url: webappUrl } }]
        ]
      }
    });
  } else if (text.startsWith('/suukyi') || text.startsWith('/birthday')) {
    await sendTelegram('sendMessage', token, {
      chat_id: chatId,
      text: '🕊️ <b>ဒေါ်အောင်ဆန်းစုကြည် ၈၁ နှစ်ပြည့် မွေးနေ့နှင့် Freedom from Fear</b>\n\n<i>"The only real prison is fear, and the only real freedom is Freedom from Fear."</i>\n— Aung San Suu Kyi',
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎂 မွေးနေ့ဆုတောင်းလွှာ ဖတ်ရန် (VPN မလို)', web_app: { url: `${webappUrl}/article.html?id=daw-aung-san-suu-kyi-81st-birthday-tribute` } }],
          [{ text: '📖 Freedom from Fear စာတမ်း', web_app: { url: `${webappUrl}/article.html?id=aung-san-suu-kyi-freedom-from-fear-1990-mm` } }]
        ]
      }
    });
  } else if (text.startsWith('/translate')) {
    const q = text.replace('/translate', '').trim();
    if (!q) {
      await sendTelegram('sendMessage', token, {
        chat_id: chatId,
        text: '🌐 <b>အသုံးပြုပုံ:</b> <code>/translate &lt;စာသား&gt;</code>',
        parse_mode: 'HTML'
      });
      return;
    }
    const isMy = /[က-႟]/.test(q);
    const sl = isMy ? 'my' : 'en';
    const tl = isMy ? 'en' : 'my';
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(q)}`);
    const data = await res.json();
    const translated = data && data[0] ? data[0].map(p => p[0]).join('') : '';

    await sendTelegram('sendMessage', token, {
      chat_id: chatId,
      text: `🌐 <b>ဘာသာပြန်ဆိုချက်:</b>\n\n<b>မူရင်း:</b> ${q}\n\n<b>ဘာသာပြန်:</b>\n<b>${translated}</b>`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🌐 ဘာသာပြန်စတူဒီယို ဖွင့်မည် (VPN မလို)', web_app: { url: `${webappUrl}/translate.html` } }]
        ]
      }
    });
  } else {
    await sendTelegram('sendMessage', token, {
      chat_id: chatId,
      text: '📖 <b>Htet Official Bot</b>\n\nCommands: /start, /app, /translate, /suukyi, /mirrors, /help\n\nအောက်ပါခလုတ်ဖြင့် Mini App (VPN မလို) ကို ဖွင့်လှစ်နိုင်ပါသည်ရှင်။',
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Htet Mini App ဖွင့်ရန် (VPN မလို)', web_app: { url: webappUrl } }]
        ]
      }
    });
  }
}

async function handleInlineQuery(iq, token, webappUrl) {
  const results = [
    {
      type: 'article',
      id: 'app',
      title: '📖 Htet Official Mini App (VPN မလို)',
      description: 'မြန်မာနိုင်ငံတွင်းမှ VPN မလိုဘဲ ဖွင့်လှစ်ဖတ်ရှုရန်',
      input_message_content: {
        message_text: `📖 <b>Htet Official Telegram Mini App</b>\n${webappUrl}`,
        parse_mode: 'HTML'
      },
      reply_markup: {
        inline_keyboard: [[{ text: '🚀 Mini App ဖွင့်ရန် (VPN မလို)', web_app: { url: webappUrl } }]]
      }
    }
  ];

  await sendTelegram('answerInlineQuery', token, {
    inline_query_id: iq.id,
    results: results,
    cache_time: 300
  });
}

async function sendTelegram(method, token, body) {
  return fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

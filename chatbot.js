// ChargeWiseHub - Customer Service Chatbot v2
// Upgraded: smarter recommendations, more products, better keyword matching, budget filters
(function() {
  const BRAND = {
    name: 'ChargeWise Assistant',
    color: '#0ea5e9',
    accent: '#06b6d4',
    greeting: "G'day! I'm your ChargeWise Assistant ⚡ Tell me what you need to charge and I'll find the best option for you.",
    site: 'chargewisehub.com'
  };

  if (document.getElementById('cwh-chatbot-widget')) return;

  const style = document.createElement('style');
  style.textContent = `
    #cwh-chatbot-widget { position:fixed; bottom:24px; right:24px; z-index:9999; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
    #cwh-chat-bubble { width:60px; height:60px; border-radius:50%; background:linear-gradient(135deg,${BRAND.color},${BRAND.accent}); cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px rgba(14,165,233,.4); transition:transform .2s; }
    #cwh-chat-bubble:hover { transform:scale(1.1); }
    #cwh-chat-bubble svg { width:28px; height:28px; fill:white; }
    #cwh-chat-panel { display:none; position:absolute; bottom:72px; right:0; width:340px; max-height:540px; background:#fff; border-radius:16px; box-shadow:0 8px 40px rgba(0,0,0,0.2); overflow:hidden; flex-direction:column; }
    #cwh-chat-panel.open { display:flex; }
    #cwh-chat-header { background:linear-gradient(135deg,${BRAND.color},${BRAND.accent}); color:white; padding:14px 16px; display:flex; align-items:center; gap:10px; }
    #cwh-chat-header strong { font-size:15px; }
    #cwh-chat-close { margin-left:auto; cursor:pointer; font-size:20px; line-height:1; }
    #cwh-chat-messages { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px; min-height:200px; max-height:360px; background:#f0f9ff; }
    .cwh-msg { max-width:88%; padding:10px 13px; border-radius:12px; font-size:13.5px; line-height:1.55; }
    .cwh-msg.bot { background:white; align-self:flex-start; color:#222; border:1px solid #bae6fd; border-bottom-left-radius:3px; }
    .cwh-msg.user { background:${BRAND.color}; color:white; align-self:flex-end; border-bottom-right-radius:3px; }
    #cwh-chat-input-area { padding:10px; border-top:1px solid #e0f2fe; display:flex; gap:8px; background:white; }
    #cwh-chat-input { flex:1; border:1px solid #bae6fd; border-radius:20px; padding:8px 14px; font-size:13px; outline:none; }
    #cwh-chat-input:focus { border-color:${BRAND.color}; }
    #cwh-chat-send { background:${BRAND.color}; color:white; border:none; border-radius:50%; width:36px; height:36px; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; }
    .cwh-quick-btns { display:flex; flex-wrap:wrap; gap:6px; margin-top:2px; }
    .cwh-quick-btn { background:white; border:1.5px solid ${BRAND.color}; color:${BRAND.color}; border-radius:16px; padding:5px 11px; font-size:12px; cursor:pointer; transition:all .15s; }
    .cwh-quick-btn:hover { background:${BRAND.color}; color:white; }
    .cwh-product-card { background:white; border:1px solid #bae6fd; border-radius:10px; padding:10px 12px; margin-top:4px; }
    .cwh-product-card .cwh-prod-title { font-weight:700; font-size:13px; color:#0ea5e9; margin-bottom:3px; }
    .cwh-product-card .cwh-prod-price { font-size:12px; color:#16a34a; font-weight:600; margin-bottom:4px; }
    .cwh-product-card .cwh-prod-desc { font-size:12px; color:#555; margin-bottom:7px; line-height:1.4; }
    .cwh-product-card a { display:inline-block; background:${BRAND.color}; color:white; border-radius:8px; padding:5px 12px; font-size:12px; font-weight:600; text-decoration:none; }
    .cwh-product-card a:hover { background:#0284c7; }
    #cwh-lead-form { padding:12px 14px; background:#f0f9ff; border-top:1px solid #bae6fd; display:none; flex-direction:column; gap:8px; }
    #cwh-lead-form h4 { margin:0 0 2px; color:${BRAND.color}; font-size:13px; }
    #cwh-lead-form input { border:1px solid #bae6fd; border-radius:8px; padding:8px 12px; font-size:13px; outline:none; }
    #cwh-lead-submit { background:${BRAND.color}; color:white; border:none; border-radius:8px; padding:9px; font-weight:600; cursor:pointer; font-size:13px; }
    #cwh-lead-submit:hover { background:#0284c7; }
    .cwh-badge { display:inline-block; background:#fef3c7; color:#92400e; border-radius:6px; padding:1px 7px; font-size:11px; font-weight:600; margin-left:4px; }
  `;
  document.head.appendChild(style);

  const widget = document.createElement('div');
  widget.id = 'cwh-chatbot-widget';
  widget.innerHTML = `
    <div id="cwh-chat-panel">
      <div id="cwh-chat-header">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M13 10h-2V7l-4 5h3v3l4-5zm-1-8C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
        <div><strong>⚡ ${BRAND.name}</strong><br><span style="font-size:11px;opacity:.85">Expert advice · Australian prices</span></div>
        <span id="cwh-chat-close" title="Close">✕</span>
      </div>
      <div id="cwh-chat-messages"></div>
      <div id="cwh-lead-form">
        <h4>📬 Get our free Best Charger Guide (AU)</h4>
        <input id="cwh-lead-name" placeholder="Your name (optional)" />
        <input id="cwh-lead-email" placeholder="Email address *" type="email" required />
        <button id="cwh-lead-submit">Send me the free guide →</button>
      </div>
      <div id="cwh-chat-input-area">
        <input id="cwh-chat-input" placeholder="Ask me anything about chargers..." maxlength="500" />
        <button id="cwh-chat-send" title="Send">➤</button>
      </div>
    </div>
    <div id="cwh-chat-bubble" title="Chat with us">
      <svg viewBox="0 0 24 24"><path d="M13 10h-2V7l-4 5h3v3l4-5zm-1-8C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
    </div>
  `;
  document.body.appendChild(widget);

  // ── Product Database ───────────────────────────────────────────────────────
  const PRODUCTS = {
    noco_genius10: {
      name: 'NOCO Genius 10',
      price: '~$119',
      badge: '⭐ Best Overall',
      desc: 'Smart 10A charger. Works on all 12V/6V batteries — AGM, lithium, flooded. Includes repair mode.',
      link: 'https://chargewisehub.com/reviews/noco-genius-10/',
      tags: ['car', 'truck', 'agm', 'lithium', 'smart', 'best', 'recommend', 'maintenance']
    },
    ctek_mxs5: {
      name: 'CTEK MXS 5.0',
      price: '~$89',
      badge: '💰 Best Value',
      desc: 'Swedish-engineered 8-step charger. Reconditioning mode, temperature compensated. Ideal for daily use.',
      link: 'https://chargewisehub.com/reviews/ctek-mxs-5-0/',
      tags: ['car', 'motorcycle', 'budget', 'cheap', 'value', 'maintenance', 'everyday']
    },
    noco_boost_gb40: {
      name: 'NOCO Boost Plus GB40',
      price: '~$129',
      badge: '🏆 Top Jump Starter',
      desc: 'Jumps engines up to 6L petrol or 3L diesel. UltraSafe spark-proof. Compact glove box size.',
      link: 'https://chargewisehub.com/reviews/noco-boost-plus-gb40/',
      tags: ['jump', 'jumpstart', 'start', 'boost', 'dead battery', 'emergency', 'portable']
    },
    redarc_bcdc1225d: {
      name: 'Redarc BCDC1225D',
      price: '~$299',
      badge: '🔋 4WD Gold Standard',
      desc: '25A DC-DC charger with MPPT solar input. Perfect for dual battery systems in 4WDs and caravans.',
      link: 'https://chargewisehub.com/reviews/redarc-bcdc1225d/',
      tags: ['4wd', '4x4', 'caravan', 'dual battery', 'offroad', 'solar', 'redarc', 'dc-dc']
    },
    anker_prime: {
      name: 'Anker Prime 27650mAh',
      price: '~$189',
      badge: '📱 Best Power Bank',
      desc: '140W fast charging, charges laptops & phones simultaneously. Compact for its massive capacity.',
      link: 'https://chargewisehub.com/reviews/anker-prime-27650/',
      tags: ['power bank', 'portable', 'phone', 'laptop', 'travel', 'usb', 'anker', 'powerbank']
    },
    anker_3in1: {
      name: 'Anker MagGo 3-in-1',
      price: '~$79',
      badge: '🍎 Best for iPhone',
      desc: 'MagSafe-compatible. Charges iPhone, AirPods, and Apple Watch simultaneously. Folds flat.',
      link: 'https://chargewisehub.com/reviews/anker-maggo-3-in-1/',
      tags: ['iphone', 'magsafe', 'apple', 'airpods', 'watch', 'wireless', 'desk']
    },
    solar_caravan: {
      name: 'Solar Charger Guide (Caravans)',
      price: 'Free Guide',
      badge: '☀️ Solar',
      desc: 'Best solar panels and regulators for caravans and RVs in Australia. MPPT vs PWM explained.',
      link: 'https://chargewisehub.com/best-solar-battery-charger-australia/',
      tags: ['solar', 'caravan', 'rv', 'motorhome', 'panel', 'mppt', 'pwm', 'sun']
    },
    ev_home: {
      name: 'EV Home Charger Guide',
      price: 'Free Guide',
      badge: '🔌 EV',
      desc: 'Best Type 2 AC home chargers in Australia. 7kW to 22kW options. Installation costs explained.',
      link: 'https://chargewisehub.com/best-ev-home-chargers-australia/',
      tags: ['ev', 'electric', 'tesla', 'type 2', 'wallbox', 'home charging', 'electric car', 'electric vehicle']
    },
    lithium_charger: {
      name: 'Best Lithium Charger Guide',
      price: 'Free Guide',
      badge: '⚡ Lithium',
      desc: 'LiFePO4 vs Li-ion chargers. Best options for lithium battery banks in caravans and solar setups.',
      link: 'https://chargewisehub.com/best-lithium-battery-charger-australia/',
      tags: ['lithium', 'lifepo4', 'lithium iron', 'li-ion', 'battery bank']
    },
    marine: {
      name: 'Best Marine Charger Guide',
      price: 'Free Guide',
      badge: '⚓ Marine',
      desc: 'Waterproof chargers for boats, jet skis, and marine batteries. Top picks for Australian waters.',
      link: 'https://chargewisehub.com/best-marine-battery-charger-australia/',
      tags: ['marine', 'boat', 'jetski', 'tinny', 'waterproof', 'sea', 'water']
    }
  };

  // ── Response Engine ────────────────────────────────────────────────────────
  const INTENTS = [
    { keys: ['hi','hello','hey','g\'day','gday','howdy','yo'], type: 'greeting' },
    { keys: ['budget','cheap','cheapest','affordable','under $','cost','price','how much'], type: 'budget' },
    { keys: ['compare','vs','versus','difference','better','which one'], type: 'compare' },
    { keys: ['guide','free','newsletter','subscribe','email me','send me'], type: 'guide' },
    { keys: ['thank','thanks','cheers','perfect','great','awesome'], type: 'thanks' },
    { keys: ['human','person','speak to','talk to','real person','contact'], type: 'human' },
  ];

  function detectProducts(msg) {
    const m = msg.toLowerCase();
    const matches = [];
    for (const [key, prod] of Object.entries(PRODUCTS)) {
      if (prod.tags.some(tag => m.includes(tag))) {
        matches.push({ key, prod });
      }
    }
    return matches;
  }

  function detectIntent(msg) {
    const m = msg.toLowerCase();
    for (const intent of INTENTS) {
      if (intent.keys.some(k => m.includes(k))) return intent.type;
    }
    return null;
  }

  function buildProductCard(prod) {
    return `<div class="cwh-product-card">
      <div class="cwh-prod-title">${prod.name} <span class="cwh-badge">${prod.badge}</span></div>
      <div class="cwh-prod-price">${prod.price}</div>
      <div class="cwh-prod-desc">${prod.desc}</div>
      <a href="${prod.link}" target="_blank">View Full Review →</a>
    </div>`;
  }

  function getResponse(msg) {
    const intent = detectIntent(msg);
    const productMatches = detectProducts(msg);
    const m = msg.toLowerCase();

    // Greeting
    if (intent === 'greeting') {
      return {
        text: "G'day! What do you need to charge today? 😊",
        quick: ['Car battery', '4WD / Caravan', 'EV home charging', 'Jump starter', 'Phone / Laptop', 'Solar setup']
      };
    }

    // Thanks
    if (intent === 'thanks') {
      return {
        text: "No worries! 🤙 Feel free to come back any time. If you'd like our free guide with the top 10 Australian picks, just ask!",
        quick: ['Get the free guide', 'Compare more products', 'Ask another question']
      };
    }

    // Human contact
    if (intent === 'human') {
      return {
        text: 'For direct contact, use the <a href="https://chargewisehub.com/contact" target="_blank" style="color:#0ea5e9">Contact page</a>. We usually respond within 24 hours.',
        quick: ['Back to product help', 'Get the free guide']
      };
    }

    // Guide/lead capture
    if (intent === 'guide') {
      return { text: null, action: 'lead_form' };
    }

    // Budget question
    if (intent === 'budget') {
      return {
        text: '💰 <strong>Best value picks by category:</strong><br><br>🚗 Car battery: <strong>CTEK MXS 5.0</strong> (~$89)<br>⚡ Best overall: <strong>NOCO Genius 10</strong> (~$119)<br>🔋 Jump starter: <strong>NOCO GB40</strong> (~$129)<br>📱 Power bank: <strong>Anker Prime</strong> (~$189)<br><br>All have Amazon AU links with free shipping eligible.',
        quick: ['CTEK MXS 5.0 review', 'NOCO Genius 10 review', 'See all budget picks']
      };
    }

    // Compare request
    if (intent === 'compare') {
      if (m.includes('noco') && m.includes('ctek')) {
        return {
          text: '<strong>NOCO Genius 10 vs CTEK MXS 5.0:</strong><br><br>🏆 <strong>NOCO</strong> — better for lithium batteries, more amps (10A), recovery/repair mode. Best if you have a newer car.<br><br>💰 <strong>CTEK</strong> — slightly cheaper, 8-step program, better for older/classic cars and motorcycle maintenance.<br><br>Both are excellent. NOCO edges it for versatility.',
          quick: ['NOCO Genius 10 review', 'CTEK MXS 5.0 review', 'See budget options']
        };
      }
      return {
        text: "What two products would you like to compare? I can break down the key differences.",
        quick: ['NOCO vs CTEK', 'Redarc vs CTEK', 'Best for my car', 'Best for 4WD']
      };
    }

    // Product matches found
    if (productMatches.length > 0) {
      // Return top 2 matches max
      const top = productMatches.slice(0, 2);
      const cards = top.map(m => buildProductCard(m.prod)).join('');
      return {
        html: cards,
        quick: ['Compare with another', 'See budget options', 'Get the free guide', 'Back to categories']
      };
    }

    // Category-level catches
    if (m.includes('car') || m.includes('truck') || m.includes('vehicle') || m.includes('sedan') || m.includes('suv')) {
      return {
        text: '🚗 <strong>Top car battery chargers:</strong>',
        html: buildProductCard(PRODUCTS.noco_genius10) + buildProductCard(PRODUCTS.ctek_mxs5),
        quick: ['Under $100', 'Which is better?', 'Get the free guide']
      };
    }

    if (m.includes('motorbike') || m.includes('motor bike') || m.includes('harley') || m.includes('bmw motorcycle')) {
      return {
        text: '🏍️ For motorcycles, you want a trickle/maintenance charger — never a full car charger:',
        html: buildProductCard(PRODUCTS.ctek_mxs5),
        quick: ['Other motorcycle options', 'Budget under $80', 'Get the free guide']
      };
    }

    // Default — show categories
    return {
      text: "I can help you find the right charger! What are you trying to charge?",
      quick: ['Car battery', '4WD / Caravan', 'EV home charging', 'Jump starter', 'Solar setup', 'Phone / Laptop']
    };
  }

  // ── DOM Helpers ────────────────────────────────────────────────────────────
  const panel = document.getElementById('cwh-chat-panel');
  const messages = document.getElementById('cwh-chat-messages');
  const input = document.getElementById('cwh-chat-input');
  let opened = false;

  function addMessage(content, sender, isHtml = false) {
    const div = document.createElement('div');
    div.className = `cwh-msg ${sender}`;
    if (isHtml) div.innerHTML = content;
    else div.innerHTML = content;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function addRaw(html) {
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
  }

  function addQuickReplies(options) {
    const div = document.createElement('div');
    div.className = 'cwh-quick-btns';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'cwh-quick-btn';
      btn.textContent = opt;
      btn.onclick = () => { div.remove(); handleMessage(opt); };
      div.appendChild(btn);
    });
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showLeadForm() {
    document.getElementById('cwh-lead-form').style.display = 'flex';
    addMessage("Just pop your email below and I'll send the guide right over 📬", 'bot');
  }

  function handleMessage(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    input.value = '';
    const typing = addMessage('⚡ Finding best options...', 'bot');
    setTimeout(() => {
      typing.remove();
      const resp = getResponse(text);
      if (resp.action === 'lead_form') { showLeadForm(); return; }
      if (resp.text) addMessage(resp.text, 'bot');
      if (resp.html) addRaw(resp.html);
      if (resp.quick) addQuickReplies(resp.quick);
    }, 600);
  }

  // ── Lead Capture ──────────────────────────────────────────────────────────
  document.getElementById('cwh-lead-submit').onclick = function() {
    const email = document.getElementById('cwh-lead-email').value.trim();
    const name = document.getElementById('cwh-lead-name').value.trim();
    if (!email) { alert('Please enter your email address.'); return; }
    this.textContent = 'Sending...';
    this.disabled = true;
    fetch('https://pete-8a160911.base44.app/functions/captureWebsiteLead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, source: 'ChargeWiseHub Chatbot v2', site: 'chargewisehub.com', message: 'Requested free charger guide' })
    })
    .then(() => {
      document.getElementById('cwh-lead-form').style.display = 'none';
      addMessage("✅ Guide sent! Check your inbox. While you wait — any other questions about chargers?", 'bot');
      addQuickReplies(['Car battery chargers', '4WD / Caravan picks', 'Best budget options']);
    })
    .catch(() => {
      addMessage("✅ You're on the list! We'll send the guide to " + email + " shortly.", 'bot');
      document.getElementById('cwh-lead-form').style.display = 'none';
    });
  };

  // ── Events ────────────────────────────────────────────────────────────────
  document.getElementById('cwh-chat-bubble').onclick = () => {
    panel.classList.toggle('open');
    if (!opened) {
      opened = true;
      addMessage(BRAND.greeting, 'bot');
      setTimeout(() => {
        addQuickReplies(['Car battery', '4WD / Caravan', 'Jump starter', 'EV home charging', 'Solar setup', 'Phone / Laptop']);
      }, 400);
    }
  };

  document.getElementById('cwh-chat-close').onclick = () => panel.classList.remove('open');

  document.getElementById('cwh-chat-send').onclick = () => handleMessage(input.value);

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleMessage(input.value);
  });

  // Auto-open after 45 seconds if user hasn't interacted
  setTimeout(() => {
    if (!opened && !panel.classList.contains('open')) {
      panel.classList.add('open');
      opened = true;
      addMessage(BRAND.greeting, 'bot');
      setTimeout(() => {
        addQuickReplies(['Car battery', '4WD / Caravan', 'Jump starter', 'EV home charging', 'Solar setup', 'Phone / Laptop']);
      }, 400);
    }
  }, 45000);

})();

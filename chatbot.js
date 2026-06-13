// ChargeWiseHub - Customer Service Chatbot
(function() {
  const BRAND = {
    name: 'ChargeWise Assistant',
    color: '#0ea5e9',
    accent: '#06b6d4',
    greeting: "Hey! I'm the ChargeWise Assistant. I can help you find the best battery charger, jump starter, or EV charger for your needs. What are you looking for?",
    site: 'chargewisehub.com'
  };

  if (document.getElementById('cwh-chatbot-widget')) return;

  const style = document.createElement('style');
  style.textContent = `
    #cwh-chatbot-widget { position:fixed; bottom:24px; right:24px; z-index:9999; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
    #cwh-chat-bubble { width:60px; height:60px; border-radius:50%; background:linear-gradient(135deg,${BRAND.color},${BRAND.accent}); cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px rgba(14,165,233,.4); transition:transform .2s; }
    #cwh-chat-bubble:hover { transform:scale(1.1); }
    #cwh-chat-bubble svg { width:28px; height:28px; fill:white; }
    #cwh-chat-panel { display:none; position:absolute; bottom:72px; right:0; width:340px; max-height:520px; background:#fff; border-radius:16px; box-shadow:0 8px 40px rgba(0,0,0,0.2); overflow:hidden; flex-direction:column; }
    #cwh-chat-panel.open { display:flex; }
    #cwh-chat-header { background:linear-gradient(135deg,${BRAND.color},${BRAND.accent}); color:white; padding:14px 16px; display:flex; align-items:center; gap:10px; }
    #cwh-chat-header strong { font-size:15px; }
    #cwh-chat-close { margin-left:auto; cursor:pointer; font-size:20px; }
    #cwh-chat-messages { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px; min-height:200px; max-height:340px; background:#f0f9ff; }
    .cwh-msg { max-width:85%; padding:10px 13px; border-radius:12px; font-size:13.5px; line-height:1.5; }
    .cwh-msg.bot { background:white; align-self:flex-start; color:#222; border:1px solid #bae6fd; border-bottom-left-radius:3px; }
    .cwh-msg.user { background:${BRAND.color}; color:white; align-self:flex-end; border-bottom-right-radius:3px; }
    #cwh-chat-input-area { padding:10px; border-top:1px solid #e0f2fe; display:flex; gap:8px; background:white; }
    #cwh-chat-input { flex:1; border:1px solid #bae6fd; border-radius:20px; padding:8px 14px; font-size:13px; outline:none; }
    #cwh-chat-input:focus { border-color:${BRAND.color}; }
    #cwh-chat-send { background:${BRAND.color}; color:white; border:none; border-radius:50%; width:36px; height:36px; cursor:pointer; font-size:16px; }
    .cwh-quick-btns { display:flex; flex-wrap:wrap; gap:6px; }
    .cwh-quick-btn { background:white; border:1px solid ${BRAND.color}; color:${BRAND.color}; border-radius:16px; padding:5px 10px; font-size:12px; cursor:pointer; }
    .cwh-quick-btn:hover { background:${BRAND.color}; color:white; }
    #cwh-lead-form { padding:14px; background:#f0f9ff; display:none; flex-direction:column; gap:8px; }
    #cwh-lead-form h4 { margin:0; color:${BRAND.color}; font-size:13px; }
    #cwh-lead-form input { border:1px solid #bae6fd; border-radius:8px; padding:8px 12px; font-size:13px; outline:none; }
    #cwh-lead-submit { background:${BRAND.color}; color:white; border:none; border-radius:8px; padding:9px; font-weight:600; cursor:pointer; }
  `;
  document.head.appendChild(style);

  const widget = document.createElement('div');
  widget.id = 'cwh-chatbot-widget';
  widget.innerHTML = `
    <div id="cwh-chat-panel">
      <div id="cwh-chat-header">
        <div><strong>⚡ ${BRAND.name}</strong><br><span style="font-size:11px;opacity:.85">Expert buying advice · Australia</span></div>
        <span id="cwh-chat-close">✕</span>
      </div>
      <div id="cwh-chat-messages"></div>
      <div id="cwh-lead-form">
        <h4>📬 Get our free Best Charger Guide</h4>
        <input id="cwh-lead-name" placeholder="Your Name" />
        <input id="cwh-lead-email" placeholder="Email Address *" type="email" required />
        <button id="cwh-lead-submit">Send me the guide →</button>
      </div>
      <div id="cwh-chat-input-area">
        <input id="cwh-chat-input" placeholder="Ask about chargers..." maxlength="500" />
        <button id="cwh-chat-send">➤</button>
      </div>
    </div>
    <div id="cwh-chat-bubble">
      <svg viewBox="0 0 24 24"><path d="M13 10h-2V7l-4 5h3v3l4-5zm-1-8C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
    </div>
  `;
  document.body.appendChild(widget);

  const panel = document.getElementById('cwh-chat-panel');
  const messages = document.getElementById('cwh-chat-messages');
  const input = document.getElementById('cwh-chat-input');
  let leadCaptured = false;
  let sessionId = Math.random().toString(36).substr(2, 9);

  const RECS = {
    car: { text: 'For car batteries, the <strong>NOCO Genius 10</strong> is our top pick — smart charging, works on all battery types. The <strong>CTEK MXS 5.0</strong> is great for maintenance.', link: 'https://chargewisehub.com/reviews/noco-genius-10/', btn: 'Read NOCO Genius 10 Review' },
    ev: { text: 'For home EV charging, check our <strong>Best EV Home Chargers</strong> guide — we cover Type 2 AC chargers from 7kW to 22kW for Australian homes.', link: 'https://chargewisehub.com/best-ev-home-chargers-australia/', btn: 'View EV Charger Guide' },
    jump: { text: 'The <strong>NOCO Boost Plus GB40</strong> is the best jump starter under $150 — starts engines up to 6L petrol. Compact enough to keep in the glove box.', link: 'https://chargewisehub.com/reviews/noco-boost-plus-gb40/', btn: 'Read GB40 Review' },
    solar: { text: 'Our solar charger guide covers the best options for 4WDs, caravans, and off-grid setups in Australia.', link: 'https://chargewisehub.com/best-solar-battery-charger-australia/', btn: 'View Solar Charger Guide' },
    '4wd': { text: 'For 4WDs, dual-battery systems need a DC-DC charger. The <strong>Redarc BCDC1225D</strong> is the gold standard for serious off-roaders.', link: 'https://chargewisehub.com/reviews/redarc-bcdc1225d/', btn: 'Read Redarc Review' },
    motorcycle: { text: 'Motorcycle batteries need a tender, not a full charger. The <strong>CTEK MXS 5.0</strong> has a dedicated motorcycle mode.', link: 'https://chargewisehub.com/best-motorcycle-battery-charger-australia/', btn: 'View Motorcycle Guide' },
    powerbank: { text: 'For portable power banks, the <strong>Anker Prime 27650</strong> is our pick for serious capacity with fast charging.', link: 'https://chargewisehub.com/reviews/anker-prime-27650/', btn: 'Read Anker Prime Review' },
  };

  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `cwh-msg ${sender}`;
    div.innerHTML = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
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

  function getResponse(msg) {
    const m = msg.toLowerCase();
    for (const [key, rec] of Object.entries(RECS)) {
      if (m.includes(key) || (key==='jump' && (m.includes('start') || m.includes('boost'))) || (key==='4wd' && (m.includes('4x4')||m.includes('offroad')||m.includes('caravan')||m.includes('dual battery')))) {
        return { text: `${rec.text}<br><br><a href="${rec.link}" target="_blank" style="color:${BRAND.color};font-weight:600">🔗 ${rec.btn} →</a>`, quick: ['Compare more options', 'Best budget pick', 'Get the free guide'] };
      }
    }
    if (m.includes('best') || m.includes('recommend') || m.includes('which'))
      return { text: "What's it for? I can give you a specific recommendation.", quick: ['Car battery', '4WD / Caravan', 'EV home charging', 'Jump starter', 'Motorcycle', 'Phone / laptop'] };
    if (m.includes('guide') || m.includes('free') || m.includes('subscribe') || m.includes('newsletter'))
      return { text: null, action: 'lead_form' };
    if (m.includes('price') || m.includes('cheap') || m.includes('budget'))
      return { text: 'Budget pick for car batteries: <strong>CTEK MXS 5.0</strong> (~$89). Best value overall: <strong>NOCO Genius 10</strong> (~$119). Both have Amazon AU links with our affiliate tag.', quick: ['NOCO vs CTEK', 'Best jump starter', 'Get the free guide'] };
    return { text: "I can help you find the right charger! Tell me what vehicle or device you need to charge.", quick: ['Car battery', '4WD / Caravan', 'EV home charging', 'Jump starter', 'Get the free guide'] };
  }

  function handleMessage(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    input.value = '';
    const typing = addMessage('⚡ Finding the best option...', 'bot');
    setTimeout(() => {
      typing.remove();
      const resp = getResponse(text);
      if (resp.action === 'lead_form') { showLeadForm(); return; }
      if (resp.text) addMessage(resp.text, 'bot');
      if (resp.quick) addQuickReplies(resp.quick);
    }, 700);
  }

  function showLeadForm() {
    document.getElementById('cwh-lead-form').style.display = 'flex';
    messages.style.maxHeight = '200px';
  }

  document.getElementById('cwh-lead-submit').onclick = function() {
    const email = document.getElementById('cwh-lead-email').value.trim();
    const name = document.getElementById('cwh-lead-name').value.trim();
    if (!email) { alert('Please enter your email.'); return; }
    fetch('https://app.base44.com/api/apps/69ca5e07db7008c68a160911/functions/captureWebsiteLead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, source: 'ChargeWiseHub Chatbot', site: 'chargewisehub.com', interest: 'Free charger guide', sessionId })
    }).catch(() => {});
    leadCaptured = true;
    document.getElementById('cwh-lead-form').style.display = 'none';
    messages.style.maxHeight = '340px';
    addMessage(`Done! ⚡ Check your inbox — the guide is on its way to <strong>${email}</strong>. Anything else I can help with?`, 'bot');
    addQuickReplies(['Best car charger', 'Best jump starter', 'EV chargers']);
  };

  document.getElementById('cwh-chat-bubble').onclick = () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open') && messages.children.length === 0) {
      setTimeout(() => {
        addMessage(BRAND.greeting, 'bot');
        addQuickReplies(['Car battery charger', '4WD / Caravan', 'EV home charging', 'Jump starter']);
      }, 300);
    }
  };
  document.getElementById('cwh-chat-close').onclick = () => panel.classList.remove('open');
  document.getElementById('cwh-chat-send').onclick = () => handleMessage(input.value);
  input.onkeypress = (e) => { if (e.key === 'Enter') handleMessage(input.value); };
})();

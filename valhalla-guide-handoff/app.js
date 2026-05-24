const DATA = JSON.parse(document.getElementById('appdata').textContent);
const RECIPES = __RECIPES__;

const fmt = n => n.toLocaleString('en-US');

/* ---------- Navigation ---------- */
const main = document.getElementById('main');
const navBtns = [...document.querySelectorAll('.nav button')];
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
menuBtn.onclick = () => nav.classList.toggle('open');

function go(page){
  navBtns.forEach(b => b.classList.toggle('active', b.dataset.page === page));
  nav.classList.remove('open');
  render(page);
  window.scrollTo({top:0,behavior:'smooth'});
}
navBtns.forEach(b => b.onclick = () => go(b.dataset.page));

/* ---------- Renderers ---------- */
function render(page){
  if(page==='home') return home();
  if(page==='skills') return skills();
  if(page==='leveling') return leveling();
  if(page==='smithing') return smithing();
  if(page==='tinker') return tinker();
  if(page==='recipes') return recipes();
}

function home(){
  const catCount = {};
  DATA.skills.forEach(s => catCount[s.cat] = (catCount[s.cat]||0)+1);
  main.innerHTML = `
  <section class="page active">
    <div class="hero">
      <div class="kicker">Player Codex</div>
      <h2>Master the realm of ValhallaMMO</h2>
      <p>This plugin turns vanilla Minecraft into a deep RPG. Every action you take — mining, fighting, farming, crafting — trains a skill, unlocks perks, and makes your gear stronger. This guide explains how all of it fits together.</p>
      <div class="stats-row">
        <div class="stat-b"><div class="n">14</div><div class="l">Skills</div></div>
        <div class="stat-b"><div class="n">100</div><div class="l">Max Level</div></div>
        <div class="stat-b"><div class="n">49</div><div class="l">Tinker Upgrades</div></div>
        <div class="stat-b"><div class="n">555</div><div class="l">Recipes</div></div>
      </div>
    </div>

    <h3>The core idea in three sentences</h3>
    <div class="grid g3">
      <div class="card"><span class="ico">🎯</span><div class="title">Play to level</div><p>You don't grind menus — you earn skill XP simply by doing the activity. Mine ore to level Mining, swing a sword to level Light Weapons.</p></div>
      <div class="card"><span class="ico">✦</span><div class="title">Levels feed Power</div><p>Every skill you raise also raises your <strong>Power</strong> level, which grants skill points you spend in skill trees to unlock perks.</p></div>
      <div class="card"><span class="ico">🔨</span><div class="title">Skills shape gear</div><p>Your Smithing level decides how strong the gear you craft is. Higher level = higher quality = better stats from the same recipe.</p></div>
    </div>

    <h3>What's in the Classic pack</h3>
    <p>Your server runs the <strong>Classic import</strong>, a full crafting overhaul layered on top of the skills system. It adds a custom <strong>copper tier</strong>, new weapon types (daggers, rapiers, spears, greataxes, warhammers), and a multi-step smithing workflow where you craft, heat, quench, fit and sharpen gear.</p>
    <div class="grid g4" style="margin-top:18px">
      <div class="card"><span class="ico">⚔</span><div class="title">9 weapons</div><p>Sword, dagger, rapier, spear, greataxe, mace, warhammer, trident, bow.</p></div>
      <div class="card"><span class="ico">🛡</span><div class="title">6 armor tiers</div><p>Leather, chainmail, copper, iron, gold, diamond — all upgradable.</p></div>
      <div class="card"><span class="ico">⚒</span><div class="title">4 craft systems</div><p>Grid table, cauldron quench, furnace heat, grindstone sharpen.</p></div>
      <div class="card"><span class="ico">🔧</span><div class="title">49 upgrades</div><p>Tinker your gear with damage, defense, mobility and utility mods.</p></div>
    </div>

    <h3>Where to start</h3>
    <div class="grid g2">
      <div class="card" style="cursor:pointer" onclick="go('skills')"><h4>New player?</h4><div class="title">Read the Skills page →</div><p>Understand what each of the 14 skills does and how to train it. This is the heart of the plugin.</p></div>
      <div class="card" style="cursor:pointer" onclick="go('smithing')"><h4>Want better gear?</h4><div class="title">Learn the Smithing flow →</div><p>The craft → heat → quench → fit → sharpen pipeline is the most-misunderstood system. We break it down step by step.</p></div>
    </div>
  </section>`;
}

function skills(){
  const cats = ['Gathering','Combat','Defense','Crafting','Meta'];
  let html = `<section class="page active">
    <div class="kicker">The 14 Skills</div>
    <h2>Skills &amp; how to train them</h2>
    <p class="lede">Every skill levels by doing its activity — no menus, no grind targets. Click any skill to see its best XP sources.</p>`;
  cats.forEach(cat => {
    const list = DATA.skills.filter(s => s.cat === cat);
    if(!list.length) return;
    html += `<h3>${cat}</h3><div class="grid g3" style="margin-bottom:8px">`;
    list.forEach(s => {
      html += `<div class="skill-card" onclick="skillDetail('${s.id}')">
        <div class="sc-head">
          <div class="sc-icon" style="color:${s.color};background:${s.color}1a">${s.icon}</div>
          <div><div class="sc-name">${s.name}</div><div class="sc-cat">${s.cat}</div></div>
        </div>
        <div class="sc-body"><p>${s.desc}</p></div>
        <div class="sc-more">View XP sources →</div>
      </div>`;
    });
    html += `</div>`;
  });
  html += `</section>`;
  main.innerHTML = html;
}

function skillDetail(id){
  const s = DATA.skills.find(x => x.id === id);
  let rows = '';
  s.top.forEach(t => {
    if(t.length === 1){ rows += `<tr><td colspan="2" style="font-style:italic">${t[0]}</td></tr>`; }
    else { rows += `<tr><td>${t[0]}</td><td class="xp">${typeof t[1]==='number'?fmt(t[1])+' XP':t[1]}</td></tr>`; }
  });
  main.innerHTML = `<section class="page active">
    <button class="chip" onclick="go('skills')" style="margin-bottom:24px">← All skills</button>
    <div class="hero" style="margin-bottom:30px">
      <div style="display:flex;align-items:center;gap:18px">
        <div class="sc-icon" style="width:64px;height:64px;font-size:34px;color:${s.color};background:${s.color}1a;border-color:${s.color}55">${s.icon}</div>
        <div><div class="kicker" style="margin-bottom:4px">${s.cat} skill</div><h2 style="margin:0;font-size:32px">${s.name}</h2></div>
      </div>
      <p style="margin-top:20px">${s.desc}</p>
    </div>
    <div class="grid g2">
      <div class="card"><h4>How you train it</h4><p>${s.how}</p></div>
      <div class="card"><h4>Special ability</h4><p>${s.ability}</p></div>
    </div>
    <h3>Top XP sources</h3>
    <div class="tbl-wrap"><table><thead><tr><th>Action / drop</th><th>XP earned</th></tr></thead><tbody>${rows}</tbody></table></div>
    <div class="callout"><div class="ct">Tip</div><p>Only naturally-generated blocks and legitimate kills grant XP. Placing then re-breaking a block gives nothing, and farming XP in one chunk too fast triggers a diminishing-returns nerf.</p></div>
  </section>`;
  window.scrollTo({top:0,behavior:'smooth'});
}
window.skillDetail = skillDetail;
window.go = go;

function leveling(){
  let rows = '';
  DATA.curve.milestones.forEach(m => {
    rows += `<tr><td class="lvl">${m[0]}</td><td class="xp">${fmt(m[1])}</td><td class="xp" style="color:var(--ink-dim)">${fmt(m[2])}</td></tr>`;
  });
  main.innerHTML = `<section class="page active">
    <div class="kicker">Experience &amp; Progression</div>
    <h2>How leveling works</h2>
    <p class="lede">Skills get exponentially harder to level. Early levels fly by; the last stretch to 100 is a real commitment.</p>

    <div class="grid g3">
      <div class="card"><span class="ico">📈</span><div class="title">Per-skill XP</div><p>Each of the 14 skills tracks its own XP and level, capped at <strong>100</strong>. You raise it by performing that skill's activity.</p></div>
      <div class="card"><span class="ico">✦</span><div class="title">Power level</div><p>All skill XP also pours into <strong>Power</strong> (max 256). Power grants the skill points you spend on perks.</p></div>
      <div class="card"><span class="ico">🌳</span><div class="title">Perks &amp; trees</div><p>Open a skill tree with <code>/skills</code>, then spend points to unlock perks. Many perks have level requirements.</p></div>
    </div>

    <h3>The XP curve (per skill)</h3>
    <p>XP needed for the next level follows this formula, where <code>level</code> is the level you're climbing toward:</p>
    <div class="callout"><p style="font-family:var(--mono);color:var(--gold);font-size:15px">${DATA.curve.formula}</p></div>

    <div class="calc">
      <label>Target level: <span id="lvlOut" style="color:var(--gold);font-family:var(--mono)">50</span></label>
      <input type="range" id="lvlSlider" min="1" max="100" value="50">
      <div class="calc-out"><span class="big" id="cumOut">97,670</span><span class="unit">total XP to reach this level</span></div>
      <div class="calc-grid">
        <div class="calc-mini"><div class="n" id="thisLvl">7,520</div><div class="l">XP for this level alone</div></div>
        <div class="calc-mini"><div class="n" id="oreEq">~244</div><div class="l">≈ diamond ore (400 XP ea.)</div></div>
        <div class="calc-mini"><div class="n" id="pctMax">9.8%</div><div class="l">of the way to level 100</div></div>
      </div>
    </div>

    <h3>Milestone reference</h3>
    <div class="tbl-wrap"><table><thead><tr><th>Level</th><th>Total XP</th><th>This level costs</th></tr></thead><tbody>${rows}</tbody></table></div>

    <div class="grid g2" style="margin-top:30px">
      <div class="card"><h4>Diminishing returns</h4><p>Earning lots of XP in a single chunk too quickly triggers a nerf — XP drops to ~10% in that chunk. Move around as you grind to avoid it.</p></div>
      <div class="card"><h4>Overleveled gear penalty</h4><p>Using gear far above your skill level cripples it: up to −70% damage, −70% armor, and 10× durability loss. Match your gear tier to your level.</p></div>
    </div>
  </section>`;

  const slider = document.getElementById('lvlSlider');
  const F = lvl => (lvl + 75 * Math.pow(2, lvl/7.6)) + 300;
  function update(){
    const lvl = +slider.value;
    let cum = 0; for(let i=1;i<=lvl;i++) cum += F(i);
    const thisL = F(lvl);
    document.getElementById('lvlOut').textContent = lvl;
    document.getElementById('cumOut').textContent = fmt(Math.round(cum));
    document.getElementById('thisLvl').textContent = fmt(Math.round(thisL));
    document.getElementById('oreEq').textContent = '~' + fmt(Math.round(cum/400));
    document.getElementById('pctMax').textContent = (cum/7897845*100).toFixed(1) + '%';
  }
  slider.oninput = update; update();
}

function smithing(){
  let steps = '';
  DATA.smithSteps.forEach((s,i) => {
    steps += `<div class="step"><div class="step-num">${i+1}</div><div class="step-body"><div class="st">${s.t}</div><p>${s.d}</p><span class="tag">${s.tag}</span></div></div>`;
  });
  let fitRows = '';
  if(DATA.fitIngredients) DATA.fitIngredients.forEach(f => {
    fitRows += `<tr><td class="lvl">${f.tier}</td><td>${f.ingredient}</td><td style="color:var(--ink-faint);font-size:13px">${f.note}</td></tr>`;
  });
  let ciCards = '';
  if(DATA.customItems) DATA.customItems.forEach(c => {
    ciCards += `<div class="card"><div class="title">${c.name}</div><p>${c.use}</p></div>`;
  });
  main.innerHTML = `<section class="page active">
    <div class="kicker">The Crafting Pipeline</div>
    <h2>Smithing &amp; gear quality</h2>
    <p class="lede">The Classic pack replaces vanilla crafting with a multi-step forge. Every step matters — skip one and your gear won't reach its full potential. Read each step carefully.</p>

    <div class="callout warn"><div class="ct">⚠ Read this first</div><p><strong>Heating ≠ smelting ingots.</strong> When the guide says "heat the item," it means put <em>the weapon or armor itself</em> into the furnace — not a raw ingot. Hot ingots are a separate thing used for fitting armor (Step 4). This is the #1 mistake players make.</p></div>

    <div class="flow">${steps}</div>

    <h3>Step 4 — Fitting ingredient table</h3>
    <p>Each armor tier needs a different ingredient placed alongside the armor in the crafting table:</p>
    <div class="tbl-wrap"><table>
      <thead><tr><th>Armor tier</th><th>Ingredient needed</th><th>How to get it</th></tr></thead>
      <tbody>${fitRows}</tbody>
    </table></div>

    <div class="callout"><div class="ct">Where do Hot Ingots come from?</div><p>Smelt a <strong>raw iron ingot</strong> in a furnace → you get a <strong>Hot Iron Ingot</strong> (gold works the same way). These look like renamed ingots with gold-colored text. Use them only for fitting iron/gold armor — do NOT drop them in a cauldron.</p></div>

    <h3>The quality system</h3>
    <div class="grid g2">
      <div class="card"><h4>Quality scaling</h4><p>Each item gets a quality value at craft time, tied to your Smithing level. A higher-quality sword has more damage and durability than a low-quality one — same recipe, different smith.</p></div>
      <div class="card"><h4>Copper tier</h4><p>A custom material between stone and iron, with its own ingots, nuggets, armor (with custom color) and full weapon set. A great mid-game step.</p></div>
    </div>

    <h3>Custom items in the Classic pack</h3>
    <div class="grid g2">${ciCards}</div>
  </section>`;
}

function tinker(){
  let html = `<section class="page active">
    <div class="kicker">Item Modification</div>
    <h2>Tinker upgrades</h2>
    <p class="lede">49 upgrades you apply at the crafting table to customize gear. The item must have been Valhalla-crafted, and most upgrades stack up to 4 times.</p>
    <div class="callout"><div class="ct">How to apply</div><p>Open a crafting table. Place your gear in the <strong>center slot</strong>, then surround it with the required materials. The recipe is shapeless for most upgrades (slot order doesn't matter). Each application uses one upgrade slot on the item.</p></div>`;
  const TI = DATA.tinkerIngredients || {};
  const keyMap = {"Attack damage":"attack_damage","Armor penetration":"armor_penetration_fraction","Crit chance":"crit_chance","Bleed chance":"bleed_chance","Stun chance":"stun_chance","Life steal":"life_steal","Shield disarming":"shield_disarming","Dismount chance":"dismount_chance","Attack reach":"attack_reach","All-damage bonus":"damage_all","Fire damage":"damage_fire","Magic damage":"damage_magic","Poison damage":"damage_poison","Necrotic damage":"damage_necrotic","Radiant damage":"damage_radiant","Bleed resistance":"bleed_resistance","Crit damage resistance":"crit_damage_resistance","Stun resistance":"stun_resistance","Dodge chance":"dodge_chance","Knockback resistance":"knockback_resistance","Immunity bonus":"immunity_bonus","Immunity reduction":"immunity_reduction","Healing bonus":"healing_bonus","Jump height":"jump_height","Extra jumps":"extra_jumps","Sprint speed":"sprint_speed","Sneak speed":"sneak_speed","Mining speed":"mining_speed","Mining drops":"mining_drops","Mining luck":"mining_luck","Digging drops / luck":"digging_drops","Farming drops / luck":"farming_drops","Woodcutting drops / luck":"woodcutting_drops","Entity drops":"entity_drops","Deepslate affinity":"deepslate_affinity","Durability multiplier":"durability_multiplier","Ammo consumption":"ammo_consumption","Cooldown reduction":"cooldown_reduction","Skill XP gain":"skill_exp_gain","Vanilla XP gain":"vanilla_exp_gain","Smithing quality":"smithing_quality","Enchanting quality":"enchanting_quality","Alchemy quality":"alchemy_quality","Bonus slot 1 / 2 / 3":"bonus_slot_1"};
  Object.entries(DATA.tinker).forEach(([cat,list]) => {
    html += `<h3>${cat}</h3><div class="grid g3">`;
    list.forEach(u => {
      const k = keyMap[u[0]];
      const ti = TI[k];
      const mat = ti ? ti[0] : '';
      const applies = ti ? ti[1] : '';
      let extra = '';
      if(mat) extra = `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--line)"><span style="font-family:var(--mono);font-size:11px;color:var(--gold-dim)">COST:</span> <span style="font-size:12.5px;color:var(--ink)">${mat}</span><br><span style="font-family:var(--mono);font-size:11px;color:var(--gold-dim)">APPLIES TO:</span> <span style="font-size:12.5px;color:var(--ink)">${applies}</span></div>`;
      html += `<div class="card" style="padding:16px 18px"><div class="title" style="font-size:15px;margin-bottom:6px">${u[0]}</div><p style="font-size:13.5px">${u[1]}</p>${extra}</div>`;
    });
    html += `</div>`;
  });
  html += `</section>`;
  main.innerHTML = html;
}

function recipes(){
  main.innerHTML = `<section class="page active">
    <div class="kicker">Recipe Browser</div>
    <h2>All recipes</h2>
    <p class="lede">Every craft, quench, sharpen and upgrade recipe in the Classic pack — 356 player-facing recipes. (A further 199 internal &ldquo;heat&rdquo; steps power the furnace stage and aren&rsquo;t shown here.)</p>
    <div class="search-bar"><span class="si">⌕</span><input id="rsearch" placeholder="Search recipes — try 'diamond', 'quench', 'copper'…"></div>
    <div class="filters" id="rfilters">
      <span class="chip active" data-f="all">All</span>
      <span class="chip" data-f="grid">Grid table</span>
      <span class="chip" data-f="cauldron">Cauldron</span>
      <span class="chip" data-f="immersive">Grindstone</span>
      <span class="chip" data-f="smith">Smithing table</span>
    </div>
    <div id="rdetail" style="display:none"></div>
    <div class="tbl-wrap"><table><thead><tr><th>Recipe</th><th>Station</th><th>Smithing XP</th></tr></thead><tbody id="rbody"></tbody></table></div>
  </section>`;

  const badge = {grid:['Grid table','b-grid'],cauldron:['Cauldron','b-cauldron'],immersive:['Grindstone','b-immersive'],smith:['Smithing table','b-smith']};
  const RD = RECIPE_DETAILS;
  let filter = 'all', query = '';
  function pretty(n){ return n.replace(/_/g,' ').replace(/\b\w/g, c=>c.toUpperCase()); }

  function showDetail(name){
    const d = RD[name];
    const panel = document.getElementById('rdetail');
    if(!d){ panel.style.display='none'; return; }
    const b = badge[d.s];
    const sysLabel = b ? b[0] : d.s;
    const sysBadge = b ? b[1] : 'b-grid';

    let html = `<div class="card" style="margin-bottom:20px;position:relative">
      <button onclick="document.getElementById('rdetail').style.display='none'" style="position:absolute;top:14px;right:16px;background:none;border:none;color:var(--ink-faint);font-size:18px;cursor:pointer">&times;</button>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <div class="title" style="margin:0;font-size:18px">${pretty(name)}</div>
        <span class="badge ${sysBadge}">${sysLabel}</span>
      </div>`;

    // Applies To (tinker upgrades)
    if(d.a){
      html += `<div style="margin-bottom:14px"><h4 style="margin-bottom:8px">Applies To</h4>
        <div style="font-size:14px;color:var(--teal);padding:3px 0">${d.a}</div>
      </div>`;
    }

    // Ingredients
    if(d.i && d.i.length){
      html += `<div style="margin-bottom:14px"><h4 style="margin-bottom:8px">Ingredients</h4>`;
      d.i.forEach(ing => { html += `<div style="font-size:14px;color:var(--ink);padding:3px 0">• ${ing}</div>`; });
      html += `</div>`;
    }
    // System-specific instructions
    if(d.s === 'cauldron'){
      html += `<div style="margin-bottom:14px"><h4 style="margin-bottom:8px">How to use</h4>
        <div style="font-size:14px;color:var(--ink-dim)">1. Heat the item in a furnace first (it needs the 'heated' tag)</div>
        <div style="font-size:14px;color:var(--ink-dim)">2. Fill a cauldron with water</div>
        <div style="font-size:14px;color:var(--ink-dim)">3. Drop (Q key) the heated item into the cauldron</div>
        <div style="font-size:14px;color:var(--ink-dim)">4. Wait ${d.ct ? (d.ct/20)+'s' : '30s'} — item pops out quenched</div>
      </div>`;
    }
    if(d.s === 'immersive'){
      html += `<div style="margin-bottom:14px"><h4 style="margin-bottom:8px">How to use</h4>
        <div style="font-size:14px;color:var(--ink-dim)">1. Hold the weapon/tool in your hand</div>
        <div style="font-size:14px;color:var(--ink-dim)">2. Right-click a grindstone</div>
        <div style="font-size:14px;color:var(--ink-dim)">3. No extra ingredients needed</div>
      </div>`;
    }
    if(d.s === 'smith'){
      html += `<div style="margin-bottom:14px"><h4 style="margin-bottom:8px">How to use</h4>
        <div style="font-size:14px;color:var(--ink-dim)">1. Open a smithing table</div>
        <div style="font-size:14px;color:var(--ink-dim)">2. Place the diamond item + Unstable Diamond</div>
        <div style="font-size:14px;color:var(--ink-dim)">3. Item upgrades to netherite, keeping all upgrades</div>
      </div>`;
    }
    if(d.s === 'grid' && d.i && d.i.length){
      html += `<div style="margin-bottom:14px"><h4 style="margin-bottom:8px">How to use</h4>
        <div style="font-size:14px;color:var(--ink-dim)">Place all items in a crafting table (order usually doesn't matter for tinker/fit recipes)</div>
      </div>`;
    }

    // Requirements
    if(d.r && d.r.length){
      html += `<div style="margin-bottom:14px"><h4 style="margin-bottom:8px">Requirements</h4>`;
      d.r.forEach(req => { html += `<div style="font-size:14px;color:var(--orange);padding:2px 0">⚠ Item must have: ${req}</div>`; });
      html += `</div>`;
    }

    // Effects
    if(d.e && d.e.length){
      html += `<div style="margin-bottom:14px"><h4 style="margin-bottom:8px">Effects</h4>`;
      d.e.forEach(eff => { html += `<span class="skill-tag" style="margin:3px 4px 3px 0">${eff}</span>`; });
      html += `</div>`;
    }

    // XP
    if(d.x){
      html += `<div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--line)">
        <span style="font-family:var(--mono);font-size:12px;color:var(--gold-dim)">SMITHING XP:</span>
        <span style="font-family:var(--display);font-size:20px;color:var(--gold);margin-left:8px">${fmt(d.x)}</span>
      </div>`;
    }

    html += `</div>`;
    panel.innerHTML = html;
    panel.style.display = 'block';
    panel.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  window._showDetail = showDetail;

  function draw(){
    const rows = RECIPES.filter(r => (filter==='all'||r[1]===filter) && r[0].includes(query));
    const body = document.getElementById('rbody');
    body.innerHTML = rows.slice(0,250).map(r => {
      const b = badge[r[1]];
      return `<tr onclick="window._showDetail('${r[0]}')" style="cursor:pointer"><td>${pretty(r[0])}</td><td><span class="badge ${b[1]}">${b[0]}</span></td><td class="xp">${r[2]?fmt(r[2]):'—'}</td></tr>`;
    }).join('') || `<tr><td colspan="3" style="color:var(--ink-faint)">No recipes match.</td></tr>`;
    if(rows.length>250) body.innerHTML += `<tr><td colspan="3" style="color:var(--ink-faint);font-style:italic">…and ${rows.length-250} more — refine your search.</td></tr>`;
  }
  document.getElementById('rsearch').oninput = e => { query = e.target.value.toLowerCase(); draw(); };
  document.querySelectorAll('#rfilters .chip').forEach(c => c.onclick = () => {
    document.querySelectorAll('#rfilters .chip').forEach(x=>x.classList.remove('active'));
    c.classList.add('active'); filter = c.dataset.f; draw();
  });
  draw();
}

home();

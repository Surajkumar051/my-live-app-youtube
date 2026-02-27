// ══════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════
const TABS = ['home','studio','vidlink','views','analyzer','tags','thumb','revenue','viral','p1','p2','p5','p6'];

function go(id) {
  document.querySelectorAll('.sec').forEach(function(s){ s.classList.remove('active'); });
  document.querySelectorAll('.tab').forEach(function(b){ b.classList.remove('active'); });
  var sec = document.getElementById(id);
  if(sec) sec.classList.add('active');
  var idx = TABS.indexOf(id);
  var tabBtns = document.querySelectorAll('.tab');
  if(idx >= 0 && tabBtns[idx]) tabBtns[idx].classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}

// ══════════════════════════════════════════
// STATS UPDATER
// ══════════════════════════════════════════
function updateStats() {
  var veEl = document.getElementById('v-views'), seEl = document.getElementById('v-subs'), vdEl = document.getElementById('v-vids');
  var v = veEl ? (parseInt(veEl.value) || 0) : 0;
  var s = seEl ? (parseInt(seEl.value) || 0) : 0;
  var vd = vdEl ? (parseInt(vdEl.value) || 0) : 0;
  animNum('sv-views', v);
  animNum('sv-subs', s);
  animNum('sv-vids', vd);
}

function animNum(elId, target) {
  var el = document.getElementById(elId);
  if(!el) return;
  var cur = 0;
  var step = Math.max(1, Math.floor(target/25));
  var t = setInterval(function(){
    cur = Math.min(cur+step, target);
    el.textContent = cur.toLocaleString();
    if(cur >= target) clearInterval(t);
  }, 30);
}

// ══════════════════════════════════════════
// STUDIO UPDATER
// ══════════════════════════════════════════
function updateStudio() {
  function fmt(id) {
    var el = document.getElementById(id);
    var v = el ? parseInt(el.value) || 0 : 0;
    if(v >= 1000000) return (v/1000000).toFixed(1)+'M';
    if(v >= 1000) return (v/1000).toFixed(1)+'K';
    return v.toString();
  }
  function set(id, val) { var el=document.getElementById(id); if(el) el.textContent=val; }

  set('sm-totalviews', fmt('ch-totalviews') || '—');
  set('sm-subs', fmt('ch-subs') || '—');
  set('sm-vidv', fmt('ch-vidviews') || '—');
  set('sm-shortv', fmt('ch-shortviews') || '—');
  set('sm-watch', fmt('ch-watchtime') || '—');
  var ctrEl = document.getElementById('ch-ctr');
  var ctr = ctrEl ? (parseFloat(ctrEl.value)||0) : 0;
  set('sm-ctr', ctr ? ctr.toFixed(1)+'%' : '—');

  // Color CTR
  var ctrChEl = document.getElementById('sm-ctr-ch');
  if(ctrChEl) {
    if(ctr > 5) { ctrChEl.textContent='✅ Excellent'; ctrChEl.className='yt-metric-change up'; }
    else if(ctr > 3) { ctrChEl.textContent='⚠️ Average'; ctrChEl.className='yt-metric-change'; ctrChEl.style.color='#FF8800'; }
    else if(ctr > 0) { ctrChEl.textContent='❌ Low — needs fix'; ctrChEl.className='yt-metric-change down'; }
  }
}

// ══════════════════════════════════════════
// VIDEO LIST (STUDIO)
// ══════════════════════════════════════════
var videoRows = [];
function addVideoRow(type) {
  var id = Date.now();
  videoRows.push({id:id, type:type, title:'', views:0});
  renderVideoList();
}

function renderVideoList() {
  var list = document.getElementById('videoList');
  if(!list) return;
  list.innerHTML = '';
  videoRows.forEach(function(row, idx) {
    var div = document.createElement('div');
    div.style.cssText = 'display:flex;gap:6px;align-items:center;margin-bottom:6px;';
    div.innerHTML = '<span style="font-size:16px;">'+(row.type==='short'?'📱':'🎬')+'</span>'
      +'<input class="ctrl-input" style="flex:2;" placeholder="'+(row.type==='short'?'Short':'Video')+' title..." value="'+row.title+'" oninput="updateRow('+idx+',\'title\',this.value)">'
      +'<input class="ctrl-input" style="flex:1;min-width:80px;" type="number" placeholder="Views" value="'+(row.views||'')+'" oninput="updateRow('+idx+',\'views\',this.value)">'
      +'<button onclick="removeRow('+idx+')" style="background:rgba(255,31,31,0.1);border:1px solid rgba(255,31,31,0.2);border-radius:5px;width:28px;height:28px;color:var(--red);cursor:pointer;font-size:14px;flex-shrink:0;">×</button>';
    list.appendChild(div);
  });
  renderStudioVideoDisplay();
}

function updateRow(idx, field, val) {
  if(videoRows[idx]) videoRows[idx][field] = val;
  renderStudioVideoDisplay();
}

function removeRow(idx) {
  videoRows.splice(idx, 1);
  renderVideoList();
}

function renderStudioVideoDisplay() {
  var disp = document.getElementById('studio-video-display');
  if(!disp || videoRows.length === 0) { if(disp) disp.innerHTML=''; return; }
  var maxViews = Math.max.apply(null, videoRows.map(function(r){ return parseInt(r.views)||0; })) || 1;
  var html = '<div class="box"><div class="box-label">Your Videos & Shorts Performance</div>';
  videoRows.forEach(function(row) {
    var v = parseInt(row.views) || 0;
    var pct = Math.round((v/maxViews)*100);
    var vfmt = v>=1000 ? (v/1000).toFixed(1)+'K' : v;
    html += '<div class="video-row">'
      +'<div class="video-thumb-ph">'+(row.type==='short'?'📱':'🎬')+'</div>'
      +'<div class="video-info">'
        +'<div class="video-title">'+(row.title||'Untitled '+(row.type==='short'?'Short':'Video'))+'</div>'
        +'<div class="video-meta">'+(row.type==='short'?'YouTube Short':'Long Video')+'</div>'
        +'<div class="progress-bar"><div class="progress-fill" style="width:'+pct+'%"></div></div>'
      +'</div>'
      +'<div class="video-views">'+vfmt+'</div>'
      +'</div>';
  });
  html += '</div>';
  disp.innerHTML = html;
}

// ══════════════════════════════════════════
// VIDEO LINK PREVIEW
// ══════════════════════════════════════════
function previewVidLink() {
  var urlInputEl = document.getElementById('vidlink-url');
  var url = urlInputEl ? urlInputEl.value.trim() : '';
  var preview = document.getElementById('vidlink-preview');
  var urlDisp = document.getElementById('vl-url-display');
  var statsMini = document.getElementById('vl-stats-mini');
  if(!url || !preview) return;
  if(!urlDisp || !statsMini) return;

  // Detect video ID
  var videoId = '';
  var isShort = url.includes('/shorts/');
  var match = url.match(/[?&]v=([^&]+)/) || url.match(/shorts\/([^?&/]+)/) || url.match(/youtu\.be\/([^?&]+)/);
  if(match) videoId = match[1];

  preview.className = 'vid-preview show';
  urlDisp.textContent = '🔗 ' + url;
  statsMini.innerHTML =
    '<div class="vid-stat-mini"><span>'+(isShort?'📱':'🎬')+'</span>'+(isShort?'YouTube Short':'Long Video')+'</div>'
    +'<div class="vid-stat-mini"><span id="vl-id-show">'+(videoId||'—')+'</span>Video ID</div>'
    +'<div class="vid-stat-mini"><span>✅</span>URL Loaded</div>';

  // Auto-fill type
  var typeEl = document.getElementById('vl-type');
  if(typeEl) typeEl.value = isShort ? 'YouTube Short' : 'Long Video';
}

// ══════════════════════════════════════════
// ══════════════════════════════════════════
// THUMBNAIL ENGINE
// ══════════════════════════════════════════
var thUploadedImage = null;
var thCurrentTheme = 'bgmi';
var thCurrentLayout = 'fire';
var thDrawTimer = null;

var TH_THEMES = [
  {id:'bgmi',    icon:'🎯', name:'BGMI',      bg:['#050514','#0a0a28','#010116'], a:'#00AAFF', g:'#0055FF', s:'#88DDFF'},
  {id:'freefire',icon:'🔥', name:'FREE FIRE', bg:['#0f0500','#1f0a00','#0a0300'], a:'#FF5500', g:'#FF2200', s:'#FFAA44'},
  {id:'cod',     icon:'💀', name:'COD',       bg:['#060606','#0f0f0f','#020202'], a:'#00FF88', g:'#00AA55', s:'#88FFCC'},
  {id:'minecraft',icon:'⛏️',name:'MINECRAFT', bg:['#1a3a0a','#0d2005','#0a1a05'], a:'#7CFC00', g:'#228B22', s:'#ADFF2F'},
  {id:'roblox',  icon:'🧱', name:'ROBLOX',    bg:['#120000','#220000','#080000'], a:'#FF2222', g:'#CC0000', s:'#FF8888'},
  {id:'gta',     icon:'🚗', name:'GTA',       bg:['#0a1400','#142000','#050a00'], a:'#FFCC00', g:'#FF8800', s:'#FFE44D'},
  {id:'tech',    icon:'📱', name:'TECH',      bg:['#000814','#001128','#000508'], a:'#00D4FF', g:'#0066FF', s:'#88EEFF'},
  {id:'moti',    icon:'💪', name:'MOTIVATE',  bg:['#150800','#280f00','#080300'], a:'#FF6B00', g:'#FF3300', s:'#FFD700'},
  {id:'horror',  icon:'👻', name:'HORROR',    bg:['#020202','#080202','#000000'], a:'#8B0000', g:'#CC0000', s:'#FF4444'},
  {id:'sports',  icon:'⚽', name:'SPORTS',    bg:['#001400','#002200','#000800'], a:'#00FF44', g:'#00AA22', s:'#88FF88'},
  {id:'crypto',  icon:'💰', name:'CRYPTO',    bg:['#080800','#141400','#040400'], a:'#FFD700', g:'#FF8800', s:'#FFF4AA'},
  {id:'vlog',    icon:'🎥', name:'VLOG',      bg:['#080010','#100018','#040008'], a:'#FF55FF', g:'#9900CC', s:'#FF88FF'}
];

function thGetTheme(){ return TH_THEMES.find(function(t){return t.id===thCurrentTheme;})||TH_THEMES[0]; }

function thBuildThemeGrid(){
  var g=document.getElementById('th-theme-grid');
  if(!g) return;
  g.innerHTML='';
  TH_THEMES.forEach(function(t){
    var b=document.createElement('button');
    b.style.cssText='background:'+(t.id===thCurrentTheme?'rgba(255,31,31,0.15)':'#111')+';border:1px solid '+(t.id===thCurrentTheme?'var(--red)':'#1e1e1e')+';border-radius:7px;padding:7px 4px;cursor:pointer;text-align:center;transition:all 0.15s;font-family:Rajdhani,sans-serif;';
    b.innerHTML='<div style="font-size:18px;margin-bottom:3px;">'+t.icon+'</div><div style="font-size:8px;color:#888;font-weight:700;letter-spacing:0.5px;">'+t.name+'</div>';
    b.onclick=function(){ thCurrentTheme=t.id; var ae=document.getElementById('th-accent'); if(ae) ae.value=t.a; thBuildThemeGrid(); thDraw(); };
    g.appendChild(b);
  });
}

function thSetLayout(l){
  thCurrentLayout=l;
  document.querySelectorAll('.th-lbtn').forEach(function(b){ b.classList.toggle('active',b.dataset.l===l); });
  thDraw();
}

function thLoadImage(e){
  var file=e.target.files[0]; if(!file) return;
  var reader=new FileReader();
  reader.onload=function(ev){
    var img=new Image();
    img.onload=function(){
      thUploadedImage=img;
      var pr=document.getElementById('th-img-preview');
      if(pr){ pr.src=ev.target.result; pr.style.display='block'; }
      var ct=document.getElementById('th-img-controls');
      if(ct) ct.style.display='block';
      thDraw();
    };
    img.src=ev.target.result;
  };
  reader.readAsDataURL(file);
}

function thRemoveImage(){
  thUploadedImage=null;
  var pr=document.getElementById('th-img-preview'); if(pr){ pr.style.display='none'; pr.src=''; }
  var ct=document.getElementById('th-img-controls'); if(ct) ct.style.display='none';
  var inp=document.getElementById('th-img-input'); if(inp) inp.value='';
  thDraw();
}

// drag-drop on upload zone
(function(){
  function ready(){ 
    var uz=document.getElementById('th-upload-zone');
    if(!uz) return;
    uz.addEventListener('dragover',function(e){e.preventDefault();uz.style.borderColor='var(--red)';});
    uz.addEventListener('dragleave',function(){uz.style.borderColor='#2a2a2a';});
    uz.addEventListener('drop',function(e){
      e.preventDefault(); uz.style.borderColor='#2a2a2a';
      var file=e.dataTransfer.files[0];
      if(file&&file.type.startsWith('image/')){ thLoadImage({target:{files:[file]}}); }
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',ready); else ready();
})();

// ── CANVAS HELPERS ───────────────────────
function thGv(id){ var e=document.getElementById(id); return e?e.value:''; }
function thRng(i,off){ var x=Math.sin(i*(off||7)+1)*43758.5453; return x-Math.floor(x); }
function thRgba(hex,a){ var r=parseInt(hex.slice(1,3),16)||0,g=parseInt(hex.slice(3,5),16)||0,b=parseInt(hex.slice(5,7),16)||0; return 'rgba('+r+','+g+','+b+','+a+')'; }
function thWrap(ctx,text,x,y,maxW,lh){
  var words=text.split(' '),line='',out=[];
  for(var i=0;i<words.length;i++){
    var test=line?line+' '+words[i]:words[i];
    if(ctx.measureText(test).width>maxW&&line){out.push({t:line,x:x,y:y});line=words[i];y+=lh;}else line=test;
  }
  out.push({t:line,x:x,y:y}); return out;
}
function thStroke(ctx,text,x,y,fs,fill,stroke,sw,shadow){
  ctx.save();
  ctx.font='bold '+fs+'px Impact,sans-serif'; ctx.textAlign='left';
  ctx.lineWidth=sw||8; ctx.strokeStyle=stroke||'#000';
  ctx.shadowColor=stroke||'#000'; ctx.shadowBlur=shadow||0;
  ctx.strokeText(text,x,y);
  ctx.fillStyle=fill||'#fff'; ctx.shadowColor=fill||'#fff'; ctx.shadowBlur=shadow||0;
  ctx.fillText(text,x,y); ctx.restore();
}
function thParticles(ctx,W,H,color,count){
  ctx.save();
  for(var i=0;i<count;i++){
    ctx.fillStyle=thRgba(color,thRng(i,5)*0.55+0.08);
    ctx.beginPath(); ctx.arc(thRng(i,7)*W,thRng(i,13)*H,thRng(i,3)*2.5+0.3,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}
function thVignette(ctx,W,H){
  var g=ctx.createRadialGradient(W/2,H/2,H*0.15,W/2,H/2,W*0.8);
  g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,0.72)');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
}
function thBg(ctx,W,H,bg){
  var g=ctx.createRadialGradient(W*0.3,H*0.4,0,W*0.5,H*0.5,W*0.9);
  g.addColorStop(0,bg[1]); g.addColorStop(0.5,bg[0]); g.addColorStop(1,bg[2]);
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
}
function thChanBar(ctx,W,H,ch,accent){
  ctx.save();
  ctx.fillStyle=thRgba(accent,0.92); ctx.fillRect(0,H-52,W,52);
  ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.fillRect(0,H-52,W,2);
  ctx.fillStyle='rgba(255,255,255,0.1)'; ctx.fillRect(0,H-52,W,14);
  ctx.font='bold 28px Impact,sans-serif'; ctx.textAlign='center'; ctx.fillStyle='#fff';
  ctx.shadowColor='rgba(0,0,0,0.5)'; ctx.shadowBlur=6;
  ctx.fillText(ch.toUpperCase(),W/2,H-14); ctx.restore();
}
function thBadge(ctx,x,y,text,accent,fs){
  if(!text) return; ctx.save();
  ctx.font='bold '+fs+'px Impact,sans-serif';
  var tw=ctx.measureText(text).width,pad=fs*0.28,bh=fs*1.1;
  ctx.shadowColor=accent; ctx.shadowBlur=20;
  ctx.fillStyle=accent; ctx.fillRect(x,y-bh*0.82,tw+pad*2,bh);
  ctx.fillStyle='rgba(255,255,255,0.15)'; ctx.fillRect(x,y-bh*0.82,tw+pad*2,bh*0.35);
  ctx.textAlign='left'; ctx.fillStyle='#fff'; ctx.fillText(text,x+pad,y); ctx.restore();
}
function thDrawImage(ctx,W,H){
  if(!thUploadedImage) return;
  var side=thGv('th-img-side')||'right';
  var scale=(parseFloat(thGv('th-img-scale'))||100)/100;
  var iw=thUploadedImage.width*scale, ih=thUploadedImage.height*scale;
  var ix=0, iy=H-ih;
  if(side==='right'){ ix=W-iw*0.75; iy=H-ih; }
  else if(side==='left'){ ix=-iw*0.1; iy=H-ih; }
  else if(side==='center'){ ix=(W-iw)/2; iy=H-ih; }
  if(side==='fill'){
    var sc=Math.max(W/thUploadedImage.width,H/thUploadedImage.height)*scale;
    var fw=thUploadedImage.width*sc,fh=thUploadedImage.height*sc;
    ctx.save(); ctx.globalAlpha=0.38;
    ctx.drawImage(thUploadedImage,(W-fw)/2,(H-fh)/2,fw,fh); ctx.restore();
    ctx.fillStyle='rgba(0,0,0,0.52)'; ctx.fillRect(0,0,W,H);
  } else {
    ctx.save(); ctx.shadowColor='rgba(0,0,0,0.9)'; ctx.shadowBlur=35; ctx.shadowOffsetX=5; ctx.shadowOffsetY=5;
    ctx.drawImage(thUploadedImage,ix,iy,iw,ih); ctx.restore();
    var th=thGetTheme(); ctx.save(); ctx.globalAlpha=0.2;
    ctx.shadowColor=th.a; ctx.shadowBlur=45;
    ctx.drawImage(thUploadedImage,ix,iy,iw,ih); ctx.restore();
  }
}

// ── LAYOUTS ──────────────────────────────
function thDrawFire(ctx,W,H,t,sub,badge,ch,accent,textCol,theme){
  thBg(ctx,W,H,theme.bg);
  var fg=ctx.createLinearGradient(0,H,0,H*0.35);
  fg.addColorStop(0,thRgba(accent,0.42)); fg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=fg; ctx.fillRect(0,0,W,H);
  for(var i=0;i<80;i++){
    var fp=thRng(i,11)*W,fh=thRng(i,7)*140+30;
    var ffg=ctx.createLinearGradient(fp,H,fp,H-fh);
    ffg.addColorStop(0,thRgba(accent,0.35+thRng(i,3)*0.25));
    ffg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=ffg;
    ctx.beginPath(); ctx.ellipse(fp,H-fh*0.3,thRng(i,9)*22+6,fh*0.5,0,0,Math.PI*2); ctx.fill();
  }
  for(var li=0;li<4;li++){
    ctx.save(); ctx.strokeStyle=thRgba(theme.s,0.65+li*0.1); ctx.lineWidth=li===1?2.5:1.2;
    ctx.shadowColor=theme.s; ctx.shadowBlur=10;
    ctx.beginPath(); var lx=thRng(li,11)*W; ctx.moveTo(lx,0);
    for(var si=0;si<8;si++){ lx+=(thRng(li*3+si,1)-0.5)*70; ctx.lineTo(lx,(si+1)*(H*0.45/8)); }
    ctx.stroke(); ctx.restore();
  }
  thParticles(ctx,W,H,theme.s,120);
  thDrawImage(ctx,W,H);
  ctx.fillStyle=accent; ctx.fillRect(0,0,10,H);
  thBadge(ctx,W-260,108,badge,accent,72);
  var lines=thWrap(ctx,t,55,300,W-120,145); ctx.font='bold 130px Impact,sans-serif';
  lines.forEach(function(l){ thStroke(ctx,l.t,l.x,l.y,130,textCol,'#000',9,28); });
  thStroke(ctx,sub,55,lines[lines.length-1].y+62,54,accent,'#000',5,15);
  thVignette(ctx,W,H); thChanBar(ctx,W,H,ch,accent);
}
function thDrawCyber(ctx,W,H,t,sub,badge,ch,accent,textCol,theme){
  thBg(ctx,W,H,theme.bg);
  ctx.save(); ctx.strokeStyle=thRgba(accent,0.07); ctx.lineWidth=1;
  for(var x=0;x<W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(var y=0;y<H;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  ctx.restore();
  var cg=ctx.createRadialGradient(W*0.22,H*0.5,0,W*0.22,H*0.5,W*0.55);
  cg.addColorStop(0,thRgba(theme.g,0.28)); cg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=cg; ctx.fillRect(0,0,W,H);
  ctx.save(); ctx.fillStyle='rgba(0,0,0,0.05)'; for(var sy=0;sy<H;sy+=3) ctx.fillRect(0,sy,W,1); ctx.restore();
  thParticles(ctx,W,H,theme.s,110);
  thDrawImage(ctx,W,H);
  ctx.save(); ctx.fillStyle=thRgba(accent,0.12); ctx.beginPath(); ctx.moveTo(W,0);ctx.lineTo(W-240,0);ctx.lineTo(W,240);ctx.fill(); ctx.restore();
  thBadge(ctx,W-260,108,badge,accent,70);
  var lines=thWrap(ctx,t,55,300,W-120,145); ctx.font='bold 130px Impact,sans-serif';
  lines.forEach(function(l){ thStroke(ctx,l.t,l.x,l.y,130,textCol,theme.g,8,25); });
  thStroke(ctx,sub,55,lines[lines.length-1].y+62,52,theme.s,'#000',4,12);
  thVignette(ctx,W,H); thChanBar(ctx,W,H,ch,accent);
}
function thDrawSplit(ctx,W,H,t,sub,badge,ch,accent,textCol,theme){
  thBg(ctx,W,H,theme.bg);
  ctx.save(); ctx.fillStyle=thRgba(accent,0.1);
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(W*0.52,0);ctx.lineTo(W*0.36,H);ctx.lineTo(0,H);ctx.fill(); ctx.restore();
  ctx.save(); ctx.strokeStyle=accent; ctx.lineWidth=5;
  ctx.shadowColor=accent; ctx.shadowBlur=30;
  ctx.beginPath();ctx.moveTo(W*0.52,0);ctx.lineTo(W*0.36,H);ctx.stroke(); ctx.restore();
  var rg=ctx.createRadialGradient(W*0.78,H*0.45,0,W*0.78,H*0.45,W*0.42);
  rg.addColorStop(0,thRgba(theme.g,0.22)); rg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=rg; ctx.fillRect(0,0,W,H);
  thParticles(ctx,W,H,theme.s,120);
  thDrawImage(ctx,W,H);
  ctx.save(); ctx.textAlign='center'; ctx.font='bold 150px Impact,sans-serif';
  ctx.fillStyle=thRgba(accent,0.07); ctx.shadowColor=accent; ctx.shadowBlur=40;
  ctx.fillText(badge,W*0.75,H*0.62); ctx.restore();
  thStroke(ctx,badge,W*0.57,H*0.54,90,accent,'#000',6,22);
  var lines=thWrap(ctx,t,50,300,W*0.47,145); ctx.font='bold 130px Impact,sans-serif';
  lines.forEach(function(l){ thStroke(ctx,l.t,l.x,l.y,130,textCol,'#000',9,28); });
  thStroke(ctx,sub,50,lines[lines.length-1].y+62,52,accent,'#000',4,12);
  thVignette(ctx,W,H); thChanBar(ctx,W,H,ch,accent);
}
function thDrawGlitch(ctx,W,H,t,sub,badge,ch,accent,textCol,theme){
  thBg(ctx,W,H,theme.bg);
  ctx.save();
  for(var i=0;i<15;i++){
    ctx.fillStyle=thRgba(accent,thRng(i,5)*0.11+0.02);
    ctx.fillRect((thRng(i,2)-0.5)*50,thRng(i,17)*H,W,thRng(i,7)*26+3);
  }
  ctx.restore();
  ctx.save(); ctx.globalAlpha=0.28; ctx.globalCompositeOperation='screen';
  ctx.fillStyle='rgba(255,0,0,0.38)'; ctx.fillRect(13,0,W,H);
  ctx.fillStyle='rgba(0,255,255,0.38)'; ctx.fillRect(-13,0,W,H);
  ctx.restore();
  thParticles(ctx,W,H,theme.s,140);
  thDrawImage(ctx,W,H);
  thBadge(ctx,50,108,badge,accent,70);
  var lines=thWrap(ctx,t,55,300,W-120,145); ctx.font='bold 130px Impact,sans-serif';
  ctx.save(); ctx.globalAlpha=0.45;
  lines.forEach(function(l){ thStroke(ctx,l.t,l.x+10,l.y,130,'#FF2222','#000',5,0); });
  ctx.restore(); ctx.save(); ctx.globalAlpha=0.45;
  lines.forEach(function(l){ thStroke(ctx,l.t,l.x-10,l.y,130,'#00FFFF','#000',5,0); });
  ctx.restore();
  lines.forEach(function(l){ thStroke(ctx,l.t,l.x,l.y,130,textCol,'#000',8,22); });
  thStroke(ctx,sub,55,lines[lines.length-1].y+62,52,accent,'#000',4,12);
  ctx.save(); ctx.globalAlpha=0.03; for(var n=0;n<1200;n++){ ctx.fillStyle=thRng(n,7)>0.5?'#fff':'#000'; ctx.fillRect(thRng(n,3)*W,thRng(n,5)*H,2,2); } ctx.restore();
  thVignette(ctx,W,H); thChanBar(ctx,W,H,ch,accent);
}
function thDrawGold(ctx,W,H,t,sub,badge,ch,accent,textCol,theme){
  var bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#0a0700'); bg.addColorStop(0.5,'#1c1500'); bg.addColorStop(1,'#050400');
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
  var gg=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,W*0.65);
  gg.addColorStop(0,'rgba(255,215,0,0.17)'); gg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=gg; ctx.fillRect(0,0,W,H);
  ctx.save(); ctx.strokeStyle='rgba(255,215,0,0.06)'; ctx.lineWidth=1;
  for(var xi=0;xi<W+80;xi+=80){ for(var yi=0;yi<H+80;yi+=80){ ctx.beginPath();ctx.moveTo(xi,yi-40);ctx.lineTo(xi+40,yi);ctx.lineTo(xi,yi+40);ctx.lineTo(xi-40,yi);ctx.closePath();ctx.stroke(); } }
  ctx.restore();
  thParticles(ctx,W,H,'#FFD700',160);
  var topG=ctx.createLinearGradient(0,0,W,0);
  topG.addColorStop(0,'rgba(0,0,0,0)'); topG.addColorStop(0.5,'rgba(255,215,0,0.6)'); topG.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=topG; ctx.fillRect(0,0,W,7);
  thDrawImage(ctx,W,H);
  ctx.save(); ctx.font='36px serif'; ctx.textAlign='center'; ctx.fillStyle='#FFD700';
  ctx.shadowColor='#FFD700'; ctx.shadowBlur=14;
  ctx.fillText('★',W*0.18,90); ctx.fillText('★',W*0.82,90); ctx.restore();
  thStroke(ctx,badge,W/2-(ctx.measureText?80:80),105,68,'#FFD700','#000',5,18);
  var lines=thWrap(ctx,t,55,310,W-120,150); ctx.font='bold 130px Impact,sans-serif';
  lines.forEach(function(l){ thStroke(ctx,l.t,l.x,l.y,130,'#FFD700','#3a2800',10,35); });
  thStroke(ctx,sub,55,lines[lines.length-1].y+65,52,'#FFF8DC','#553300',4,10);
  thVignette(ctx,W,H);
  ctx.save();
  var cb=ctx.createLinearGradient(0,H-52,W,H-52);
  cb.addColorStop(0,'#0f0c00'); cb.addColorStop(0.5,'#2a2200'); cb.addColorStop(1,'#0f0c00');
  ctx.fillStyle=cb; ctx.fillRect(0,H-52,W,52);
  ctx.fillStyle='rgba(255,215,0,0.5)'; ctx.fillRect(0,H-52,W,2);
  ctx.font='bold 28px Impact,sans-serif'; ctx.textAlign='center'; ctx.fillStyle='#FFD700';
  ctx.shadowColor='#FFD700'; ctx.shadowBlur=10;
  ctx.fillText(ch.toUpperCase(),W/2,H-14); ctx.restore();
}
function thDrawClean(ctx,W,H,t,sub,badge,ch,accent,textCol,theme){
  ctx.fillStyle='#080808'; ctx.fillRect(0,0,W,H);
  var og=ctx.createRadialGradient(W*0.72,H*0.32,0,W*0.72,H*0.32,W*0.52);
  og.addColorStop(0,thRgba(accent,0.13)); og.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=og; ctx.fillRect(0,0,W,H);
  ctx.fillStyle=accent; ctx.fillRect(50,H*0.14,W-100,3);
  ctx.fillStyle=thRgba(accent,0.18); ctx.fillRect(50,H*0.14+8,W-100,1);
  thParticles(ctx,W,H,theme.s,70);
  thDrawImage(ctx,W,H);
  ctx.save(); ctx.font='bold 34px Impact,sans-serif';
  var bw=ctx.measureText(badge).width+44;
  ctx.fillStyle=accent; ctx.fillRect(W-bw-45,38,bw,56);
  ctx.fillStyle='rgba(255,255,255,0.12)'; ctx.fillRect(W-bw-45,38,bw,20);
  ctx.textAlign='right'; ctx.fillStyle='#fff'; ctx.fillText(badge,W-47,86); ctx.textAlign='left'; ctx.restore();
  var lines=thWrap(ctx,t,55,300,W-120,150); ctx.font='bold 130px Impact,sans-serif';
  lines.forEach(function(l){ thStroke(ctx,l.t,l.x,l.y,130,textCol,'#000',7,18); });
  var sy=lines[lines.length-1].y+20;
  ctx.fillStyle=accent; ctx.fillRect(55,sy,180,3);
  thStroke(ctx,sub,55,sy+52,50,accent,'#000',3,10);
  ctx.fillStyle=thRgba(accent,0.22); ctx.fillRect(0,H-55,W,1);
  ctx.save(); ctx.font='bold 24px Impact,sans-serif'; ctx.textAlign='right'; ctx.fillStyle=accent;
  ctx.shadowColor=accent; ctx.shadowBlur=8;
  ctx.fillText(ch.toUpperCase(),W-38,H-16); ctx.shadowBlur=0; ctx.restore();
  thVignette(ctx,W,H);
}

// ── MAIN DRAW ────────────────────────────
function thDrawToCanvas(canvas, layoutOvr){
  if(!canvas) return;
  var ctx=canvas.getContext('2d');
  var W=1280,H=720;
  ctx.clearRect(0,0,W,H);
  var t=thGv('th-title')||'RANK PUSH';
  var sub=thGv('th-sub')||'CONQUEROR IN 7 DAYS';
  var badge=thGv('th-num')||'TOP 1%';
  var ch=thGv('th-channel')||'ROB UNITY POWER';
  var accent=thGv('th-accent')||'#FF1F1F';
  var textCol=thGv('th-textcol')||'#FFFFFF';
  var theme=thGetTheme();
  var layout=layoutOvr||thCurrentLayout;
  if(layout==='fire')    thDrawFire(ctx,W,H,t,sub,badge,ch,accent,textCol,theme);
  else if(layout==='cyber')  thDrawCyber(ctx,W,H,t,sub,badge,ch,accent,textCol,theme);
  else if(layout==='split')  thDrawSplit(ctx,W,H,t,sub,badge,ch,accent,textCol,theme);
  else if(layout==='glitch') thDrawGlitch(ctx,W,H,t,sub,badge,ch,accent,textCol,theme);
  else if(layout==='gold')   thDrawGold(ctx,W,H,t,sub,badge,ch,accent,textCol,theme);
  else if(layout==='clean')  thDrawClean(ctx,W,H,t,sub,badge,ch,accent,textCol,theme);
}

function thDraw(){
  clearTimeout(thDrawTimer);
  thDrawTimer=setTimeout(function(){ thDrawToCanvas(document.getElementById('thumbCanvas')); },60);
}

function thDownload(){
  thDrawToCanvas(document.getElementById('thumbCanvas'));
  setTimeout(function(){
    var a=document.createElement('a');
    a.download='ROB_UNITY_POWER_thumbnail.png';
    a.href=document.getElementById('thumbCanvas').toDataURL('image/png');
    a.click();
  },120);
}

function thVariations(){
  var grid=document.getElementById('th-var-grid');
  if(!grid) return;
  grid.innerHTML='';
  var all=['fire','cyber','split','glitch','gold','clean'], used=[], tmp=all.slice();
  while(used.length<4){ var idx=Math.floor(Math.random()*tmp.length); used.push(tmp.splice(idx,1)[0]); }
  var icons={'fire':'🔥','cyber':'💻','split':'⚡','glitch':'💥','gold':'👑','clean':'◼'};
  used.forEach(function(layout,i){
    var wrap=document.createElement('div');
    wrap.style.cssText='position:relative;border-radius:7px;overflow:hidden;border:1px solid var(--border);';
    var c=document.createElement('canvas'); c.width=1280; c.height=720;
    c.style.cssText='width:100%;height:auto;display:block;';
    wrap.appendChild(c);
    var lbl=document.createElement('div');
    lbl.style.cssText='position:absolute;top:5px;left:5px;background:rgba(0,0,0,0.75);border-radius:4px;padding:2px 7px;font-size:9px;color:var(--gold);letter-spacing:1px;font-weight:700;';
    lbl.textContent=(icons[layout]||'🎨')+' '+layout.toUpperCase(); wrap.appendChild(lbl);
    var dlb=document.createElement('button');
    dlb.style.cssText='position:absolute;bottom:5px;right:5px;background:linear-gradient(135deg,#a07010,#FFD700);border:none;border-radius:4px;padding:3px 9px;color:#000;font-size:9px;font-weight:700;cursor:pointer;letter-spacing:1px;';
    dlb.textContent='⬇️ DL';
    dlb.onclick=(function(cv,lay){ return function(e){ e.stopPropagation(); var a=document.createElement('a'); a.download='thumbnail_'+lay+'.png'; a.href=cv.toDataURL('image/png'); a.click(); }; })(c,layout);
    wrap.appendChild(dlb); grid.appendChild(wrap);
    setTimeout((function(cv,lay){ return function(){ thDrawToCanvas(cv,lay); }; })(c,layout),i*80);
  });
}

function thRandomize(){
  thCurrentTheme=TH_THEMES[Math.floor(Math.random()*TH_THEMES.length)].id;
  var layouts=['fire','cyber','split','glitch','gold','clean'];
  thCurrentLayout=layouts[Math.floor(Math.random()*layouts.length)];
  var theme=thGetTheme();
  var ac=document.getElementById('th-accent'); if(ac) ac.value=theme.a;
  thBuildThemeGrid();
  document.querySelectorAll('.th-lbtn').forEach(function(b){ b.classList.toggle('active',b.dataset.l===thCurrentLayout); });
  thDraw();
}

window.addEventListener('load',function(){
  thBuildThemeGrid();
  // Add lbtn styles
  var s=document.createElement('style');
  s.textContent='.th-lbtn{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:5px 12px;color:var(--muted2);font-size:11px;font-weight:700;cursor:pointer;transition:all 0.15s;font-family:Rajdhani,sans-serif;letter-spacing:1px;}.th-lbtn.active{color:#fff;border-color:var(--red);background:rgba(255,31,31,0.12);}.th-lbtn:hover{color:var(--text);}';
  document.head.appendChild(s);
  setTimeout(thDraw,300);
});

async function runAI(id) {
  var btn = document.getElementById('btn-'+id);
  var outBox = document.getElementById('out-'+id);
  var textEl = document.getElementById('text-'+id);

  if(!btn || !outBox || !textEl) {
    console.warn('Missing element for id:', id);
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<div class="spin"></div> ANALYZING...';
  outBox.className = 'out-box show';
  textEl.innerHTML = '<div class="loader-wrap"><div class="spin"></div>AI analyzing for ROB UNITY POWER...</div>';

  try {
    var response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: getSystem(id),
        messages: [{role:'user', content: buildMsg(id)}]
      })
    });

    var data = await response.json();
    var result = (data.content && data.content[0] && data.content[0].text) ? data.content[0].text : 'No response received. Please try again.';

    textEl.className = 'out-content';
    textEl.textContent = '';

    var i = 0;
    function type() {
      if(i < result.length) {
        textEl.textContent += result.slice(i, i+15);
        i += 15;
        setTimeout(type, 10);
      } else {
        if(id === 'tags') renderTagPills(result, 'tags-pills');
        if(id === 'vidlink') renderTagPills(result, 'vl-tag-pills');
      }
    }
    type();

  } catch(err) {
    textEl.textContent = 'Error: ' + err.message + '\n\nPlease try again.';
  }

  btn.disabled = false;
  btn.innerHTML = '⚡ RUN AGAIN';
}

// ══════════════════════════════════════════
// TAG PILLS RENDERER
// ══════════════════════════════════════════
function renderTagPills(text, pillsId) {
  var pillsWrap = document.getElementById(pillsId);
  if(!pillsWrap) return;
  var tagMatch = text.match(/(?:MAIN TAGS|TAGS LIST|30 tags)[^\n]*\n([\s\S]*?)(?:\n\n|\n[0-9A-Z])/i);
  if(!tagMatch) return;
  var tags = tagMatch[1].split(',').map(function(t){ return t.trim().replace(/^[-\s*#]+/,''); }).filter(function(t){ return t && t.length < 60; });
  pillsWrap.innerHTML = '';
  tags.slice(0,40).forEach(function(tag, i) {
    var p = document.createElement('span');
    p.className = 'tag-pill ' + (i%3===0 ? '' : i%3===1 ? 'green' : 'gold');
    p.textContent = tag;
    p.title = 'Click to copy';
    p.onclick = function(){ navigator.clipboard.writeText(tag).catch(function(){}); p.textContent='✓ '+tag; setTimeout(function(){ p.textContent=tag; }, 1500); };
    pillsWrap.appendChild(p);
  });
}

// ══════════════════════════════════════════
// COPY OUTPUT — NULL-SAFE
// ══════════════════════════════════════════
function copyOut(id) {
  var textEl = document.getElementById('text-'+id);
  if(!textEl) return;
  var text = textEl.textContent || '';
  if(!text) return;
  navigator.clipboard.writeText(text).then(function() {
    var outBox = document.getElementById('out-'+id);
    var btn = outBox ? outBox.querySelector('.btn-copy') : null;
    if(btn){ btn.textContent='✓ COPIED'; setTimeout(function(){ btn.textContent='COPY'; }, 2000); }
  }).catch(function(){});
}
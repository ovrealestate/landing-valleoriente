function readTracking(){try{return JSON.parse(sessionStorage.getItem('ov_tracking')||'{}');}catch{return {};}}
const TRACKING_KEYS=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','campaign_id','adset_id','ad_id'];
function captureTracking(){const q=new URLSearchParams(location.search);const saved=readTracking();let changed=false;TRACKING_KEYS.forEach(k=>{const v=q.get(k);if(v){saved[k]=v;changed=true;}});if(changed){try{sessionStorage.setItem('ov_tracking',JSON.stringify(saved));}catch{}}}
function decorateInternalLinks(){const saved=readTracking();document.querySelectorAll('a[data-preserve-tracking]').forEach(a=>{try{const u=new URL(a.getAttribute('href'),location.href);Object.entries(saved).forEach(([k,v])=>u.searchParams.set(k,v));a.href=u.pathname+u.search+u.hash;}catch{}});}
function setupLightbox(){const box=document.getElementById('lightbox');if(!box)return;const img=document.getElementById('lightboxImage');const cap=document.getElementById('lightboxCaption');const close=box.querySelector('.lightbox-close');document.querySelectorAll('.gallery-open').forEach(btn=>btn.addEventListener('click',()=>{img.src=btn.dataset.src;img.alt=btn.dataset.label||'';cap.textContent=btn.dataset.label||'';box.classList.add('is-open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}));const hide=()=>{box.classList.remove('is-open');box.setAttribute('aria-hidden','true');document.body.style.overflow='';};close?.addEventListener('click',hide);box.addEventListener('click',e=>{if(e.target===box)hide();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&box.classList.contains('is-open'))hide();});}
function setupPlanCarousel(){const track=document.querySelector('[data-plan-track]');if(!track)return;const cards=[...track.children];const prev=document.querySelector('[data-plan-prev]');const next=document.querySelector('[data-plan-next]');const count=document.querySelector('[data-plan-count]');let current=0;const update=()=>{const center=track.scrollLeft+track.clientWidth/2;let idx=0,dist=Infinity;cards.forEach((c,i)=>{const d=Math.abs(c.offsetLeft+c.offsetWidth/2-center);if(d<dist){dist=d;idx=i;}});current=idx;if(count)count.textContent=`${idx+1} / ${cards.length}`;};const go=i=>{current=Math.max(0,Math.min(cards.length-1,i));cards[current].scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});setTimeout(update,260);};prev?.addEventListener('click',()=>go(current-1));next?.addEventListener('click',()=>go(current+1));track.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});addEventListener('resize',update);update();}
captureTracking();decorateInternalLinks();setupLightbox();setupPlanCarousel();setupProjectSlider();

function setupProjectSlider(){const slider=document.querySelector('[data-project-slider]');if(!slider)return;const slides=[...slider.querySelectorAll('[data-project-slide]')];const dots=[...document.querySelectorAll('[data-project-dot]')];if(!slides.length)return;let current=0;let timer=null;const delay=2200;const show=i=>{current=(i+slides.length)%slides.length;slides.forEach((slide,idx)=>slide.classList.toggle('is-active',idx===current));dots.forEach((dot,idx)=>dot.classList.toggle('is-active',idx===current));};const stop=()=>{if(timer){clearInterval(timer);timer=null;}};const start=()=>{if(slides.length<2)return;stop();timer=setInterval(()=>show(current+1),delay);};dots.forEach((dot,idx)=>dot.addEventListener('click',()=>{show(idx);start();}));slider.addEventListener('mouseenter',stop);slider.addEventListener('mouseleave',start);slider.addEventListener('focusin',stop);slider.addEventListener('focusout',()=>{setTimeout(()=>{if(!slider.contains(document.activeElement))start();},0);});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});show(0);start();}

function cookieValue(name){return document.cookie.split('; ').find(v=>v.startsWith(name+'='))?.slice(name.length+1)||'';}
function setupLeadForm(){
 const form=document.getElementById('leadForm');if(!form)return;
 const status=document.getElementById('leadStatus'),button=form.querySelector('button[type=submit]');let eventId=null,busy=false;
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(busy||!form.reportValidity())return;
  const fields=Object.fromEntries(new FormData(form));const digits=fields.phone;
  fields.email=fields.email.trim();
  if(!/^[0-9]{10}$/.test(digits)){status.textContent='Escribe tu celular con exactamente 10 dígitos.';status.dataset.error='true';return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email)){status.textContent='Revisa tu correo: usa el formato nombre@dominio.com.';status.dataset.error='true';return;}
  busy=true;button.disabled=true;status.dataset.error='false';status.textContent='Enviando tu solicitud…';
  eventId=eventId||crypto.randomUUID();const tracking=readTracking();
  const payload={...tracking,...fields,consent:fields.consent==='on',meta_event_id:eventId,fbp:cookieValue('_fbp'),fbc:cookieValue('_fbc')||(tracking.fbclid?'fb.1.'+Date.now()+'.'+tracking.fbclid:''),page_url:location.origin+location.pathname};
  try{
   const response=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(25000)});
   const result=await response.json();if(!response.ok||!result.ok)throw new Error('send');
   status.textContent='Gracias. Recibimos tu solicitud y un asesor te contactará.';form.reset();
   try{if(window.fbq)window.fbq('track','Lead',{}, {eventID:eventId});}catch{}eventId=null;
  }catch{status.dataset.error='true';status.textContent='No pudimos confirmar el envío. Intenta nuevamente; tus datos siguen aquí.';}
  finally{busy=false;button.disabled=false;}
 });
}
setupLeadForm();

const json = (data, status = 200) => Response.json(data, {status, headers:{'Cache-Control':'no-store'}});
export default {
 async fetch(request, env) {
  const url = new URL(request.url);
  if (url.pathname !== '/api/lead') return env.ASSETS.fetch(request);
  if (request.method !== 'POST') return json({ok:false},405);
  if (request.headers.get('Origin') !== url.origin) return json({ok:false},403);
  if (!(request.headers.get('Content-Type')||'').includes('application/json')) return json({ok:false},415);
  if (!env.LEADS_SCRIPT_URL || !env.LEADS_SCRIPT_TOKEN) return json({ok:false},503);
  try {
   const raw = await request.text();if(raw.length>12000)return json({ok:false},413);
   const d = JSON.parse(raw);
   if(d.company)return json({ok:false},400);
   const str=(key,max=200)=>String(d[key]||'').trim().slice(0,max);
   let phone=str('phone',25).replace(/\D/g,'');if(phone.length===10)phone='52'+phone;
   if(str('nombre_completo',120).length<2 || !/^\d{10,15}$/.test(phone) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str('email',160)) || d.consent!==true || !/^[a-f0-9-]{36}$/i.test(str('meta_event_id')))return json({ok:false},400);
   if(!['Lo antes posible','En 1 a 3 meses','En 3 a 6 meses','Más de 6 meses'].includes(str('plazo_compra')) || !['1','2','3','Aún no lo sé'].includes(str('recamaras')))return json({ok:false},400);
   const lead={created_time:new Date().toISOString(),nombre_completo:str('nombre_completo',120),phone,correo_electronico:str('email',160).toLowerCase(),plazo_compra:str('plazo_compra'),recamaras:str('recamaras'),proyecto:'Valle Oriente',etapa:'Nuevo',meta_event_id:str('meta_event_id'),client_ip:request.headers.get('CF-Connecting-IP')||'',client_user_agent:(request.headers.get('User-Agent')||'').slice(0,500),page_url:url.origin+'/',consent:'Aceptado'};
   for(const key of ['campaign_id','adset_id','ad_id'])lead[key]=/^\d{1,30}$/.test(str(key))?str(key):'';
   for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','fbp','fbc'])lead[key]=str(key,500);
   const res=await fetch(env.LEADS_SCRIPT_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:env.LEADS_SCRIPT_TOKEN,lead}),signal:AbortSignal.timeout(20000)});
   if(!res.ok)return json({ok:false},502);
   const result=await res.json();if(result.ok!==true || result.meta_event_id!==lead.meta_event_id)return json({ok:false},502);
   return json({ok:true,meta_event_id:lead.meta_event_id});
  }catch{return json({ok:false},502);}
 }
};

import { useState, useMemo, useEffect } from "react";

const SHEET_ID = "1UBjalKNQ1bt_qCiGgQ9BRbs2gtnEYjL-1D--Yicmrdg";
// Fuente principal: export CSV de la PRIMERA pestaña (Hoja1). No infiere tipos por columna,
// así las parcelas con letra como "76A" nunca llegan vacías. Sin "gid": el gid de Hoja1 no es 0
// y un gid inexistente responde HTTP 400. Respaldo: gviz, por si el export falla.
const SHEET_URLS = [
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`,
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Hoja1`,
];

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic","Ene'27"];
const MES_VOL_HASTA = 1;
const MES_OBL_DESDE = 2;

function calcMesActivo(){
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth();
  if(anio === 2026) return Math.min(mes, 12);
  if(anio === 2027 && mes === 0) return 12;
  if(anio > 2027) return 12;
  return 2;
}
const MES_ACTIVO = calcMesActivo();

/* ════════════════ Lectura y validación de la planilla ════════════════
   Reglas para que un cambio en la planilla no rompa la app:
   - Las columnas se ubican por su ENCABEZADO (PARCELA, NOMBRE, Rifa, Mantención y meses),
     no por posición: insertar o mover columnas no desordena los datos.
   - Si no se reconocen los encabezados de meses, se usa la posición histórica (col. E a Q).
   - Filas con número de parcela inválido o repetido se ignoran y se informan en consola.
   - Si la fuente principal falla o no trae el encabezado PARCELA, se prueba la siguiente.
   - Si ninguna responde, se muestran los últimos datos guardados en este dispositivo. */

function parseNum(val){
  if(val === null || val === undefined || val === "") return 0;
  // Montos en pesos son enteros. Un decimal de 1-2 dígitos ("3000.0") se descarta;
  // grupos de 3 dígitos tras "." o "," son miles ("$3.000", "3,000").
  const clean = String(val).trim().replace(/[.,]\d{1,2}$/,"").replace(/[^0-9-]/g,"");
  const n = parseInt(clean,10);
  return isNaN(n) || n < 0 ? 0 : n;
}

function normParcela(val){
  // "Parcela 76-b" / " 076 B " / "76.0" → "76B" / "76"
  const s = String(val||"").trim().toUpperCase().replace(/\.0+$/,"").replace(/[\s\-_.]+/g,"");
  const m = s.match(/(\d+)([A-Z]?)$/);
  return m ? String(parseInt(m[1],10)) + m[2] : s;
}

const PARCELA_VALIDA = /^\d{1,3}[A-Z]?$/;

function normTexto(s){
  return String(s||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}

// Separa un CSV completo respetando comillas, comillas dobles ("") y saltos de línea internos
function splitCsv(text){
  const rows = []; let row = [], cur = "", inQ = false;
  for(let i = 0; i < text.length; i++){
    const ch = text[i];
    if(inQ){
      if(ch === '"' && text[i+1] === '"'){ cur += '"'; i++; }
      else if(ch === '"') inQ = false;
      else cur += ch;
    } else if(ch === '"') inQ = true;
    else if(ch === ',') { row.push(cur.trim()); cur = ""; }
    else if(ch === '\n'){ row.push(cur.trim()); rows.push(row); row = []; cur = ""; }
    else if(ch !== '\r') cur += ch;
  }
  if(cur !== "" || row.length){ row.push(cur.trim()); rows.push(row); }
  return rows;
}

const MES_TXT = {ene:1,jan:1,feb:2,mar:3,abr:4,apr:4,may:5,jun:6,jul:7,ago:8,aug:8,sep:9,set:9,oct:10,nov:11,dic:12,dec:12};

// Convierte un encabezado de mes al índice 0..12 (Ene 2026 .. Ene 2027), o -1
function idxMes(h){
  const s = normTexto(h);
  let y, m;
  let r;
  if((r = s.match(/^(\d{4})-(\d{1,2})/)))                       { y=+r[1]; m=+r[2]; }
  else if((r = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/)))    {
    // Los encabezados son día 1 del mes: el número distinto de 1 es el mes (sirve para d/m y m/d)
    const a=+r[1], b=+r[2]; y=+r[3]; m = a===1 ? b : a;
  }
  else if((r = s.match(/^([a-z]{3})[a-z]*[\s.\-'/]*(\d{2,4})$/)) && MES_TXT[r[1]]) { m=MES_TXT[r[1]]; y=+r[2]; }
  else if((r = s.match(/^(\d{5})(\.0+)?$/)))                    {          // serial de Excel
    const d = new Date(Date.UTC(1899,11,30) + (+r[1])*864e5); y=d.getUTCFullYear(); m=d.getUTCMonth()+1;
  }
  else return -1;
  if(y < 100) y += 2000;
  const i = (y-2026)*12 + (m-1);
  return i >= 0 && i < 13 ? i : -1;
}

function parseCsv(text){
  const filas = splitCsv(text);
  const avisos = [];
  // Encabezado: primera fila (de las 5 primeras) con "PARCELA". gviz puede borrar ese texto
  // (columna numérica), así que se acepta también una fila con "NOMBRE" o con los meses.
  const primeras = filas.slice(0,5);
  let hIdx = primeras.findIndex(f=>f.some(c=>normTexto(c).includes("parcela")));
  if(hIdx < 0) hIdx = primeras.findIndex(f=>f.some(c=>normTexto(c).startsWith("nombre")));
  if(hIdx < 0) hIdx = primeras.findIndex(f=>f.filter(c=>idxMes(c) >= 0).length >= 12);
  if(hIdx < 0) throw new Error("No se reconoce el encabezado de la planilla");
  const h = filas[hIdx].map(normTexto);
  const col = (pred, def)=>{ const i = h.findIndex(pred); return i >= 0 ? i : def; };
  const cP = col(c=>c.includes("parcela"), 0);
  const cN = col(c=>c.startsWith("nombre"), 1);
  const cR = col(c=>c.startsWith("rifa"), 2);
  const cM = col(c=>c.startsWith("mantenc"), 3);
  let cMes = Array(13).fill(-1);
  filas[hIdx].forEach((c,i)=>{ const k = idxMes(c); if(k >= 0 && cMes[k] < 0) cMes[k] = i; });
  if(cMes.filter(i=>i>=0).length < 12){
    avisos.push("Encabezados de meses no reconocidos: se usan columnas E a Q.");
    cMes = Array.from({length:13},(_,i)=>4+i);
  }

  const vistos = new Set();
  const rows = [];
  filas.slice(hIdx+1).forEach((c,k)=>{
    const original = (c[cP]||"").trim();
    if(!original && !(c[cN]||"").trim()) return;              // fila vacía
    const p = normParcela(original);
    const fila = hIdx + 2 + k;
    if(!PARCELA_VALIDA.test(p)){ avisos.push(`Fila ${fila}: parcela inválida "${original}" — ignorada.`); return; }
    if(vistos.has(p)){ avisos.push(`Fila ${fila}: parcela ${p} repetida — se usa la primera.`); return; }
    vistos.add(p);
    rows.push({
      p,
      n: (c[cN]||"").trim(),
      rifa: parseNum(c[cR]),
      mant: parseNum(c[cM]),
      pagos: cMes.map(i=>parseNum(c[i])),
    });
  });
  if(!rows.length) throw new Error("La planilla no trae parcelas");
  return { rows, avisos };
}

const CACHE_KEY = "nipas_datos_v1";
function leerCache(){
  try { const c = JSON.parse(localStorage.getItem(CACHE_KEY)); return c && Array.isArray(c.rows) ? c : null; }
  catch { return null; }
}
function guardarCache(rows){
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), rows })); } catch {}
}

function fetchConTimeout(url, ms = 12000){
  const ctrl = new AbortController();
  const t = setTimeout(()=>ctrl.abort(), ms);
  return fetch(url, { cache: "no-store", signal: ctrl.signal }).finally(()=>clearTimeout(t));
}

async function cargarPlanilla(){
  let ultimoError;
  for(const url of SHEET_URLS){
    try{
      const r = await fetchConTimeout(url);
      if(!r.ok) throw new Error("HTTP " + r.status);
      const res = parseCsv(await r.text());
      if(res.avisos.length) console.warn("[Planilla] Revisar:\n" + res.avisos.join("\n"));
      return res;
    }catch(e){ ultimoError = e; console.warn("[Planilla] Falló " + url.split("/").pop() + ": " + e.message); }
  }
  throw ultimoError;
}

function fmtFecha(ts){
  return new Date(ts).toLocaleString("es-CL",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});
}

function getEstado(pagos){
  return pagos.slice(MES_OBL_DESDE, MES_ACTIVO).every(v=>v>0) ? "Al Día" : "Pendiente";
}

const N = {
  bgPage:"#1a1f12", bgCard:"#232b18", bgCard2:"#1e2614", bgInput:"#141a0d",
  verde:"#6a9e3f", verdeClaro:"#8bc34a", verdeBg:"#1d2e10", verdeBorde:"#4a7a25",
  rojo:"#c0392b", rojoBg:"#2e1010", rojoBorde:"#8b2020",
  amarillo:"#e6a817", azulBg:"#102030", azulBorde:"#2060a0",
  texto:"#e8ead4", textoMuted:"#9aaa7a", borde:"#3a4a25",
};

const cardBase = {
  background:N.bgCard, borderRadius:16,
  border:`1.5px solid ${N.borde}`, padding:"20px",
};

export default function App(){
  const [vista, setVista]     = useState("dashboard");
  const [parcela, setParcela] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError]     = useState("");
  const [raw, setRaw]         = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [actualizado, setActualizado] = useState(null);

  function cargarDatos(){
    setCargando(true);
    setErrorCarga("");
    cargarPlanilla()
      .then(({rows})=>{
        guardarCache(rows);
        setRaw(rows); setActualizado({ ts: Date.now(), desdeCache: false });
      })
      .catch(()=>{
        const c = leerCache();
        if(c){ setRaw(c.rows); setActualizado({ ts: c.ts, desdeCache: true }); }
        else setErrorCarga("No se pudo cargar la planilla.");
      })
      .finally(()=>setCargando(false));
  }

  useEffect(()=>{ cargarDatos(); },[]);

  const stats = useMemo(()=>({
    total:   raw.length,
    alDia:   raw.filter(r=>getEstado(r.pagos)==="Al Día").length,
    pendiente: raw.filter(r=>getEstado(r.pagos)==="Pendiente").length,
  }),[raw]);

  function buscar(){
    setError(""); setResultado(null);
    const q = normParcela(parcela);
    if(!q){ setError("Ingresa el número de tu parcela."); return; }
    if(!PARCELA_VALIDA.test(q)){ setError("Escribe solo el número de la parcela, por ejemplo 45 o 76B."); return; }
    const f = raw.find(r=>r.p===q);
    if(!f){ setError("Parcela no encontrada. Verifica el número."); return; }
    setResultado(f);
  }

  /* ── Pantalla de carga ── */
  if(cargando) return(
    <div style={{minHeight:"100vh",background:N.bgPage,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",gap:16,color:N.texto,
      fontFamily:"'Segoe UI',sans-serif"}}>
      <div style={{fontSize:52}}>🌿</div>
      <div style={{fontSize:18,fontWeight:700,color:N.verdeClaro}}>COMUNIDAD LAS NIPAS</div>
      <div style={{fontSize:15,color:N.textoMuted}}>Cargando datos...</div>
    </div>
  );

  /* ── Pantalla de error ── */
  if(errorCarga) return(
    <div style={{minHeight:"100vh",background:N.bgPage,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",gap:16,color:N.texto,
      fontFamily:"'Segoe UI',sans-serif",padding:24,textAlign:"center"}}>
      <div style={{fontSize:48}}>⚠️</div>
      <div style={{fontSize:16,color:"#ef9a9a"}}>{errorCarga}</div>
      <button onClick={cargarDatos} style={{padding:"12px 28px",background:N.verde,color:"#fff",
        border:"none",borderRadius:12,fontSize:16,fontWeight:700,cursor:"pointer"}}>
        Reintentar
      </button>
    </div>
  );

  /* ── App principal ── */
  return(
    <div style={{minHeight:"100vh",background:N.bgPage,color:N.texto,
      fontFamily:"'Segoe UI',system-ui,sans-serif",maxWidth:480,margin:"0 auto"}}>

      {/* HEADER */}
      <div style={{background:N.bgCard,borderBottom:`2px solid ${N.verde}`,
        padding:"16px 20px",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <img src="https://i.imgur.com/YmOYHXM.jpeg" alt="Logo Las Nipas"
            style={{width:48,height:48,borderRadius:12,objectFit:"cover",
              border:`2px solid ${N.verdeBorde}`}}
            onError={e=>{ e.target.style.display="none"; }}
          />
          <div>
            <div style={{fontWeight:800,fontSize:17,letterSpacing:.5,color:N.texto}}>
              COMUNIDAD LAS NIPAS
            </div>
            <div style={{fontSize:12,color:N.textoMuted,marginTop:1}}>
              Control de Aportes 2026 – 2027
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:8}}>
          {[["dashboard","📊","Dashboard"],["residente","🏠","Mi Parcela"]].map(([v,ico,lbl])=>(
            <button key={v}
              onClick={()=>{ setVista(v); setError(""); setResultado(null); setParcela(""); }}
              style={{
                flex:1,padding:"12px 8px",borderRadius:12,border:"none",cursor:"pointer",
                fontWeight:700,fontSize:15,display:"flex",alignItems:"center",
                justifyContent:"center",gap:6,transition:"all .2s",
                background: vista===v ? N.verde : N.bgCard2,
                color:       vista===v ? "#fff"  : N.textoMuted,
                boxShadow:   vista===v ? `0 2px 12px ${N.verde}44` : "none",
              }}>
              {ico} {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{padding:"20px 16px"}}>

        {/* ── DASHBOARD ── */}
        {vista==="dashboard" && (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{fontSize:12,color:N.textoMuted,fontWeight:700,
              textTransform:"uppercase",letterSpacing:1}}>
              Resumen General
            </div>

            {/* Total parcelas */}
            <div style={{...cardBase,textAlign:"center",padding:"36px 20px",
              background:`linear-gradient(135deg,${N.bgCard} 0%,${N.verdeBg} 100%)`,
              borderColor:N.verdeBorde}}>
              <div style={{fontSize:13,color:N.textoMuted,fontWeight:700,
                letterSpacing:.5,marginBottom:8}}>TOTAL PARCELAS</div>
              <div style={{fontSize:80,fontWeight:900,color:N.verdeClaro,lineHeight:1}}>
                {stats.total}
              </div>
              <div style={{fontSize:14,color:N.textoMuted,marginTop:8}}>
                registradas en el período
              </div>
            </div>

            {/* Al día / Pendientes */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div style={{...cardBase,textAlign:"center",padding:"24px 12px",
                borderColor:N.verdeBorde,background:N.verdeBg}}>
                <div style={{fontSize:40,marginBottom:8}}>✅</div>
                <div style={{fontSize:48,fontWeight:900,color:N.verdeClaro,lineHeight:1}}>
                  {stats.alDia}
                </div>
                <div style={{fontSize:14,color:N.textoMuted,fontWeight:700,marginTop:8}}>
                  Al Día
                </div>
              </div>
              <div style={{...cardBase,textAlign:"center",padding:"24px 12px",
                borderColor:N.rojoBorde,background:N.rojoBg}}>
                <div style={{fontSize:40,marginBottom:8}}>⚠️</div>
                <div style={{fontSize:48,fontWeight:900,color:"#e57373",lineHeight:1}}>
                  {stats.pendiente}
                </div>
                <div style={{fontSize:14,color:N.textoMuted,fontWeight:700,marginTop:8}}>
                  Con Pendientes
                </div>
              </div>
            </div>

            {/* Período */}
            <div style={{textAlign:"center",fontSize:13,color:N.textoMuted,
              background:N.bgCard2,borderRadius:10,padding:"10px 14px",
              border:`1px solid ${N.borde}`}}>
              📅 Estado basado en meses obligatorios vencidos<br/>
              <strong style={{color:N.verde}}>
                {MES_ACTIVO <= MES_OBL_DESDE
                  ? "Aún no vence ningún mes obligatorio"
                  : "Marzo — " + (MES_ACTIVO <= 12 ? MESES[MES_ACTIVO-1]+" 2026" : "Ene 2027")}
              </strong>
            </div>

            {actualizado && (actualizado.desdeCache ? (
              <div style={{textAlign:"center",fontSize:14,color:N.amarillo,fontWeight:700,
                background:N.bgCard2,borderRadius:10,padding:"10px 14px",border:`1px solid ${N.amarillo}`}}>
                ⚠️ Sin conexión con la planilla. Mostrando datos guardados del {fmtFecha(actualizado.ts)}.
                <div style={{marginTop:8}}>
                  <button onClick={cargarDatos} style={{padding:"8px 18px",background:N.verde,color:"#fff",
                    border:"none",borderRadius:8,fontSize:14,fontWeight:700,cursor:"pointer"}}>Reintentar</button>
                </div>
              </div>
            ) : (
              <div style={{textAlign:"center",fontSize:11,color:N.verdeBorde}}>
                🔄 Datos actualizados desde Google Sheets · {fmtFecha(actualizado.ts)}
              </div>
            ))}
          </div>
        )}

        {/* ── RESIDENTE ── */}
        {vista==="residente" && (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{fontSize:12,color:N.textoMuted,fontWeight:700,
              textTransform:"uppercase",letterSpacing:1}}>
              Consulta tu Parcela
            </div>

            {/* Bienvenida */}
            {!resultado && (
              <div style={{...cardBase,textAlign:"center",padding:"24px 20px",
                borderColor:N.verdeBorde,background:N.verdeBg}}>
                <div style={{fontSize:36,marginBottom:10}}>👋</div>
                <div style={{fontSize:20,fontWeight:800,color:N.texto,marginBottom:8}}>
                  ¡Bienvenido/a!
                </div>
                <div style={{fontSize:15,color:N.textoMuted,lineHeight:1.6}}>
                  Aquí puedes consultar el estado de tus pagos.<br/>
                  Solo ingresa el{" "}
                  <strong style={{color:N.verdeClaro}}>número de tu parcela</strong>
                  {" "}y presiona{" "}
                  <strong style={{color:N.verdeClaro}}>Ir</strong>.
                </div>
              </div>
            )}

            {/* Buscador */}
            <div style={cardBase}>
              <div style={{fontSize:16,color:N.textoMuted,marginBottom:14,fontWeight:500}}>
                ¿Cuál es tu parcela?
              </div>
              <div style={{display:"flex",gap:10}}>
                <input
                  placeholder="Ej: 10, 46, 79B..."
                  value={parcela}
                  onChange={e=>{ setParcela(e.target.value); setError(""); setResultado(null); }}
                  onKeyDown={e=>e.key==="Enter" && buscar()}
                  style={{flex:1,padding:"14px 16px",borderRadius:12,
                    border:`2px solid ${N.borde}`,background:N.bgInput,
                    color:N.texto,fontSize:18,outline:"none",
                    WebkitAppearance:"none",fontWeight:600}}
                />
                <button onClick={buscar}
                  style={{padding:"14px 22px",background:N.verde,color:"#fff",border:"none",
                    borderRadius:12,cursor:"pointer",fontWeight:800,fontSize:18,
                    boxShadow:`0 4px 16px ${N.verde}55`,
                    WebkitTapHighlightColor:"transparent"}}>
                  Ir
                </button>
              </div>
              {error && (
                <div style={{marginTop:12,color:"#ff8a80",fontSize:15,
                  display:"flex",alignItems:"center",gap:8,
                  background:N.rojoBg,borderRadius:10,padding:"10px 14px",
                  border:`1px solid ${N.rojoBorde}`}}>
                  ⚠️ {error}
                </div>
              )}
            </div>

            {/* Resultado */}
            {resultado && (()=>{
              const r = resultado;
              const alDia = getEstado(r.pagos)==="Al Día";
              const totalPagado = r.pagos.reduce((s,v)=>s+v,0);
              return(
                <>
                  {/* Tarjeta estado */}
                  <div style={{...cardBase,
                    borderColor: alDia ? N.verdeBorde : N.rojoBorde,
                    background:  alDia ? N.verdeBg   : N.rojoBg}}>
                    <div style={{display:"flex",justifyContent:"space-between",
                      alignItems:"flex-start",gap:12}}>
                      <div>
                        <div style={{fontSize:13,color:N.textoMuted,marginBottom:4,
                          fontWeight:700,letterSpacing:.5}}>PARCELA</div>
                        <div style={{fontSize:56,fontWeight:900,lineHeight:1,
                          color: alDia ? N.verdeClaro : "#ef9a9a"}}>
                          {r.p}
                        </div>
                        <div style={{fontSize:15,color:N.amarillo,fontWeight:700,marginTop:10}}>
                          💵 Total pagado:<br/>
                          <span style={{fontSize:20}}>
                            ${totalPagado.toLocaleString("es-CL")}
                          </span>
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"}}>
                        <div style={{padding:"10px 18px",borderRadius:12,fontWeight:800,
                          fontSize:16,textAlign:"center",color:"#fff",
                          background:  alDia ? N.verde : N.rojo,
                          boxShadow: alDia
                            ? `0 4px 14px ${N.verde}55`
                            : `0 4px 14px ${N.rojo}55`}}>
                          {alDia ? "✅ Al Día" : "⚠️ Pendiente"}
                        </div>
                        {r.rifa>0 && (
                          <div style={{fontSize:14,color:"#f48fb1",background:"#2a0f1e",
                            padding:"8px 14px",borderRadius:10,
                            border:"1.5px solid #7b1f4a",fontWeight:700,textAlign:"center"}}>
                            🎟️ Rifa<br/>
                            <span style={{fontSize:17}}>
                              ${r.rifa.toLocaleString("es-CL")}
                            </span>
                          </div>
                        )}
                        {r.mant>0 && (
                          <div style={{fontSize:14,color:"#81d4fa",background:N.azulBg,
                            padding:"8px 14px",borderRadius:10,
                            border:`1.5px solid ${N.azulBorde}`,fontWeight:700,textAlign:"center"}}>
                            🔧 Mantención<br/>
                            <span style={{fontSize:17}}>
                              ${r.mant.toLocaleString("es-CL")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Grid meses */}
                  <div style={cardBase}>
                    <div style={{fontSize:16,fontWeight:800,marginBottom:16,color:N.texto}}>
                      Estado de Pagos
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                      {MESES.map((mes,i)=>{
                        const pago      = r.pagos[i];
                        const esVol     = i <= MES_VOL_HASTA;
                        const esOblVenc = i >= MES_OBL_DESDE && i < MES_ACTIVO;
                        const esPorVencer = i >= MES_ACTIVO;
                        const pagado    = pago > 0;
                        const pendiente = esOblVenc && !pagado;

                        let bg = N.bgCard2, borde = N.borde, textCol = N.textoMuted;
                        if(pagado)   { bg = N.verdeBg; borde = N.verdeBorde; textCol = N.verdeClaro; }
                        if(pendiente){ bg = N.rojoBg;  borde = N.rojoBorde;  textCol = "#ef9a9a"; }

                        return(
                          <div key={i} style={{borderRadius:12,padding:"12px 6px",
                            textAlign:"center",background:bg,border:`1.5px solid ${borde}`}}>
                            <div style={{fontSize:12,fontWeight:800,
                              color:N.textoMuted,marginBottom:2}}>{mes}</div>
                            {esVol && (
                              <div style={{fontSize:9,color:N.amarillo,
                                fontWeight:800,marginBottom:4}}>VOLUNTARIO</div>
                            )}
                            {esPorVencer && (
                              <div style={{fontSize:9,color:"#7a9a55",
                                fontWeight:800,marginBottom:4}}>POR VENCER</div>
                            )}
                            {!esVol && !esPorVencer && (
                              <div style={{fontSize:9,marginBottom:4}}>&nbsp;</div>
                            )}
                            <div style={{fontSize:22,margin:"2px 0"}}>
                              {pagado ? "✅" : pendiente ? "❌" : esPorVencer ? "🕐" : "—"}
                            </div>
                            <div style={{fontSize:11,color:textCol,fontWeight:700,marginTop:4}}>
                              {pagado
                                ? "$"+(pago/1000).toFixed(0)+"k"
                                : pendiente
                                  ? "Pendiente"
                                  : esPorVencer
                                    ? "Por vencer"
                                    : "No pagado"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
      <div style={{height:32}}/>
    </div>
  );
}

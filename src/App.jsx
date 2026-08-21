import { useState, useMemo, useEffect } from "react";

const SHEET_ID = "1UBjalKNQ1bt_qCiGgQ9BRbs2gtnEYjL-1D--Yicmrdg";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Hoja1`;

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

function parseNum(val){
  if(!val) return 0;
  const clean = val.toString().replace(/[$\.\s]/g,"").replace(",",".");
  const n = parseFloat(clean);
  return isNaN(n) ? 0 : n;
}

function parseCsv(text){
  const lines = text.trim().split("\n");
  const rows = lines.slice(1);
  return rows.map(line=>{
    const cols = line.split(",").map(c=>c.replace(/^"|"$/g,"").trim());
    const pagos = [
      parseNum(cols[4]),
      parseNum(cols[5]),
      parseNum(cols[6]),
      parseNum(cols[7]),
      parseNum(cols[8]),
      parseNum(cols[9]),
      parseNum(cols[10]),
      parseNum(cols[11]),
      parseNum(cols[12]),
      parseNum(cols[13]),
      parseNum(cols[14]),
      parseNum(cols[15]),
      parseNum(cols[16]),
    ];
    return {
      p: (cols[0]||"").replace(/\s+/g,"").toUpperCase(),
      n: cols[1]||"",
      rifa: parseNum(cols[2]),
      mant: parseNum(cols[3]),
      pagos,
    };
  }).filter(r=>r.p);
}

function getEstado(pagos){
  return pagos.slice(MES_OBL_DESDE,MES_ACTIVO).every(v=>v>0)?"Al Día":"Pendiente";
}

const N = {
  bgPage:"#1a1f12",bgCard:"#232b18",bgCard2:"#1e2614",bgInput:"#141a0d",
  verde:"#6a9e3f",verdeClaro:"#8bc34a",verdeBg:"#1d2e10",verdeBorde:"#4a7a25",
  rojo:"#c0392b",rojoBg:"#2e1010",rojoBorde:"#8b2020",
  amarillo:"#e6a817",azulBg:"#102030",azulBorde:"#2060a0",
  texto:"#e8ead4",textoMuted:"#9aaa7a",borde:"#3a4a25",
};

export default function App(){
  const [vista,setVista]=useState("dashboard");
  const [parcela,setParcela]=useState("");
  const [resultado,setResultado]=useState(null);
  const [error,setError]=useState("");
  const [raw,setRaw]=useState([]);
  const [cargando,setCargando]=useState(true);
  const [errorCarga,setErrorCarga]=useState("");

  useEffect(()=>{
    fetch(SHEET_URL)
      .then(r=>{
        if(!r.ok) throw new Error("No se pudo conectar");
        return r.text();
      })
      .then(text=>{
        setRaw(parseCsv(text));
        setCargando(false);
      })
      .catch(()=>{
        setErrorCarga("No se pudo cargar la planilla. Verifica la conexión.");
        setCargando(false);
      });
  },[]);

  const stats=useMemo(()=>({
    total:raw.length,
    alDia:raw.filter(r=>getEstado(r.pagos)==="Al Día").length,
    pendiente:raw.filter(r=>getEstado(r.pagos)==="Pendiente").length,
  }),[raw]);

  function buscar(){
    setError("");setResultado(null);
    const q=parcela.trim().toUpperCase().replace(/\s+/g,"");
    if(!q){setError("Ingresa el número de tu parcela.");return;}
    const f=raw.find(r=>r.p===q);
    if(!f){setError("Parcela no encontrada. Verifica el número.");return;}
    setResultado(f);
  }

  const cardBase={background:N.bgCard,borderRadius:16,border:`1.5px solid ${N.borde}`,padding:"20px"};

  if(cargando) return(
    <div style={{minHeight:"100vh",background:N.bgPage,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,color:N.texto,fontFamily:"'Segoe UI',sans-serif"}}>
      <div style={{fontSize:48}}>🌿</div>
      <div style={{fontSize:18,fontWeight:700,color:N.verdeClaro}}>COMUNIDAD LAS NIPAS</div>
      <div style={{fontSize:15,color:N.textoMuted}}>Cargando datos...</div>
      <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
    </div>
  );

  if(errorCarga) return(
    <div style={{minHeight:"100vh",background:N.bgPage,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,color:N.texto,fontFamily:"'Segoe UI',sans-serif",padding:24,textAlign:"center"}}>
      <div style={{fontSize:48}}>⚠️</div>
      <div style={{fontSize:16,color:"#ef9a9a"}}>{errorCarga}</div>
      <button onClick={()=>window.location.reload()} style={{marginTop:8,padding:"12px 24px",background:N.verde,color:"#fff",border:"none",borderRadius:12,fontSize:16,fontWeight:700,cursor:"pointer"}}>
        Reintentar
      </button>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:N.bgPage,color:N.texto,fontFamily:"'Segoe UI',system-ui,sans-serif",maxWidth:480,margin:"0 auto"}}>

      {/* HEADER */}
      <div style={{background:N.bgCard,borderBottom:`2px solid ${N.verde}`,padding:"16px 20px",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <img src="https://i.imgur.com/YmOYHXM.jpeg" alt="Logo"
            style={{width:48,height:48,borderRadius:12,objectFit:"cover",border:`2px solid ${N.verdeBorde}`}}
            onError={e=>{e.target.style.display="none";}}
          />
          <div>
            <div style={{fontWeight:800,fontSize:17,letterSpacing:.5,color:N.texto}}>COMUNIDAD LAS NIPAS</div>
            <div style={{fontSize:12,color:N.textoMuted,marginTop:1}}>Control de Aportes 2026 – 2027</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {[["dashboard","📊","Dashboard"],["residente","🏠","Mi Parcela"]].map(([v,ico,lbl])=>(
            <button key={v} onClick={()=>{setVista(v);setError("");setResultado(null);setParcela("");}} style={{
              flex:1,padding:"12px 8px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:15,
              transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:6,
              background:vista===v?N.verde:N.bgCard2,color:vista===v?"#fff":N.textoMuted,
              boxShadow:vista===v?`0 2px 12px ${N.verde}44`:"none",
            }}>{ico} {lbl}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"20px 16px"}}>

        {/* DASHBOARD */}
        {vista==="dashboard"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{fontSize:12,color:N.textoMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Resumen General</div>
            <div style={{...cardBase,textAlign:"center",padding:"36px 20px",background:`linear-gradient(135deg,${N.bgCard} 0%,${N.verdeBg} 100%)`,borderColor:N.verdeBorde}}>
              <div style={{fontSize:13,color:N.textoMuted,fontWeight:700,letterSpacing:.5,marginBottom:8}}>TOTAL PARCELAS</div>
              <div style={{fontSize:80,fontWeight:900,color:N.verdeClaro,lineHeight:1}}>{stats.total}</div>
              <div style={{fontSize:14,color:N.textoMuted,marginTop:8}}>registradas en el período</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div style={{...cardBase,textAlign:"center",padding:"24px 12px",borderColor:N.verdeBorde,background:N.verdeBg}}>
                <div style={{fontSize:40,marginBottom:8}}>✅</div>
                <div style={{fontSize:48,fontWeight:900,color:N.verdeClaro,lineHeight:1}}>{stats.alDia}</div>
                <div style={{fontSize:14,color:N.textoMuted,fontWeight:700,marginTop:8}}>Al Día</div>
              </div>
              <div style={{...cardBase,textAlign:"center",padding:"24px 12px",borderColor:N.rojoBorde,background:N.rojoBg}}>
                <div style={{fontSize:40,marginBottom:8}}>⚠️</div>
                <div style={{fontSize:48,fontWeight:900,color:"#e57373",lineHeight:1}}>{stats.pendiente}</div>
                <div style={{fontSize:14,color:N.textoMuted,fontWeight:700,marginTop:8}}>Con Pendientes</div>
              </div>
            </div>
            <div style={{textAlign:"center",fontSize:13,color:N.textoMuted,background:N.bgCard2,borderRadius:10,padding:"10px 14px",border:`1px solid ${N.borde}`}}>
              📅 Estado basado en meses obligatorios vencidos<br/>
              <strong style={{color:N.verde}}>Marzo — {MESES[MES_ACTIVO-1]} {MES_ACTIVO<=12?"2026":"2027"}</strong>
            </div>
            <div style={{textAlign:"center",fontSize:11,color:N.verdeBorde}}>
              🔄 Datos actualizados desde Google Sheets
            </div>
          </div>
        )}

        {/* RESIDENTE */}
        {vista==="residente"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{fontSize:12,color:N.textoMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Consulta tu Parcela</div>

            {!resultado&&(
              <div style={{...cardBase,textAlign:"center",padding:"24px 20px",borderColor:N.verdeBorde,background:N.verdeBg}}>
                <div style={{fontSize:36,marginBottom:10}}>👋</div>
                <div style={{fontSize:20,fontWeight:800,color:N.texto,marginBottom:8}}>¡Bienvenido/a!</div>
                <div style={{fontSize:15,color:N.textoMuted,lineHeight:1.6}}>
                  Aquí puedes consultar el estado de tus pagos.<br/>
                  Solo ingresa el <strong style={{color:N.verdeClaro}}>número de tu parcela</strong> y presiona <strong style={{color:N.verdeClaro}}>Ir</strong>.
                </div>
              </div>
            )}

            <div style={cardBase}>
              <div style={{fontSize:16,color:N.textoMuted,marginBottom:14,fontWeight:500}}>¿Cuál es tu parcela?</div>
              <div style={{display:"flex",gap:10}}>
                <input placeholder="Ej: 10, 46, 79B..."
                  value={parcela}
                  onChange={e=>{setParcela(e.target.value);setError("");setResultado(null);}}
                  onKeyDown={e=>e.key==="Enter"&&buscar()}
                  style={{flex:1,padding:"14px 16px",borderRadius:12,border:`2px solid ${N.borde}`,background:N.bgInput,color:N.texto,fontSize:18,outline:"none",WebkitAppearance:"none",fontWeight:600}}
                />
                <button onClick={buscar} style={{padding:"14px 22px",background:N.verde,color:"#fff",border:"none",borderRadius:12,cursor:"pointer",fontWeight:800,fontSize:18,boxShadow:`0 4px 16px ${N.verde}55`,WebkitTapHighlightColor:"transparent"}}>Ir</button>
              </div>
              {error&&(
                <div style={{marginTop:12,color:"#ff8a80",fontSize:15,display:"flex",alignItems:"center",gap:8,background:N.rojoBg,borderRadius:10,padding:"10px 14px",border:`1px solid ${N.rojoBorde}`}}>
                  ⚠️ {error}
                </div>
              )}
            </div>

            {resultado&&(()=>{
              const r=resultado;
              const alDia=getEstado(r.pagos)==="Al Día";
              const totalPagado=r.pagos.reduce((s,v)=>s+v,0);
              return(
                <>
                  <div style={{...cardBase,borderColor:alDia?N.verdeBorde:N.rojoBorde,background:alDia?N.verdeBg:N.rojoBg}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                      <div>
                        <div style={{fontSize:13,color:N.textoMuted,marginBottom:4,fontWeight:700,letterSpacing:.5}}>PARCELA</div>
                        <div style={{fontSize:56,fontWeight:900,color:alDia?N.verdeClaro:"#ef9a9a",lineHeight:1}}>{r.p}</div>
                        <div style={{fontSize:15,color:N.amarillo,fontWeight:700,marginTop:10}}>
                          💵 Total pagado:<br/>
                          <span style={{fontSize:20}}>${totalPagado.toLocaleString("es-CL")}</span>
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"}}>
                        <div style={{padding:"10px 18px",borderRadius:12,fontWeight:800,fontSize:16,textAlign:"center",background:alDia?N.verde:N.rojo,color:"#fff",boxShadow:alDia?`0 4px 14px ${N.verde}55`:`0 4px 14px ${N.rojo}55`}}>
                          {alDia?"✅ Al Día":"⚠️ Pendiente"}
                        </div>
                        {r.rifa>0&&(
                          <div style={{fontSize:14,color:"#f48fb1",background:"#2a0f1e",padding:"8px 14px",borderRadius:10,border:"1.5px solid #7b1f4a",fontWeight:700,textAlign:"center"}}>
                            🎟️ Rifa<br/><span style={{fontSize:17}}>${r.rifa.toLocaleString("es-CL")}</span>
                          </div>
                        )}
                        {r.mant>0&&(
                          <div style={{fontSize:14,color:"#81d4fa",background:N.azulBg,padding:"8px 14px",borderRadius:10,border:`1.5px solid ${N.azulBorde}`,fontWeight:700,textAlign:"center"}}>
                            🔧 Mantención<br/><span style={{fontSize:17}}>${r.mant.toLocaleString("es-CL")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={cardBase}>
                    <div style={{fontSize:16,fontWeight:800,marginBottom:16,color:N.texto}}>Estado de Pagos</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                      {MESES.map((mes,i)=>{
                        const pago=r.pagos[i];
                        const esVol=i<=MES_VOL_HASTA;
                        const esOblVenc=i>=MES_OBL_DESDE&&i<MES_ACTIVO;
                        const esPorVencer=i>=MES_ACTIVO;
                        const pagado=pago>0;
                        const pendiente=esOblVenc&&!pagado;
                        let bg=N.bgCard2,borde=N.borde,textCol=N.textoMuted;
                        if(pagado){bg=N.verdeBg;borde=N.verdeBorde;textCol=N.verdeClaro;}
                        else if(pendiente){bg=N.rojoBg;borde=N.rojoBorde;textCol="#ef9a9a";}
                        return(
                          <div key={i} style={{borderRadius:12,padding:"12px 6px",textAlign:"center",background:bg,border:`1.5px solid ${borde}`}}>
                            <div style={{fontSize:12,fontWeight:800,color:N.textoMuted,marginBottom:2}}>{mes}</div>
                            {esVol&&<div style={{fontSize:9,color:N.amarillo,fontWeight:800,marginBottom:4}}>VOLUNTARIO</div>}
                            {esPorVencer&&<div style={{fontSize:9,color:"#7a9a55",fontWeight:800,marginBottom:4}}>POR VENCER</div>}
                            {!esVol&&!esPorVencer&&<div style={{fontSize:9,color:"transparent",marginBottom:4}}>‎</div>}
                            <div style={{fontSize:22,margin:"2px 0"}}>
                              {pagado?"✅":pendiente?"❌":esPorVencer?"🕐":"—"}
                            </div>
                            <div style={{fontSize:11,color:textCol,fontWeight:700,marginTop:4}}>
                              {pagado?"$"+(pago/1000).toFixed(0)+"k":pendiente?"Pendiente":esPorVencer?"Por vencer":"No pagado"}
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
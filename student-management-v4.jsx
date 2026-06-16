import { useState, useRef, useCallback } from "react";

/* =====================================================================
   SVG ICON SYSTEM — Lucide-style stroked icons, no emoji
===================================================================== */
const I = {
  cap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  userPlus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  userCheck: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>,
  briefcase: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  eye: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  download: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  upload: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  fileJson: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/><path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"/></svg>,
  fileText: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  image: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  logOut: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  back: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  camera: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  share: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  menu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  warn: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  info: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  // gender icons
  male: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="14" r="5"/><path d="M21 3l-6.5 6.5"/><path d="M21 3h-5"/><path d="M21 3v5"/></svg>,
  female: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="5"/><line x1="12" y1="14" x2="12" y2="21"/><line x1="9" y1="18" x2="15" y2="18"/></svg>,
  // role icons
  teacher: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  director: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
  student: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
};

function Icon({ name, size=16, color="currentColor", style={} }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:size, height:size, flexShrink:0, color, ...style }}>
      {I[name] || null}
    </span>
  );
}

/* =====================================================================
   CONSTANTS
===================================================================== */
const ADMIN_PASS = "135790";
const SHARED_KEY = "edumanage_students_v3";
const ROLES = { teacher: "อาจารย์", director: "ผู้อำนวยการ", student: "นักเรียน" };

const MALE_SVG   = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%232563eb'/%3E%3Ccircle cx='50' cy='36' r='18' fill='%23bfdbfe'/%3E%3Cellipse cx='50' cy='95' rx='30' ry='22' fill='%231d4ed8'/%3E%3C/svg%3E`;
const FEMALE_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23ec4899'/%3E%3Ccircle cx='50' cy='36' r='18' fill='%23fce7f3'/%3E%3Cellipse cx='50' cy='95' rx='30' ry='22' fill='%23be185d'/%3E%3C/svg%3E`;
const OTHER_SVG  = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%238b5cf6'/%3E%3Ccircle cx='50' cy='36' r='18' fill='%23ede9fe'/%3E%3Cellipse cx='50' cy='95' rx='30' ry='22' fill='%236d28d9'/%3E%3C/svg%3E`;

const SAMPLE_STUDENTS = [
  {id:"s1",createdAt:Date.now(),firstName:"สมชาย",  lastName:"ใจดี",      number:1,studentId:"67001",class:"ม.1/1",gender:"ชาย",  birthdate:"2013-03-15",phone:"081-234-5678",address:"123 ถ.สุขุมวิท กรุงเทพฯ",photo:null,note:""},
  {id:"s2",createdAt:Date.now(),firstName:"มานี",    lastName:"รักเรียน",  number:2,studentId:"67002",class:"ม.1/1",gender:"หญิง", birthdate:"2013-07-20",phone:"082-345-6789",address:"456 ถ.พระราม 4 กรุงเทพฯ",photo:null,note:""},
  {id:"s3",createdAt:Date.now(),firstName:"วิชาญ",   lastName:"เก่งกล้า", number:3,studentId:"67003",class:"ม.1/1",gender:"ชาย",  birthdate:"2013-01-10",phone:"083-456-7890",address:"789 ถ.รัชดา กรุงเทพฯ",photo:null,note:""},
  {id:"s4",createdAt:Date.now(),firstName:"สุดา",    lastName:"แสนสวย",   number:1,studentId:"67004",class:"ม.1/2",gender:"หญิง", birthdate:"2013-05-25",phone:"084-567-8901",address:"101 ถ.ลาดพร้าว กรุงเทพฯ",photo:null,note:""},
  {id:"s5",createdAt:Date.now(),firstName:"ประสิทธิ์",lastName:"มากมี",    number:2,studentId:"67005",class:"ม.1/2",gender:"ชาย",  birthdate:"2013-09-08",phone:"085-678-9012",address:"202 ถ.งามวงศ์วาน นนทบุรี",photo:null,note:""},
  {id:"s6",createdAt:Date.now(),firstName:"รัตนา",   lastName:"ดีงาม",     number:3,studentId:"67006",class:"ม.1/2",gender:"หญิง", birthdate:"2013-11-30",phone:"086-789-0123",address:"303 ถ.บางนา สมุทรปราการ",photo:null,note:""},
  {id:"s7",createdAt:Date.now(),firstName:"ณัฐพล",   lastName:"ศรีสุข",   number:1,studentId:"67007",class:"ม.2/1",gender:"ชาย",  birthdate:"2012-04-18",phone:"087-890-1234",address:"404 ถ.เพชรเกษม กรุงเทพฯ",photo:null,note:""},
  {id:"s8",createdAt:Date.now(),firstName:"อรุณี",   lastName:"บุปผา",    number:2,studentId:"67008",class:"ม.2/1",gender:"หญิง", birthdate:"2012-06-12",phone:"088-901-2345",address:"505 ถ.สาทร กรุงเทพฯ",photo:null,note:""},
];

function genId() { return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
function calcAge(d){ if(!d) return "—"; return Math.floor((Date.now()-new Date(d))/(365.25*24*3600*1000))+" ปี"; }
function fmtDate(d){ if(!d) return "—"; return new Date(d).toLocaleDateString("th-TH",{year:"numeric",month:"long",day:"numeric"}); }
function genderAvatar(s){
  if(s.photo) return s.photo;
  if(s.gender==="ชาย") return MALE_SVG;
  if(s.gender==="หญิง") return FEMALE_SVG;
  return OTHER_SVG;
}

/* =====================================================================
   TOAST
===================================================================== */
function useToast(){
  const [toasts,setToasts]=useState([]);
  const show=useCallback((msg,type="info")=>{
    const id=genId();
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3200);
  },[]);
  return {toasts,show};
}

/* =====================================================================
   AVATAR
===================================================================== */
function Avatar({s,size=40,style={}}){
  return(
    <img src={genderAvatar(s)} alt=""
      style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:"2px solid rgba(255,255,255,0.15)",...style}}
    />
  );
}

/* =====================================================================
   GENDER BADGE
===================================================================== */
function GenderBadge({g,light=false}){
  const map={ชาย:["#2563eb","#dbeafe","male"],หญิง:["#be185d","#fce7f3","female"]};
  const[c,bg,ico]=map[g]||["#6d28d9","#ede9fe","info"];
  return(
    <span style={{padding:"3px 9px",borderRadius:999,background:light?"rgba(255,255,255,0.15)":bg,color:light?"#fff":c,fontSize:"0.73rem",fontWeight:700,border:light?"1px solid rgba(255,255,255,0.2)":"none",display:"inline-flex",alignItems:"center",gap:5}}>
      <Icon name={ico} size={12}/>{g}
    </span>
  );
}

/* =====================================================================
   CLASS BADGE — color by grade level
===================================================================== */
const CLASS_COLORS={
  "ม.1":["#0e7490","#ecfeff","#a5f3fc"],
  "ม.2":["#7c3aed","#f5f3ff","#ddd6fe"],
  "ม.3":["#b45309","#fffbeb","#fde68a"],
  "ม.4":["#065f46","#ecfdf5","#a7f3d0"],
  "ม.5":["#9d174d","#fdf2f8","#fbcfe8"],
  "ม.6":["#1e3a8a","#eff6ff","#bfdbfe"],
};
function ClassBadge({cls,light=false}){
  if(!cls) return null;
  const grade=cls.match(/(ม\.\d)/)?.[1]||"";
  const[tc,bg,border]=CLASS_COLORS[grade]||["#475569","#f1f5f9","#e2e8f0"];
  return(
    <span style={{
      padding:"3px 9px",borderRadius:999,
      background:light?"rgba(255,255,255,0.18)":bg,
      color:light?"#fff":tc,
      fontSize:"0.72rem",fontWeight:800,letterSpacing:0.3,
      border:light?`1px solid rgba(255,255,255,0.25)`:`1px solid ${border}`,
      display:"inline-flex",alignItems:"center",gap:5,whiteSpace:"nowrap"
    }}>
      <Icon name="cap" size={11}/>{cls}
    </span>
  );
}

/* =====================================================================
   STATUS CHIPS — photo, note
===================================================================== */
function StatusChips({s,light=false}){
  const chips=[];
  if(s.photo) chips.push({icon:"camera",label:"มีรูป",  color:"#059669",bg:"#ecfdf5",border:"#a7f3d0"});
  if(s.note)  chips.push({icon:"info",  label:"มีโน้ต",color:"#d97706",bg:"#fffbeb",border:"#fde68a"});
  if(!chips.length) return null;
  return(
    <span style={{display:"inline-flex",gap:4,flexWrap:"wrap"}}>
      {chips.map(({icon,label,color,bg,border})=>(
        <span key={label} style={{
          padding:"2px 7px",borderRadius:999,
          background:light?"rgba(255,255,255,0.15)":bg,
          color:light?"rgba(255,255,255,0.9)":color,
          fontSize:"0.67rem",fontWeight:700,
          border:light?"1px solid rgba(255,255,255,0.2)":`1px solid ${border}`,
          display:"inline-flex",alignItems:"center",gap:4
        }}>
          <Icon name={icon} size={10}/>{label}
        </span>
      ))}
    </span>
  );
}

/* =====================================================================
   ICON BUTTON
===================================================================== */
function IBtn({name,title,onClick,bg="#eff6ff",tc="#1d4ed8",size=30}){
  const[hov,setHov]=useState(false);
  return(
    <button title={title} onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{width:size,height:size,borderRadius:8,border:"none",background:hov?"#e2e8f0":bg,color:tc,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .15s"}}>
      <Icon name={name} size={14}/>
    </button>
  );
}

/* =====================================================================
   LOGIN SCREEN
===================================================================== */
function LoginScreen({onLogin}){
  const[role,setRole]=useState("teacher");
  const[pass,setPass]=useState("");
  const[err,setErr]=useState("");
  const[loading,setLoading]=useState(false);

  const ROLE_DEFS=[
    ["teacher","teacher","อาจารย์"],
    ["director","director","ผู้อำนวยการ"],
    ["student","student","นักเรียน"],
  ];

  const submit=async()=>{
    setErr(""); setLoading(true);
    await new Promise(r=>setTimeout(r,400));
    setLoading(false);
    if(role==="student") onLogin({role:"student",studentId:pass.trim()});
    else { if(pass===ADMIN_PASS) onLogin({role}); else setErr("รหัสผ่านไม่ถูกต้อง"); }
  };

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#060d1f 0%,#0f172a 50%,#1e1b4b 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Noto Sans Thai','Inter',sans-serif"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(60,100,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(60,100,255,.04) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none"}}/>
      <div style={{position:"relative",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:28,padding:"44px 40px",width:"100%",maxWidth:420,backdropFilter:"blur(24px)",boxShadow:"0 32px 80px rgba(0,0,0,0.5)"}}>

        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{width:64,height:64,background:"linear-gradient(135deg,#2563eb,#38bdf8)",borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:"0 8px 32px rgba(37,99,235,0.5)",color:"#fff"}}>
            <Icon name="cap" size={30}/>
          </div>
          <h1 style={{color:"#fff",fontSize:"1.6rem",fontWeight:900,margin:0,letterSpacing:-1}}>EduManage</h1>
          <p style={{color:"rgba(148,180,255,0.6)",fontSize:"0.82rem",marginTop:6}}>ระบบจัดการข้อมูลนักเรียน</p>
        </div>

        {/* Role tabs */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:24}}>
          {ROLE_DEFS.map(([r,ico,lbl])=>(
            <button key={r} onClick={()=>{setRole(r);setPass("");setErr("");}}
              style={{padding:"12px 6px",borderRadius:12,border:`2px solid ${role===r?"#2563eb":"rgba(255,255,255,0.1)"}`,background:role===r?"rgba(37,99,235,0.2)":"transparent",color:role===r?"#60a5fa":"rgba(255,255,255,0.4)",cursor:"pointer",transition:"all .2s",fontSize:"0.78rem",fontWeight:600,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
              <Icon name={ico} size={22}/>
              {lbl}
            </button>
          ))}
        </div>

        <div style={{marginBottom:8}}>
          <label style={{display:"block",color:"rgba(148,180,255,0.8)",fontSize:"0.8rem",fontWeight:700,marginBottom:8}}>
            {role==="student"?"เลขประจำตัวนักเรียน":"รหัสผ่าน"}
          </label>
          <input
            type={role==="student"?"text":"password"}
            value={pass} onChange={e=>{setPass(e.target.value);setErr("");}}
            onKeyDown={e=>e.key==="Enter"&&submit()}
            placeholder={role==="student"?"กรอกเลขประจำตัว เช่น 67001":"กรอกรหัสผ่าน"}
            style={{width:"100%",padding:"13px 16px",borderRadius:12,border:`1.5px solid ${err?"#f87171":"rgba(255,255,255,0.15)"}`,background:"rgba(255,255,255,0.07)",color:"#fff",fontSize:"0.95rem",outline:"none",boxSizing:"border-box",transition:"border-color .2s",fontFamily:"inherit"}}
          />
          {err&&<p style={{color:"#f87171",fontSize:"0.78rem",marginTop:6}}>{err}</p>}
        </div>

        <button onClick={submit} disabled={!pass||loading}
          style={{width:"100%",padding:14,borderRadius:12,border:"none",background:(!pass||loading)?"rgba(37,99,235,0.3)":"linear-gradient(135deg,#2563eb,#1d4ed8)",color:(!pass||loading)?"rgba(255,255,255,0.35)":"#fff",fontSize:"0.95rem",fontWeight:700,cursor:(!pass||loading)?"not-allowed":"pointer",marginTop:8,transition:"all .2s",boxShadow:(!pass||loading)?"none":"0 4px 20px rgba(37,99,235,0.4)",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"inherit"}}>
          {loading?<><Icon name="refresh" size={16}/> กำลังตรวจสอบ...</>:<><Icon name="check" size={16}/> เข้าสู่ระบบ</>}
        </button>

        <p style={{textAlign:"center",color:"rgba(148,180,255,0.3)",fontSize:"0.72rem",marginTop:20}}>
          {role==="student"?"นักเรียนสามารถดูข้อมูลได้เท่านั้น":"อาจารย์ / ผอ. สามารถแก้ไขข้อมูลได้ทุกอย่าง"}
        </p>
      </div>
    </div>
  );
}

/* =====================================================================
   EXPORT IMAGE MODAL
===================================================================== */
function ExportImageModal({student,onClose}){
  const cardRef=useRef();
  const gColor=student.gender==="ชาย"?"#2563eb":student.gender==="หญิง"?"#ec4899":"#8b5cf6";

  const downloadCard=async()=>{
    try{
      const mod=await import("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.esm.min.js").catch(()=>({default:null}));
      if(!mod.default){window.print();return;}
      const canvas=await mod.default(cardRef.current,{scale:2,backgroundColor:null,useCORS:true});
      const a=document.createElement("a");
      a.href=canvas.toDataURL("image/png");
      a.download=`student_${student.studentId}.png`;
      a.click();
    }catch{window.print();}
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(8,15,40,0.85)",backdropFilter:"blur(12px)",zIndex:900,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Noto Sans Thai','Inter',sans-serif"}}>
      <div style={{background:"#fff",borderRadius:24,maxWidth:480,width:"100%",boxShadow:"0 32px 80px rgba(0,0,0,0.4)"}}>
        <div style={{padding:"18px 24px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <strong style={{color:"#0f172a",fontSize:"0.97rem",display:"flex",alignItems:"center",gap:8}}><Icon name="image" size={18} color="#2563eb"/> บัตรประจำตัวนักเรียน</strong>
          <button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center",padding:4}}><Icon name="x" size={20}/></button>
        </div>
        <div style={{padding:24}}>
          <div ref={cardRef} style={{background:`linear-gradient(135deg,${gColor},${gColor}cc)`,borderRadius:16,padding:"28px 24px",color:"#fff",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-40,right:-40,width:140,height:140,background:"rgba(255,255,255,0.08)",borderRadius:"50%"}}/>
            <div style={{position:"absolute",bottom:-30,left:-30,width:100,height:100,background:"rgba(255,255,255,0.06)",borderRadius:"50%"}}/>
            <div style={{display:"flex",gap:20,alignItems:"center",position:"relative",zIndex:1}}>
              <img src={genderAvatar(student)} alt="" style={{width:80,height:80,borderRadius:"50%",border:"3px solid rgba(255,255,255,0.4)",objectFit:"cover"}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:"0.65rem",fontWeight:700,opacity:0.65,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>EduManage · บัตรนักเรียน</div>
                <div style={{fontSize:"1.3rem",fontWeight:900,lineHeight:1.2}}>{student.firstName} {student.lastName}</div>
                <div style={{display:"flex",gap:6,alignItems:"center",marginTop:6,flexWrap:"wrap"}}>
                  <ClassBadge cls={student.class} light/>
                  <span style={{fontSize:"0.78rem",opacity:0.75}}>เลขที่ {student.number}</span>
                </div>
                <div style={{marginTop:8,background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"4px 10px",display:"inline-block",fontSize:"0.78rem",fontWeight:700}}>รหัส {student.studentId}</div>
              </div>
            </div>
            <div style={{marginTop:20,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,position:"relative",zIndex:1}}>
              {[["เพศ",student.gender],["วันเกิด",fmtDate(student.birthdate)],["อายุ",calcAge(student.birthdate)],["เบอร์โทร",student.phone||"—"]].map(([l,v])=>(
                <div key={l} style={{background:"rgba(255,255,255,0.12)",borderRadius:10,padding:"10px 12px"}}>
                  <div style={{fontSize:"0.62rem",opacity:0.6,fontWeight:700,marginBottom:2}}>{l}</div>
                  <div style={{fontSize:"0.84rem",fontWeight:700}}>{v}</div>
                </div>
              ))}
            </div>
            {student.address&&(
              <div style={{marginTop:10,background:"rgba(255,255,255,0.12)",borderRadius:10,padding:"10px 12px",position:"relative",zIndex:1}}>
                <div style={{fontSize:"0.62rem",opacity:0.6,fontWeight:700,marginBottom:2}}>ที่อยู่</div>
                <div style={{fontSize:"0.8rem",fontWeight:600}}>{student.address}</div>
              </div>
            )}
          </div>
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <button onClick={downloadCard} style={{flex:1,padding:12,borderRadius:10,border:"none",background:"linear-gradient(135deg,#2563eb,#1d4ed8)",color:"#fff",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"inherit"}}>
              <Icon name="download" size={16}/> บันทึกเป็นรูปภาพ
            </button>
            <button onClick={onClose} style={{padding:"12px 20px",borderRadius:10,border:"1.5px solid #e2e8f0",background:"#fff",color:"#475569",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>ปิด</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   EXPORT OPTIONS MODAL
===================================================================== */
function ExportStudentRow({student,onClose}){
  const[show,setShow]=useState(false);
  return(
    <>
      <button onClick={()=>setShow(true)} style={{padding:"8px 12px",borderRadius:10,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",display:"flex",gap:10,alignItems:"center",textAlign:"left",width:"100%",fontFamily:"inherit"}}>
        <Avatar s={student} size={32}/>
        <div>
          <div style={{fontWeight:600,fontSize:"0.82rem",color:"#0f172a"}}>{student.firstName} {student.lastName}</div>
          <div style={{fontSize:"0.72rem",color:"#64748b"}}>{student.class} · {student.studentId}</div>
        </div>
      </button>
      {show&&<ExportImageModal student={student} onClose={()=>{setShow(false);onClose();}}/>}
    </>
  );
}

function ExportModal({students,onClose,toast}){
  const[selected,setSelected]=useState(null);

  const exportJSON=()=>{
    if(!students.length){toast("ไม่มีข้อมูล","error");return;}
    const b=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),count:students.length,students},null,2)],{type:"application/json"});
    const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="students.json";a.click();
    toast("ส่งออก JSON เรียบร้อย","success");onClose();
  };
  const exportCSV=()=>{
    if(!students.length){toast("ไม่มีข้อมูล","error");return;}
    const h=["เลขที่","เลขประจำตัว","ชื่อ","นามสกุล","ชั้น/ห้อง","เพศ","วันเกิด","เบอร์โทร","ที่อยู่"];
    const rows=students.map(s=>[s.number,s.studentId,s.firstName,s.lastName,s.class,s.gender,s.birthdate,s.phone,s.address].map(v=>`"${(v||"").toString().replace(/"/g,'""')}"`).join(","));
    const b=new Blob(["\uFEFF"+[h.join(","),...rows].join("\n")],{type:"text/csv;charset=utf-8;"});
    const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="students.csv";a.click();
    toast("ส่งออก CSV เรียบร้อย","success");onClose();
  };

  const OPTIONS=[
    {id:"json",icon:"fileJson",label:"JSON",desc:"สำรองข้อมูลสำหรับนำเข้าระบบ",fn:exportJSON},
    {id:"csv", icon:"fileText",label:"CSV / Excel",desc:"ตาราง เปิดด้วย Microsoft Excel ได้",fn:exportCSV},
    {id:"img", icon:"image",   label:"บัตรนักเรียน (รูปภาพ)",desc:"เลือกนักเรียน แล้วบันทึกเป็นไฟล์ภาพ PNG",fn:()=>setSelected("img")},
  ];

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(8,15,40,0.75)",backdropFilter:"blur(10px)",zIndex:800,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Noto Sans Thai','Inter',sans-serif"}}>
      <div style={{background:"#fff",borderRadius:24,maxWidth:420,width:"100%",boxShadow:"0 32px 80px rgba(0,0,0,0.35)"}}>
        <div style={{padding:"18px 24px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <strong style={{color:"#0f172a",fontSize:"1rem",display:"flex",alignItems:"center",gap:8}}><Icon name="share" size={18} color="#2563eb"/> ส่งออกข้อมูล</strong>
          <button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",color:"#64748b",display:"flex",padding:4}}><Icon name="x" size={20}/></button>
        </div>
        <div style={{padding:24}}>
          <p style={{color:"#64748b",fontSize:"0.83rem",marginBottom:14}}>{students.length} รายการ · เลือกรูปแบบที่ต้องการ</p>
          {OPTIONS.map(({id,icon,label,desc,fn})=>(
            <button key={id} onClick={fn}
              style={{width:"100%",padding:"14px 16px",borderRadius:14,border:`2px solid ${selected===id?"#2563eb":"#e2e8f0"}`,background:selected===id?"#eff6ff":"#fff",marginBottom:10,cursor:"pointer",textAlign:"left",display:"flex",gap:14,alignItems:"center",transition:"all .15s",fontFamily:"inherit"}}>
              <span style={{width:40,height:40,borderRadius:10,background:selected===id?"#dbeafe":"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:selected===id?"#2563eb":"#64748b"}}>
                <Icon name={icon} size={20}/>
              </span>
              <div>
                <div style={{fontWeight:700,color:"#0f172a",fontSize:"0.88rem"}}>{label}</div>
                <div style={{color:"#64748b",fontSize:"0.76rem",marginTop:2}}>{desc}</div>
              </div>
            </button>
          ))}
          {selected==="img"&&(
            <div style={{marginTop:4,padding:16,background:"#f8fafc",borderRadius:12,border:"1px solid #e2e8f0"}}>
              <p style={{color:"#475569",fontSize:"0.8rem",marginBottom:10,fontWeight:700}}>เลือกนักเรียนที่ต้องการส่งออก</p>
              <div style={{maxHeight:200,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
                {students.map(s=><ExportStudentRow key={s.id} student={s} onClose={onClose}/>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   STUDENT FORM MODAL
===================================================================== */
function StudentModal({student,onSave,onClose}){
  const[form,setForm]=useState(student?{...student}:{firstName:"",lastName:"",number:"",studentId:"",class:"",gender:"",birthdate:"",phone:"",address:"",photo:null,note:""});
  const[errors,setErrors]=useState({});
  const[avatarData,setAvatarData]=useState(student?.photo||null);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  const validate=()=>{
    const e={};
    if(!form.firstName.trim()) e.firstName="กรุณากรอกชื่อ";
    if(!form.lastName.trim())  e.lastName="กรุณากรอกนามสกุล";
    if(!form.number)           e.number="กรุณากรอกเลขที่";
    if(!form.studentId.trim()) e.studentId="กรุณากรอกเลขประจำตัว";
    if(!form.class.trim())     e.class="กรุณากรอกชั้น/ห้อง";
    if(!form.gender)           e.gender="กรุณาเลือกเพศ";
    setErrors(e); return !Object.keys(e).length;
  };

  const submit=()=>{ if(!validate()) return; onSave({...form,photo:avatarData}); };

  const handlePhoto=(e)=>{
    const f=e.target.files[0]; if(!f) return;
    if(f.size>2*1024*1024){alert("ไฟล์ใหญ่เกิน 2MB");return;}
    const r=new FileReader();
    r.onload=ev=>setAvatarData(ev.target.result);
    r.readAsDataURL(f); e.target.value="";
  };

  const FG=({k,label,placeholder,type="text",req=false})=>(
    <div style={{marginBottom:14}}>
      <label style={{display:"block",fontSize:"0.77rem",fontWeight:700,color:"#475569",marginBottom:5}}>{label}{req&&<span style={{color:"#ef4444",marginLeft:2}}>*</span>}</label>
      <input type={type} value={form[k]||""} onChange={e=>set(k,e.target.value)} placeholder={placeholder}
        style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${errors[k]?"#f87171":"#e2e8f0"}`,fontSize:"0.87rem",color:"#0f172a",background:"#f8fafc",outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"border-color .15s"}}/>
      {errors[k]&&<span style={{color:"#f87171",fontSize:"0.72rem"}}>{errors[k]}</span>}
    </div>
  );

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(8,15,40,0.7)",backdropFilter:"blur(12px)",zIndex:700,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Noto Sans Thai','Inter',sans-serif"}}>
      <div style={{background:"#fff",borderRadius:24,width:"100%",maxWidth:640,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 32px 80px rgba(0,0,0,0.4)"}}>
        <div style={{padding:"20px 28px 16px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#fff",zIndex:10}}>
          <strong style={{fontSize:"1rem",color:"#0f172a",display:"flex",alignItems:"center",gap:8}}>
            <Icon name={student?"edit":"userPlus"} size={18} color="#2563eb"/>
            {student?"แก้ไขข้อมูลนักเรียน":"เพิ่มนักเรียนใหม่"}
          </strong>
          <button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",color:"#64748b",padding:4,display:"flex"}}><Icon name="x" size={20}/></button>
        </div>
        <div style={{padding:"22px 28px"}}>
          {/* Avatar row */}
          <div style={{display:"flex",alignItems:"center",gap:16,padding:16,background:"#f8fafc",borderRadius:14,border:"1.5px dashed #e2e8f0",marginBottom:22}}>
            <img src={avatarData||genderAvatar({...form,photo:avatarData})} alt="" style={{width:64,height:64,borderRadius:"50%",objectFit:"cover",border:"2px solid #bfdbfe",flexShrink:0}}/>
            <div>
              <label htmlFor="photoUpload" style={{display:"inline-flex",alignItems:"center",gap:7,padding:"8px 14px",background:"#eff6ff",color:"#1d4ed8",borderRadius:8,fontWeight:700,fontSize:"0.8rem",cursor:"pointer",border:"1.5px solid #bfdbfe"}}>
                <Icon name="camera" size={14}/> อัปโหลดรูปโปรไฟล์
              </label>
              <input id="photoUpload" type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
              {avatarData&&<button onClick={()=>setAvatarData(null)} style={{marginLeft:8,padding:"8px 12px",background:"none",border:"1px solid #e2e8f0",borderRadius:8,color:"#64748b",cursor:"pointer",fontSize:"0.78rem",fontFamily:"inherit"}}>ลบรูป</button>}
              <p style={{color:"#94a3b8",fontSize:"0.72rem",marginTop:5}}>หากไม่มีรูป ระบบจะใช้ไอคอนเพศอัตโนมัติ</p>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
            <FG k="firstName" label="ชื่อ" placeholder="ชื่อ" req/>
            <FG k="lastName"  label="นามสกุล" placeholder="นามสกุล" req/>
            <FG k="number"    label="เลขที่" placeholder="1" type="number" req/>
            <FG k="studentId" label="เลขประจำตัวนักเรียน" placeholder="เช่น 67001" req/>
            <FG k="class"     label="ชั้น/ห้อง" placeholder="เช่น ม.1/1" req/>
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:"0.77rem",fontWeight:700,color:"#475569",marginBottom:5}}>เพศ<span style={{color:"#ef4444",marginLeft:2}}>*</span></label>
              <select value={form.gender} onChange={e=>set("gender",e.target.value)}
                style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${errors.gender?"#f87171":"#e2e8f0"}`,fontSize:"0.87rem",color:"#0f172a",background:"#f8fafc",outline:"none",fontFamily:"inherit"}}>
                <option value="">เลือกเพศ</option>
                <option>ชาย</option><option>หญิง</option><option>อื่นๆ</option>
              </select>
              {errors.gender&&<span style={{color:"#f87171",fontSize:"0.72rem"}}>{errors.gender}</span>}
            </div>
            <FG k="birthdate" label="วันเกิด" placeholder="" type="date"/>
            <FG k="phone"     label="เบอร์โทรศัพท์" placeholder="0xx-xxx-xxxx" type="tel"/>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:"0.77rem",fontWeight:700,color:"#475569",marginBottom:5}}>ที่อยู่</label>
            <textarea value={form.address||""} onChange={e=>set("address",e.target.value)} rows={3} placeholder="ที่อยู่ปัจจุบัน"
              style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:"0.87rem",color:"#0f172a",background:"#f8fafc",resize:"vertical",boxSizing:"border-box",fontFamily:"inherit",outline:"none"}}/>
          </div>
          <div>
            <label style={{display:"block",fontSize:"0.77rem",fontWeight:700,color:"#475569",marginBottom:5}}>หมายเหตุ</label>
            <textarea value={form.note||""} onChange={e=>set("note",e.target.value)} rows={2} placeholder="โรคประจำตัว ข้อมูลพิเศษ ฯลฯ"
              style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:"0.87rem",color:"#0f172a",background:"#f8fafc",resize:"vertical",boxSizing:"border-box",fontFamily:"inherit",outline:"none"}}/>
          </div>
        </div>
        <div style={{padding:"14px 28px 22px",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"flex-end",gap:10}}>
          <button onClick={onClose} style={{padding:"10px 20px",borderRadius:10,border:"1.5px solid #e2e8f0",background:"#fff",color:"#475569",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>ยกเลิก</button>
          <button onClick={submit}  style={{padding:"10px 24px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#2563eb,#1d4ed8)",color:"#fff",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 14px rgba(37,99,235,0.35)",fontFamily:"inherit"}}>
            <Icon name="check" size={15}/> บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   SMALL HELPERS
===================================================================== */
function Section({title,children}){
  return(
    <div style={{marginBottom:20}}>
      <div style={{fontSize:"0.7rem",fontWeight:800,textTransform:"uppercase",letterSpacing:2,color:"#2563eb",marginBottom:12,paddingBottom:8,borderBottom:"2px solid #dbeafe"}}>{title}</div>
      {children}
    </div>
  );
}
function Grid2({children}){ return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{children}</div>; }
function Field({label,value,full=false}){
  return(
    <div style={full?{gridColumn:"1/-1"}:{}}>
      <div style={{fontSize:"0.67rem",fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#94a3b8",marginBottom:3}}>{label}</div>
      <div style={{fontWeight:600,color:"#0f172a",fontSize:"0.9rem"}}>{value||"—"}</div>
    </div>
  );
}
function PgBtn({label,disabled,active,onClick}){
  return(
    <button onClick={onClick} disabled={disabled}
      style={{width:32,height:32,borderRadius:8,border:`1.5px solid ${active?"#2563eb":"#e2e8f0"}`,background:active?"#2563eb":"#fff",color:active?"#fff":disabled?"#cbd5e1":"#475569",fontWeight:700,fontSize:"0.8rem",cursor:disabled?"not-allowed":"pointer",transition:"all .15s",fontFamily:"inherit"}}>
      {label}
    </button>
  );
}

/* =====================================================================
   MAIN APP
===================================================================== */
export default function App(){
  const[session,setSession]=useState(null);
  const[students,setStudents]=useState([]);
  const[loading,setLoading]=useState(false);
  const[view,setView]=useState("dashboard");
  const[search,setSearch]=useState("");
  const[filterClass,setFilterClass]=useState("");
  const[filterGender,setFilterGender]=useState("");
  const[sortBy,setSortBy]=useState("number_asc");
  const[page,setPage]=useState(1);
  const[detail,setDetail]=useState(null);
  const[editModal,setEditModal]=useState(null);
  const[confirmDel,setConfirmDel]=useState(null);
  const[showExport,setShowExport]=useState(false);
  const[showExportImg,setShowExportImg]=useState(null);
  const[sideOpen,setSideOpen]=useState(false);
  const{toasts,show:toast}=useToast();
  const PAGE_SIZE=10;
  const canEdit=session&&(session.role==="teacher"||session.role==="director");

  /* ── load from shared storage ── */
  const loadStudents=useCallback(async()=>{
    setLoading(true);
    try{
      const res=await window.storage.get(SHARED_KEY,true);
      if(res&&res.value) setStudents(JSON.parse(res.value));
      else{ await window.storage.set(SHARED_KEY,JSON.stringify(SAMPLE_STUDENTS),true); setStudents(SAMPLE_STUDENTS); }
    }catch{setStudents(SAMPLE_STUDENTS);}
    setLoading(false);
  },[]);

  const saveStudents=useCallback(async(newList)=>{
    setStudents(newList);
    try{ await window.storage.set(SHARED_KEY,JSON.stringify(newList),true); }
    catch{ toast("บันทึกไม่สำเร็จ","error"); }
  },[toast]);

  const[effect,setEffect]=useState(false);
  if(!effect){ setEffect(true); }

  const handleLoginWithValidation=async(sess)=>{
    if(sess.role==="student"){
      setLoading(true);
      try{
        const res=await window.storage.get(SHARED_KEY,true).catch(()=>null);
        const list=res?JSON.parse(res.value):SAMPLE_STUDENTS;
        const found=list.find(s=>s.studentId===sess.studentId);
        setLoading(false);
        if(!found){setSession({...sess,invalid:true});return;}
        setSession({...sess,studentData:found});
      }catch{setLoading(false);setSession(sess);}
    }else{setSession(sess);}
  };

  // load students after session set
  const prevSession=useRef(null);
  if(session&&!session.invalid&&prevSession.current!==session){
    prevSession.current=session;
    loadStudents();
  }

  if(session?.invalid) return(
    <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Noto Sans Thai','Inter',sans-serif"}}>
      <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:36,textAlign:"center",color:"#fff",maxWidth:360}}>
        <div style={{width:60,height:60,borderRadius:"50%",background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",color:"#f87171"}}><Icon name="warn" size={28}/></div>
        <h2 style={{marginBottom:8,fontSize:"1.1rem"}}>ไม่พบข้อมูล</h2>
        <p style={{color:"rgba(148,180,255,0.6)",marginBottom:22,fontSize:"0.85rem"}}>ไม่พบเลขประจำตัวนักเรียนนี้ในระบบ</p>
        <button onClick={()=>setSession(null)} style={{padding:"10px 24px",borderRadius:10,border:"none",background:"#2563eb",color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:8}}>
          <Icon name="back" size={15}/> กลับ
        </button>
      </div>
    </div>
  );

  if(!session) return <LoginScreen onLogin={handleLoginWithValidation}/>;

  /* ── filter & sort ── */
  const filtered=(()=>{
    let list=students;
    if(session.role==="student"&&session.studentData) list=[session.studentData];
    const q=search.toLowerCase();
    list=list.filter(s=>{
      const mq=!q||[s.firstName,s.lastName,s.studentId,s.class,String(s.number||"")].some(v=>(v||"").toLowerCase().includes(q));
      return mq&&(!filterClass||s.class===filterClass)&&(!filterGender||s.gender===filterGender);
    });
    list.sort((a,b)=>{
      if(sortBy==="number_asc")  return (a.number||0)-(b.number||0);
      if(sortBy==="number_desc") return (b.number||0)-(a.number||0);
      if(sortBy==="name_asc")    return (a.firstName||"").localeCompare(b.firstName||"","th");
      if(sortBy==="name_desc")   return (b.firstName||"").localeCompare(a.firstName||"","th");
      return 0;
    });
    return list;
  })();

  const totalPg=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));
  const paginated=filtered.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
  const classes=[...new Set(students.map(s=>s.class).filter(Boolean))].sort();
  const males=students.filter(s=>s.gender==="ชาย").length;
  const females=students.filter(s=>s.gender==="หญิง").length;

  /* ── CRUD ── */
  const handleSave=async(form)=>{
    let newList;
    if(editModal&&editModal!=="new"){ newList=students.map(s=>s.id===editModal.id?{...s,...form}:s); toast("แก้ไขข้อมูลเรียบร้อย","success"); }
    else{ newList=[...students,{id:genId(),createdAt:Date.now(),...form}]; toast("เพิ่มนักเรียนเรียบร้อย","success"); }
    await saveStudents(newList);
    setEditModal(null);
    if(detail&&editModal!=="new") setDetail(newList.find(s=>s.id===editModal.id));
  };
  const handleDelete=async()=>{
    const newList=students.filter(s=>s.id!==confirmDel);
    await saveStudents(newList); toast("ลบข้อมูลเรียบร้อย","info");
    setConfirmDel(null);
    if(detail?.id===confirmDel){setDetail(null);setView("students");}
  };
  const handleImport=(e)=>{
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=async ev=>{
      try{
        const d=JSON.parse(ev.target.result);
        const imp=Array.isArray(d)?d:(d.students||[]);
        let added=0; const newList=[...students];
        imp.forEach(s=>{if(!s.id)s.id=genId();if(!newList.find(x=>x.id===s.id)){newList.push(s);added++;}});
        await saveStudents(newList); toast(`นำเข้าสำเร็จ ${added} รายการ`,"success");
      }catch{toast("ไฟล์ไม่ถูกต้อง","error");}
    };
    r.readAsText(f,"utf-8"); e.target.value="";
  };

  const roleBg=session.role==="director"?"#7c3aed":session.role==="teacher"?"#0284c7":"#059669";
  const roleIcon=session.role==="director"?"director":session.role==="teacher"?"teacher":"student";

  /* ──────────────────── SIDEBAR ──────────────────── */
  const NAV_ITEMS=[
    {v:"dashboard",icon:"home",label:"แดชบอร์ด"},
    {v:"students", icon:"users",label:"รายชื่อนักเรียน"},
  ];

  const Sidebar=()=>(
    <>
      {sideOpen&&<div onClick={()=>setSideOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:190}}/>}
      <aside style={{position:"fixed",top:0,left:0,bottom:0,width:240,background:"linear-gradient(180deg,rgba(10,16,40,0.98),rgba(6,10,28,0.99))",borderRight:"1px solid rgba(99,140,255,0.12)",display:"flex",flexDirection:"column",zIndex:200,transform:sideOpen?"translateX(0)":"translateX(0)",transition:"transform .25s",boxShadow:"6px 0 48px rgba(0,0,0,0.5)",fontFamily:"'Noto Sans Thai','Inter',sans-serif"}}>

        {/* Logo */}
        <div style={{padding:"20px 18px",borderBottom:"1px solid rgba(99,140,255,0.12)"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,background:"linear-gradient(135deg,#1d4ed8,#38bdf8)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#fff"}}>
              <Icon name="cap" size={24}/>
            </div>
            <div>
              <div style={{color:"#fff",fontWeight:800,fontSize:"0.95rem"}}>EduManage</div>
              <div style={{color:"rgba(148,180,255,0.5)",fontSize:"0.68rem"}}>ระบบจัดการนักเรียน</div>
            </div>
          </div>
          {/* Role chip */}
          <div style={{marginTop:14,padding:"10px 12px",background:"rgba(255,255,255,0.05)",borderRadius:10,border:"1px solid rgba(255,255,255,0.07)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:32,height:32,borderRadius:8,background:roleBg+"25",display:"flex",alignItems:"center",justifyContent:"center",color:roleBg+"cc",flexShrink:0}}>
                <Icon name={roleIcon} size={16}/>
              </div>
              <div>
                <div style={{color:"rgba(255,255,255,0.85)",fontSize:"0.78rem",fontWeight:700}}>
                  {session.role==="student"?`${session.studentData?.firstName||""} ${session.studentData?.lastName||""}`:ROLES[session.role]}
                </div>
                <div style={{fontSize:"0.63rem",padding:"1px 7px",background:roleBg,color:"#fff",borderRadius:999,display:"inline-block",fontWeight:700,marginTop:2}}>{ROLES[session.role]}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:"12px 10px",overflowY:"auto"}}>
          <div style={{fontSize:"0.6rem",color:"rgba(99,140,255,0.4)",fontWeight:800,letterSpacing:2,textTransform:"uppercase",padding:"14px 10px 6px"}}>เมนูหลัก</div>
          {NAV_ITEMS.map(({v,icon,label})=>(
            <button key={v} onClick={()=>{setView(v);setSideOpen(false);}}
              style={{width:"100%",padding:"11px 14px",borderRadius:12,border:"none",background:view===v?"rgba(37,99,235,0.25)":"transparent",color:view===v?"#60a5fa":"rgba(255,255,255,0.45)",display:"flex",alignItems:"center",gap:12,cursor:"pointer",marginBottom:3,fontSize:"0.86rem",fontWeight:600,textAlign:"left",transition:"all .15s",boxShadow:view===v?"inset 0 0 0 1px rgba(37,99,235,0.3)":"none"}}>
              <Icon name={icon} size={17}/>
              {label}
            </button>
          ))}

          {canEdit&&(
            <>
              <div style={{fontSize:"0.6rem",color:"rgba(99,140,255,0.4)",fontWeight:800,letterSpacing:2,textTransform:"uppercase",padding:"16px 10px 6px"}}>จัดการข้อมูล</div>
              <button onClick={()=>setEditModal("new")} style={{width:"100%",padding:"11px 14px",borderRadius:12,border:"none",background:"transparent",color:"rgba(255,255,255,0.45)",display:"flex",alignItems:"center",gap:12,cursor:"pointer",marginBottom:3,fontSize:"0.86rem",fontWeight:600,textAlign:"left",transition:"color .15s"}}>
                <Icon name="userPlus" size={17}/> เพิ่มนักเรียน
              </button>
              <button onClick={()=>setShowExport(true)} style={{width:"100%",padding:"11px 14px",borderRadius:12,border:"none",background:"transparent",color:"rgba(255,255,255,0.45)",display:"flex",alignItems:"center",gap:12,cursor:"pointer",marginBottom:3,fontSize:"0.86rem",fontWeight:600,textAlign:"left",transition:"color .15s"}}>
                <Icon name="share" size={17}/> ส่งออกข้อมูล
              </button>
              <label style={{width:"100%",padding:"11px 14px",borderRadius:12,display:"flex",alignItems:"center",gap:12,cursor:"pointer",marginBottom:3,fontSize:"0.86rem",fontWeight:600,color:"rgba(255,255,255,0.45)",boxSizing:"border-box"}}>
                <Icon name="upload" size={17}/> นำเข้าข้อมูล
                <input type="file" accept=".json" onChange={handleImport} style={{display:"none"}}/>
              </label>
              <button onClick={()=>loadStudents()} style={{width:"100%",padding:"11px 14px",borderRadius:12,border:"none",background:"transparent",color:"rgba(255,255,255,0.45)",display:"flex",alignItems:"center",gap:12,cursor:"pointer",marginBottom:3,fontSize:"0.86rem",fontWeight:600,textAlign:"left",transition:"color .15s"}}>
                <Icon name="refresh" size={17}/> รีเฟรชข้อมูล
              </button>
            </>
          )}
        </nav>

        <div style={{padding:"12px 18px",borderTop:"1px solid rgba(99,140,255,0.1)"}}>
          <button onClick={()=>setSession(null)} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid rgba(255,255,255,0.07)",background:"rgba(255,255,255,0.03)",color:"rgba(255,255,255,0.35)",cursor:"pointer",fontSize:"0.8rem",fontWeight:600,display:"flex",alignItems:"center",gap:10,fontFamily:"inherit"}}>
            <Icon name="logOut" size={15}/> ออกจากระบบ
          </button>
          <div style={{color:"rgba(148,180,255,0.2)",fontSize:"0.63rem",textAlign:"center",marginTop:8}}>v3.0 · EduManage</div>
        </div>
      </aside>
    </>
  );

  /* ──────────────────── DASHBOARD ──────────────────── */
  const Dashboard=()=>{
    const cc={};
    students.forEach(s=>{cc[s.class]=(cc[s.class]||0)+1;});
    const bars=Object.entries(cc).sort((a,b)=>b[1]-a[1]).slice(0,8);
    const maxV=bars.length?Math.max(...bars.map(b=>b[1])):1;
    const STAT_CARDS=[
      {bg:"linear-gradient(135deg,#1e40af,#3b82f6)",icon:"users",  val:students.length,lbl:"นักเรียนทั้งหมด",  sh:"0 8px 30px rgba(29,78,216,0.35)"},
      {bg:"linear-gradient(135deg,#0369a1,#38bdf8)",icon:"male",   val:males,            lbl:"นักเรียนชาย",     sh:"0 8px 30px rgba(3,105,161,0.35)"},
      {bg:"linear-gradient(135deg,#9d174d,#ec4899)",icon:"female", val:females,          lbl:"นักเรียนหญิง",   sh:"0 8px 30px rgba(157,23,77,0.35)"},
      {bg:"linear-gradient(135deg,#4c1d95,#a78bfa)",icon:"cap",    val:classes.length,   lbl:"ห้องเรียน",      sh:"0 8px 30px rgba(76,29,149,0.35)"},
    ];
    return(
      <div>
        <h2 style={{fontSize:"1.4rem",fontWeight:900,color:"#0f172a",marginBottom:4}}>แดชบอร์ด</h2>
        <p style={{color:"#64748b",marginBottom:24,fontSize:"0.83rem"}}>ภาพรวมข้อมูลนักเรียน · อัปเดตจาก Shared Storage</p>

        {/* Stat cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:16,marginBottom:24}}>
          {STAT_CARDS.map((c,i)=>(
            <div key={i} style={{background:c.bg,borderRadius:20,padding:"22px 20px",color:"#fff",boxShadow:c.sh,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-18,right:-18,width:72,height:72,background:"rgba(255,255,255,0.1)",borderRadius:"50%"}}/>
              <div style={{width:38,height:38,borderRadius:10,background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
                <Icon name={c.icon} size={20}/>
              </div>
              <div style={{fontSize:"2rem",fontWeight:900,lineHeight:1}}>{c.val}</div>
              <div style={{fontSize:"0.76rem",opacity:0.8,marginTop:4,fontWeight:600}}>{c.lbl}</div>
            </div>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
          {/* Gender donut */}
          <div style={{background:"#fff",borderRadius:16,padding:20,boxShadow:"0 4px 20px rgba(0,0,0,0.06)",border:"1px solid #f1f5f9"}}>
            <h3 style={{fontSize:"0.83rem",fontWeight:800,color:"#0f172a",marginBottom:16,display:"flex",alignItems:"center",gap:8}}><Icon name="users" size={16} color="#2563eb"/> สัดส่วนเพศ</h3>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <svg viewBox="0 0 42 42" width={90} height={90} style={{transform:"rotate(-90deg)",flexShrink:0}}>
                <circle cx="21" cy="21" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="5"/>
                {students.length>0&&<>
                  <circle cx="21" cy="21" r="15.9" fill="none" stroke="#2563eb" strokeWidth="5" strokeDasharray={`${males/students.length*100} ${100-males/students.length*100}`} strokeLinecap="round"/>
                  <circle cx="21" cy="21" r="15.9" fill="none" stroke="#ec4899" strokeWidth="5" strokeDasharray={`${females/students.length*100} ${100-females/students.length*100}`} strokeDashoffset={-(males/students.length*100)} strokeLinecap="round"/>
                </>}
              </svg>
              <div style={{flex:1}}>
                {[["#2563eb","ชาย",males],["#ec4899","หญิง",females],["#8b5cf6","อื่นๆ",students.length-males-females]].filter(x=>x[2]>0).map(([c,l,v])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                    <div style={{width:9,height:9,borderRadius:"50%",background:c,flexShrink:0}}/>
                    <span style={{fontSize:"0.78rem",color:"#475569",flex:1}}>{l}</span>
                    <span style={{fontSize:"0.78rem",fontWeight:800,color:"#0f172a"}}>{v} <span style={{fontWeight:500,color:"#94a3b8"}}>({students.length>0?(v/students.length*100).toFixed(0):0}%)</span></span>
                  </div>
                ))}
                {!students.length&&<p style={{color:"#94a3b8",fontSize:"0.78rem"}}>ยังไม่มีข้อมูล</p>}
              </div>
            </div>
          </div>

          {/* Class bar */}
          <div style={{background:"#fff",borderRadius:16,padding:20,boxShadow:"0 4px 20px rgba(0,0,0,0.06)",border:"1px solid #f1f5f9"}}>
            <h3 style={{fontSize:"0.83rem",fontWeight:800,color:"#0f172a",marginBottom:16,display:"flex",alignItems:"center",gap:8}}><Icon name="cap" size={16} color="#2563eb"/> นักเรียนแยกตามชั้น</h3>
            <div style={{display:"flex",alignItems:"flex-end",gap:6,height:80}}>
              {bars.map(([cls,cnt])=>(
                <div key={cls} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <span style={{fontSize:"0.62rem",color:"#0f172a",fontWeight:700}}>{cnt}</span>
                  <div style={{width:"100%",background:"linear-gradient(to top,#2563eb,#60a5fa)",borderRadius:"4px 4px 0 0",height:Math.max(6,Math.round(cnt/maxV*60))+"px",transition:"height .3s"}}/>
                  <span style={{fontSize:"0.56rem",color:"#94a3b8",textAlign:"center",lineHeight:1.2}}>{cls}</span>
                </div>
              ))}
              {!bars.length&&<p style={{color:"#94a3b8",fontSize:"0.78rem"}}>ยังไม่มีข้อมูล</p>}
            </div>
          </div>
        </div>

        {/* Recent */}
        <div style={{background:"#fff",borderRadius:16,boxShadow:"0 4px 20px rgba(0,0,0,0.06)",border:"1px solid #f1f5f9",overflow:"hidden"}}>
          <div style={{padding:"14px 20px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <h3 style={{fontSize:"0.86rem",fontWeight:800,color:"#0f172a",display:"flex",alignItems:"center",gap:8}}><Icon name="users" size={16} color="#2563eb"/> นักเรียนล่าสุด 5 คน</h3>
            <button onClick={()=>setView("students")} style={{fontSize:"0.76rem",color:"#2563eb",fontWeight:700,border:"none",background:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:"inherit"}}>
              ดูทั้งหมด <Icon name="back" size={13} style={{transform:"rotate(180deg)"}}/>
            </button>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:"#f8fafc"}}>
              {["นักเรียน","เลขที่","ชั้น/ห้อง","เพศ"].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:"0.7rem",fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:0.8}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {[...students].reverse().slice(0,5).map(s=>(
                <tr key={s.id} style={{borderTop:"1px solid #f1f5f9"}}>
                  <td style={{padding:"10px 16px"}}><div style={{display:"flex",alignItems:"center",gap:10}}>
                    <Avatar s={s} size={36}/><span style={{fontWeight:600,fontSize:"0.85rem",color:"#0f172a"}}>{s.firstName} {s.lastName}</span>
                  </div></td>
                  <td style={{padding:"10px 16px",fontWeight:700,color:"#2563eb",fontSize:"0.85rem"}}>{s.number}</td>
                  <td style={{padding:"10px 16px"}}><ClassBadge cls={s.class}/></td>
                  <td style={{padding:"10px 16px"}}><GenderBadge g={s.gender}/></td>
                </tr>
              ))}
              {!students.length&&<tr><td colSpan={4} style={{padding:28,textAlign:"center",color:"#94a3b8",fontSize:"0.85rem"}}>ยังไม่มีข้อมูล</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* ──────────────────── STUDENTS TABLE ──────────────────── */
  const StudentsView=()=>(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div>
          <h2 style={{fontSize:"1.4rem",fontWeight:900,color:"#0f172a",marginBottom:4}}>รายชื่อนักเรียน</h2>
          <p style={{color:"#64748b",fontSize:"0.81rem"}}>{filtered.length} รายการ · {canEdit?"แก้ไขได้":"ดูอย่างเดียว"}</p>
        </div>
        {canEdit&&(
          <button onClick={()=>setEditModal("new")} style={{padding:"10px 18px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#2563eb,#1d4ed8)",color:"#fff",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 14px rgba(37,99,235,0.35)",fontSize:"0.86rem",fontFamily:"inherit"}}>
            <Icon name="userPlus" size={16}/> เพิ่มนักเรียน
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div style={{background:"#fff",borderRadius:16,padding:"12px 14px",marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",border:"1px solid #f1f5f9",display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{position:"relative",flex:1,minWidth:180}}>
          <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",pointerEvents:"none",display:"flex"}}><Icon name="search" size={15}/></span>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="ค้นหาชื่อ เลขที่ รหัส ชั้น..."
            style={{width:"100%",padding:"9px 12px 9px 34px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:"0.84rem",color:"#0f172a",outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
        </div>
        {[
          {val:filterClass,set:v=>{setFilterClass(v);setPage(1);},opts:[["","ทุกชั้น"],...classes.map(c=>[c,c])]},
          {val:filterGender,set:v=>{setFilterGender(v);setPage(1);},opts:[["","ทุกเพศ"],["ชาย","ชาย"],["หญิง","หญิง"],["อื่นๆ","อื่นๆ"]]},
          {val:sortBy,set:setSortBy,opts:[["number_asc","เลขที่ น้อย→มาก"],["number_desc","เลขที่ มาก→น้อย"],["name_asc","ชื่อ ก→ฮ"],["name_desc","ชื่อ ฮ→ก"]]},
        ].map(({val,set,opts},i)=>(
          <select key={i} value={val} onChange={e=>set(e.target.value)}
            style={{padding:"9px 10px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:"0.81rem",color:"#475569",background:"#f8fafc",outline:"none",fontFamily:"inherit"}}>
            {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
        ))}
        {canEdit&&(
          <button onClick={()=>setShowExport(true)} style={{padding:"9px 14px",borderRadius:10,border:"1.5px solid #e2e8f0",background:"#f8fafc",color:"#475569",fontWeight:600,cursor:"pointer",fontSize:"0.81rem",display:"flex",alignItems:"center",gap:7,fontFamily:"inherit"}}>
            <Icon name="share" size={14}/> ส่งออก
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{background:"#fff",borderRadius:16,boxShadow:"0 4px 20px rgba(0,0,0,0.06)",border:"1px solid #f1f5f9",overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
            <thead><tr style={{background:"linear-gradient(90deg,#f8fafc,#f1f5f9)"}}>
              {["#","เลขที่","นักเรียน","รหัส","ชั้น/ห้อง","เพศ","เบอร์โทร","จัดการ"].map(h=>(
                <th key={h} style={{padding:"12px 14px",textAlign:"left",fontSize:"0.7rem",fontWeight:800,color:"#64748b",textTransform:"uppercase",letterSpacing:0.8,whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {paginated.map((s,i)=>(
                <tr key={s.id} style={{borderTop:"1px solid #f1f5f9",transition:"background .1s"}} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                  <td style={{padding:"11px 14px",color:"#94a3b8",fontSize:"0.77rem"}}>{(page-1)*PAGE_SIZE+i+1}</td>
                  <td style={{padding:"11px 14px",fontWeight:700,color:"#2563eb",fontSize:"0.87rem"}}>{s.number}</td>
                  <td style={{padding:"11px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <Avatar s={s} size={38}/>
                      <div>
                        <div style={{fontWeight:700,fontSize:"0.86rem",color:"#0f172a"}}>{s.firstName} {s.lastName}</div>
                        <div style={{display:"flex",alignItems:"center",gap:5,marginTop:2,flexWrap:"wrap"}}>
                          {s.birthdate&&<span style={{fontSize:"0.71rem",color:"#94a3b8"}}>อายุ {calcAge(s.birthdate)}</span>}
                          <StatusChips s={s}/>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:"11px 14px"}}><span style={{padding:"3px 8px",background:"#eff6ff",color:"#1d4ed8",borderRadius:6,fontSize:"0.76rem",fontWeight:700}}>{s.studentId}</span></td>
                  <td style={{padding:"11px 14px"}}><ClassBadge cls={s.class}/></td>
                  <td style={{padding:"11px 14px"}}><GenderBadge g={s.gender}/></td>
                  <td style={{padding:"11px 14px",color:"#64748b",fontSize:"0.81rem"}}>{s.phone||"—"}</td>
                  <td style={{padding:"11px 14px"}}>
                    <div style={{display:"flex",gap:5}}>
                      <IBtn name="eye"    title="ดูรายละเอียด"   onClick={()=>{setDetail(s);setView("detail");}} bg="#eff6ff" tc="#1d4ed8"/>
                      {canEdit&&<>
                        <IBtn name="edit"  title="แก้ไข"          onClick={()=>setEditModal(s)} bg="#eff6ff" tc="#1d4ed8"/>
                        <IBtn name="trash" title="ลบ"              onClick={()=>setConfirmDel(s.id)} bg="#fee2e2" tc="#b91c1c"/>
                      </>}
                      <IBtn name="image"  title="บัตรนักเรียน"   onClick={()=>setShowExportImg(s)} bg="#f0fdf4" tc="#059669"/>
                    </div>
                  </td>
                </tr>
              ))}
              {!paginated.length&&(
                <tr><td colSpan={8} style={{padding:44,textAlign:"center",color:"#94a3b8"}}>
                  <div style={{width:52,height:52,borderRadius:"50%",background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",color:"#cbd5e1"}}><Icon name="users" size={24}/></div>
                  <div style={{fontWeight:600,marginBottom:4}}>ไม่พบข้อมูลนักเรียน</div>
                  <div style={{fontSize:"0.8rem"}}>ลองเปลี่ยนคำค้นหา</div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length>0&&(
          <div style={{padding:"10px 16px",borderTop:"1px solid #f1f5f9",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
            <span style={{fontSize:"0.77rem",color:"#64748b"}}>แสดง {Math.min((page-1)*PAGE_SIZE+1,filtered.length)}–{Math.min(page*PAGE_SIZE,filtered.length)} จาก {filtered.length} รายการ</span>
            <div style={{display:"flex",gap:4}}>
              <PgBtn label="‹" disabled={page<=1} onClick={()=>setPage(p=>p-1)}/>
              {Array.from({length:totalPg},(_,i)=>i+1).filter(p=>totalPg<=6||Math.abs(p-page)<=1||p===1||p===totalPg).map((p,i,arr)=>(
                <span key={p} style={{display:"inline-flex",alignItems:"center",gap:4}}>
                  {i>0&&arr[i-1]!==p-1&&<span style={{padding:"0 2px",color:"#94a3b8",fontSize:"0.8rem"}}>…</span>}
                  <PgBtn label={p} active={p===page} onClick={()=>setPage(p)}/>
                </span>
              ))}
              <PgBtn label="›" disabled={page>=totalPg} onClick={()=>setPage(p=>p+1)}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  /* ──────────────────── DETAIL VIEW ──────────────────── */
  const DetailView=()=>{
    if(!detail) return null;
    const s=students.find(x=>x.id===detail.id)||detail;
    const gColor=s.gender==="ชาย"?"#2563eb":s.gender==="หญิง"?"#ec4899":"#8b5cf6";
    return(
      <div>
        <button onClick={()=>setView("students")} style={{padding:"8px 16px",borderRadius:10,border:"1.5px solid #e2e8f0",background:"#fff",color:"#475569",fontWeight:600,cursor:"pointer",marginBottom:20,fontSize:"0.82rem",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit"}}>
          <Icon name="back" size={15}/> กลับรายชื่อ
        </button>
        <div style={{background:"#fff",borderRadius:20,boxShadow:"0 4px 20px rgba(0,0,0,0.07)",border:"1px solid #f1f5f9",overflow:"hidden"}}>
          <div style={{background:`linear-gradient(135deg,${gColor},${gColor}cc)`,padding:"30px 32px 26px",display:"flex",gap:20,alignItems:"center",position:"relative",overflow:"hidden",flexWrap:"wrap"}}>
            <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,background:"rgba(255,255,255,0.1)",borderRadius:"50%"}}/>
            <Avatar s={s} size={88} style={{border:"3px solid rgba(255,255,255,0.4)",flexShrink:0}}/>
            <div style={{position:"relative",zIndex:1}}>
              <h2 style={{color:"#fff",fontSize:"1.45rem",fontWeight:900,marginBottom:4}}>{s.firstName} {s.lastName}</h2>
              <p style={{color:"rgba(255,255,255,0.72)",fontSize:"0.86rem"}}>{s.class} · เลขที่ {s.number}</p>
              <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap",alignItems:"center"}}>
                <GenderBadge g={s.gender} light/>
                <ClassBadge cls={s.class} light/>
                {s.birthdate&&<span style={{padding:"3px 12px",borderRadius:999,background:"rgba(255,255,255,0.18)",color:"rgba(255,255,255,0.9)",fontSize:"0.75rem",fontWeight:600,border:"1px solid rgba(255,255,255,0.2)"}}>อายุ {calcAge(s.birthdate)}</span>}
                <StatusChips s={s} light/>
              </div>
            </div>
          </div>
          <div style={{padding:28}}>
            <Section title="ข้อมูลทั่วไป">
              <Grid2>
                {[["เลขที่",s.number],["เลขประจำตัว",s.studentId],["ชั้น/ห้อง",s.class],["เพศ",s.gender],["วันเกิด",fmtDate(s.birthdate)],["อายุ",calcAge(s.birthdate)]].map(([l,v])=>(
                  <Field key={l} label={l} value={v}/>
                ))}
              </Grid2>
            </Section>
            <Section title="ข้อมูลติดต่อ">
              <Grid2>
                <Field label="เบอร์โทรศัพท์" value={s.phone||"—"}/>
                <Field label="ที่อยู่" value={s.address||"—"} full/>
              </Grid2>
            </Section>
            {s.note&&<Section title="หมายเหตุ"><p style={{color:"#475569",fontSize:"0.86rem",background:"#f8fafc",padding:"12px 14px",borderRadius:10,border:"1px solid #e2e8f0",margin:0}}>{s.note}</p></Section>}
            <div style={{display:"flex",gap:10,marginTop:20,flexWrap:"wrap"}}>
              {canEdit&&<>
                <button onClick={()=>setEditModal(s)} style={{padding:"10px 18px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#2563eb,#1d4ed8)",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:"0.86rem",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit"}}>
                  <Icon name="edit" size={15}/> แก้ไขข้อมูล
                </button>
                <button onClick={()=>setConfirmDel(s.id)} style={{padding:"10px 18px",borderRadius:10,border:"1.5px solid #fca5a5",background:"#fee2e2",color:"#b91c1c",fontWeight:700,cursor:"pointer",fontSize:"0.86rem",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit"}}>
                  <Icon name="trash" size={15}/> ลบข้อมูล
                </button>
              </>}
              <button onClick={()=>setShowExportImg(s)} style={{padding:"10px 18px",borderRadius:10,border:"1.5px solid #bbf7d0",background:"#f0fdf4",color:"#059669",fontWeight:700,cursor:"pointer",fontSize:"0.86rem",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit"}}>
                <Icon name="image" size={15}/> ส่งออกบัตร
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ──────────────────── RENDER ──────────────────── */
  return(
    <div style={{minHeight:"100vh",background:"#eef2fb",fontFamily:"'Noto Sans Thai','Inter',sans-serif"}}>
      <Sidebar/>
      <main style={{marginLeft:240,minHeight:"100vh"}}>
        {/* Topbar */}
        <header style={{height:60,background:"rgba(255,255,255,0.92)",backdropFilter:"blur(12px)",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",padding:"0 24px",gap:12,position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 10px rgba(0,0,0,0.05)"}}>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontWeight:800,color:"#0f172a",fontSize:"0.95rem"}}>
              {view==="dashboard"?"แดชบอร์ด":view==="students"?"รายชื่อนักเรียน":"ข้อมูลนักเรียน"}
            </span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {loading&&<span style={{fontSize:"0.76rem",color:"#94a3b8",display:"flex",alignItems:"center",gap:5}}><Icon name="refresh" size={13}/> กำลังโหลด...</span>}
            <div style={{padding:"4px 12px",borderRadius:999,background:roleBg+"18",color:roleBg,fontSize:"0.74rem",fontWeight:700,border:`1px solid ${roleBg}30`,display:"flex",alignItems:"center",gap:6}}>
              <Icon name={roleIcon} size={13}/>
              {session.role==="student"?session.studentData?.firstName||"นักเรียน":ROLES[session.role]}
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{padding:"28px 32px",maxWidth:1200}}>
          {view==="dashboard"&&<Dashboard/>}
          {view==="students"&&<StudentsView/>}
          {view==="detail"&&<DetailView/>}
        </div>
      </main>

      {/* Modals */}
      {editModal&&canEdit&&<StudentModal student={editModal==="new"?null:editModal} onSave={handleSave} onClose={()=>setEditModal(null)}/>}
      {showExport&&<ExportModal students={students} onClose={()=>setShowExport(false)} toast={toast}/>}
      {showExportImg&&<ExportImageModal student={showExportImg} onClose={()=>setShowExportImg(null)}/>}

      {/* Confirm Delete */}
      {confirmDel&&(
        <div style={{position:"fixed",inset:0,background:"rgba(8,15,40,0.75)",backdropFilter:"blur(10px)",zIndex:900,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#fff",borderRadius:24,padding:36,maxWidth:380,width:"100%",textAlign:"center",boxShadow:"0 32px 80px rgba(0,0,0,0.4)"}}>
            <div style={{width:64,height:64,background:"linear-gradient(135deg,#fee2e2,#fecaca)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",color:"#b91c1c"}}>
              <Icon name="trash" size={28}/>
            </div>
            <h3 style={{color:"#0f172a",marginBottom:8,fontSize:"1.08rem"}}>ยืนยันการลบ</h3>
            <p style={{color:"#64748b",fontSize:"0.84rem",marginBottom:24,lineHeight:1.6}}>
              ต้องการลบข้อมูลของ "{students.find(s=>s.id===confirmDel)?.firstName} {students.find(s=>s.id===confirmDel)?.lastName}" ใช่หรือไม่?<br/>การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button onClick={()=>setConfirmDel(null)} style={{padding:"10px 20px",borderRadius:10,border:"1.5px solid #e2e8f0",background:"#fff",color:"#475569",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>ยกเลิก</button>
              <button onClick={handleDelete} style={{padding:"10px 20px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#ef4444,#dc2626)",color:"#fff",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit"}}>
                <Icon name="trash" size={15}/> ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div style={{position:"fixed",bottom:24,right:24,zIndex:9999,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none"}}>
        {toasts.map(t=>(
          <div key={t.id} style={{padding:"11px 18px",borderRadius:12,display:"flex",alignItems:"center",gap:10,fontSize:"0.84rem",fontWeight:600,minWidth:220,maxWidth:340,
            background:t.type==="success"?"linear-gradient(135deg,#064e3b,#065f46)":t.type==="error"?"linear-gradient(135deg,#7f1d1d,#991b1b)":"linear-gradient(135deg,#1e3a8a,#1e40af)",
            color:t.type==="success"?"#6ee7b7":t.type==="error"?"#fca5a5":"#93c5fd",
            boxShadow:"0 8px 32px rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.08)",animation:"slideIn .3s ease"}}>
            <span style={{display:"flex",alignItems:"center",color:"inherit"}}>
              <Icon name={t.type==="success"?"check":t.type==="error"?"x":"info"} size={16}/>
            </span>
            {t.msg}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @media(max-width:768px){ main{margin-left:0!important;} }
        *{box-sizing:border-box;}
      `}</style>
    </div>
  );
}

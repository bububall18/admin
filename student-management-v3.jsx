import { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================
   CONSTANTS
============================================================ */
const DB_KEY = "edumanage_v3_students";
const PASS_STAFF = "135790";
const PAGE_SIZE = 10;

const ROLES = [
  { id: "teacher", label: "อาจารย์", icon: null },
  { id: "director", label: "ผู้อำนวยการ", icon: null },
  { id: "student", label: "นักเรียน", icon: null },
];

/* ============================================================
   SVG ICONS (no emoji)
============================================================ */
const Icon = ({ name, size = 18, color = "currentColor", style = {} }) => {
  const paths = {
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    close: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    back: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    cap: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    warn: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    camera: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>,
    menu: <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    chart: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    // Gender SVG icons
    male: <><circle cx="12" cy="8" r="4"/><path d="M12 12v8M9 17h6"/><path d="M17 3h4v4"/><line x1="20" y1="3" x2="14.5" y2="8.5"/></>,
    female: <><circle cx="12" cy="8" r="4"/><path d="M12 12v8M9 17h6M12 17v3"/></>,
    other: <><circle cx="12" cy="8" r="4"/><path d="M12 12v8M9 17h6"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", flexShrink: 0, ...style }}>
      {paths[name] || null}
    </svg>
  );
};

/* Gender avatar SVG */
const GenderAvatar = ({ gender, size = 38 }) => {
  const isMale = gender === "ชาย";
  const isFemale = gender === "หญิง";
  const bg = isMale ? "#dbeafe" : isFemale ? "#fce7f3" : "#ede9fe";
  const color = isMale ? "#1d4ed8" : isFemale ? "#be185d" : "#7c3aed";
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ borderRadius: "50%", flexShrink: 0 }}>
      <rect width="40" height="40" rx="20" fill={bg} />
      {isMale && <>
        <circle cx="20" cy="14" r="6" fill={color} opacity="0.85"/>
        <path d="M8 34c0-6.627 5.373-10 12-10s12 3.373 12 10" fill={color} opacity="0.85"/>
      </>}
      {isFemale && <>
        <circle cx="20" cy="13" r="6" fill={color} opacity="0.85"/>
        <path d="M8 34c0-6.627 5.373-10 12-10s12 3.373 12 10" fill={color} opacity="0.85"/>
        <path d="M15 9c0 0 2-3 5-3s5 3 5 3" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
      </>}
      {!isMale && !isFemale && <>
        <circle cx="20" cy="14" r="6" fill={color} opacity="0.85"/>
        <path d="M8 34c0-6.627 5.373-10 12-10s12 3.373 12 10" fill={color} opacity="0.85"/>
        <text x="20" y="32" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">?</text>
      </>}
    </svg>
  );
};

const AvatarCell = ({ student, size = 38 }) => {
  if (student.photo) {
    return <img src={student.photo} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid #e2e8f0" }} onError={e => { e.target.style.display = "none"; }} />;
  }
  return <GenderAvatar gender={student.gender} size={size} />;
};

/* ============================================================
   HELPERS
============================================================ */
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const calcAge = d => Math.floor((Date.now() - new Date(d).getTime()) / (365.25 * 24 * 3600 * 1000));
const fmtDate = d => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });
};
const dlFile = (name, content, type) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name; a.click(); URL.revokeObjectURL(a.href);
};

const SAMPLE_STUDENTS = [
  { id: genId(), createdAt: Date.now(), firstName: "สมชาย", lastName: "ใจดี", number: 1, studentId: "67001", class: "ม.1/1", gender: "ชาย", birthdate: "2013-03-15", phone: "081-234-5678", address: "123 ถ.สุขุมวิท กรุงเทพฯ", photo: null, note: "" },
  { id: genId(), createdAt: Date.now(), firstName: "มานี", lastName: "รักเรียน", number: 2, studentId: "67002", class: "ม.1/1", gender: "หญิง", birthdate: "2013-07-20", phone: "082-345-6789", address: "456 ถ.พระราม 4 กรุงเทพฯ", photo: null, note: "" },
  { id: genId(), createdAt: Date.now(), firstName: "วิชาญ", lastName: "เก่งกล้า", number: 3, studentId: "67003", class: "ม.1/1", gender: "ชาย", birthdate: "2013-01-10", phone: "083-456-7890", address: "789 ถ.รัชดา กรุงเทพฯ", photo: null, note: "" },
  { id: genId(), createdAt: Date.now(), firstName: "สุดา", lastName: "แสนสวย", number: 1, studentId: "67004", class: "ม.1/2", gender: "หญิง", birthdate: "2013-05-25", phone: "084-567-8901", address: "101 ถ.ลาดพร้าว กรุงเทพฯ", photo: null, note: "" },
  { id: genId(), createdAt: Date.now(), firstName: "ประสิทธิ์", lastName: "มากมี", number: 2, studentId: "67005", class: "ม.1/2", gender: "ชาย", birthdate: "2013-09-08", phone: "085-678-9012", address: "202 ถ.งามวงศ์วาน นนทบุรี", photo: null, note: "" },
  { id: genId(), createdAt: Date.now(), firstName: "รัตนา", lastName: "ดีงาม", number: 3, studentId: "67006", class: "ม.1/2", gender: "หญิง", birthdate: "2013-11-30", phone: "086-789-0123", address: "303 ถ.บางนา สมุทรปราการ", photo: null, note: "" },
  { id: genId(), createdAt: Date.now(), firstName: "ณัฐพล", lastName: "ศรีสุข", number: 1, studentId: "67007", class: "ม.2/1", gender: "ชาย", birthdate: "2012-04-18", phone: "087-890-1234", address: "404 ถ.เพชรเกษม กรุงเทพฯ", photo: null, note: "" },
  { id: genId(), createdAt: Date.now(), firstName: "อรุณี", lastName: "บุปผา", number: 2, studentId: "67008", class: "ม.2/1", gender: "หญิง", birthdate: "2012-06-12", phone: "088-901-2345", address: "505 ถ.สาทร กรุงเทพฯ", photo: null, note: "" },
];

/* ============================================================
   TOAST
============================================================ */
const ToastContainer = ({ toasts }) => (
  <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 18px", borderRadius: 12, minWidth: 260, maxWidth: 360,
        background: t.type === "success" ? "#dcfce7" : t.type === "error" ? "#fee2e2" : "#dbeafe",
        border: `1.5px solid ${t.type === "success" ? "#86efac" : t.type === "error" ? "#fca5a5" : "#93c5fd"}`,
        color: t.type === "success" ? "#166534" : t.type === "error" ? "#991b1b" : "#1e40af",
        boxShadow: "0 4px 20px rgba(0,0,0,.12)", fontWeight: 600, fontSize: 14,
        animation: "slideIn .2s ease"
      }}>
        <Icon name={t.type === "success" ? "check" : t.type === "error" ? "warn" : "info"} size={16} />
        {t.msg}
      </div>
    ))}
  </div>
);

/* ============================================================
   LOGIN SCREEN
============================================================ */
const LoginScreen = ({ onLogin }) => {
  const [role, setRole] = useState("teacher");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [showPass, setShowPass] = useState(false);

  const roleInfo = {
    teacher: { label: "อาจารย์", desc: "รหัสผ่าน: 135790", color: "#1d4ed8", bg: "#dbeafe" },
    director: { label: "ผู้อำนวยการ", desc: "รหัสผ่าน: 135790", color: "#7c3aed", bg: "#ede9fe" },
    student: { label: "นักเรียน", desc: "ใช้เลขประจำตัวนักเรียนเป็นรหัสผ่าน", color: "#059669", bg: "#dcfce7" },
  };

  const handleLogin = () => {
    setErr("");
    if (role === "student") {
      // student uses their own student ID — we pass it to the parent to verify
      onLogin(role, pass.trim());
    } else {
      if (pass === PASS_STAFF) {
        onLogin(role, pass.trim());
      } else {
        setErr("รหัสผ่านไม่ถูกต้อง");
      }
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap');
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:.6; } 50% { opacity:1; } }
        * { box-sizing:border-box; }
        input:focus { outline:none; }
        button { cursor:pointer; font-family:inherit; }
      `}</style>
      <div style={{ width: "100%", maxWidth: 440, animation: "fadeUp .4s ease" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: "linear-gradient(135deg, #1d4ed8, #38bdf8)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 32px rgba(37,99,235,.5), 0 0 0 1px rgba(255,255,255,.1)",
            marginBottom: 16
          }}>
            <Icon name="cap" size={36} color="#fff" />
          </div>
          <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-.02em" }}>EduManage</h1>
          <p style={{ color: "rgba(148,180,255,.7)", fontSize: 14, marginTop: 4 }}>ระบบจัดการข้อมูลนักเรียน</p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,.04)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,.1)", borderRadius: 24,
          padding: "32px 28px", boxShadow: "0 24px 80px rgba(0,0,0,.4)"
        }}>
          <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="lock" size={18} color="#60a5fa" /> เข้าสู่ระบบ
          </h2>

          {/* Role selector */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: "rgba(148,180,255,.8)", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 10 }}>เลือกประเภทผู้ใช้</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { id: "teacher", label: "อาจารย์", icon: "shield" },
                { id: "director", label: "ผู้อำนวยการ", icon: "cap" },
                { id: "student", label: "นักเรียน", icon: "users" },
              ].map(r => (
                <button key={r.id} onClick={() => { setRole(r.id); setPass(""); setErr(""); }} style={{
                  padding: "12px 8px", borderRadius: 12, border: "1.5px solid",
                  borderColor: role === r.id ? "#3b82f6" : "rgba(255,255,255,.1)",
                  background: role === r.id ? "rgba(59,130,246,.2)" : "rgba(255,255,255,.03)",
                  color: role === r.id ? "#93c5fd" : "rgba(255,255,255,.5)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  fontWeight: 600, fontSize: 13, transition: "all .2s",
                }}>
                  <Icon name={r.icon} size={20} color={role === r.id ? "#60a5fa" : "rgba(255,255,255,.4)"} />
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "rgba(148,180,255,.8)", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
              {role === "student" ? "เลขประจำตัวนักเรียน" : "รหัสผ่าน"}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={pass}
                onChange={e => { setPass(e.target.value); setErr(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder={role === "student" ? "กรอกเลขประจำตัว เช่น 67001" : "กรอกรหัสผ่าน"}
                style={{
                  width: "100%", padding: "12px 44px 12px 16px",
                  borderRadius: 10, border: `1.5px solid ${err ? "#f87171" : "rgba(255,255,255,.12)"}`,
                  background: "rgba(255,255,255,.06)", color: "#fff",
                  fontSize: 15, letterSpacing: "0.08em",
                }}
              />
              <button onClick={() => setShowPass(!showPass)} style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: "rgba(255,255,255,.4)", padding: 0,
              }}>
                <Icon name="eye" size={18} />
              </button>
            </div>
            {err && <p style={{ color: "#f87171", fontSize: 13, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="warn" size={14} color="#f87171" /> {err}
            </p>}
          </div>

          {/* Hint */}
          <p style={{ color: "rgba(148,180,255,.5)", fontSize: 12, marginBottom: 20 }}>
            {roleInfo[role].desc}
          </p>

          <button onClick={handleLogin} style={{
            width: "100%", padding: "14px", borderRadius: 12, border: "none",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "#fff", fontWeight: 700, fontSize: 15,
            boxShadow: "0 4px 0 #1438a0, 0 8px 28px rgba(37,99,235,.5)",
            transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}>
            <Icon name="check" size={18} color="#fff" /> เข้าสู่ระบบ
          </button>
        </div>

        <p style={{ color: "rgba(148,180,255,.4)", textAlign: "center", fontSize: 12, marginTop: 20 }}>
          EduManage v3.0 — ระบบข้อมูลนักเรียน
        </p>
      </div>
    </div>
  );
};

/* ============================================================
   EXPORT IMAGE MODAL
============================================================ */
const ExportImageModal = ({ student, onClose }) => {
  const canvasRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!student) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 480;
    canvas.height = 320;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 480, 320);
    grad.addColorStop(0, "#1e3a8a");
    grad.addColorStop(1, "#1d4ed8");
    ctx.fillStyle = grad;
    ctx.roundRect(0, 0, 480, 320, 20);
    ctx.fill();

    // Header stripe
    ctx.fillStyle = "rgba(255,255,255,.06)";
    ctx.fillRect(0, 0, 480, 80);

    // School label
    ctx.fillStyle = "rgba(255,255,255,.9)";
    ctx.font = "bold 15px 'Inter', sans-serif";
    ctx.fillText("EduManage — บัตรข้อมูลนักเรียน", 24, 32);
    ctx.fillStyle = "rgba(148,180,255,.7)";
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillText(new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" }), 24, 54);

    // Avatar circle
    ctx.fillStyle = student.gender === "ชาย" ? "#dbeafe" : student.gender === "หญิง" ? "#fce7f3" : "#ede9fe";
    ctx.beginPath();
    ctx.arc(64, 160, 44, 0, Math.PI * 2);
    ctx.fill();
    // Gender icon text
    ctx.fillStyle = student.gender === "ชาย" ? "#1d4ed8" : student.gender === "หญิง" ? "#be185d" : "#7c3aed";
    ctx.font = "bold 36px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(student.gender === "ชาย" ? "M" : student.gender === "หญิง" ? "F" : "?", 64, 172);
    ctx.textAlign = "left";

    // Name
    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px 'Inter', 'Noto Sans Thai', sans-serif";
    ctx.fillText(`${student.firstName} ${student.lastName}`, 124, 148);

    // Class & ID
    ctx.fillStyle = "rgba(148,180,255,.85)";
    ctx.font = "14px 'Inter', sans-serif";
    ctx.fillText(`${student.class}  |  เลขที่ ${student.number}  |  เลขประจำตัว: ${student.studentId}`, 124, 174);

    // Gender badge
    ctx.fillStyle = student.gender === "ชาย" ? "rgba(219,234,254,.2)" : "rgba(252,231,243,.2)";
    ctx.roundRect(124, 185, 80, 24, 12);
    ctx.fill();
    ctx.fillStyle = student.gender === "ชาย" ? "#93c5fd" : "#f9a8d4";
    ctx.font = "bold 12px 'Inter', sans-serif";
    ctx.fillText(student.gender, 148, 202);

    // Divider
    ctx.strokeStyle = "rgba(255,255,255,.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(24, 232);
    ctx.lineTo(456, 232);
    ctx.stroke();

    // Info fields
    const fields = [
      ["วันเกิด", student.birthdate ? fmtDate(student.birthdate) : "—"],
      ["อายุ", student.birthdate ? `${calcAge(student.birthdate)} ปี` : "—"],
      ["เบอร์โทร", student.phone || "—"],
    ];
    fields.forEach(([label, val], i) => {
      const x = 24 + i * 155;
      ctx.fillStyle = "rgba(148,180,255,.6)";
      ctx.font = "11px 'Inter', sans-serif";
      ctx.fillText(label, x, 256);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px 'Inter', sans-serif";
      ctx.fillText(val, x, 276);
    });

    // Address
    if (student.address) {
      ctx.fillStyle = "rgba(148,180,255,.6)";
      ctx.font = "11px 'Inter', sans-serif";
      ctx.fillText("ที่อยู่", 24, 300);
      ctx.fillStyle = "rgba(255,255,255,.8)";
      ctx.font = "12px 'Inter', sans-serif";
      ctx.fillText(student.address.slice(0, 60) + (student.address.length > 60 ? "..." : ""), 80, 300);
    }

    setDone(true);
  }, [student]);

  const download = () => {
    const canvas = canvasRef.current;
    const a = document.createElement("a");
    a.download = `student_${student.studentId}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(8,15,40,.7)", backdropFilter: "blur(12px)",
      zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", padding: 20
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: 28, maxWidth: 540, width: "100%",
        boxShadow: "0 24px 80px rgba(0,0,0,.4)"
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontWeight: 800, fontSize: 17, margin: 0 }}>ส่งออกรูปข้อมูลนักเรียน</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <Icon name="close" size={20} color="#94a3b8" />
          </button>
        </div>
        <canvas ref={canvasRef} style={{ width: "100%", borderRadius: 12, border: "1px solid #e2e8f0", display: "block" }} />
        {done && (
          <button onClick={download} style={{
            marginTop: 16, width: "100%", padding: "12px", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff",
            fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}>
            <Icon name="download" size={16} color="#fff" /> ดาวน์โหลดรูปภาพ
          </button>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   STUDENT FORM MODAL
============================================================ */
const StudentModal = ({ student, onSave, onClose }) => {
  const [form, setForm] = useState({
    firstName: "", lastName: "", number: "", studentId: "",
    class: "", gender: "", birthdate: "", phone: "", address: "", note: "", photo: null,
    ...student,
  });
  const [errors, setErrors] = useState({});
  const [avPrev, setAvPrev] = useState(student?.photo || null);
  const fileRef = useRef();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "กรุณากรอกชื่อ";
    if (!form.lastName.trim()) e.lastName = "กรุณากรอกนามสกุล";
    if (!form.number) e.number = "กรุณากรอกเลขที่";
    if (!form.studentId.trim()) e.studentId = "กรุณากรอกเลขประจำตัว";
    if (!form.class.trim()) e.class = "กรุณากรอกชั้น/ห้อง";
    if (!form.gender) e.gender = "กรุณาเลือกเพศ";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...form, number: parseInt(form.number), photo: avPrev });
  };

  const handlePhoto = e => {
    const f = e.target.files[0]; if (!f) return;
    if (f.size > 2 * 1024 * 1024) { alert("ไฟล์รูปใหญ่เกิน 2MB"); return; }
    const r = new FileReader();
    r.onload = ev => setAvPrev(ev.target.result);
    r.readAsDataURL(f);
    e.target.value = "";
  };

  const inp = { style: { width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, fontFamily: "inherit", background: "#f8fafc", color: "#1e293b", outline: "none" } };
  const fg = (label, key, type = "text", placeholder = "", required = false) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".04em" }}>
        {label}{required && <span style={{ color: "#f87171", marginLeft: 2 }}>*</span>}
      </label>
      <input type={type} value={form[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
        style={{ ...inp.style, borderColor: errors[key] ? "#f87171" : "#e2e8f0" }} />
      {errors[key] && <span style={{ color: "#f87171", fontSize: 12 }}>{errors[key]}</span>}
    </div>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(8,15,40,.65)", backdropFilter: "blur(12px)",
      zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 24, width: "100%", maxWidth: 680, maxHeight: "92vh",
        overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,.4)", border: "1px solid rgba(226,232,240,.5)"
      }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "22px 28px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontWeight: 800, fontSize: 17, margin: 0 }}>{student ? "แก้ไขข้อมูลนักเรียน" : "เพิ่มนักเรียนใหม่"}</h3>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="close" size={15} color="#94a3b8" />
          </button>
        </div>

        <div style={{ padding: "24px 28px" }}>
          {/* Avatar upload */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", borderRadius: 12, background: "#f8fafc", border: "1.5px dashed #cbd5e1", marginBottom: 20 }}>
            {avPrev
              ? <img src={avPrev} alt="" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid #c5d8fd" }} />
              : <GenderAvatar gender={form.gender} size={64} />
            }
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => fileRef.current.click()} style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #c5d8fd", background: "#f0f5ff", color: "#1d4ed8", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="camera" size={14} color="#1d4ed8" /> เลือกรูป
                </button>
                {avPrev && <button onClick={() => setAvPrev(null)} style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>ลบรูป</button>}
              </div>
              <small style={{ color: "#94a3b8", fontSize: 12, display: "block", marginTop: 6 }}>JPG, PNG ไม่เกิน 2MB · หากไม่ใส่รูปจะใช้ไอคอนเพศโดยอัตโนมัติ</small>
            </div>
          </div>
          <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {fg("ชื่อ", "firstName", "text", "ชื่อ", true)}
            {fg("นามสกุล", "lastName", "text", "นามสกุล", true)}
            {fg("เลขที่", "number", "number", "1", true)}
            {fg("เลขประจำตัวนักเรียน", "studentId", "text", "เช่น 67001", true)}
            {fg("ชั้น/ห้อง", "class", "text", "เช่น ม.1/1", true)}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".04em" }}>เพศ<span style={{ color: "#f87171", marginLeft: 2 }}>*</span></label>
              <select value={form.gender} onChange={e => set("gender", e.target.value)}
                style={{ ...inp.style, borderColor: errors.gender ? "#f87171" : "#e2e8f0", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: 15, paddingRight: 32 }}>
                <option value="">เลือกเพศ</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
              {errors.gender && <span style={{ color: "#f87171", fontSize: 12 }}>{errors.gender}</span>}
            </div>
            {fg("วันเกิด", "birthdate", "date", "")}
            {fg("เบอร์โทรศัพท์", "phone", "tel", "0xx-xxx-xxxx")}
            <div style={{ gridColumn: "1/-1", display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".04em" }}>ที่อยู่</label>
              <textarea value={form.address} onChange={e => set("address", e.target.value)} placeholder="ที่อยู่ปัจจุบัน"
                style={{ ...inp.style, resize: "vertical", minHeight: 70, fontFamily: "inherit" }} />
            </div>
            <div style={{ gridColumn: "1/-1", display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".04em" }}>หมายเหตุ / บันทึก</label>
              <textarea value={form.note || ""} onChange={e => set("note", e.target.value)} placeholder="บันทึกเพิ่มเติมเกี่ยวกับนักเรียน"
                style={{ ...inp.style, resize: "vertical", minHeight: 60, fontFamily: "inherit" }} />
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 28px 24px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>ยกเลิก</button>
          <button onClick={handleSave} style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="check" size={15} color="#fff" /> บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   EXPORT MODAL (choose type)
============================================================ */
const ExportChoiceModal = ({ onClose, onExportJSON, onExportCSV, onExportImage, students }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(8,15,40,.65)", backdropFilter: "blur(12px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
    <div style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 420, padding: 32, boxShadow: "0 24px 80px rgba(0,0,0,.4)" }} onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h3 style={{ fontWeight: 800, fontSize: 18, margin: 0 }}>ส่งออกข้อมูล</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <Icon name="close" size={20} color="#94a3b8" />
        </button>
      </div>

      {[
        { icon: "file", label: "ส่งออก CSV", desc: "ไฟล์ตาราง Excel / CSV", action: onExportCSV, color: "#059669", bg: "#dcfce7", border: "#86efac" },
        { icon: "download", label: "ส่งออก JSON", desc: "ไฟล์ข้อมูล JSON ครบถ้วน", action: onExportJSON, color: "#1d4ed8", bg: "#dbeafe", border: "#93c5fd" },
        { icon: "image", label: "รูปภาพบัตรนักเรียน", desc: "เลือกนักเรียนเพื่อสร้างบัตรรูปภาพ", action: onExportImage, color: "#7c3aed", bg: "#ede9fe", border: "#c4b5fd" },
      ].map(opt => (
        <button key={opt.label} onClick={opt.action} style={{
          display: "flex", alignItems: "center", gap: 16, width: "100%",
          padding: "16px 18px", borderRadius: 12, border: `1.5px solid ${opt.border}`,
          background: opt.bg, cursor: "pointer", marginBottom: 10, textAlign: "left"
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,.08)" }}>
            <Icon name={opt.icon} size={22} color={opt.color} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: opt.color }}>{opt.label}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{opt.desc}</div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

/* ============================================================
   SELECT STUDENT FOR IMAGE EXPORT
============================================================ */
const SelectStudentModal = ({ students, onSelect, onClose }) => {
  const [q, setQ] = useState("");
  const filtered = students.filter(s =>
    [s.firstName, s.lastName, s.studentId, s.class].some(v => v?.toLowerCase().includes(q.toLowerCase()))
  );
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(8,15,40,.65)", backdropFilter: "blur(12px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 480, maxHeight: "80vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,.4)" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "22px 24px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontWeight: 800, fontSize: 17, margin: 0 }}>เลือกนักเรียน</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><Icon name="close" size={20} color="#94a3b8" /></button>
        </div>
        <div style={{ padding: "12px 24px" }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="ค้นหาชื่อหรือเลขประจำตัว..." style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none" }} />
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "0 24px 24px" }}>
          {filtered.map(s => (
            <button key={s.id} onClick={() => onSelect(s)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #f1f5f9", background: "#fff", cursor: "pointer", marginBottom: 6, textAlign: "left" }}>
              <AvatarCell student={s} size={40} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{s.firstName} {s.lastName}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{s.class} · เลขที่ {s.number} · {s.studentId}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   MAIN APP
============================================================ */
export default function App() {
  const [session, setSession] = useState(null); // { role, studentId? }
  const [students, setStudents] = useState([]);
  const [view, setView] = useState("dashboard");
  const [detailId, setDetailId] = useState(null);
  const [modalStudent, setModalStudent] = useState(undefined); // undefined = closed, null = new
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [exportChoice, setExportChoice] = useState(false);
  const [exportImageStudent, setExportImageStudent] = useState(null);
  const [selectStudentForExport, setSelectStudentForExport] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [sortBy, setSortBy] = useState("number_asc");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  const canEdit = session && (session.role === "teacher" || session.role === "director");
  const isStudent = session && session.role === "student";

  /* ---- Toast ---- */
  const toast = useCallback((msg, type = "info") => {
    const id = genId();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  /* ---- Persistent Storage ---- */
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(DB_KEY);
        const data = result ? JSON.parse(result.value) : null;
        if (data && data.length) {
          setStudents(data);
        } else {
          setStudents(SAMPLE_STUDENTS);
          await window.storage.set(DB_KEY, JSON.stringify(SAMPLE_STUDENTS), true);
        }
      } catch {
        // fallback to sample
        setStudents(SAMPLE_STUDENTS);
      }
      setStorageReady(true);
    })();
  }, []);

  const persist = useCallback(async (list) => {
    try {
      await window.storage.set(DB_KEY, JSON.stringify(list), true);
    } catch {
      // silent
    }
  }, []);

  /* ---- Login ---- */
  const handleLogin = useCallback((role, pass) => {
    if (role === "student") {
      const found = students.find(s => s.studentId === pass);
      if (!found) {
        // can't verify yet if students not loaded — just set session and check later
        setSession({ role: "student", studentId: pass });
      } else {
        setSession({ role: "student", studentId: pass });
      }
    } else {
      setSession({ role });
    }
  }, [students]);

  // verify student login after students load
  useEffect(() => {
    if (session && session.role === "student" && storageReady) {
      const found = students.find(s => s.studentId === session.studentId);
      if (!found) {
        setSession(null);
        toast("ไม่พบเลขประจำตัวนักเรียนนี้", "error");
      }
    }
  }, [storageReady, students, session, toast]);

  /* ---- CRUD ---- */
  const saveStudent = useCallback((data) => {
    setStudents(prev => {
      let next;
      if (data.id && prev.find(s => s.id === data.id)) {
        next = prev.map(s => s.id === data.id ? { ...s, ...data } : s);
        toast("แก้ไขข้อมูลเรียบร้อยแล้ว", "success");
      } else {
        const newS = { id: genId(), createdAt: Date.now(), note: "", ...data };
        next = [...prev, newS];
        toast("เพิ่มนักเรียนเรียบร้อยแล้ว", "success");
      }
      persist(next);
      return next;
    });
    setModalStudent(undefined);
  }, [persist, toast]);

  const deleteStudent = useCallback((id) => {
    setStudents(prev => {
      const next = prev.filter(s => s.id !== id);
      persist(next);
      return next;
    });
    toast("ลบข้อมูลเรียบร้อยแล้ว", "info");
    setDeleteTarget(null);
    if (view === "detail") setView("students");
  }, [persist, toast, view]);

  /* ---- Export ---- */
  const exportJSON = () => {
    if (!students.length) { toast("ไม่มีข้อมูล", "error"); return; }
    dlFile("students.json", JSON.stringify({ exportedAt: new Date().toISOString(), count: students.length, students }, null, 2), "application/json");
    toast(`ส่งออก ${students.length} รายการ`, "success");
    setExportChoice(false);
  };
  const exportCSV = () => {
    if (!students.length) { toast("ไม่มีข้อมูล", "error"); return; }
    const h = ["เลขที่", "เลขประจำตัว", "ชื่อ", "นามสกุล", "ชั้น/ห้อง", "เพศ", "วันเกิด", "เบอร์โทร", "ที่อยู่", "หมายเหตุ"];
    const rows = students.map(s => [s.number, s.studentId, s.firstName, s.lastName, s.class, s.gender, s.birthdate, s.phone, s.address, s.note || ""].map(v => `"${(v || "").toString().replace(/"/g, '""')}"`).join(","));
    dlFile("students.csv", "\uFEFF" + [h.join(","), ...rows].join("\n"), "text/csv;charset=utf-8;");
    toast("ส่งออก CSV เรียบร้อย", "success");
    setExportChoice(false);
  };

  /* ---- Filter/Search ---- */
  const uniqueClasses = [...new Set(students.map(s => s.class).filter(Boolean))].sort((a, b) => a.localeCompare(b, "th"));
  const filtered = students.filter(s => {
    const q = search.trim().toLowerCase();
    const mq = !q || [s.firstName, s.lastName, s.studentId, s.class, String(s.number)].some(v => v?.toLowerCase().includes(q));
    return mq && (!filterClass || s.class === filterClass) && (!filterGender || s.gender === filterGender);
  }).sort((a, b) => {
    if (sortBy === "number_asc") return a.number - b.number;
    if (sortBy === "number_desc") return b.number - a.number;
    if (sortBy === "name_asc") return (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName, "th");
    if (sortBy === "name_desc") return (b.firstName + b.lastName).localeCompare(a.firstName + a.lastName, "th");
    return 0;
  });

  const totalPg = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const curPage = Math.min(page, totalPg);
  const pageStudents = filtered.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE);

  /* ---- Dashboard stats ---- */
  const males = students.filter(s => s.gender === "ชาย").length;
  const females = students.filter(s => s.gender === "หญิง").length;
  const classCounts = {};
  students.forEach(s => { classCounts[s.class] = (classCounts[s.class] || 0) + 1; });

  const detailStudent = detailId ? students.find(s => s.id === detailId) : null;
  const loggedStudent = isStudent ? students.find(s => s.studentId === session.studentId) : null;

  if (!session || (isStudent && !loggedStudent && storageReady)) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  /* ---- Styles ---- */
  const s = {
    app: { display: "flex", minHeight: "100vh", fontFamily: "'Noto Sans Thai', 'Inter', sans-serif", background: "#eef2fb", color: "#1e293b" },
    sidebar: {
      width: 256, background: "linear-gradient(180deg, rgba(10,16,40,.98), rgba(6,10,28,.99))",
      borderRight: "1px solid rgba(99,140,255,.12)", display: "flex", flexDirection: "column",
      position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 200,
      transform: sidebarOpen || window.innerWidth > 768 ? "translateX(0)" : "translateX(-100%)",
      transition: "transform .28s ease",
    },
    main: { marginLeft: window.innerWidth > 768 ? 256 : 0, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" },
    topbar: { height: 64, background: "#fff", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,.06)" },
    navItem: (active) => ({
      display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12,
      color: active ? "#fff" : "rgba(255,255,255,.45)", fontSize: 14, fontWeight: 500,
      cursor: "pointer", border: "none", background: active ? "rgba(37,99,235,.35)" : "none",
      width: "100%", textAlign: "left", marginBottom: 2, transition: "all .2s",
    }),
    card: { background: "#fff", borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,.06)", border: "1px solid rgba(226,232,240,.5)", overflow: "hidden" },
    btn: (variant = "primary") => ({
      display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 18px",
      borderRadius: 10, border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer",
      fontFamily: "inherit", transition: "all .15s",
      ...(variant === "primary" ? { background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff", boxShadow: "0 4px 0 #1438a0, 0 6px 20px rgba(37,99,235,.35)" }
        : variant === "danger" ? { background: "#fee2e2", color: "#b91c1c", border: "1.5px solid #fca5a5" }
        : variant === "ghost" ? { background: "#fff", color: "#475569", border: "1.5px solid #e2e8f0" }
        : { background: "#f0f5ff", color: "#1d4ed8", border: "1.5px solid #c5d8fd" })
    }),
  };

  const navView = (v, label, icon) => (
    <button style={s.navItem(view === v)} onClick={() => { setView(v); setSidebarOpen(false); }}>
      <Icon name={icon} size={18} color={view === v ? "#fff" : "rgba(255,255,255,.45)"} />
      {label}
    </button>
  );

  const GenderBadge = ({ gender }) => {
    const isMale = gender === "ชาย";
    const isFemale = gender === "หญิง";
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700,
        background: isMale ? "#dbeafe" : isFemale ? "#fce7f3" : "#ede9fe",
        color: isMale ? "#1d4ed8" : isFemale ? "#be185d" : "#7c3aed",
        border: `1px solid ${isMale ? "#93c5fd" : isFemale ? "#f9a8d4" : "#c4b5fd"}`,
      }}>
        <Icon name={isMale ? "male" : isFemale ? "female" : "other"} size={11} color={isMale ? "#1d4ed8" : isFemale ? "#be185d" : "#7c3aed"} />
        {gender}
      </span>
    );
  };

  return (
    <div style={s.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap');
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing:border-box; margin:0; padding:0; }
        button { cursor:pointer; font-family:inherit; }
        input, select, textarea { font-family:inherit; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:#c5d8fd; border-radius:999px; }
        table { border-collapse:collapse; width:100%; }
        th { text-align:left; padding:10px 14px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; color:#64748b; border-bottom:2px solid #f1f5f9; background:#f8fafc; }
        td { padding:12px 14px; border-bottom:1px solid #f8fafc; font-size:14px; vertical-align:middle; }
        tr:hover td { background:#f8fafc; }
        .view-anim { animation: fadeUp .3s ease; }
      `}</style>

      <ToastContainer toasts={toasts} />

      {/* ===== SIDEBAR ===== */}
      <aside style={{ ...s.sidebar, transform: sidebarOpen ? "translateX(0)" : window.innerWidth > 900 ? "translateX(0)" : "translateX(-100%)" }}>
        <div style={{ padding: "20px 18px", borderBottom: "1px solid rgba(99,140,255,.12)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#1d4ed8,#38bdf8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(37,99,235,.5)", flexShrink: 0 }}>
            <Icon name="cap" size={22} color="#fff" />
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>EduManage</div>
            <div style={{ color: "rgba(148,180,255,.6)", fontSize: 11 }}>ระบบจัดการนักเรียน</div>
          </div>
        </div>

        {/* Role badge */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(99,140,255,.08)" }}>
          <div style={{ background: "rgba(37,99,235,.15)", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name={session.role === "student" ? "users" : session.role === "director" ? "cap" : "shield"} size={15} color="#60a5fa" />
            <div>
              <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 600 }}>เข้าสู่ระบบในฐานะ</div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>
                {session.role === "teacher" ? "อาจารย์" : session.role === "director" ? "ผู้อำนวยการ" : `นักเรียน (${session.studentId})`}
              </div>
            </div>
          </div>
        </div>

        <nav style={{ padding: "12px 10px", flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(99,140,255,.4)", padding: "10px 10px 6px" }}>เมนูหลัก</div>
          {navView("dashboard", "แดชบอร์ด", "home")}
          {navView("students", "รายชื่อนักเรียน", "users")}
          {canEdit && <>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(99,140,255,.4)", padding: "10px 10px 6px", marginTop: 4 }}>ข้อมูล</div>
            <button style={s.navItem(false)} onClick={() => setExportChoice(true)}>
              <Icon name="download" size={18} color="rgba(255,255,255,.45)" /> ส่งออกข้อมูล
            </button>
          </>}
          {isStudent && loggedStudent && <>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(99,140,255,.4)", padding: "10px 10px 6px", marginTop: 4 }}>ข้อมูลของฉัน</div>
            <button style={s.navItem(view === "myprofile")} onClick={() => { setDetailId(loggedStudent.id); setView("detail"); setSidebarOpen(false); }}>
              <Icon name="eye" size={18} color="rgba(255,255,255,.45)" /> ดูข้อมูลของฉัน
            </button>
          </>}
        </nav>

        <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(99,140,255,.1)" }}>
          <button onClick={() => setSession(null)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 10, border: "none", background: "rgba(248,113,113,.1)", color: "#f87171", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            <Icon name="logout" size={16} color="#f87171" /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 199 }} />}

      {/* ===== MAIN ===== */}
      <main style={{ marginLeft: 256, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Topbar */}
        <header style={s.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "none", border: "none", padding: 6, borderRadius: 8, cursor: "pointer", display: "none" }}>
              <Icon name="menu" size={22} color="#64748b" />
            </button>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: "#1e293b" }}>
                {view === "dashboard" ? "แดชบอร์ด" : view === "students" ? "รายชื่อนักเรียน" : view === "detail" ? "ข้อมูลนักเรียน" : ""}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                {view === "dashboard" ? "ภาพรวมระบบ" : view === "students" ? `นักเรียนทั้งหมด ${students.length} คน` : "รายละเอียด"}
              </div>
            </div>
          </div>
          {canEdit && view === "students" && (
            <button style={s.btn("primary")} onClick={() => setModalStudent(null)}>
              <Icon name="plus" size={16} color="#fff" /> เพิ่มนักเรียน
            </button>
          )}
          {canEdit && view === "dashboard" && (
            <button style={s.btn("secondary")} onClick={() => setExportChoice(true)}>
              <Icon name="download" size={16} color="#1d4ed8" /> ส่งออก
            </button>
          )}
        </header>

        {/* Content */}
        <div style={{ padding: "28px 32px", flex: 1 }} className="view-anim">

          {/* ======= DASHBOARD ======= */}
          {view === "dashboard" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 18, marginBottom: 28 }}>
                {[
                  { label: "นักเรียนทั้งหมด", val: students.length, color: "#1d4ed8", bg: "linear-gradient(135deg,#1e40af,#3b82f6)", icon: "users" },
                  { label: "นักเรียนชาย", val: males, color: "#0284c7", bg: "linear-gradient(135deg,#0369a1,#38bdf8)", icon: "male" },
                  { label: "นักเรียนหญิง", val: females, color: "#be185d", bg: "linear-gradient(135deg,#9d174d,#f472b6)", icon: "female" },
                  { label: "ห้องเรียน", val: uniqueClasses.length, color: "#6d28d9", bg: "linear-gradient(135deg,#4c1d95,#a78bfa)", icon: "cap" },
                ].map(c => (
                  <div key={c.label} style={{ borderRadius: 20, padding: "24px 22px", background: c.bg, color: "#fff", boxShadow: "0 8px 0 rgba(0,0,0,.2), 0 14px 40px rgba(0,0,0,.2)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.08)" }} />
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                      <Icon name={c.icon} size={22} color="#fff" />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>{c.val}</div>
                    <div style={{ fontSize: 13, opacity: .8, marginTop: 6 }}>{c.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                {/* Gender donut */}
                <div style={s.card}>
                  <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #f1f5f9", fontWeight: 700, fontSize: 15 }}>สัดส่วนเพศ</div>
                  <div style={{ padding: 22, display: "flex", alignItems: "center", gap: 20 }}>
                    {students.length > 0 ? <>
                      <svg viewBox="0 0 42 42" width={100} height={100} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
                        <circle cx="21" cy="21" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                        {males > 0 && <circle cx="21" cy="21" r="15.9" fill="none" stroke="#2563eb" strokeWidth="5"
                          strokeDasharray={`${males / students.length * 100} ${100 - males / students.length * 100}`} strokeDashoffset="0" strokeLinecap="round" />}
                        {females > 0 && <circle cx="21" cy="21" r="15.9" fill="none" stroke="#ec4899" strokeWidth="5"
                          strokeDasharray={`${females / students.length * 100} ${100 - females / students.length * 100}`} strokeDashoffset={`${-males / students.length * 100}`} strokeLinecap="round" />}
                      </svg>
                      <div>
                        {[["#2563eb", "ชาย", males], ["#ec4899", "หญิง", females], ["#8b5cf6", "อื่นๆ", students.length - males - females]].filter(([, , n]) => n > 0).map(([c, lbl, n]) => (
                          <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: c, flexShrink: 0 }} />
                            <span style={{ fontSize: 13 }}>{lbl}</span>
                            <span style={{ marginLeft: "auto", fontWeight: 700, fontSize: 13 }}>{n} ({(n / students.length * 100).toFixed(1)}%)</span>
                          </div>
                        ))}
                      </div>
                    </> : <p style={{ color: "#94a3b8", fontSize: 13 }}>ยังไม่มีข้อมูล</p>}
                  </div>
                </div>

                {/* Class bar chart */}
                <div style={s.card}>
                  <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #f1f5f9", fontWeight: 700, fontSize: 15 }}>นักเรียนแยกตามชั้น</div>
                  <div style={{ padding: "16px 22px", display: "flex", alignItems: "flex-end", gap: 12, height: 140, overflowX: "auto" }}>
                    {Object.entries(classCounts).length > 0
                      ? Object.entries(classCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([cls, cnt]) => {
                        const max = Math.max(...Object.values(classCounts));
                        return (
                          <div key={cls} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 42 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#1d4ed8" }}>{cnt}</span>
                            <div style={{ width: 32, background: "linear-gradient(to top,#1d4ed8,#60a5fa)", borderRadius: "6px 6px 2px 2px", height: Math.max(12, Math.round(cnt / max * 80)) }} />
                            <span style={{ fontSize: 10, color: "#64748b", textAlign: "center", lineHeight: 1.2 }}>{cls}</span>
                          </div>
                        );
                      })
                      : <p style={{ color: "#94a3b8", fontSize: 13 }}>ยังไม่มีข้อมูล</p>
                    }
                  </div>
                </div>
              </div>

              {/* Recent */}
              <div style={s.card}>
                <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>นักเรียนล่าสุด <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>5 คน</span></div>
                  {!isStudent && <button style={s.btn("secondary")} onClick={() => setView("students")}>ดูทั้งหมด</button>}
                </div>
                <table>
                  <thead><tr><th>นักเรียน</th><th>เลขที่</th><th>ชั้น/ห้อง</th><th>เพศ</th></tr></thead>
                  <tbody>
                    {[...students].reverse().slice(0, 5).map(s => (
                      <tr key={s.id}>
                        <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <AvatarCell student={s} size={36} />
                          <span style={{ fontWeight: 600 }}>{s.firstName} {s.lastName}</span>
                        </div></td>
                        <td style={{ fontWeight: 600 }}>{s.number}</td>
                        <td style={{ fontWeight: 600 }}>{s.class}</td>
                        <td><GenderBadge gender={s.gender} /></td>
                      </tr>
                    ))}
                    {!students.length && <tr><td colSpan={4} style={{ textAlign: "center", color: "#94a3b8", padding: 28 }}>ยังไม่มีข้อมูล</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======= STUDENTS ======= */}
          {view === "students" && (
            <div style={s.card}>
              <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>
                  รายชื่อนักเรียน <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 12, padding: "2px 10px", borderRadius: 999, fontWeight: 700, marginLeft: 6 }}>{filtered.length} คน</span>
                </div>
                {canEdit && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={s.btn("ghost")} onClick={() => setExportChoice(true)}>
                      <Icon name="download" size={14} color="#64748b" /> ส่งออก
                    </button>
                    <button style={s.btn("primary")} onClick={() => setModalStudent(null)}>
                      <Icon name="plus" size={15} color="#fff" /> เพิ่มนักเรียน
                    </button>
                  </div>
                )}
              </div>

              {/* Toolbar */}
              <div style={{ padding: "14px 22px", borderBottom: "1px solid #f8fafc", display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
                    <Icon name="search" size={16} color="#94a3b8" />
                  </span>
                  <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="ค้นหาชื่อ เลขที่ เลขประจำตัว ชั้น..."
                    style={{ width: "100%", padding: "9px 14px 9px 38px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", background: "#f8fafc" }} />
                </div>
                <select value={filterClass} onChange={e => { setFilterClass(e.target.value); setPage(1); }} style={{ padding: "9px 32px 9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", background: "#f8fafc", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: 14 }}>
                  <option value="">ทุกชั้น</option>
                  {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={filterGender} onChange={e => { setFilterGender(e.target.value); setPage(1); }} style={{ padding: "9px 32px 9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", background: "#f8fafc", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: 14 }}>
                  <option value="">ทุกเพศ</option>
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: "9px 32px 9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", background: "#f8fafc", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: 14 }}>
                  <option value="number_asc">เลขที่ น้อย-มาก</option>
                  <option value="number_desc">เลขที่ มาก-น้อย</option>
                  <option value="name_asc">ชื่อ ก-ฮ</option>
                  <option value="name_desc">ชื่อ ฮ-ก</option>
                </select>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead><tr>
                    <th style={{ width: 36 }}>#</th>
                    <th>เลขที่</th>
                    <th>นักเรียน</th>
                    <th>เลขประจำตัว</th>
                    <th>ชั้น/ห้อง</th>
                    <th>เพศ</th>
                    <th>เบอร์โทร</th>
                    <th>จัดการ</th>
                  </tr></thead>
                  <tbody>
                    {pageStudents.map((st, i) => (
                      <tr key={st.id}>
                        <td style={{ color: "#94a3b8", fontSize: 12 }}>{(curPage - 1) * PAGE_SIZE + i + 1}</td>
                        <td style={{ fontWeight: 700, color: "#1d4ed8" }}>{st.number}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <AvatarCell student={st} size={38} />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 14 }}>{st.firstName} {st.lastName}</div>
                              {st.birthdate && <div style={{ fontSize: 12, color: "#94a3b8" }}>อายุ {calcAge(st.birthdate)} ปี</div>}
                            </div>
                          </div>
                        </td>
                        <td><span style={{ background: "#f1f5f9", padding: "3px 10px", borderRadius: 6, fontSize: 13, fontWeight: 600, fontFamily: "monospace" }}>{st.studentId}</span></td>
                        <td style={{ fontWeight: 600 }}>{st.class}</td>
                        <td><GenderBadge gender={st.gender} /></td>
                        <td style={{ fontSize: 13, color: "#64748b" }}>{st.phone || "—"}</td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button title="ดูรายละเอียด" onClick={() => { setDetailId(st.id); setView("detail"); }} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Icon name="eye" size={15} color="#64748b" />
                            </button>
                            {canEdit && <>
                              <button title="แก้ไข" onClick={() => setModalStudent(st)} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #c5d8fd", background: "#f0f5ff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Icon name="edit" size={15} color="#1d4ed8" />
                              </button>
                              <button title="ลบ" onClick={() => setDeleteTarget(st)} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #fca5a5", background: "#fee2e2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Icon name="trash" size={15} color="#b91c1c" />
                              </button>
                            </>}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!filtered.length && (
                      <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8" }}>
                        <Icon name="users" size={40} color="#e2e8f0" style={{ display: "block", margin: "0 auto 12px" }} />
                        ไม่พบข้อมูลนักเรียน
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filtered.length > PAGE_SIZE && (
                <div style={{ padding: "14px 22px", borderTop: "1px solid #f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>แสดง {(curPage - 1) * PAGE_SIZE + 1}–{Math.min(curPage * PAGE_SIZE, filtered.length)} จาก {filtered.length} รายการ</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {curPage > 1 && <button onClick={() => setPage(p => p - 1)} style={{ padding: "6px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>‹</button>}
                    {Array.from({ length: totalPg }, (_, i) => i + 1).filter(p => Math.abs(p - curPage) <= 2 || p === 1 || p === totalPg).map(p => (
                      <button key={p} onClick={() => setPage(p)} style={{ padding: "6px 12px", borderRadius: 8, border: "1.5px solid", borderColor: p === curPage ? "#2563eb" : "#e2e8f0", background: p === curPage ? "#2563eb" : "#fff", color: p === curPage ? "#fff" : "#1e293b", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{p}</button>
                    ))}
                    {curPage < totalPg && <button onClick={() => setPage(p => p + 1)} style={{ padding: "6px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>›</button>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======= DETAIL ======= */}
          {view === "detail" && detailStudent && (
            <div>
              <button style={{ ...s.btn("ghost"), marginBottom: 16 }} onClick={() => setView(isStudent ? "dashboard" : "students")}>
                <Icon name="back" size={15} color="#64748b" /> กลับ
              </button>
              <div style={s.card}>
                <div style={{ background: "linear-gradient(135deg,#1e40af,#1d4ed8,#3b82f6)", padding: "32px 36px", display: "flex", alignItems: "center", gap: 20 }}>
                  {detailStudent.photo
                    ? <img src={detailStudent.photo} alt="" style={{ width: 88, height: 88, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,.35)", boxShadow: "0 6px 24px rgba(0,0,0,.3)", flexShrink: 0 }} />
                    : <div style={{ flexShrink: 0 }}><GenderAvatar gender={detailStudent.gender} size={88} /></div>
                  }
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: 0 }}>{detailStudent.firstName} {detailStudent.lastName}</h2>
                    <p style={{ fontSize: 13, color: "rgba(148,180,255,.85)", marginTop: 4 }}>{detailStudent.class} · เลขที่ {detailStudent.number}</p>
                    <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                      <GenderBadge gender={detailStudent.gender} />
                      {detailStudent.birthdate && <span style={{ padding: "3px 12px", borderRadius: 999, background: "rgba(255,255,255,.15)", color: "rgba(255,255,255,.9)", fontSize: 12, fontWeight: 600 }}>อายุ {calcAge(detailStudent.birthdate)} ปี</span>}
                    </div>
                  </div>
                </div>
                <div style={{ padding: "30px 36px" }}>
                  {[
                    { title: "ข้อมูลทั่วไป", fields: [
                      ["เลขที่", detailStudent.number], ["เลขประจำตัวนักเรียน", detailStudent.studentId],
                      ["ชั้น/ห้อง", detailStudent.class], ["เพศ", detailStudent.gender],
                      ["วันเกิด", fmtDate(detailStudent.birthdate)], ["อายุ", detailStudent.birthdate ? calcAge(detailStudent.birthdate) + " ปี" : "—"],
                    ]},
                    { title: "ข้อมูลติดต่อ", fields: [
                      ["เบอร์โทรศัพท์", detailStudent.phone || "—"], ["ที่อยู่", detailStudent.address || "—"],
                    ]},
                    ...(detailStudent.note ? [{ title: "หมายเหตุ", fields: [["บันทึก", detailStudent.note]] }] : []),
                  ].map(sec => (
                    <div key={sec.title}>
                      <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "#2563eb", marginBottom: 14, marginTop: 24, paddingBottom: 7, borderBottom: "2px solid #dbeafe" }}>{sec.title}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        {sec.fields.map(([label, val]) => (
                          <div key={label} style={{ gridColumn: label === "ที่อยู่" || label === "บันทึก" ? "1/-1" : "auto" }}>
                            <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#94a3b8" }}>{label}</label>
                            <p style={{ fontSize: 14, color: "#1e293b", fontWeight: 600, marginTop: 2 }}>{val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {canEdit && (
                    <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
                      <button style={s.btn("primary")} onClick={() => setModalStudent(detailStudent)}>
                        <Icon name="edit" size={15} color="#fff" /> แก้ไขข้อมูล
                      </button>
                      <button style={s.btn("secondary")} onClick={() => { setExportImageStudent(detailStudent); }}>
                        <Icon name="image" size={15} color="#1d4ed8" /> ส่งออกรูปภาพ
                      </button>
                      <button style={s.btn("danger")} onClick={() => setDeleteTarget(detailStudent)}>
                        <Icon name="trash" size={15} color="#b91c1c" /> ลบข้อมูล
                      </button>
                    </div>
                  )}
                  {isStudent && (
                    <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
                      <button style={s.btn("secondary")} onClick={() => setExportImageStudent(detailStudent)}>
                        <Icon name="image" size={15} color="#1d4ed8" /> ส่งออกบัตรข้อมูล
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ===== MODALS ===== */}
      {modalStudent !== undefined && (
        <StudentModal student={modalStudent} onSave={saveStudent} onClose={() => setModalStudent(undefined)} />
      )}

      {deleteTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(8,15,40,.7)", backdropFilter: "blur(12px)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: 36, maxWidth: 380, width: "100%", textAlign: "center", boxShadow: "0 24px 80px rgba(0,0,0,.4)" }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg,#fee2e2,#fecaca)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", boxShadow: "0 6px 0 rgba(185,28,28,.12), 0 8px 28px rgba(239,68,68,.3)" }}>
              <Icon name="trash" size={30} color="#b91c1c" />
            </div>
            <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 10 }}>ยืนยันการลบ</h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>ต้องการลบข้อมูลของ <strong>{deleteTarget.firstName} {deleteTarget.lastName}</strong> ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button style={s.btn("ghost")} onClick={() => setDeleteTarget(null)}>ยกเลิก</button>
              <button style={s.btn("danger")} onClick={() => deleteStudent(deleteTarget.id)}>ลบข้อมูล</button>
            </div>
          </div>
        </div>
      )}

      {exportChoice && (
        <ExportChoiceModal
          onClose={() => setExportChoice(false)}
          onExportJSON={exportJSON}
          onExportCSV={exportCSV}
          onExportImage={() => { setExportChoice(false); setSelectStudentForExport(true); }}
          students={students}
        />
      )}

      {selectStudentForExport && (
        <SelectStudentModal
          students={students}
          onSelect={st => { setSelectStudentForExport(false); setExportImageStudent(st); }}
          onClose={() => setSelectStudentForExport(false)}
        />
      )}

      {exportImageStudent && (
        <ExportImageModal student={exportImageStudent} onClose={() => setExportImageStudent(null)} />
      )}
    </div>
  );
}

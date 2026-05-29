import { useEffect, useMemo, useState } from "react";

const colors = {
  primary: "#5c7936",
  primaryLight: "#779c46",
  primaryDark: "#415626",
  cream: "#e0debc",
  white: "#ffffff",
  bg: "#f4f3ec",
  textDark: "#1a2410",
  textMid: "#4a5e30",
  textLight: "#8a9e6a",
  red: "#c0392b",
  orange: "#e67e22",
  blue: "#2980b9",
  purple: "#6c5ce7",
};

const screens = {
  ONBOARDING: "onboarding",
  WELCOME: "welcome",
  LOGIN: "login",
  HOME: "home",
  AGENDAR: "agendar",
  RASTREAR: "rastrear",
  HISTORICO: "historico",
  PERFIL: "perfil",
  CONFIRMACAO: "confirmacao",
  USINA_HOME: "usina_home",
  USINA_SOLICITAR: "usina_solicitar",
  USINA_RASTREAR: "usina_rastrear",
  USINA_HISTORICO: "usina_historico",
  USINA_PERFIL: "usina_perfil",
  USINA_CONFIRMACAO: "usina_confirmacao",
  USINA_FORNECEDOR: "usina_fornecedor",
  ESG_DETALHE: "esg_detalhe",
  ADMIN_HOME: "admin_home",
};

const defaultNames = {
  empresa: "Supermercado Pão de Mel",
  usina: "Usina BioPower SP",
  admin: "Administrativo",
};

const mockColetas = [
  { id: "BF-2024-001", data: "Hoje, 14:00", tipo: "Resíduos Alimentares", peso: "320 kg", status: "em_transporte", empresa: "Supermercado Pão de Mel" },
  { id: "BF-2024-002", data: "Amanhã, 09:00", tipo: "Cascas e Orgânicos", peso: "180 kg", status: "agendada", empresa: "Restaurante Sabor Verde" },
  { id: "BF-2024-003", data: "22/05, 11:00", tipo: "Resíduos Industriais", peso: "850 kg", status: "agendada", empresa: "Indústria AlimBrasil" },
];

const mockHistorico = [
  { id: "BF-2023-188", data: "15/05/2026", peso: "290 kg", status: "concluida", biogasGerado: "43 m³" },
  { id: "BF-2023-187", data: "08/05/2026", peso: "310 kg", status: "concluida", biogasGerado: "48 m³" },
  { id: "BF-2023-186", data: "01/05/2026", peso: "275 kg", status: "concluida", biogasGerado: "40 m³" },
];

const mockInsumosUsina = [
  { id: "BF-US-001", empresa: "Supermercado Pão de Mel", tipo: "Resíduos Alimentares", peso: "320 kg", data: "Hoje, 14:00", status: "em_transporte", qualidade: "92%", biogasPrevisto: "48 m³", origem: "São Paulo - SP", destino: "Usina BioPower SP", contaminacao: "Baixa", contrato: "Mensal recorrente" },
  { id: "BF-US-002", empresa: "Restaurante Sabor Verde", tipo: "Cascas e Orgânicos", peso: "180 kg", data: "Amanhã, 09:00", status: "disponivel", qualidade: "89%", biogasPrevisto: "27 m³", origem: "Campinas - SP", destino: "Usina BioPower SP", contaminacao: "Muito baixa", contrato: "Avulso" },
  { id: "BF-US-003", empresa: "Indústria AlimBrasil", tipo: "Efluentes Orgânicos", peso: "1.200 kg", data: "22/05, 11:00", status: "triagem", qualidade: "84%", biogasPrevisto: "172 m³", origem: "Jundiaí - SP", destino: "Usina BioPower SP", contaminacao: "Média", contrato: "Contrato trimestral" },
];

const mockHistoricoUsina = [
  { id: "BF-US-188", data: "15/05/2026", empresa: "Hortifruti Bela Terra", peso: "620 kg", qualidade: "91%", biogasGerado: "93 m³", status: "recebido" },
  { id: "BF-US-187", data: "12/05/2026", empresa: "Laticínios Vale Azul", peso: "980 kg", qualidade: "87%", biogasGerado: "145 m³", status: "recebido" },
  { id: "BF-US-186", data: "08/05/2026", empresa: "Restaurante Sabor Verde", peso: "210 kg", qualidade: "94%", biogasGerado: "33 m³", status: "recebido" },
];

const statusMap = {
  em_transporte: { label: "Em Transporte", color: colors.blue },
  agendada: { label: "Agendada", color: colors.primaryLight },
  concluida: { label: "Concluída", color: "#27ae60" },
  aguardando: { label: "Aguardando", color: colors.orange },
  disponivel: { label: "Disponível", color: colors.primaryLight },
  triagem: { label: "Em Triagem", color: colors.orange },
  contratado: { label: "Contratado", color: colors.purple },
  recebido: { label: "Recebido", color: "#27ae60" },
};

const residuoPotencial = {
  "Restos Alimentares": { m3PerTon: 150, econPorTon: 220 },
  "Cascas e Orgânicos": { m3PerTon: 120, econPorTon: 180 },
  "Resíduos Industriais": { m3PerTon: 180, econPorTon: 260 },
  "Efluentes Orgânicos": { m3PerTon: 200, econPorTon: 280 },
  "Resíduos Alimentares": { m3PerTon: 155, econPorTon: 225 },
  "Mix Padronizado": { m3PerTon: 140, econPorTon: 200 },
};

const formatCurrency = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const formatTon = (v) => `${v.toFixed(2).replace(".", ",")} t`;

const calcularValorEmpresa = () => {
  const t = 1.24;
  const ass = 350;
  const taxOp = 150;
  const taxTon = 120;
  const cusLog = 280;
  const econTon = 180;
  const econOp = 100;
  const relESG = 90;
  const cert = 60;
  const receita = ass + taxOp + taxTon * t + relESG + cert;
  const custoTotal = receita + cusLog;
  const economia = t * econTon + econOp;
  const custoLiquido = custoTotal - economia;
  return { t, receita, custoTotal, cusLog, economia, custoLiquido, relESG, cert };
};

const calcularValorUsina = () => {
  const t = 3.2;
  const ass = 500;
  const taxInt = 90;
  const perc = 0.82;
  const valTon = 420;
  const econLog = 250;
  const receita = ass + t * taxInt;
  const biomassa = t * perc;
  const potencial = biomassa * valTon;
  const ganho = potencial + econLog - receita;
  return { t, receita, biomassa, potencial, ganho, econLog };
};

const calcularReceitaBioFlow = () => {
  const e = calcularValorEmpresa();
  const u = calcularValorUsina();
  const total = e.receita + u.receita;
  const custosProprios = total * 0.38;
  const suporte = total * 0.12;
  const produto = total * 0.09;
  return {
    volume: e.t + u.t,
    total,
    empresa: e.receita,
    usina: u.receita,
    logistica: e.cusLog,
    custosProprios,
    suporte,
    produto,
    margem: total - custosProprios - suporte - produto,
  };
};

const esgTier = (score) =>
  score < 20 ? { name: "Iniciante", icon: "🌱", color: "#78909c" }
    : score < 40 ? { name: "Bronze", icon: "🥉", color: "#a0764e" }
      : score < 60 ? { name: "Prata", icon: "🥈", color: "#8e9fa8" }
        : score < 80 ? { name: "Ouro", icon: "🥇", color: "#e8a020" }
          : { name: "Platina", icon: "💎", color: colors.primary };

const esgNextTier = (score) =>
  score < 20 ? { name: "Bronze", pts: 20 - score }
    : score < 40 ? { name: "Prata", pts: 40 - score }
      : score < 60 ? { name: "Ouro", pts: 60 - score }
        : score < 80 ? { name: "Platina", pts: 80 - score }
          : { name: "Platina", pts: 0 };

const roleScreen = (role) => (
  role === "usina" ? screens.USINA_HOME
    : role === "admin" ? screens.ADMIN_HOME
      : screens.HOME
);

const roleLabel = (role) => (
  role === "usina" ? "Painel da Usina de Biogás"
    : role === "admin" ? "Painel Administrativo BioFlow"
      : "Painel da Empresa Geradora"
);

const roleIcon = (role) => (
  role === "usina" ? "⚡"
    : role === "admin" ? "📊"
      : "🏪"
);

function Phone({ children }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      padding: 20,
      boxSizing: "border-box",
      background: "linear-gradient(135deg, #e9eadc 0%, #ced7c4 100%)",
      fontFamily: "'Georgia', serif",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        button, input, textarea { font: inherit; }
        button { -webkit-tap-highlight-color: transparent; }
        @keyframes softEnter {
          from { opacity: 0; transform: translate3d(0, 16px, 0) scale(0.985); filter: blur(2px); }
          to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
        }
        @keyframes onboardSlide {
          from { opacity: 0; transform: translate3d(24px, 0, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes barFill { from { width: 0%; } to { width: var(--bar-w); } }
        @keyframes pathDraw { from { stroke-dashoffset: 420; } to { stroke-dashoffset: 0; } }
        .bio-scroll { scrollbar-width: none; scroll-behavior: smooth; }
        .bio-scroll::-webkit-scrollbar { display: none; }
        .bio-button { transition: transform .22s ease, box-shadow .22s ease, background .22s ease, border-color .22s ease, color .22s ease; }
        .bio-button:active { transform: scale(.98); }
        .bio-card { transition: transform .24s ease, box-shadow .24s ease, border-color .24s ease; }
        .bio-card[data-clickable="true"]:hover { transform: translateY(-2px); box-shadow: 0 14px 30px #1a241016; }
      `}</style>
      <div style={{
        width: 390,
        height: 780,
        maxHeight: "calc(100vh - 40px)",
        background: colors.bg,
        borderRadius: 44,
        boxShadow: "0 40px 100px #1a241044, 0 0 0 8px #fff, 0 0 0 10px #e0debc",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}>
        <div style={{ background: colors.primaryDark, height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0 }}>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "sans-serif" }}>9:41</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center", color: "#fff", fontSize: 11, fontFamily: "sans-serif" }}>
            <span>●●●●</span>
            <span>WiFi</span>
            <span>🔋</span>
          </div>
        </div>
        <div className="bio-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function ScreenShell({ children, style = {} }) {
  return (
    <div style={{
      flex: 1,
      animation: "softEnter .42s cubic-bezier(.2,.8,.2,1)",
      willChange: "opacity, transform",
      ...style,
    }}>
      {children}
    </div>
  );
}

function Header({ title, subtitle, icon = "🌿", gradient = `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})` }) {
  return (
    <div style={{ background: gradient, padding: "28px 24px 24px", borderRadius: "0 0 26px 26px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: 22, margin: 0, fontWeight: 900 }}>{title}</h2>
          {subtitle && <p style={{ color: colors.cream, fontSize: 13, margin: "5px 0 0", fontFamily: "sans-serif", opacity: 0.88 }}>{subtitle}</p>}
        </div>
        <div style={{ background: "#ffffff22", borderRadius: 12, padding: "8px 10px", fontSize: 22 }}>{icon}</div>
      </div>
    </div>
  );
}

function Card({ children, onClick, style = {} }) {
  return (
    <div
      className="bio-card"
      data-clickable={Boolean(onClick)}
      onClick={onClick}
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 16,
        border: `1.5px solid ${colors.cream}`,
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, placeholder, value, onChange, multiline = false, type = "text" }) {
  const common = {
    display: "block",
    width: "100%",
    marginTop: 6,
    border: `1.5px solid ${colors.cream}`,
    borderRadius: 12,
    padding: "14px 16px",
    fontSize: 15,
    fontFamily: "sans-serif",
    background: "#fff",
    color: colors.textDark,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div>
      <label style={{ color: colors.primaryDark, fontSize: 12, fontWeight: 800, fontFamily: "sans-serif" }}>
        {label.toUpperCase()}
      </label>
      {multiline ? (
        <textarea value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={{ ...common, resize: "none", height: 80 }} />
      ) : (
        <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={common} />
      )}
    </div>
  );
}

function PrimaryButton({ children, onClick, style = {} }) {
  return (
    <button className="bio-button" onClick={onClick} style={{
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
      color: "#fff",
      border: "none",
      borderRadius: 14,
      padding: "16px 18px",
      fontSize: 15,
      fontWeight: 800,
      cursor: "pointer",
      fontFamily: "sans-serif",
      boxShadow: `0 8px 24px ${colors.primary}33`,
      ...style,
    }}>
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, style = {} }) {
  return (
    <button className="bio-button" onClick={onClick} style={{
      background: "#fff",
      color: colors.textMid,
      border: `1.5px solid ${colors.cream}`,
      borderRadius: 14,
      padding: "16px 18px",
      fontSize: 14,
      fontWeight: 800,
      cursor: "pointer",
      fontFamily: "sans-serif",
      ...style,
    }}>
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  const s = statusMap[status] || { label: status, color: "#999" };
  return (
    <span style={{
      background: `${s.color}22`,
      color: s.color,
      border: `1px solid ${s.color}44`,
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 800,
      padding: "3px 10px",
      fontFamily: "sans-serif",
      whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  );
}

function SimRow({ icon, label, value, highlight = false }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${colors.cream}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{ color: colors.textMid, fontSize: 12, fontFamily: "sans-serif", lineHeight: 1.25 }}>{label}</span>
      </div>
      <span style={{ color: highlight ? colors.primary : colors.primaryDark, fontWeight: highlight ? 900 : 800, fontSize: 13, fontFamily: "sans-serif", whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
}

function ESGCircle({ score, compact = false }) {
  const tier = esgTier(score);
  const r = compact ? 18 : 22;
  const size = compact ? 46 : 56;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={c} cy={c} r={r} fill="none" stroke={`${tier.color}22`} strokeWidth="5" />
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={tier.color}
          strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${c} ${c})`}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: compact ? 17 : 20 }}>
        {tier.icon}
      </div>
    </div>
  );
}

function ESGCard({ score, label, detail, onClick }) {
  const tier = esgTier(score);
  const next = esgNextTier(score);
  return (
    <Card onClick={onClick} style={{ background: `linear-gradient(135deg, ${tier.color}08, #fff)`, border: `1.5px solid ${tier.color}33` }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 14 }}>Score ESG BioFlow</div>
          <div style={{ color: colors.textLight, fontSize: 11, fontFamily: "sans-serif", marginTop: 3, lineHeight: 1.35 }}>{label}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ESGCircle score={score} />
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, color: tier.color, fontFamily: "sans-serif" }}>
              {score}<span style={{ fontSize: 10, color: colors.textLight, fontWeight: 400 }}>/100</span>
            </div>
            <div style={{ fontSize: 10, color: colors.textLight, fontFamily: "sans-serif" }}>{tier.name}</div>
          </div>
        </div>
      </div>
      <div style={{ background: "#f4f3ec", borderRadius: 8, height: 7, marginBottom: 10, overflow: "hidden" }}>
        <div style={{ "--bar-w": `${score}%`, height: "100%", width: `${score}%`, background: `linear-gradient(90deg, ${tier.color}, ${tier.color}cc)`, borderRadius: 8, animation: "barFill .9s ease forwards" }} />
      </div>
      <div style={{ background: `${tier.color}10`, borderRadius: 10, padding: "8px 12px", marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: colors.textMid, fontFamily: "sans-serif", lineHeight: 1.5 }}>{detail}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
        <div style={{ fontSize: 11, color: colors.textLight, fontFamily: "sans-serif" }}>
          {next.pts > 0 ? <>Mais <strong>{next.pts} pontos</strong> para {next.name}</> : "Nível máximo atingido"}
        </div>
        <span style={{ color: colors.primary, fontSize: 11, fontWeight: 900, fontFamily: "sans-serif" }}>Ver detalhes →</span>
      </div>
    </Card>
  );
}

function ESGGraph({ score, variant }) {
  const tier = esgTier(score);
  const values = variant === "usina" ? [18, 24, 27, 31, 36, 42] : [19, 25, 35, 41, 49, 57];
  const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
  const points = values.map((v, i) => `${26 + i * 51},${132 - v * 1.12}`).join(" ");
  const bars = variant === "usina"
    ? [{ l: "Qualidade", v: 84 }, { l: "Rastreio", v: 92 }, { l: "Volume", v: 64 }, { l: "Recorr.", v: 58 }]
    : [{ l: "Coletas", v: 76 }, { l: "CO₂", v: 68 }, { l: "Docs", v: 88 }, { l: "Recorr.", v: 52 }];

  return (
    <Card style={{ border: `1.5px solid ${tier.color}33` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 14 }}>Evolução do Score</div>
          <div style={{ color: colors.textLight, fontFamily: "sans-serif", fontSize: 10 }}>Histórico simulado mensal</div>
        </div>
        <ESGCircle score={score} compact />
      </div>
      <svg width="100%" height="148" viewBox="0 0 320 148" aria-label="Gráfico de evolução ESG" style={{ display: "block" }}>
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1="22" y1={24 + i * 31} x2="300" y2={24 + i * 31} stroke="#e8e4cc" strokeWidth="1" />
        ))}
        <defs>
          <linearGradient id="esgArea" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor={tier.color} stopOpacity=".18" />
            <stop stopColor={tier.color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`26,132 ${points} 281,132`} fill="url(#esgArea)" />
        <polyline
          points={points}
          fill="none"
          stroke={tier.color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="420"
          style={{ animation: "pathDraw 1s ease forwards" }}
        />
        {values.map((v, i) => (
          <g key={labels[i]}>
            <circle cx={26 + i * 51} cy={132 - v * 1.12} r="5" fill="#fff" stroke={tier.color} strokeWidth="3" />
            <text x={26 + i * 51} y="145" textAnchor="middle" fontSize="9" fill={colors.textLight} fontFamily="sans-serif">{labels[i]}</text>
          </g>
        ))}
      </svg>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
        {bars.map((bar) => (
          <div key={bar.l} style={{ background: colors.bg, borderRadius: 10, padding: "8px 9px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: "sans-serif", color: colors.textMid, marginBottom: 5 }}>
              <span>{bar.l}</span>
              <strong>{bar.v}%</strong>
            </div>
            <div style={{ height: 6, borderRadius: 6, background: "#e5e1c7", overflow: "hidden" }}>
              <div style={{ width: `${bar.v}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${tier.color}, ${colors.primaryLight})` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function CardTitle({ icon, title, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div>
        <div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 14 }}>{title}</div>
        {sub && <div style={{ color: colors.textLight, fontSize: 10, fontFamily: "sans-serif" }}>{sub}</div>}
      </div>
    </div>
  );
}

function OperationalVision({ compact = false }) {
  const bf = calcularReceitaBioFlow();
  const margemPct = Math.round((bf.margem / bf.total) * 100);
  return (
    <Card style={{ background: "linear-gradient(135deg, #f0f8ea, #fff)", border: `1.5px solid ${colors.primary}22` }}>
      <CardTitle icon="🌿" title="Visão operacional BioFlow" sub="Simulação interna baseada na atividade do app" />
      <SimRow icon="📦" label="Volume transacionado estimado" value={formatTon(bf.volume)} />
      <SimRow icon="🏪" label="Receita de empresas" value={formatCurrency(bf.empresa)} highlight />
      <SimRow icon="⚡" label="Receita de usinas" value={formatCurrency(bf.usina)} highlight />
      {!compact && <SimRow icon="🚛" label="Custos logísticos repassados" value={formatCurrency(bf.logistica)} />}
      <SimRow icon="⚙️" label="Custos próprios estimados" value={formatCurrency(bf.custosProprios + bf.suporte + bf.produto)} />
      <SimRow icon="📈" label="Lucro bruto simulado" value={`${formatCurrency(bf.margem)} (${margemPct}%)`} highlight />
      <p style={{ color: colors.textLight, fontSize: 10, fontFamily: "sans-serif", lineHeight: 1.5, margin: "10px 0 0" }}>
        Esta visão fica no Administrativo, com receita, custos e margem calculados a partir dos volumes e operações simuladas no aplicativo.
      </p>
    </Card>
  );
}

function MetricStrip({ items }) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      {items.map((c) => (
        <div key={c.label} style={{ flex: 1, background: "#ffffff18", borderRadius: 14, padding: "12px 10px", border: "1px solid #ffffff22" }}>
          <div style={{ fontSize: 18 }}>{c.icon}</div>
          <div style={{ color: "#fff", fontSize: 15, fontWeight: 900, marginTop: 4 }}>{c.value}</div>
          <div style={{ color: colors.cream, fontSize: 9, opacity: 0.85, fontFamily: "sans-serif", lineHeight: 1.3 }}>{c.label}</div>
        </div>
      ))}
    </div>
  );
}

function HeroHeader({ name, subtitle, icon, variant = "empresa", children }) {
  const gradient = variant === "usina" ? "linear-gradient(135deg, #1a3a2a, #2d6040)" : `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})`;
  return (
    <div style={{ background: gradient, padding: "28px 24px 32px", borderRadius: "0 0 28px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 14 }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ color: colors.cream, fontSize: 12, margin: 0, fontFamily: "sans-serif", opacity: 0.85 }}>{subtitle}</p>
          <h2 style={{ color: "#fff", fontSize: 20, margin: "2px 0 0", fontWeight: 900, lineHeight: 1.2 }}>{name} {icon}</h2>
        </div>
        <div style={{ background: "#ffffff22", borderRadius: 12, padding: "8px 10px", fontSize: 20 }}>🔔</div>
      </div>
      {children}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "9px 0", borderBottom: `1px solid ${colors.cream}` }}>
      <span style={{ color: colors.textLight, fontSize: 13, fontFamily: "sans-serif" }}>{label}</span>
      <span style={{ color: colors.primaryDark, fontSize: 13, fontWeight: 800, fontFamily: "sans-serif", textAlign: "right" }}>{value}</span>
    </div>
  );
}

function SectionTitle({ title, action, onAction }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: -6 }}>
      <h3 style={{ margin: 0, color: colors.primaryDark, fontSize: 16, fontWeight: 900 }}>{title}</h3>
      {action && <button onClick={onAction} style={{ background: "none", border: "none", color: colors.primary, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", padding: 0 }}>{action}</button>}
    </div>
  );
}

function StepHeader({ title, current, labels, dark = false }) {
  return (
    <div style={{ background: dark ? "#1a3a2a" : colors.primaryDark, padding: "28px 24px 20px", borderRadius: "0 0 24px 24px" }}>
      <h2 style={{ color: "#fff", fontSize: 22, margin: 0, fontWeight: 900 }}>{title}</h2>
      <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
        {labels.map((_, i) => <div key={labels[i]} style={{ flex: 1, height: 4, borderRadius: 4, background: current >= i ? colors.primaryLight : "#ffffff33", transition: "background .25s ease" }} />)}
      </div>
      <p style={{ color: colors.cream, fontSize: 12, margin: "8px 0 0", fontFamily: "sans-serif", opacity: 0.85 }}>
        {labels[current]} · Passo {current + 1}/{labels.length}
      </p>
    </div>
  );
}

function PickResiduo({ title, options, value, onPick }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h3 style={{ color: colors.primaryDark, margin: "0 0 8px", fontSize: 16 }}>{title}</h3>
      {options.map(([label, icon, sub]) => (
        <button key={label} className="bio-button" onClick={() => onPick(label)} style={{ background: value === label ? `${colors.primary}11` : "#fff", border: `1.5px solid ${value === label ? colors.primary : colors.cream}`, borderRadius: 14, padding: 16, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 28 }}>{icon}</span>
          <div>
            <div style={{ color: colors.primaryDark, fontWeight: 800, fontSize: 14 }}>{label}</div>
            <div style={{ color: colors.textLight, fontSize: 12, fontFamily: "sans-serif" }}>{sub}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

function PotentialCard({ tipo }) {
  if (!tipo) return null;
  const pot = residuoPotencial[tipo] || { m3PerTon: 140, econPorTon: 200 };
  return (
    <div style={{ background: `${colors.primary}0f`, border: `1px solid ${colors.primary}33`, borderRadius: 14, padding: "12px 14px", animation: "popIn .3s ease-out" }}>
      <div style={{ color: colors.primaryDark, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>💡 Potencial estimado - {tipo}</div>
      <div style={{ display: "flex", gap: 10 }}>
        {[["⚡", `~${pot.m3PerTon} m³/t`, "biogás potencial"], ["💰", formatCurrency(pot.econPorTon), "ganho/tonelada"]].map(([icon, val, label]) => (
          <div key={label} style={{ flex: 1, background: "#fff", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 16 }}>{icon}</div>
            <div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 13, fontFamily: "sans-serif" }}>{val}</div>
            <div style={{ color: colors.textLight, fontSize: 9, fontFamily: "sans-serif" }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ color: colors.textLight, fontSize: 10, fontFamily: "sans-serif", marginTop: 6 }}>
        Valores são simulações e variam conforme volume, qualidade e localização.
      </div>
    </div>
  );
}

function Timeline({ steps, title = "Linha do Tempo" }) {
  return (
    <Card>
      <h4 style={{ margin: "0 0 16px", color: colors.primaryDark, fontSize: 14 }}>{title}</h4>
      {steps.map((step, i) => (
        <div key={step.label} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i === steps.length - 1 ? 0 : 14 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: 18 }}>{step.icon}</span>
            {i < steps.length - 1 && <div style={{ width: 2, height: 22, background: step.done || step.active ? colors.primaryLight : colors.cream, marginTop: 4 }} />}
          </div>
          <div>
            <div style={{ color: step.done || step.active ? colors.primaryDark : colors.textLight, fontWeight: step.active ? 900 : 700, fontSize: 13, fontFamily: "sans-serif" }}>{step.label}</div>
            <div style={{ color: colors.textLight, fontSize: 11, fontFamily: "sans-serif", marginTop: 2 }}>{step.time}</div>
          </div>
        </div>
      ))}
    </Card>
  );
}

function SuccessScreen({ icon, title, code, body, info, score, cta, onClick }) {
  return (
    <ScreenShell style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", animation: "popIn .38s ease-out" }}>
      <div style={{ fontSize: 70, marginBottom: 16, lineHeight: 1 }}>{icon}</div>
      <h2 style={{ color: colors.primaryDark, fontSize: 26, margin: "0 0 12px", fontWeight: 900 }}>{title}</h2>
      <p style={{ color: colors.textMid, fontSize: 15, margin: "0 0 8px", fontFamily: "sans-serif", lineHeight: 1.6 }}>Código: <strong style={{ color: colors.primary }}>{code}</strong></p>
      <p style={{ color: colors.textLight, fontSize: 14, margin: "0 0 26px", fontFamily: "sans-serif", lineHeight: 1.6 }}>{body}</p>
      <Card style={{ background: colors.cream, width: "100%", marginBottom: 14 }}>
        <p style={{ margin: 0, fontSize: 13, color: colors.primaryDark, fontFamily: "sans-serif", lineHeight: 1.5 }}>🌍 {info}</p>
      </Card>
      <Card style={{ background: `${colors.primary}0d`, border: `1px solid ${colors.primary}22`, width: "100%", marginBottom: 24 }}>
        <p style={{ margin: 0, fontSize: 12, color: colors.textMid, fontFamily: "sans-serif", lineHeight: 1.5 }}>🏆 {score}</p>
      </Card>
      <PrimaryButton onClick={onClick}>{cta}</PrimaryButton>
    </ScreenShell>
  );
}

function HistoryRow({ item }) {
  return (
    <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
      <div>
        <div style={{ color: colors.primaryDark, fontWeight: 800, fontSize: 13 }}>{item.empresa || item.id}</div>
        <div style={{ color: colors.textLight, fontSize: 11, margin: "3px 0", fontFamily: "sans-serif" }}>{item.tipo || "Resíduo orgânico"} · {item.peso}</div>
        <StatusBadge status={item.status || "concluida"} />
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ color: colors.textLight, fontSize: 11, fontFamily: "sans-serif" }}>{item.data}</div>
        {(item.biogasGerado || item.biogasPrevisto) && <div style={{ color: colors.primary, fontSize: 12, fontWeight: 800, marginTop: 4 }}>⚡ {item.biogasGerado || item.biogasPrevisto}</div>}
        {item.qualidade && <div style={{ color: colors.textLight, fontSize: 10, fontFamily: "sans-serif" }}>Qual. {item.qualidade}</div>}
      </div>
    </Card>
  );
}

function ProfileRow({ icon, label, val }) {
  return (
    <Card style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ color: colors.textLight, fontSize: 11, fontFamily: "sans-serif" }}>{label}</div>
        <div style={{ color: colors.primaryDark, fontWeight: 800, fontSize: 13, fontFamily: "sans-serif" }}>{val}</div>
      </div>
      <span style={{ color: colors.textLight }}>›</span>
    </Card>
  );
}

function ProfileHeader({ icon, name, subtitle, variant = "empresa", badge }) {
  const gradient = variant === "usina" ? "linear-gradient(135deg, #1a3a2a, #2d6040)" : `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})`;
  return (
    <div style={{ background: gradient, padding: "32px 24px 40px", borderRadius: "0 0 28px 28px", textAlign: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 8 }}>{icon}</div>
      <h2 style={{ color: "#fff", margin: "0 0 4px", fontSize: 20, fontWeight: 900 }}>{name}</h2>
      <p style={{ color: colors.cream, margin: 0, fontSize: 13, fontFamily: "sans-serif", opacity: 0.85 }}>{subtitle}</p>
      {badge && (
        <div style={{ background: "#ffffff22", borderRadius: 10, padding: "6px 14px", display: "inline-block", marginTop: 10 }}>
          <span style={{ color: colors.cream, fontSize: 12, fontFamily: "sans-serif" }}>{badge}</span>
        </div>
      )}
    </div>
  );
}

function QuickAction({ icon, label, onClick }) {
  return (
    <button className="bio-button" onClick={onClick} style={{ flex: 1, background: "#fff", border: `1.5px solid ${colors.cream}`, borderRadius: 16, padding: "18px 0", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <span style={{ color: colors.primaryDark, fontSize: 12, fontWeight: 800, fontFamily: "sans-serif" }}>{label}</span>
    </button>
  );
}

export default function BioFlowApp() {
  const [screen, setScreen] = useState(screens.ONBOARDING);
  const [previousScreen, setPreviousScreen] = useState(screens.ONBOARDING);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [transitionKey, setTransitionKey] = useState(0);
  const [userType, setUserType] = useState("empresa");
  const [activeTab, setActiveTab] = useState("home");
  const [agendarStep, setAgendarStep] = useState(0);
  const [usinaStep, setUsinaStep] = useState(0);
  const [form, setForm] = useState({ tipo: "", peso: "", data: "", obs: "" });
  const [usinaForm, setUsinaForm] = useState({ tipo: "", volume: "", data: "", qualidade: "", recorrencia: "" });
  const [loginForm, setLoginForm] = useState({ nome: "", email: "", senha: "" });
  const [rastrearId, setRastrearId] = useState("BF-2024-001");
  const [usinaRastrearId, setUsinaRastrearId] = useState("BF-US-001");
  const [selectedFornecedorId, setSelectedFornecedorId] = useState("BF-US-002");
  const [insumosUsina, setInsumosUsina] = useState(mockInsumosUsina);
  const [esgContext, setEsgContext] = useState(null);

  useEffect(() => {
    try {
      const loginSalvo = localStorage.getItem("bioflow_login_form");
      const roleSalvo = localStorage.getItem("bioflow_user_type");
      const empresaSalva = localStorage.getItem("bioflow_empresa_form");
      const usinaSalva = localStorage.getItem("bioflow_usina_form");
      const insumosSalvos = localStorage.getItem("bioflow_insumos_usina");
      if (loginSalvo) setLoginForm(JSON.parse(loginSalvo));
      if (roleSalvo) setUserType(roleSalvo);
      if (empresaSalva) setForm(JSON.parse(empresaSalva));
      if (usinaSalva) setUsinaForm(JSON.parse(usinaSalva));
      if (insumosSalvos) setInsumosUsina(JSON.parse(insumosSalvos));
    } catch (e) {
      console.warn("BioFlow storage error", e);
    }
  }, []);

  useEffect(() => { localStorage.setItem("bioflow_login_form", JSON.stringify(loginForm)); }, [loginForm]);
  useEffect(() => { localStorage.setItem("bioflow_user_type", userType); }, [userType]);
  useEffect(() => { localStorage.setItem("bioflow_empresa_form", JSON.stringify(form)); }, [form]);
  useEffect(() => { localStorage.setItem("bioflow_usina_form", JSON.stringify(usinaForm)); }, [usinaForm]);
  useEffect(() => { localStorage.setItem("bioflow_insumos_usina", JSON.stringify(insumosUsina)); }, [insumosUsina]);

  const accountName = useMemo(() => {
    const typedName = loginForm.nome.trim();
    return typedName || defaultNames[userType] || defaultNames.empresa;
  }, [loginForm.nome, userType]);

  const currentInsumo = insumosUsina.find((i) => i.id === usinaRastrearId) || insumosUsina[0];
  const selectedFornecedor = insumosUsina.find((i) => i.id === selectedFornecedorId) || insumosUsina[1];

  const go = (nextScreen, tab) => {
    setPreviousScreen(screen);
    setTransitionKey((k) => k + 1);
    setScreen(nextScreen);
    if (tab) setActiveTab(tab);
  };

  const limparDadosSalvos = () => {
    localStorage.removeItem("bioflow_login_form");
    localStorage.removeItem("bioflow_user_type");
    localStorage.removeItem("bioflow_empresa_form");
    localStorage.removeItem("bioflow_usina_form");
    localStorage.removeItem("bioflow_insumos_usina");
    setLoginForm({ nome: "", email: "", senha: "" });
    setUserType("empresa");
    setForm({ tipo: "", peso: "", data: "", obs: "" });
    setUsinaForm({ tipo: "", volume: "", data: "", qualidade: "", recorrencia: "" });
    setInsumosUsina(mockInsumosUsina);
    go(screens.WELCOME);
  };

  const openEsg = (context) => {
    setEsgContext(context);
    go(screens.ESG_DETALHE);
  };

  const backFromEsg = () => {
    if (previousScreen && previousScreen !== screens.ESG_DETALHE) go(previousScreen);
    else go(userType === "usina" ? screens.USINA_HOME : screens.HOME, "home");
  };

  const acceptFornecedor = (id) => {
    setInsumosUsina((items) => items.map((item) => (
      item.id === id ? { ...item, status: "contratado", data: "Coleta confirmada: amanhã, 09:00" } : item
    )));
    setUsinaRastrearId(id);
    go(screens.USINA_CONFIRMACAO);
  };

  const NavBar = () => {
    if (userType === "admin") {
      return (
        <div style={{ display: "flex", borderTop: `1px solid ${colors.cream}`, background: "#fff", position: "sticky", bottom: 0, zIndex: 5 }}>
          {[{ id: "home", icon: "⊞", label: "Painel" }, { id: "perfil", icon: "◌", label: "Login" }].map((tab) => (
            <button key={tab.id} className="bio-button" onClick={() => { setActiveTab(tab.id); go(tab.id === "home" ? screens.ADMIN_HOME : screens.LOGIN, tab.id); }} style={{ flex: 1, border: "none", background: "transparent", padding: "10px 0 14px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: activeTab === tab.id ? colors.primary : "#aaa" }}>
              <span style={{ fontSize: 20 }}>{tab.icon}</span>
              <span style={{ fontSize: 10, fontWeight: activeTab === tab.id ? 800 : 500, fontFamily: "sans-serif" }}>{tab.label}</span>
            </button>
          ))}
        </div>
      );
    }

    const isUsina = userType === "usina";
    const tabs = isUsina
      ? [{ id: "home", icon: "⊞", label: "Painel" }, { id: "agendar", icon: "＋", label: "Insumos" }, { id: "rastrear", icon: "◎", label: "Entradas" }, { id: "historico", icon: "≡", label: "Histórico" }, { id: "perfil", icon: "◌", label: "Usina" }]
      : [{ id: "home", icon: "⊞", label: "Início" }, { id: "agendar", icon: "＋", label: "Agendar" }, { id: "rastrear", icon: "◎", label: "Rastrear" }, { id: "historico", icon: "≡", label: "Histórico" }, { id: "perfil", icon: "◌", label: "Perfil" }];

    return (
      <div style={{ display: "flex", borderTop: `1px solid ${colors.cream}`, background: "#fff", position: "sticky", bottom: 0, zIndex: 5 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className="bio-button"
            onClick={() => {
              setActiveTab(tab.id);
              if (isUsina) {
                if (tab.id === "agendar") { setUsinaStep(0); go(screens.USINA_SOLICITAR, tab.id); }
                else if (tab.id === "rastrear") go(screens.USINA_RASTREAR, tab.id);
                else if (tab.id === "historico") go(screens.USINA_HISTORICO, tab.id);
                else if (tab.id === "perfil") go(screens.USINA_PERFIL, tab.id);
                else go(screens.USINA_HOME, tab.id);
              } else {
                if (tab.id === "agendar") { setAgendarStep(0); go(screens.AGENDAR, tab.id); }
                else if (tab.id === "rastrear") go(screens.RASTREAR, tab.id);
                else if (tab.id === "historico") go(screens.HISTORICO, tab.id);
                else if (tab.id === "perfil") go(screens.PERFIL, tab.id);
                else go(screens.HOME, tab.id);
              }
            }}
            style={{ flex: 1, border: "none", background: "transparent", padding: "10px 0 14px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: activeTab === tab.id ? colors.primary : "#aaa" }}
          >
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: activeTab === tab.id ? 800 : 500, fontFamily: "sans-serif" }}>{tab.label}</span>
          </button>
        ))}
      </div>
    );
  };

  if (screen === screens.ONBOARDING) {
    const slides = [
      {
        icon: "🌿",
        bg: `linear-gradient(160deg, ${colors.primaryDark} 0%, ${colors.primary} 55%, ${colors.primaryLight} 100%)`,
        title: "A ponte que faltava",
        sub: "Conectando resíduos orgânicos a quem transforma em energia.",
        body: (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0 18px" }}>
              {[{ e: "🏪", l: "Empresas" }, { e: "🌿", l: "BioFlow" }, { e: "⚡", l: "Usinas" }].map((x) => (
                <div key={x.l} style={{ textAlign: "center" }}>
                  <div style={{ background: "#ffffff18", borderRadius: 16, padding: "14px 18px", fontSize: 28 }}>{x.e}</div>
                  <div style={{ color: colors.cream, fontSize: 10, marginTop: 4, fontFamily: "sans-serif" }}>{x.l}</div>
                </div>
              ))}
            </div>
            <p style={{ color: "#ffffffdd", fontSize: 13, fontFamily: "sans-serif", textAlign: "center", lineHeight: 1.6, margin: 0 }}>
              Coletamos, transportamos e rastreamos resíduos orgânicos de empresas geradoras até usinas de biogás.
            </p>
          </>
        ),
      },
      {
        icon: "🏪",
        bg: `linear-gradient(160deg, #1e3a1a 0%, ${colors.primaryDark} 50%, ${colors.primary} 100%)`,
        title: "Para Empresas",
        sub: "Transforme custo operacional em oportunidade ESG.",
        body: <ValueList items={[["♻️", "Destinação correta", "Resíduos rastreados e certificados"], ["💰", "Economia potencial", "Simule custos e ganho ESG"], ["🏆", "Relatório ESG", "Certificação de impacto ambiental"], ["📍", "Rastreabilidade", "Origem e destino documentados"]]} />,
      },
      {
        icon: "⚡",
        bg: "linear-gradient(160deg, #0f2a1e 0%, #1a3a2a 50%, #2d6040 100%)",
        title: "Para Usinas",
        sub: "Insumo garantido, rastreável e de qualidade.",
        body: <ValueList items={[["📦", "3,2 t/mês estimadas", "Biomassa via rede BioFlow"], ["⚡", "~1.102 m³ potencial", "Biogás mensal estimado"], ["🧪", "Qualidade", "Triagem e baixa contaminação"], ["📊", "Previsibilidade", "Fornecimento mais contínuo"]]} />,
      },
      {
        icon: "🚀",
        bg: `linear-gradient(160deg, ${colors.primaryDark} 0%, ${colors.primary} 55%, ${colors.primaryLight} 100%)`,
        title: "Escolha seu acesso",
        sub: "Empresa, usina ou Administrativo BioFlow.",
        body: (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[["empresa", "Sou uma Empresa 🏪"], ["usina", "Sou uma Usina de Biogás ⚡"], ["admin", "Administrativo 📊"]].map(([role, label], index) => (
              <button key={role} className="bio-button" onClick={() => { setUserType(role); go(screens.LOGIN); }} style={{ background: index === 0 ? "#fff" : "transparent", color: index === 0 ? colors.primaryDark : "#fff", border: index === 0 ? "none" : "2px solid #ffffff88", borderRadius: 16, padding: "15px 0", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "sans-serif" }}>
                {label}
              </button>
            ))}
          </div>
        ),
      },
    ];

    const slide = slides[onboardingStep];

    return (
      <Phone>
        <div key={onboardingStep} style={{ flex: 1, background: slide.bg, display: "flex", flexDirection: "column", padding: "36px 24px 28px", animation: "onboardSlide .38s cubic-bezier(.2,.8,.2,1)" }}>
          <div style={{ display: "flex", gap: 6, alignSelf: "center", marginBottom: 28 }}>
            {slides.map((_, i) => (
              <button key={i} onClick={() => setOnboardingStep(i)} style={{ width: i === onboardingStep ? 22 : 8, height: 8, borderRadius: 4, border: "none", background: i === onboardingStep ? "#fff" : "#ffffff44", transition: "all .3s ease", cursor: "pointer", padding: 0 }} />
            ))}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 44, marginBottom: 14, lineHeight: 1 }}>{slide.icon}</div>
            <h2 style={{ color: "#fff", fontSize: 26, margin: "0 0 6px", fontWeight: 900, lineHeight: 1.2 }}>{slide.title}</h2>
            <p style={{ color: colors.cream, fontSize: 13, margin: "0 0 20px", fontFamily: "sans-serif", opacity: 0.9, lineHeight: 1.5 }}>{slide.sub}</p>
            <div style={{ flex: 1 }}>{slide.body}</div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20, alignItems: "center" }}>
            {onboardingStep > 0 && <button className="bio-button" onClick={() => setOnboardingStep((s) => s - 1)} style={{ background: "#ffffff22", border: "none", borderRadius: 12, padding: "12px 14px", color: "#fff", cursor: "pointer", fontFamily: "sans-serif", fontSize: 14 }}>←</button>}
            {onboardingStep < slides.length - 1 && (
              <button className="bio-button" onClick={() => setOnboardingStep((s) => s + 1)} style={{ flex: 1, background: "#ffffff22", border: "2px solid #ffffff44", borderRadius: 14, padding: "13px 0", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "sans-serif" }}>
                {onboardingStep === 0 ? "Descobrir →" : "Próximo →"}
              </button>
            )}
            {onboardingStep < slides.length - 1 && <button onClick={() => go(screens.WELCOME)} style={{ background: "none", border: "none", color: "#ffffff77", fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", padding: 8 }}>Pular</button>}
          </div>
        </div>
      </Phone>
    );
  }

  if (screen === screens.WELCOME) {
    return (
      <Phone>
        <ScreenShell style={{ background: `linear-gradient(160deg, ${colors.primaryDark} 0%, ${colors.primary} 60%, ${colors.primaryLight} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 34 }}>
          <div style={{ fontSize: 52, marginBottom: 18, lineHeight: 1 }}>🌿</div>
          <h1 style={{ color: "#fff", fontSize: 42, fontWeight: 900, margin: 0 }}>BioFlow</h1>
          <p style={{ color: colors.cream, fontSize: 14, margin: "8px 0 42px", letterSpacing: 2, textTransform: "uppercase", fontFamily: "sans-serif" }}>Energia do que sobra</p>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
            {[["empresa", "Sou uma Empresa"], ["usina", "Sou uma Usina de Biogás"], ["admin", "Administrativo BioFlow"]].map(([role, label], i) => (
              <button key={role} className="bio-button" onClick={() => { setUserType(role); go(screens.LOGIN); }} style={{ background: i === 0 ? "#fff" : "transparent", color: i === 0 ? colors.primaryDark : "#fff", border: i === 0 ? "none" : "2px solid #ffffff88", borderRadius: 16, padding: "18px 0", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "sans-serif" }}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={() => { setOnboardingStep(0); go(screens.ONBOARDING); }} style={{ background: "none", border: "none", color: "#ffffff88", fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", marginTop: 24 }}>← Voltar à apresentação</button>
        </ScreenShell>
      </Phone>
    );
  }

  if (screen === screens.LOGIN) {
    const roles = [
      { id: "empresa", icon: "🏪", label: "Empresa", sub: "Geradora de resíduos" },
      { id: "usina", icon: "⚡", label: "Usina", sub: "Biogás e biomassa" },
      { id: "admin", icon: "📊", label: "Administrativo", sub: "Custos e resultados" },
    ];

    return (
      <Phone>
        <ScreenShell key={transitionKey} style={{ padding: "26px 28px", display: "flex", flexDirection: "column" }}>
          <button onClick={() => go(screens.WELCOME)} style={{ background: "none", border: "none", color: colors.textMid, cursor: "pointer", alignSelf: "flex-start", fontSize: 22, marginBottom: 18 }}>←</button>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 32 }}>{roleIcon(userType)}</div>
            <h2 style={{ color: colors.primaryDark, fontSize: 28, margin: "8px 0 4px", fontWeight: 900 }}>Entrar</h2>
            <p style={{ color: colors.textLight, fontSize: 14, margin: 0, fontFamily: "sans-serif" }}>{roleLabel(userType)}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 9 }}>
            {roles.map((role) => {
              const active = userType === role.id;
              return (
                <button key={role.id} className="bio-button" onClick={() => setUserType(role.id)} style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left", background: active ? `${colors.primary}12` : "#fff", color: colors.primaryDark, border: `1.5px solid ${active ? colors.primary : colors.cream}`, borderRadius: 14, padding: "12px 14px", cursor: "pointer" }}>
                  <span style={{ fontSize: 24 }}>{role.icon}</span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: "block", fontWeight: 900, fontSize: 13, fontFamily: "sans-serif" }}>{role.label}</span>
                    <span style={{ display: "block", color: colors.textLight, fontSize: 11, fontFamily: "sans-serif", marginTop: 1 }}>{role.sub}</span>
                  </span>
                  <span style={{ color: active ? colors.primary : colors.cream, fontWeight: 900 }}>●</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
            <Field label={userType === "admin" ? "Nome do acesso" : "Nome no cadastro"} placeholder={userType === "admin" ? "Administrativo" : "Ex: Felipe ou nome da empresa/usina"} value={loginForm.nome} onChange={(v) => setLoginForm((p) => ({ ...p, nome: v }))} />
            <Field label="E-mail" placeholder={userType === "admin" ? "admin@bioflow.com.br" : userType === "usina" ? "operacao@usinabio.com.br" : "contato@empresa.com.br"} value={loginForm.email} onChange={(v) => setLoginForm((p) => ({ ...p, email: v }))} />
            <Field label="Senha" placeholder="••••••••" type="password" value={loginForm.senha} onChange={(v) => setLoginForm((p) => ({ ...p, senha: v }))} />
            {userType === "admin" ? (
              <OperationalVision compact />
            ) : (
              <Card style={{ background: `${colors.primary}0d`, border: `1px solid ${colors.primary}22`, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: colors.textMid, fontFamily: "sans-serif", lineHeight: 1.6 }}>
                  {userType === "usina"
                    ? "Ao entrar, veja potencial de ganho líquido mensal, previsibilidade de insumo e qualidade de biomassa."
                    : "Ao entrar, veja sua simulação de valor, economia e evolução do Score ESG."}
                </div>
              </Card>
            )}
            <PrimaryButton onClick={() => go(roleScreen(userType), "home")} style={{ marginTop: 2 }}>
              Entrar como {accountName} →
            </PrimaryButton>
          </div>
        </ScreenShell>
      </Phone>
    );
  }

  if (screen === screens.HOME) {
    const emp = calcularValorEmpresa();
    const esgScore = 35;
    return (
      <Phone>
        <ScreenShell key={transitionKey} style={{ overflowY: "auto" }}>
          <HeroHeader name={accountName} subtitle="Bom dia," icon="🏪">
            <MetricStrip items={[{ label: "Resíduos coletados", value: "1.240 kg", icon: "♻️" }, { label: "Biogás gerado", value: "183 m³", icon: "⚡" }, { label: "CO₂ evitado", value: "420 kg", icon: "🌍" }]} />
          </HeroHeader>
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <QuickAction icon="📦" label="Agendar Coleta" onClick={() => { setAgendarStep(0); go(screens.AGENDAR, "agendar"); }} />
              <QuickAction icon="📍" label="Rastrear" onClick={() => go(screens.RASTREAR, "rastrear")} />
            </div>
            <ESGCard
              score={esgScore}
              label="Baseado em resíduos destinados corretamente este mês"
              detail="Você destinou corretamente 875 kg de resíduos orgânicos. Cada coleta aumenta seu score e fortalece seu posicionamento sustentável."
              onClick={() => openEsg({ variant: "empresa", score: esgScore, owner: accountName })}
            />
            <SectionTitle title="Próximas Coletas" action="Ver todas →" onAction={() => go(screens.HISTORICO, "historico")} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {mockColetas.slice(0, 2).map((c) => (
                <Card key={c.id} onClick={() => { setRastrearId(c.id); go(screens.RASTREAR, "rastrear"); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <div>
                    <StatusBadge status={c.status} />
                    <div style={{ color: colors.primaryDark, fontWeight: 800, fontSize: 14, marginTop: 6 }}>{c.tipo}</div>
                    <div style={{ color: colors.textLight, fontSize: 12, marginTop: 2, fontFamily: "sans-serif" }}>{c.data} · {c.peso}</div>
                  </div>
                  <span style={{ color: colors.textLight, fontSize: 20 }}>›</span>
                </Card>
              ))}
            </div>
            <Card style={{ background: "linear-gradient(135deg, #f0f8ea, #fff)", border: `1.5px solid ${colors.primary}33` }}>
              <CardTitle icon="💡" title="Simulação de valor estimado" sub="Dados simulados · podem variar" />
              <SimRow icon="📦" label="Volume destinado corretamente" value={`${formatTon(emp.t)}/mês`} />
              <SimRow icon="🧾" label="Custo estimado da plataforma" value={formatCurrency(emp.receita)} />
              <SimRow icon="🚛" label="Custo logístico estimado" value={formatCurrency(emp.cusLog)} />
              <SimRow icon="💰" label="Economia potencial" value={formatCurrency(emp.economia)} highlight />
              <SimRow icon="📊" label="Custo líquido estimado" value={formatCurrency(emp.custoLiquido)} />
            </Card>
          </div>
        </ScreenShell>
        <NavBar />
      </Phone>
    );
  }

  if (screen === screens.AGENDAR) {
    return (
      <Phone>
        <ScreenShell key={transitionKey} style={{ display: "flex", flexDirection: "column" }}>
          <StepHeader title="Agendar Coleta" current={agendarStep} labels={["Tipo de resíduo", "Data e quantidade", "Confirmação"]} />
          <div style={{ padding: "24px 20px", flex: 1, overflowY: "auto" }}>
            {agendarStep === 0 && (
              <PickResiduo
                title="Qual tipo de resíduo?"
                value={form.tipo}
                options={[["Restos Alimentares", "🥦", "Restaurantes, lanchonetes"], ["Cascas e Orgânicos", "🍊", "Frutas, legumes, hortifrutis"], ["Resíduos Industriais", "🏭", "Indústria alimentícia"], ["Efluentes Orgânicos", "💧", "Laticínios, frigoríficos"]]}
                onPick={(label) => { setForm((f) => ({ ...f, tipo: label })); setAgendarStep(1); }}
              />
            )}
            {agendarStep === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h3 style={{ color: colors.primaryDark, margin: "0 0 4px", fontSize: 16 }}>Detalhes da coleta</h3>
                <PotentialCard tipo={form.tipo} />
                <Field label="Data preferida" placeholder="22/05/2026" value={form.data} onChange={(v) => setForm((p) => ({ ...p, data: v }))} />
                <Field label="Volume estimado (kg)" placeholder="Ex: 200" value={form.peso} onChange={(v) => setForm((p) => ({ ...p, peso: v }))} />
                <Field label="Observações" placeholder="Ex: resíduos ficam no fundo do estabelecimento..." value={form.obs} onChange={(v) => setForm((p) => ({ ...p, obs: v }))} multiline />
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <SecondaryButton onClick={() => setAgendarStep(0)} style={{ flex: 1 }}>← Voltar</SecondaryButton>
                  <PrimaryButton onClick={() => setAgendarStep(2)} style={{ flex: 2 }}>Continuar →</PrimaryButton>
                </div>
              </div>
            )}
            {agendarStep === 2 && (
              <ConfirmBox
                title="Confirme os dados"
                rows={[["Tipo de resíduo", form.tipo || "Restos Alimentares"], ["Data", form.data || "22/05/2026"], ["Volume estimado", `${form.peso || "200"} kg`], ["Empresa", accountName], ["Destino", "Usina BioPower SP"]]}
                message="Nossa transportadora parceira entrará em contato em até 2 horas para confirmar a janela de coleta."
                onBack={() => setAgendarStep(1)}
                onConfirm={() => go(screens.CONFIRMACAO)}
                confirmLabel="Confirmar Coleta ✓"
              />
            )}
          </div>
        </ScreenShell>
        <NavBar />
      </Phone>
    );
  }

  if (screen === screens.CONFIRMACAO) {
    return (
      <Phone>
        <SuccessScreen
          icon="🎉"
          title="Coleta Agendada!"
          code="BF-2024-003"
          body="Você receberá uma notificação quando a transportadora confirmar a coleta."
          info="Esta coleta vai gerar aproximadamente ~45 m³ de biogás, evitando 62 kg de CO₂."
          score="+3 pontos no seu Score ESG estimado por esta destinação correta."
          cta="Ir para o Início →"
          onClick={() => go(screens.HOME, "home")}
        />
      </Phone>
    );
  }

  if (screen === screens.RASTREAR) {
    const coleta = mockColetas.find((c) => c.id === rastrearId) || mockColetas[0];
    return (
      <Phone>
        <ScreenShell key={transitionKey} style={{ overflowY: "auto" }}>
          <Header title="Rastreamento" subtitle="Acompanhe sua coleta em tempo real" icon="📍" />
          <div style={{ padding: 20 }}>
            <SegmentedIds items={mockColetas} current={rastrearId} onPick={setRastrearId} prefix="BF-2024-" />
            <Card style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <StatusBadge status={coleta.status} />
                <div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 15, marginTop: 6 }}>{coleta.id}</div>
                <div style={{ color: colors.textLight, fontSize: 12, fontFamily: "sans-serif" }}>{coleta.tipo} · {coleta.peso}</div>
              </div>
              <span style={{ fontSize: 28 }}>{coleta.status === "em_transporte" ? "🚛" : "📅"}</span>
            </Card>
            <Timeline steps={[
              { icon: "✅", label: "Coleta agendada", time: "Hoje, 09:00", done: true },
              { icon: coleta.status === "em_transporte" ? "✅" : "⏳", label: "Transportadora a caminho", time: coleta.status === "em_transporte" ? "Hoje, 13:00" : "Aguardando", done: coleta.status === "em_transporte" },
              { icon: coleta.status === "em_transporte" ? "🚛" : "⭕", label: "Em transporte para a usina", time: coleta.status === "em_transporte" ? "Hoje, 13:40" : "-", active: coleta.status === "em_transporte" },
              { icon: "⭕", label: "Chegada na usina", time: "Previsto: 16:30" },
              { icon: "⭕", label: "Processamento e biogás gerado", time: "Previsto: amanhã" },
            ]} />
          </div>
        </ScreenShell>
        <NavBar />
      </Phone>
    );
  }

  if (screen === screens.HISTORICO) {
    return (
      <Phone>
        <ScreenShell key={transitionKey} style={{ overflowY: "auto" }}>
          <Header title="Histórico" subtitle="Todas as suas coletas e impacto gerado" icon="≡" />
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <SummaryCard title="Resumo do Mês - Maio 2026" metrics={[["875 kg", "Coletados"], ["131 m³", "Biogás"], ["R$ 124", "Economizado"]]} />
            {[...mockColetas, ...mockHistorico.map((h) => ({ ...h, tipo: "Resíduos Alimentares", empresa: accountName }))].map((c) => <HistoryRow key={c.id} item={c} />)}
          </div>
        </ScreenShell>
        <NavBar />
      </Phone>
    );
  }

  if (screen === screens.PERFIL) {
    return (
      <Phone>
        <ScreenShell key={transitionKey} style={{ overflowY: "auto" }}>
          <ProfileHeader icon="🏪" name={accountName} subtitle="CNPJ: 12.345.678/0001-99" />
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            {[["📍", "Endereço de coleta", "Av. Paulista, 1234 - São Paulo"], ["📞", "Contato", "(11) 91234-5678"], ["📧", "E-mail", loginForm.email || "contato@empresa.com.br"], ["🔔", "Notificações", "Ativadas"], ["📄", "Relatório ESG", "Baixar PDF"]].map(([icon, label, val]) => (
              <ProfileRow key={label} icon={icon} label={label} val={val} />
            ))}
            <button className="bio-button" onClick={limparDadosSalvos} style={{ background: "#fff2f0", border: "1.5px solid #ffcccc", borderRadius: 14, padding: 16, color: colors.red, fontWeight: 800, fontSize: 14, cursor: "pointer", marginTop: 8, fontFamily: "sans-serif" }}>Sair da conta</button>
          </div>
        </ScreenShell>
        <NavBar />
      </Phone>
    );
  }

  if (screen === screens.USINA_HOME) {
    const usina = calcularValorUsina();
    const esgScore = 27;
    return (
      <Phone>
        <ScreenShell key={transitionKey} style={{ overflowY: "auto" }}>
          <HeroHeader name={accountName} subtitle="Bem-vinda," icon="⚡" variant="usina">
            <MetricStrip items={[{ label: "Insumos garantidos", value: "2,8 t", icon: "📥" }, { label: "Biogás previsto", value: "392 m³", icon: "⚡" }, { label: "Capacidade", value: "87%", icon: "📊" }]} />
          </HeroHeader>
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <QuickAction icon="🧾" label="Solicitar insumo" onClick={() => { setUsinaStep(0); go(screens.USINA_SOLICITAR, "agendar"); }} />
              <QuickAction icon="🚛" label="Monitorar entradas" onClick={() => go(screens.USINA_RASTREAR, "rastrear")} />
            </div>
            <ESGCard
              score={esgScore}
              label="Baseado em biomassa aproveitada para biogás este mês"
              detail="A usina aproveitou 271 m³ de biogás a partir de biomassa recebida via BioFlow."
              onClick={() => openEsg({ variant: "usina", score: esgScore, owner: accountName })}
            />
            <Card style={{ background: "#fff8e8", border: `1px solid ${colors.orange}44` }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 28 }}>⚠️</span>
                <div>
                  <div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 14 }}>Previsibilidade em risco</div>
                  <div style={{ color: colors.textMid, fontSize: 12, marginTop: 2, fontFamily: "sans-serif" }}>Faltam 640 kg para operar com 95% da capacidade amanhã.</div>
                </div>
              </div>
            </Card>
            <SectionTitle title="Fornecimentos disponíveis" action="Buscar mais →" onAction={() => go(screens.USINA_SOLICITAR, "agendar")} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {insumosUsina.map((c) => (
                <Card key={c.id} onClick={() => { setSelectedFornecedorId(c.id); go(screens.USINA_FORNECEDOR); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <div>
                    <StatusBadge status={c.status} />
                    <div style={{ color: colors.primaryDark, fontWeight: 800, fontSize: 14, marginTop: 6 }}>{c.empresa}</div>
                    <div style={{ color: colors.textLight, fontSize: 12, marginTop: 2, fontFamily: "sans-serif" }}>{c.tipo} · {c.peso} · Qualidade {c.qualidade}</div>
                  </div>
                  <span style={{ color: colors.textLight, fontSize: 20 }}>›</span>
                </Card>
              ))}
            </div>
            <Card style={{ background: "linear-gradient(135deg, #f0fbf4, #fff)", border: `1.5px solid ${colors.primary}33` }}>
              <CardTitle icon="📊" title="Potencial da biomassa recebida" sub="Dados simulados · podem variar" />
              <SimRow icon="📦" label="Toneladas recebidas" value={`${formatTon(usina.t)}/mês`} />
              <SimRow icon="🌿" label="Biomassa aproveitável estimada" value={formatTon(usina.biomassa)} highlight />
              <SimRow icon="💵" label="Valor potencial gerado" value={formatCurrency(usina.potencial)} highlight />
              <SimRow icon="🧾" label="Valor pago à BioFlow" value={formatCurrency(usina.receita)} />
              <SimRow icon="📈" label="Ganho líquido potencial" value={formatCurrency(usina.ganho)} highlight />
            </Card>
          </div>
        </ScreenShell>
        <NavBar />
      </Phone>
    );
  }

  if (screen === screens.USINA_FORNECEDOR) {
    return (
      <Phone>
        <ScreenShell key={transitionKey} style={{ overflowY: "auto" }}>
          <Header title="Detalhe do Insumo" subtitle="Avalie qualidade, volume e logística" icon="🧪" gradient="linear-gradient(135deg, #1a3a2a, #2d6040)" />
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <button onClick={() => go(screens.USINA_HOME, "home")} style={{ background: "none", border: "none", color: colors.textMid, cursor: "pointer", alignSelf: "flex-start", fontSize: 14, fontFamily: "sans-serif" }}>← Voltar ao painel</button>
            <Card style={{ background: `${colors.primary}0d`, border: `1px solid ${colors.primary}22` }}>
              <CardTitle icon="💡" title="Percepção de valor" sub="Aceitar esta carga" />
              <div style={{ display: "flex", gap: 8 }}>
                {[{ icon: "⚡", val: selectedFornecedor.biogasPrevisto, label: "biogás previsto" }, { icon: "🧪", val: selectedFornecedor.qualidade, label: "qualidade" }].map((x) => (
                  <div key={x.label} style={{ flex: 1, background: "#fff", borderRadius: 10, padding: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 16 }}>{x.icon}</div>
                    <div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 13, fontFamily: "sans-serif" }}>{x.val}</div>
                    <div style={{ color: colors.textLight, fontSize: 9, fontFamily: "sans-serif" }}>{x.label}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <StatusBadge status={selectedFornecedor.status} />
                  <h3 style={{ color: colors.primaryDark, margin: "8px 0 2px", fontSize: 18 }}>{selectedFornecedor.empresa}</h3>
                  <p style={{ margin: 0, color: colors.textLight, fontSize: 12, fontFamily: "sans-serif" }}>{selectedFornecedor.origem}</p>
                </div>
                <span style={{ fontSize: 34 }}>🏭</span>
              </div>
              {[["Tipo", selectedFornecedor.tipo], ["Volume", selectedFornecedor.peso], ["Qualidade BioFlow", selectedFornecedor.qualidade], ["Contaminação", selectedFornecedor.contaminacao], ["Biogás previsto", selectedFornecedor.biogasPrevisto], ["Modelo", selectedFornecedor.contrato]].map(([label, value]) => (
                <DetailRow key={label} label={label} value={value} />
              ))}
            </Card>
            <Card style={{ background: `${colors.primaryLight}18`, border: `1px solid ${colors.primaryLight}44` }}>
              <div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 14, marginBottom: 6 }}>Por que aceitar?</div>
              <p style={{ color: colors.textMid, fontSize: 13, fontFamily: "sans-serif", lineHeight: 1.5, margin: 0 }}>Este lote reduz o risco de falta de matéria-prima, aumenta previsibilidade de produção e já vem com triagem e rastreabilidade logística BioFlow.</p>
            </Card>
            <div style={{ display: "flex", gap: 10 }}>
              <SecondaryButton onClick={() => go(screens.USINA_HOME, "home")} style={{ flex: 1 }}>Recusar</SecondaryButton>
              <PrimaryButton onClick={() => acceptFornecedor(selectedFornecedor.id)} style={{ flex: 2 }}>Aceitar carga ✓</PrimaryButton>
            </div>
          </div>
        </ScreenShell>
        <NavBar />
      </Phone>
    );
  }

  if (screen === screens.USINA_SOLICITAR) {
    return (
      <Phone>
        <ScreenShell key={transitionKey} style={{ display: "flex", flexDirection: "column" }}>
          <StepHeader title="Solicitar Insumo" current={usinaStep} labels={["Tipo necessário", "Volume e frequência", "Confirmação"]} dark />
          <div style={{ padding: "24px 20px", flex: 1, overflowY: "auto" }}>
            {usinaStep === 0 && (
              <PickResiduo
                title="Que matéria-prima sua usina precisa?"
                value={usinaForm.tipo}
                options={[["Restos Alimentares", "🥦", "Alto potencial e coleta frequente"], ["Cascas e Orgânicos", "🍊", "Boa qualidade e baixa contaminação"], ["Efluentes Orgânicos", "💧", "Maior volume para produção contínua"], ["Mix Padronizado", "🧪", "Blend indicado pela BioFlow"]]}
                onPick={(label) => { setUsinaForm((f) => ({ ...f, tipo: label })); setUsinaStep(1); }}
              />
            )}
            {usinaStep === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h3 style={{ color: colors.primaryDark, margin: "0 0 4px", fontSize: 16 }}>Defina a demanda operacional</h3>
                <PotentialCard tipo={usinaForm.tipo} />
                <Field label="Volume necessário" placeholder="Ex: 1.500 kg/semana" value={usinaForm.volume} onChange={(v) => setUsinaForm((p) => ({ ...p, volume: v }))} />
                <Field label="Data limite" placeholder="Ex: até 24/05/2026" value={usinaForm.data} onChange={(v) => setUsinaForm((p) => ({ ...p, data: v }))} />
                <Field label="Qualidade mínima" placeholder="Ex: acima de 85%" value={usinaForm.qualidade} onChange={(v) => setUsinaForm((p) => ({ ...p, qualidade: v }))} />
                <Field label="Recorrência" placeholder="Ex: diária, semanal ou mensal" value={usinaForm.recorrencia} onChange={(v) => setUsinaForm((p) => ({ ...p, recorrencia: v }))} />
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <SecondaryButton onClick={() => setUsinaStep(0)} style={{ flex: 1 }}>← Voltar</SecondaryButton>
                  <PrimaryButton onClick={() => setUsinaStep(2)} style={{ flex: 2 }}>Continuar →</PrimaryButton>
                </div>
              </div>
            )}
            {usinaStep === 2 && (
              <ConfirmBox
                title="Confirme a solicitação"
                rows={[["Tipo de insumo", usinaForm.tipo || "Mix Padronizado"], ["Volume", usinaForm.volume || "1.500 kg/semana"], ["Prazo", usinaForm.data || "Até 24/05/2026"], ["Qualidade mínima", usinaForm.qualidade || "Acima de 85%"], ["Recorrência", usinaForm.recorrencia || "Semanal"]]}
                message="A BioFlow buscará fornecedores compatíveis e priorizará lotes com rastreabilidade, separação correta na origem e melhor custo logístico."
                onBack={() => setUsinaStep(1)}
                onConfirm={() => go(screens.USINA_CONFIRMACAO)}
                confirmLabel="Confirmar demanda ✓"
              />
            )}
          </div>
        </ScreenShell>
        <NavBar />
      </Phone>
    );
  }

  if (screen === screens.USINA_CONFIRMACAO) {
    return (
      <Phone>
        <SuccessScreen
          icon="✅"
          title="Demanda Confirmada!"
          code="BF-US-004"
          body="Sua usina receberá opções de fornecimento compatíveis com volume, qualidade e prazo."
          info="Estimativa inicial: até 225 m³ de biogás com a demanda solicitada."
          score="+4 pontos no Score ESG da usina por esta solicitação de biomassa aproveitável."
          cta="Monitorar entradas →"
          onClick={() => go(screens.USINA_RASTREAR, "rastrear")}
        />
      </Phone>
    );
  }

  if (screen === screens.USINA_RASTREAR) {
    return (
      <Phone>
        <ScreenShell key={transitionKey} style={{ overflowY: "auto" }}>
          <Header title="Entradas da Usina" subtitle="Rastreie matéria-prima, qualidade e chegada" icon="🚛" gradient="linear-gradient(135deg, #1a3a2a, #2d6040)" />
          <div style={{ padding: 20 }}>
            <SegmentedIds items={insumosUsina} current={usinaRastrearId} onPick={setUsinaRastrearId} prefix="BF-US-" />
            <Card style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <StatusBadge status={currentInsumo.status} />
                  <div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 15, marginTop: 6 }}>{currentInsumo.empresa}</div>
                  <div style={{ color: colors.textLight, fontSize: 12, fontFamily: "sans-serif" }}>{currentInsumo.tipo} · {currentInsumo.peso}</div>
                </div>
                <span style={{ fontSize: 30 }}>{currentInsumo.status === "em_transporte" ? "🚛" : currentInsumo.status === "disponivel" ? "🧾" : "🧪"}</span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {[["Qualidade", currentInsumo.qualidade], ["Biogás", currentInsumo.biogasPrevisto], ["Contam.", currentInsumo.contaminacao]].map(([l, v]) => (
                  <div key={l} style={{ flex: 1, background: `${colors.primary}0f`, borderRadius: 12, padding: 10, textAlign: "center" }}>
                    <div style={{ color: colors.primaryDark, fontSize: 14, fontWeight: 900 }}>{v}</div>
                    <div style={{ color: colors.textLight, fontSize: 10, fontFamily: "sans-serif" }}>{l}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Timeline title="Linha do Tempo da Entrada" steps={[
              { icon: "✅", label: "Fornecedor validado", time: "Documento e origem conferidos", done: true },
              { icon: "✅", label: "Qualidade pré-aprovada", time: `Índice BioFlow: ${currentInsumo.qualidade}`, done: currentInsumo.status !== "disponivel" },
              { icon: currentInsumo.status === "em_transporte" ? "🚛" : "⏳", label: "Transporte até a usina", time: currentInsumo.status === "em_transporte" ? "ETA: 2h 50min" : "Aguardando aceite", active: currentInsumo.status === "em_transporte" },
              { icon: "⭕", label: "Pesagem e triagem final", time: "Na chegada" },
              { icon: "⭕", label: "Liberação para biodigestor", time: "Após aprovação" },
            ]} />
          </div>
        </ScreenShell>
        <NavBar />
      </Phone>
    );
  }

  if (screen === screens.USINA_HISTORICO) {
    return (
      <Phone>
        <ScreenShell key={transitionKey} style={{ overflowY: "auto" }}>
          <Header title="Histórico da Usina" subtitle="Recebimentos, qualidade e produção gerada" icon="📊" gradient="linear-gradient(135deg, #1a3a2a, #2d6040)" />
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <SummaryCard title="Resumo do Mês - Maio 2026" metrics={[["7,4 t", "Recebidas"], ["1.090 m³", "Biogás"], ["89%", "Qualidade média"]]} />
            {[...insumosUsina, ...mockHistoricoUsina].map((c) => <HistoryRow key={c.id} item={c} />)}
          </div>
        </ScreenShell>
        <NavBar />
      </Phone>
    );
  }

  if (screen === screens.USINA_PERFIL) {
    return (
      <Phone>
        <ScreenShell key={transitionKey} style={{ overflowY: "auto" }}>
          <ProfileHeader icon="⚡" name={accountName} subtitle="Capacidade operacional: 12 t/dia" variant="usina" badge="✅ Parceira BioFlow · Fornecimento rastreável" />
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            {[["📍", "Endereço", "Campinas - SP"], ["📦", "Tipos aceitos", "Alimentares, cascas e efluentes"], ["🧪", "Qualidade mínima", "Acima de 85%"], ["📊", "Capacidade atual", "87% utilizada"], ["📄", "Relatório operacional", "Baixar PDF"]].map(([icon, label, val]) => (
              <ProfileRow key={label} icon={icon} label={label} val={val} />
            ))}
            <button className="bio-button" onClick={limparDadosSalvos} style={{ background: "#fff2f0", border: "1.5px solid #ffcccc", borderRadius: 14, padding: 16, color: colors.red, fontWeight: 800, fontSize: 14, cursor: "pointer", marginTop: 8, fontFamily: "sans-serif" }}>Sair da conta</button>
          </div>
        </ScreenShell>
        <NavBar />
      </Phone>
    );
  }

  if (screen === screens.ESG_DETALHE) {
    const ctx = esgContext || { variant: userType === "usina" ? "usina" : "empresa", score: userType === "usina" ? 27 : 35, owner: accountName };
    const tier = esgTier(ctx.score);
    const next = esgNextTier(ctx.score);

    return (
      <Phone>
        <ScreenShell key={transitionKey} style={{ overflowY: "auto" }}>
          <Header title="Detalhes ESG" subtitle={`${ctx.owner} · nível ${tier.name}`} icon={tier.icon} gradient={`linear-gradient(135deg, ${tier.color}, ${colors.primaryDark})`} />
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <button onClick={backFromEsg} style={{ background: "none", border: "none", color: colors.textMid, cursor: "pointer", alignSelf: "flex-start", fontSize: 14, fontFamily: "sans-serif" }}>← Voltar</button>
            <Card style={{ background: `linear-gradient(135deg, ${tier.color}12, #fff)`, border: `1.5px solid ${tier.color}33` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <ESGCircle score={ctx.score} />
                <div>
                  <div style={{ color: tier.color, fontSize: 26, fontWeight: 900, fontFamily: "sans-serif" }}>{ctx.score}/100</div>
                  <div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 15 }}>Nível {tier.name}</div>
                  <div style={{ color: colors.textLight, fontSize: 11, fontFamily: "sans-serif", marginTop: 3 }}>{next.pts > 0 ? `${next.pts} pontos para chegar em ${next.name}` : "Nível máximo atingido"}</div>
                </div>
              </div>
            </Card>
            <ESGGraph score={ctx.score} variant={ctx.variant} />
            <Card>
              <CardTitle icon="🧭" title="Como o score é calculado" sub="Composição simulada" />
              {(ctx.variant === "usina"
                ? [["📥", "Biomassa recebida", "35%"], ["🧪", "Qualidade média", "25%"], ["📍", "Rastreabilidade", "25%"], ["📅", "Recorrência", "15%"]]
                : [["♻️", "Volume destinado", "35%"], ["🌍", "CO₂ evitado", "25%"], ["📄", "Documentação", "25%"], ["📅", "Recorrência", "15%"]]
              ).map(([icon, label, value]) => <SimRow key={label} icon={icon} label={label} value={value} highlight={value === "35%"} />)}
            </Card>
          </div>
        </ScreenShell>
        <NavBar />
      </Phone>
    );
  }

  if (screen === screens.ADMIN_HOME) {
    const bf = calcularReceitaBioFlow();
    const contratos = insumosUsina.filter((i) => ["contratado", "em_transporte", "recebido"].includes(i.status)).length;

    return (
      <Phone>
        <ScreenShell key={transitionKey} style={{ overflowY: "auto" }}>
          <HeroHeader name={accountName} subtitle="Painel interno," icon="📊">
            <MetricStrip items={[{ label: "Receita app", value: formatCurrency(bf.total), icon: "💵" }, { label: "Lucro simulado", value: formatCurrency(bf.margem), icon: "📈" }, { label: "Operações", value: String(mockColetas.length + insumosUsina.length), icon: "🧾" }]} />
          </HeroHeader>
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            <OperationalVision />
            <Card>
              <CardTitle icon="📊" title="Atividade dentro do aplicativo" sub="Base para custos, receitas e lucro" />
              <SimRow icon="🏪" label="Empresas com coletas simuladas" value={String(mockColetas.length)} />
              <SimRow icon="⚡" label="Insumos ativos para usinas" value={String(insumosUsina.length)} />
              <SimRow icon="✅" label="Contratos ou cargas em andamento" value={String(contratos)} highlight />
              <SimRow icon="📦" label="Volume total movimentado" value={formatTon(bf.volume)} />
            </Card>
            <Card style={{ background: "#fff8e8", border: `1px solid ${colors.orange}33` }}>
              <CardTitle icon="🧮" title="Leitura executiva" sub="Simulação de decisão" />
              <p style={{ color: colors.textMid, fontSize: 12, fontFamily: "sans-serif", lineHeight: 1.55, margin: 0 }}>
                O Administrativo concentra a visão que antes ficava no perfil: receita por empresas e usinas, custos internos, custos logísticos e lucro bruto. Conforme as ações do app aumentam coletas, contratos e insumos, estes indicadores podem ser atualizados.
              </p>
            </Card>
          </div>
        </ScreenShell>
        <NavBar />
      </Phone>
    );
  }

  return null;
}

function ValueList({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map(([icon, value, label]) => (
        <div key={label} style={{ background: "#ffffff18", borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>{icon}</span>
          <div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 13, fontFamily: "sans-serif" }}>{value}</div>
            <div style={{ color: colors.cream, fontSize: 11, fontFamily: "sans-serif", opacity: 0.9 }}>{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SegmentedIds({ items, current, onPick, prefix }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
      {items.map((c) => (
        <button key={c.id} className="bio-button" onClick={() => onPick(c.id)} style={{ flex: 1, background: current === c.id ? colors.primary : "#fff", border: `1.5px solid ${current === c.id ? colors.primary : colors.cream}`, borderRadius: 10, padding: "8px 4px", cursor: "pointer", color: current === c.id ? "#fff" : colors.textMid, fontSize: 10, fontWeight: 800, fontFamily: "sans-serif" }}>
          {c.id.replace(prefix, "#")}
        </button>
      ))}
    </div>
  );
}

function SummaryCard({ title, metrics }) {
  return (
    <Card style={{ background: `linear-gradient(135deg, ${colors.primary}22, ${colors.cream})` }}>
      <h4 style={{ margin: "0 0 12px", color: colors.primaryDark, fontSize: 14 }}>{title}</h4>
      <div style={{ display: "flex", gap: 12 }}>
        {metrics.map(([v, l]) => (
          <div key={l} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 16 }}>{v}</div>
            <div style={{ color: colors.textLight, fontSize: 10, fontFamily: "sans-serif" }}>{l}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ConfirmBox({ title, rows, message, onBack, onConfirm, confirmLabel }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h3 style={{ color: colors.primaryDark, margin: "0 0 8px", fontSize: 16 }}>{title}</h3>
      <Card>
        {rows.map(([label, value]) => <DetailRow key={label} label={label} value={value} />)}
      </Card>
      <Card style={{ background: `${colors.primary}11`, border: `1px solid ${colors.primary}33` }}>
        <p style={{ margin: 0, color: colors.primaryDark, fontSize: 13, fontFamily: "sans-serif", lineHeight: 1.5 }}>✅ {message}</p>
      </Card>
      <div style={{ display: "flex", gap: 10 }}>
        <SecondaryButton onClick={onBack} style={{ flex: 1 }}>← Voltar</SecondaryButton>
        <PrimaryButton onClick={onConfirm} style={{ flex: 2 }}>{confirmLabel}</PrimaryButton>
      </div>
    </div>
  );
}

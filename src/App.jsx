import { useEffect, useState } from "react";

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
  {
    id: "BF-US-001",
    empresa: "Supermercado Pão de Mel",
    tipo: "Resíduos Alimentares",
    peso: "320 kg",
    data: "Hoje, 14:00",
    status: "em_transporte",
    qualidade: "92%",
    biogasPrevisto: "48 m³",
    origem: "São Paulo - SP",
    destino: "Usina BioPower SP",
    contaminacao: "Baixa",
    contrato: "Mensal recorrente",
  },
  {
    id: "BF-US-002",
    empresa: "Restaurante Sabor Verde",
    tipo: "Cascas e Orgânicos",
    peso: "180 kg",
    data: "Amanhã, 09:00",
    status: "disponivel",
    qualidade: "89%",
    biogasPrevisto: "27 m³",
    origem: "Campinas - SP",
    destino: "Usina BioPower SP",
    contaminacao: "Muito baixa",
    contrato: "Avulso",
  },
  {
    id: "BF-US-003",
    empresa: "Indústria AlimBrasil",
    tipo: "Efluentes Orgânicos",
    peso: "1.200 kg",
    data: "22/05, 11:00",
    status: "triagem",
    qualidade: "84%",
    biogasPrevisto: "172 m³",
    origem: "Jundiaí - SP",
    destino: "Usina BioPower SP",
    contaminacao: "Média",
    contrato: "Contrato trimestral",
  },
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

const StatusBadge = ({ status }) => {
  const s = statusMap[status] || { label: status, color: "#999" };
  return (
    <span style={{
      background: s.color + "22",
      color: s.color,
      border: `1px solid ${s.color}44`,
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      padding: "2px 10px",
      letterSpacing: 0.3,
      fontFamily: "sans-serif",
    }}>{s.label}</span>
  );
};
const Phone = ({ children }) => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: 20,
    boxSizing: "border-box",
    background: "linear-gradient(135deg, #e8ead8 0%, #d4d8c0 100%)",
    fontFamily: "'Georgia', serif",
  }}>
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
      <div style={{ background: colors.primaryDark, height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
        <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>9:41</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ color: "#fff", fontSize: 11 }}>●●●●</span>
          <span style={{ color: "#fff", fontSize: 11 }}>WiFi</span>
          <span style={{ color: "#fff", fontSize: 11 }}>🔋</span>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  </div>
);

const Header = ({ title, subtitle, icon = "🌿", gradient = `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})` }) => (
  <div style={{ background: gradient, padding: "28px 24px 24px", borderRadius: "0 0 26px 26px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <h2 style={{ color: "#fff", fontSize: 22, margin: 0, fontWeight: 900 }}>{title}</h2>
        {subtitle && <p style={{ color: colors.cream, fontSize: 13, margin: "4px 0 0", fontFamily: "sans-serif", opacity: 0.85 }}>{subtitle}</p>}
      </div>
      <div style={{ background: "#ffffff22", borderRadius: 12, padding: "8px 10px", fontSize: 22 }}>{icon}</div>
    </div>
  </div>
);

const Card = ({ children, onClick, style = {} }) => (
  <div onClick={onClick} style={{
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    border: `1.5px solid ${colors.cream}`,
    cursor: onClick ? "pointer" : "default",
    ...style,
  }}>
    {children}
  </div>
);

const Field = ({ label, placeholder, value, onChange, multiline = false, type = "text" }) => (
  <div>
    <label style={{ color: colors.primaryDark, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, fontFamily: "sans-serif" }}>{label.toUpperCase()}</label>
    {multiline ? (
      <textarea value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} style={{
        display: "block", width: "100%", marginTop: 6,
        border: `1.5px solid ${colors.cream}`, borderRadius: 12, padding: "14px 16px",
        fontSize: 14, fontFamily: "sans-serif", background: "#fff", color: colors.textDark, caretColor: colors.primaryDark,
        outline: "none", resize: "none", height: 80, boxSizing: "border-box",
      }} />
    ) : (
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} style={{
        display: "block", width: "100%", marginTop: 6,
        border: `1.5px solid ${colors.cream}`, borderRadius: 12, padding: "14px 16px",
        fontSize: 15, fontFamily: "sans-serif", background: "#fff", color: colors.textDark, caretColor: colors.primaryDark,
        outline: "none", boxSizing: "border-box",
      }} />
    )}
  </div>
);

const PrimaryButton = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} style={{
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: "16px 18px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "sans-serif",
    boxShadow: `0 8px 24px ${colors.primary}33`,
    ...style,
  }}>{children}</button>
);

const SecondaryButton = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} style={{
    background: "#fff",
    color: colors.textMid,
    border: `1.5px solid ${colors.cream}`,
    borderRadius: 14,
    padding: "16px 18px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "sans-serif",
    ...style,
  }}>{children}</button>
);



export default function BioFlowApp() {
  const [screen, setScreen] = useState(screens.WELCOME);
  const [userType, setUserType] = useState(null);
  const [agendarStep, setAgendarStep] = useState(0);
  const [usinaStep, setUsinaStep] = useState(0);
  const [form, setForm] = useState({ tipo: "", peso: "", data: "", obs: "" });
  const [usinaForm, setUsinaForm] = useState({ tipo: "", volume: "", data: "", qualidade: "", recorrencia: "" });
  const [loginForm, setLoginForm] = useState({ email: "", senha: "" });
  const [activeTab, setActiveTab] = useState("home");
  const [rastrearId, setRastrearId] = useState("BF-2024-001");
  const [usinaRastrearId, setUsinaRastrearId] = useState("BF-US-001");
  const [selectedFornecedorId, setSelectedFornecedorId] = useState("BF-US-002");
  const [insumosUsina, setInsumosUsina] = useState(mockInsumosUsina);

  useEffect(() => {
    try {
      const empresaSalva = localStorage.getItem("bioflow_empresa_form");
      const usinaSalva = localStorage.getItem("bioflow_usina_form");
      const loginSalvo = localStorage.getItem("bioflow_login_form");
      const insumosSalvos = localStorage.getItem("bioflow_insumos_usina");

      if (empresaSalva) setForm(JSON.parse(empresaSalva));
      if (usinaSalva) setUsinaForm(JSON.parse(usinaSalva));
      if (loginSalvo) setLoginForm(JSON.parse(loginSalvo));
      if (insumosSalvos) setInsumosUsina(JSON.parse(insumosSalvos));
    } catch (error) {
      console.warn("Não foi possível carregar os dados salvos da BioFlow.", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bioflow_empresa_form", JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    localStorage.setItem("bioflow_usina_form", JSON.stringify(usinaForm));
  }, [usinaForm]);

  useEffect(() => {
    localStorage.setItem("bioflow_login_form", JSON.stringify(loginForm));
  }, [loginForm]);

  useEffect(() => {
    localStorage.setItem("bioflow_insumos_usina", JSON.stringify(insumosUsina));
  }, [insumosUsina]);

  const limparDadosSalvos = () => {
    localStorage.removeItem("bioflow_empresa_form");
    localStorage.removeItem("bioflow_usina_form");
    localStorage.removeItem("bioflow_login_form");
    localStorage.removeItem("bioflow_insumos_usina");
    setForm({ tipo: "", peso: "", data: "", obs: "" });
    setUsinaForm({ tipo: "", volume: "", data: "", qualidade: "", recorrencia: "" });
    setLoginForm({ email: "", senha: "" });
    setInsumosUsina(mockInsumosUsina);
  };

  const go = (s, tab) => {
    setScreen(s);
    if (tab) setActiveTab(tab);
  };

  const currentInsumo = insumosUsina.find(i => i.id === usinaRastrearId) || insumosUsina[0];
  const selectedFornecedor = insumosUsina.find(i => i.id === selectedFornecedorId) || insumosUsina[1];

  const acceptFornecedor = (id) => {
    setInsumosUsina(items => items.map(item => item.id === id ? { ...item, status: "contratado", data: "Coleta confirmada: amanhã, 09:00" } : item));
    setUsinaRastrearId(id);
    go(screens.USINA_CONFIRMACAO);
  };

  const NavBar = () => {
    const isUsina = userType === "usina";
    const tabs = isUsina
      ? [
          { id: "home", icon: "⊞", label: "Painel" },
          { id: "agendar", icon: "＋", label: "Insumos" },
          { id: "rastrear", icon: "◎", label: "Entradas" },
          { id: "historico", icon: "≡", label: "Histórico" },
          { id: "perfil", icon: "◌", label: "Usina" },
        ]
      : [
          { id: "home", icon: "⊞", label: "Início" },
          { id: "agendar", icon: "＋", label: "Agendar" },
          { id: "rastrear", icon: "◎", label: "Rastrear" },
          { id: "historico", icon: "≡", label: "Histórico" },
          { id: "perfil", icon: "◌", label: "Perfil" },
        ];

    return (
      <div style={{ display: "flex", borderTop: `1px solid ${colors.cream}`, background: "#fff", position: "sticky", bottom: 0 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => {
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
          }} style={{
            flex: 1, border: "none", background: "transparent", padding: "10px 0 14px", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            color: activeTab === tab.id ? colors.primary : "#aaa", transition: "color 0.2s",
          }}>
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: activeTab === tab.id ? 700 : 400, fontFamily: "sans-serif" }}>{tab.label}</span>
          </button>
        ))}
      </div>
    );
  };

  if (screen === screens.WELCOME) return (
    <Phone>
      <div style={{ flex: 1, background: `linear-gradient(160deg, ${colors.primaryDark} 0%, ${colors.primary} 60%, ${colors.primaryLight} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ fontSize: 52, marginBottom: 20, lineHeight: 1 }}>🌿</div>
        <h1 style={{ color: "#fff", fontSize: 42, fontWeight: 900, margin: 0, letterSpacing: -1 }}>BioFlow</h1>
        <p style={{ color: colors.cream, fontSize: 14, margin: "8px 0 0", letterSpacing: 2, textTransform: "uppercase", fontFamily: "sans-serif" }}>Energia do que sobra</p>
        <div style={{ width: "100%", marginTop: 60, display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={() => { setUserType("empresa"); go(screens.LOGIN); }} style={{ background: "#fff", color: colors.primaryDark, border: "none", borderRadius: 16, padding: "18px 0", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>Sou uma Empresa</button>
          <button onClick={() => { setUserType("usina"); go(screens.LOGIN); }} style={{ background: "transparent", color: "#fff", border: "2px solid #ffffff88", borderRadius: 16, padding: "18px 0", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>Sou uma Usina de Biogás</button>
        </div>
        <p style={{ color: "#ffffff66", fontSize: 12, marginTop: 32, textAlign: "center", fontFamily: "sans-serif" }}>Conectando resíduos orgânicos à energia renovável</p>
      </div>
    </Phone>
  );

  if (screen === screens.LOGIN) return (
    <Phone>
      <div style={{ flex: 1, padding: "32px 28px", display: "flex", flexDirection: "column" }}>
        <button onClick={() => go(screens.WELCOME)} style={{ background: "none", border: "none", color: colors.textMid, cursor: "pointer", alignSelf: "flex-start", fontSize: 22, marginBottom: 24 }}>←</button>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 32 }}>{userType === "usina" ? "⚡" : "🌿"}</div>
          <h2 style={{ color: colors.primaryDark, fontSize: 28, margin: "8px 0 4px", fontWeight: 900 }}>Entrar</h2>
          <p style={{ color: colors.textLight, fontSize: 14, margin: 0, fontFamily: "sans-serif" }}>{userType === "usina" ? "Painel da Usina de Biogás" : "Painel da Empresa Geradora"}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="E-mail" placeholder={userType === "usina" ? "operacao@usinabio.com.br" : "contato@empresa.com.br"} value={loginForm.email} onChange={v => setLoginForm(prev => ({ ...prev, email: v }))} />
          <Field label="Senha" placeholder="••••••••" type="password" value={loginForm.senha} onChange={v => setLoginForm(prev => ({ ...prev, senha: v }))} />
          <PrimaryButton onClick={() => go(userType === "usina" ? screens.USINA_HOME : screens.HOME, "home")} style={{ marginTop: 8 }}>Entrar →</PrimaryButton>
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <span style={{ color: colors.textLight, fontSize: 13, fontFamily: "sans-serif" }}>Não tem conta? </span>
          <span style={{ color: colors.primary, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "sans-serif" }}>Cadastre-se</span>
        </div>
      </div>
    </Phone>
  );

  if (screen === screens.HOME) return (
    <Phone>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ background: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})`, padding: "28px 24px 32px", borderRadius: "0 0 28px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <p style={{ color: colors.cream, fontSize: 12, margin: 0, fontFamily: "sans-serif", opacity: 0.8 }}>Bom dia,</p>
              <h2 style={{ color: "#fff", fontSize: 20, margin: "2px 0 0", fontWeight: 900 }}>Supermercado Pão de Mel 🏪</h2>
            </div>
            <div style={{ background: "#ffffff22", borderRadius: 12, padding: "8px 10px", fontSize: 20 }}>🔔</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[{ label: "Resíduos coletados", value: "1.240 kg", icon: "♻️" }, { label: "Biogás gerado", value: "183 m³", icon: "⚡" }, { label: "CO₂ evitado", value: "420 kg", icon: "🌍" }].map(c => (
              <div key={c.label} style={{ flex: 1, background: "#ffffff15", borderRadius: 14, padding: "12px 10px", border: "1px solid #ffffff22" }}>
                <div style={{ fontSize: 18 }}>{c.icon}</div>
                <div style={{ color: "#fff", fontSize: 16, fontWeight: 900, marginTop: 4 }}>{c.value}</div>
                <div style={{ color: colors.cream, fontSize: 9, opacity: 0.8, fontFamily: "sans-serif", lineHeight: 1.3 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", gap: 12 }}>
            {[{ label: "Agendar Coleta", icon: "📦", action: () => { setAgendarStep(0); go(screens.AGENDAR, "agendar"); } }, { label: "Rastrear", icon: "📍", action: () => go(screens.RASTREAR, "rastrear") }].map(a => (
              <button key={a.label} onClick={a.action} style={{ flex: 1, background: "#fff", border: `1.5px solid ${colors.cream}`, borderRadius: 16, padding: "18px 0", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 28 }}>{a.icon}</span>
                <span style={{ color: colors.primaryDark, fontSize: 12, fontWeight: 700, fontFamily: "sans-serif" }}>{a.label}</span>
              </button>
            ))}
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, color: colors.primaryDark, fontSize: 16, fontWeight: 900 }}>Próximas Coletas</h3>
              <span onClick={() => go(screens.HISTORICO, "historico")} style={{ color: colors.primary, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif" }}>Ver todas →</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {mockColetas.slice(0, 2).map(c => (
                <Card key={c.id} onClick={() => { setRastrearId(c.id); go(screens.RASTREAR, "rastrear"); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <StatusBadge status={c.status} />
                    <div style={{ color: colors.primaryDark, fontWeight: 700, fontSize: 14, marginTop: 6 }}>{c.tipo}</div>
                    <div style={{ color: colors.textLight, fontSize: 12, marginTop: 2, fontFamily: "sans-serif" }}>{c.data} · {c.peso}</div>
                  </div>
                  <span style={{ color: colors.textLight, fontSize: 20 }}>›</span>
                </Card>
              ))}
            </div>
          </div>
          <Card style={{ background: `linear-gradient(135deg, ${colors.cream}, #f0eed8)`, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 36 }}>🏆</div>
            <div>
              <div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 14 }}>Selo ESG Verificado</div>
              <div style={{ color: colors.textMid, fontSize: 12, marginTop: 2, fontFamily: "sans-serif" }}>Seu impacto ambiental é monitorado e certificado pela BioFlow.</div>
            </div>
          </Card>
        </div>
      </div>
      <NavBar />
    </Phone>
  );

  if (screen === screens.AGENDAR) return (
    <Phone>
      <div style={{ flex: 1 }}>
        <div style={{ background: colors.primaryDark, padding: "28px 24px 20px", borderRadius: "0 0 24px 24px" }}>
          <h2 style={{ color: "#fff", fontSize: 22, margin: 0, fontWeight: 900 }}>Agendar Coleta</h2>
          <div style={{ display: "flex", gap: 6, marginTop: 16 }}>{[1, 2, 3].map(s => <div key={s} style={{ flex: 1, height: 4, borderRadius: 4, background: agendarStep >= s - 1 ? colors.primaryLight : "#ffffff33" }} />)}</div>
          <p style={{ color: colors.cream, fontSize: 12, margin: "8px 0 0", fontFamily: "sans-serif", opacity: 0.8 }}>{["Tipo de resíduo", "Data e quantidade", "Confirmação"][agendarStep]} — Passo {agendarStep + 1}/3</p>
        </div>
        <div style={{ padding: "24px 20px", flex: 1 }}>
          {agendarStep === 0 && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h3 style={{ color: colors.primaryDark, margin: "0 0 8px", fontSize: 16 }}>Qual tipo de resíduo?</h3>
            {[{ label: "Restos Alimentares", icon: "🥦", sub: "Restaurantes, lanchonetes" }, { label: "Cascas e Orgânicos", icon: "🍊", sub: "Frutas, legumes, hortifrutis" }, { label: "Resíduos Industriais", icon: "🏭", sub: "Indústria alimentícia" }, { label: "Efluentes Orgânicos", icon: "💧", sub: "Laticínios, frigoríficos" }].map(t => (
              <button key={t.label} onClick={() => { setForm(f => ({ ...f, tipo: t.label })); setAgendarStep(1); }} style={{ background: form.tipo === t.label ? `${colors.primary}11` : "#fff", border: `1.5px solid ${form.tipo === t.label ? colors.primary : colors.cream}`, borderRadius: 14, padding: 16, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 28 }}>{t.icon}</span>
                <div><div style={{ color: colors.primaryDark, fontWeight: 700, fontSize: 14 }}>{t.label}</div><div style={{ color: colors.textLight, fontSize: 12, fontFamily: "sans-serif" }}>{t.sub}</div></div>
              </button>
            ))}
          </div>}
          {agendarStep === 1 && <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h3 style={{ color: colors.primaryDark, margin: "0 0 8px", fontSize: 16 }}>Detalhes da coleta</h3>
            <Field label="Data preferida" placeholder="22/05/2026" value={form.data} onChange={v => setForm(prev => ({ ...prev, data: v }))} />
            <Field label="Volume estimado (kg)" placeholder="Ex: 200" value={form.peso} onChange={v => setForm(prev => ({ ...prev, peso: v }))} />
            <Field label="Observações" placeholder="Ex: resíduos ficam no fundo do estabelecimento..." value={form.obs} onChange={v => setForm(prev => ({ ...prev, obs: v }))} multiline />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}><SecondaryButton onClick={() => setAgendarStep(0)} style={{ flex: 1 }}>← Voltar</SecondaryButton><PrimaryButton onClick={() => setAgendarStep(2)} style={{ flex: 2 }}>Continuar →</PrimaryButton></div>
          </div>}
          {agendarStep === 2 && <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h3 style={{ color: colors.primaryDark, margin: "0 0 8px", fontSize: 16 }}>Confirme os dados</h3>
            <Card>{[{ label: "Tipo de resíduo", value: form.tipo || "Restos Alimentares" }, { label: "Data", value: form.data || "22/05/2026" }, { label: "Volume estimado", value: (form.peso || "200") + " kg" }, { label: "Empresa", value: "Supermercado Pão de Mel" }, { label: "Destino", value: "Usina BioPower SP" }].map(r => <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${colors.cream}` }}><span style={{ color: colors.textLight, fontSize: 13, fontFamily: "sans-serif" }}>{r.label}</span><span style={{ color: colors.primaryDark, fontSize: 13, fontWeight: 700, fontFamily: "sans-serif" }}>{r.value}</span></div>)}</Card>
            <Card style={{ background: `${colors.primary}11`, border: `1px solid ${colors.primary}33` }}><p style={{ margin: 0, color: colors.primaryDark, fontSize: 13, fontFamily: "sans-serif" }}>✅ Nossa transportadora parceira entrará em contato em até <strong>2 horas</strong> para confirmar a janela de coleta.</p></Card>
            <div style={{ display: "flex", gap: 10 }}><SecondaryButton onClick={() => setAgendarStep(1)} style={{ flex: 1 }}>← Voltar</SecondaryButton><PrimaryButton onClick={() => go(screens.CONFIRMACAO)} style={{ flex: 2 }}>Confirmar Coleta ✓</PrimaryButton></div>
          </div>}
        </div>
      </div>
      <NavBar />
    </Phone>
  );

  if (screen === screens.CONFIRMACAO) return (
    <Phone>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: colors.primaryDark, fontSize: 26, margin: "0 0 12px", fontWeight: 900 }}>Coleta Agendada!</h2>
        <p style={{ color: colors.textMid, fontSize: 15, margin: "0 0 8px", fontFamily: "sans-serif", lineHeight: 1.6 }}>Código: <strong style={{ color: colors.primary }}>BF-2024-003</strong></p>
        <p style={{ color: colors.textLight, fontSize: 14, margin: "0 0 32px", fontFamily: "sans-serif", lineHeight: 1.6 }}>Você receberá uma notificação quando a transportadora confirmar a coleta.</p>
        <Card style={{ background: colors.cream, width: "100%", marginBottom: 24 }}><p style={{ margin: 0, fontSize: 13, color: colors.primaryDark, fontFamily: "sans-serif" }}>🌍 Esta coleta vai gerar aproximadamente <strong>~45 m³ de biogás</strong>, evitando <strong>62 kg de CO₂</strong>.</p></Card>
        <PrimaryButton onClick={() => go(screens.HOME, "home")}>Ir para o Início →</PrimaryButton>
      </div>
    </Phone>
  );

  if (screen === screens.RASTREAR) return (
    <Phone>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Header title="Rastreamento" subtitle="Acompanhe sua coleta em tempo real" icon="📍" />
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>{mockColetas.map(c => <button key={c.id} onClick={() => setRastrearId(c.id)} style={{ flex: 1, background: rastrearId === c.id ? colors.primary : "#fff", border: `1.5px solid ${rastrearId === c.id ? colors.primary : colors.cream}`, borderRadius: 10, padding: "8px 4px", cursor: "pointer", color: rastrearId === c.id ? "#fff" : colors.textMid, fontSize: 10, fontWeight: 700, fontFamily: "sans-serif" }}>{c.id.replace("BF-2024-", "#")}</button>)}</div>
          {(() => {
            const coleta = mockColetas.find(c => c.id === rastrearId) || mockColetas[0];
            return <>
              <Card style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><div><StatusBadge status={coleta.status} /><div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 15, marginTop: 6 }}>{coleta.id}</div><div style={{ color: colors.textLight, fontSize: 12, fontFamily: "sans-serif" }}>{coleta.tipo} · {coleta.peso}</div></div><span style={{ fontSize: 28 }}>{coleta.status === "em_transporte" ? "🚛" : "📅"}</span></Card>
              <Card><h4 style={{ margin: "0 0 16px", color: colors.primaryDark, fontSize: 14 }}>Linha do Tempo</h4>{[{ icon: "✅", label: "Coleta agendada", time: "Hoje, 09:00", done: true }, { icon: coleta.status === "em_transporte" ? "✅" : "⏳", label: "Transportadora a caminho", time: coleta.status === "em_transporte" ? "Hoje, 13:00" : "Aguardando", done: coleta.status === "em_transporte" }, { icon: coleta.status === "em_transporte" ? "🚛" : "⭕", label: "Em transporte para a usina", time: coleta.status === "em_transporte" ? "Hoje, 13:40" : "—", active: coleta.status === "em_transporte" }, { icon: "⭕", label: "Chegada na usina", time: "Previsto: 16:30" }, { icon: "⭕", label: "Processamento e biogás gerado", time: "Previsto: amanhã" }].map((step, i) => <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><span style={{ fontSize: 18 }}>{step.icon}</span>{i < 4 && <div style={{ width: 2, height: 20, background: step.done || step.active ? colors.primaryLight : colors.cream, marginTop: 4 }} />}</div><div><div style={{ color: step.done || step.active ? colors.primaryDark : colors.textLight, fontWeight: step.active ? 900 : 600, fontSize: 13, fontFamily: "sans-serif" }}>{step.label}</div><div style={{ color: colors.textLight, fontSize: 11, fontFamily: "sans-serif" }}>{step.time}</div></div></div>)}</Card>
            </>;
          })()}
        </div>
      </div>
      <NavBar />
    </Phone>
  );

  if (screen === screens.HISTORICO) return (
    <Phone>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Header title="Histórico" subtitle="Todas as suas coletas e impacto gerado" icon="≡" />
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <Card style={{ background: `linear-gradient(135deg, ${colors.primary}22, ${colors.cream})` }}><h4 style={{ margin: "0 0 12px", color: colors.primaryDark, fontSize: 14 }}>Resumo do Mês — Maio 2026</h4><div style={{ display: "flex", gap: 16 }}>{[{ v: "875 kg", l: "Coletados" }, { v: "131 m³", l: "Biogás" }, { v: "R$ 124", l: "Economizado" }].map(m => <div key={m.l} style={{ textAlign: "center" }}><div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 16 }}>{m.v}</div><div style={{ color: colors.textLight, fontSize: 10, fontFamily: "sans-serif" }}>{m.l}</div></div>)}</div></Card>
          {[...mockColetas, ...mockHistorico.map(h => ({ ...h, tipo: "Resíduos Alimentares", empresa: "Supermercado Pão de Mel" }))].map(c => <Card key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ color: colors.primaryDark, fontWeight: 700, fontSize: 13 }}>{c.id}</div><div style={{ color: colors.textLight, fontSize: 11, margin: "3px 0", fontFamily: "sans-serif" }}>{c.tipo} · {c.peso}</div><StatusBadge status={c.status || "concluida"} /></div><div style={{ textAlign: "right" }}><div style={{ color: colors.textLight, fontSize: 11, fontFamily: "sans-serif" }}>{c.data}</div>{c.biogasGerado && <div style={{ color: colors.primary, fontSize: 12, fontWeight: 700, marginTop: 4 }}>⚡ {c.biogasGerado}</div>}</div></Card>)}
        </div>
      </div>
      <NavBar />
    </Phone>
  );

  if (screen === screens.PERFIL) return (
    <Phone>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ background: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})`, padding: "32px 24px 40px", borderRadius: "0 0 28px 28px", textAlign: "center" }}><div style={{ fontSize: 56, marginBottom: 8 }}>🏪</div><h2 style={{ color: "#fff", margin: "0 0 4px", fontSize: 20, fontWeight: 900 }}>Supermercado Pão de Mel</h2><p style={{ color: colors.cream, margin: 0, fontSize: 13, fontFamily: "sans-serif", opacity: 0.8 }}>CNPJ: 12.345.678/0001-99</p></div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>{[{ icon: "📍", label: "Endereço de coleta", val: "Av. Paulista, 1234 — São Paulo" }, { icon: "📞", label: "Contato", val: "(11) 91234-5678" }, { icon: "📧", label: "E-mail", val: "contato@paodemel.com.br" }, { icon: "🔔", label: "Notificações", val: "Ativadas" }, { icon: "📄", label: "Relatório ESG", val: "Baixar PDF" }].map(m => <Card key={m.label} style={{ display: "flex", alignItems: "center", gap: 14 }}><span style={{ fontSize: 22 }}>{m.icon}</span><div style={{ flex: 1 }}><div style={{ color: colors.textLight, fontSize: 11, fontFamily: "sans-serif" }}>{m.label}</div><div style={{ color: colors.primaryDark, fontWeight: 700, fontSize: 13, fontFamily: "sans-serif" }}>{m.val}</div></div><span style={{ color: colors.textLight }}>›</span></Card>)}<button onClick={() => { limparDadosSalvos(); go(screens.WELCOME); }} style={{ background: "#fff2f0", border: "1.5px solid #ffcccc", borderRadius: 14, padding: 16, color: colors.red, fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 8, fontFamily: "sans-serif" }}>Sair da conta</button></div>
      </div>
      <NavBar />
    </Phone>
  );

  if (screen === screens.USINA_HOME) return (
    <Phone>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ background: `linear-gradient(135deg, #1a3a2a, #2d6040)`, padding: "28px 24px 32px", borderRadius: "0 0 28px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div><p style={{ color: colors.cream, fontSize: 12, margin: 0, fontFamily: "sans-serif", opacity: 0.8 }}>Bem-vinda,</p><h2 style={{ color: "#fff", fontSize: 20, margin: "2px 0 0", fontWeight: 900 }}>Usina BioPower SP ⚡</h2></div>
            <div style={{ background: "#ffffff22", borderRadius: 12, padding: "8px 10px", fontSize: 20 }}>🔔</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>{[{ label: "Insumos garantidos", value: "2,8 t", icon: "📥" }, { label: "Biogás previsto", value: "392 m³", icon: "⚡" }, { label: "Capacidade", value: "87%", icon: "📊" }].map(c => <div key={c.label} style={{ flex: 1, background: "#ffffff15", borderRadius: 14, padding: "12px 10px", border: "1px solid #ffffff22" }}><div style={{ fontSize: 18 }}>{c.icon}</div><div style={{ color: "#fff", fontSize: 15, fontWeight: 900, marginTop: 4 }}>{c.value}</div><div style={{ color: colors.cream, fontSize: 9, opacity: 0.8, fontFamily: "sans-serif", lineHeight: 1.3 }}>{c.label}</div></div>)}</div>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => { setUsinaStep(0); go(screens.USINA_SOLICITAR, "agendar"); }} style={{ flex: 1, background: "#fff", border: `1.5px solid ${colors.cream}`, borderRadius: 16, padding: "18px 0", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}><span style={{ fontSize: 28 }}>🧾</span><span style={{ color: colors.primaryDark, fontSize: 12, fontWeight: 700, fontFamily: "sans-serif" }}>Solicitar insumo</span></button>
            <button onClick={() => go(screens.USINA_RASTREAR, "rastrear")} style={{ flex: 1, background: "#fff", border: `1.5px solid ${colors.cream}`, borderRadius: 16, padding: "18px 0", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}><span style={{ fontSize: 28 }}>🚛</span><span style={{ color: colors.primaryDark, fontSize: 12, fontWeight: 700, fontFamily: "sans-serif" }}>Monitorar entradas</span></button>
          </div>
          <Card style={{ background: "#fff8e8", border: `1px solid ${colors.orange}44` }}><div style={{ display: "flex", gap: 12, alignItems: "center" }}><span style={{ fontSize: 28 }}>⚠️</span><div><div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 14 }}>Previsibilidade em risco</div><div style={{ color: colors.textMid, fontSize: 12, marginTop: 2, fontFamily: "sans-serif" }}>Faltam 640 kg para operar com 95% da capacidade amanhã.</div></div></div></Card>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><h3 style={{ margin: 0, color: colors.primaryDark, fontSize: 16, fontWeight: 900 }}>Fornecimentos disponíveis</h3><span onClick={() => go(screens.USINA_SOLICITAR, "agendar")} style={{ color: colors.primary, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif" }}>Buscar mais →</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{insumosUsina.map(c => <Card key={c.id} onClick={() => { setSelectedFornecedorId(c.id); go(screens.USINA_FORNECEDOR); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><StatusBadge status={c.status} /><div style={{ color: colors.primaryDark, fontWeight: 800, fontSize: 14, marginTop: 6 }}>{c.empresa}</div><div style={{ color: colors.textLight, fontSize: 12, marginTop: 2, fontFamily: "sans-serif" }}>{c.tipo} · {c.peso} · Qualidade {c.qualidade}</div></div><span style={{ color: colors.textLight, fontSize: 20 }}>›</span></Card>)}</div>
          </div>
          <Card style={{ background: `${colors.primary}11`, border: `1px solid ${colors.primary}33` }}><h4 style={{ margin: "0 0 8px", color: colors.primaryDark, fontSize: 13 }}>Previsão de Produção — Semana</h4><div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 60 }}>{[40, 65, 55, 80, 45, 70, 87].map((v, i) => <div key={i} style={{ flex: 1, background: i === 6 ? colors.primaryLight : colors.cream, borderRadius: "4px 4px 0 0", height: `${v}%` }} />)}</div><div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>{["S", "T", "Q", "Q", "S", "S", "D"].map((d, i) => <span key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: colors.textLight, fontFamily: "sans-serif" }}>{d}</span>)}</div><p style={{ margin: "10px 0 0", color: colors.textMid, fontSize: 12, fontFamily: "sans-serif" }}>Clique nos fornecimentos para contratar, acompanhar rota e validar qualidade.</p></Card>
        </div>
      </div>
      <NavBar />
    </Phone>
  );

  if (screen === screens.USINA_FORNECEDOR) return (
    <Phone>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Header title="Detalhe do Insumo" subtitle="Avalie qualidade, volume e logística" icon="🧪" gradient="linear-gradient(135deg, #1a3a2a, #2d6040)" />
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <button onClick={() => go(screens.USINA_HOME, "home")} style={{ background: "none", border: "none", color: colors.textMid, cursor: "pointer", alignSelf: "flex-start", fontSize: 14, fontFamily: "sans-serif" }}>← Voltar ao painel</button>
          <Card><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}><div><StatusBadge status={selectedFornecedor.status} /><h3 style={{ color: colors.primaryDark, margin: "8px 0 2px", fontSize: 18 }}>{selectedFornecedor.empresa}</h3><p style={{ margin: 0, color: colors.textLight, fontSize: 12, fontFamily: "sans-serif" }}>{selectedFornecedor.origem}</p></div><span style={{ fontSize: 34 }}>🏭</span></div>{[{ label: "Tipo", value: selectedFornecedor.tipo }, { label: "Volume", value: selectedFornecedor.peso }, { label: "Qualidade BioFlow", value: selectedFornecedor.qualidade }, { label: "Contaminação", value: selectedFornecedor.contaminacao }, { label: "Biogás previsto", value: selectedFornecedor.biogasPrevisto }, { label: "Modelo", value: selectedFornecedor.contrato }].map(r => <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${colors.cream}` }}><span style={{ color: colors.textLight, fontSize: 13, fontFamily: "sans-serif" }}>{r.label}</span><span style={{ color: colors.primaryDark, fontSize: 13, fontWeight: 800, fontFamily: "sans-serif" }}>{r.value}</span></div>)}</Card>
          <Card style={{ background: `${colors.primaryLight}18`, border: `1px solid ${colors.primaryLight}44` }}><div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 14, marginBottom: 6 }}>Por que aceitar?</div><p style={{ color: colors.textMid, fontSize: 13, fontFamily: "sans-serif", lineHeight: 1.5, margin: 0 }}>Este lote ajuda a reduzir o risco de falta de matéria-prima, aumenta a previsibilidade da produção e já vem com triagem e rastreabilidade logística BioFlow.</p></Card>
          <div style={{ display: "flex", gap: 10 }}><SecondaryButton onClick={() => go(screens.USINA_HOME, "home")} style={{ flex: 1 }}>Recusar</SecondaryButton><PrimaryButton onClick={() => acceptFornecedor(selectedFornecedor.id)} style={{ flex: 2 }}>Aceitar carga ✓</PrimaryButton></div>
        </div>
      </div>
      <NavBar />
    </Phone>
  );

  if (screen === screens.USINA_SOLICITAR) return (
    <Phone>
      <div style={{ flex: 1 }}>
        <div style={{ background: "#1a3a2a", padding: "28px 24px 20px", borderRadius: "0 0 24px 24px" }}>
          <h2 style={{ color: "#fff", fontSize: 22, margin: 0, fontWeight: 900 }}>Solicitar Insumo</h2>
          <div style={{ display: "flex", gap: 6, marginTop: 16 }}>{[1, 2, 3].map(s => <div key={s} style={{ flex: 1, height: 4, borderRadius: 4, background: usinaStep >= s - 1 ? colors.primaryLight : "#ffffff33" }} />)}</div>
          <p style={{ color: colors.cream, fontSize: 12, margin: "8px 0 0", fontFamily: "sans-serif", opacity: 0.85 }}>{["Tipo necessário", "Volume e frequência", "Confirmação"][usinaStep]} — Passo {usinaStep + 1}/3</p>
        </div>
        <div style={{ padding: "24px 20px", flex: 1 }}>
          {usinaStep === 0 && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}><h3 style={{ color: colors.primaryDark, margin: "0 0 8px", fontSize: 16 }}>Que matéria-prima sua usina precisa?</h3>{[{ label: "Restos Alimentares", icon: "🥦", sub: "Alto potencial e coleta frequente" }, { label: "Cascas e Orgânicos", icon: "🍊", sub: "Boa qualidade e baixa contaminação" }, { label: "Efluentes Orgânicos", icon: "💧", sub: "Maior volume para produção contínua" }, { label: "Mix Padronizado", icon: "🧪", sub: "Blend indicado pela BioFlow" }].map(t => <button key={t.label} onClick={() => { setUsinaForm(f => ({ ...f, tipo: t.label })); setUsinaStep(1); }} style={{ background: usinaForm.tipo === t.label ? `${colors.primary}11` : "#fff", border: `1.5px solid ${usinaForm.tipo === t.label ? colors.primary : colors.cream}`, borderRadius: 14, padding: 16, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14 }}><span style={{ fontSize: 28 }}>{t.icon}</span><div><div style={{ color: colors.primaryDark, fontWeight: 700, fontSize: 14 }}>{t.label}</div><div style={{ color: colors.textLight, fontSize: 12, fontFamily: "sans-serif" }}>{t.sub}</div></div></button>)}</div>}
          {usinaStep === 1 && <div style={{ display: "flex", flexDirection: "column", gap: 16 }}><h3 style={{ color: colors.primaryDark, margin: "0 0 8px", fontSize: 16 }}>Defina a demanda operacional</h3><Field label="Volume necessário" placeholder="Ex: 1.500 kg/semana" value={usinaForm.volume} onChange={v => setUsinaForm(prev => ({ ...prev, volume: v }))} /><Field label="Data limite" placeholder="Ex: até 24/05/2026" value={usinaForm.data} onChange={v => setUsinaForm(prev => ({ ...prev, data: v }))} /><Field label="Qualidade mínima" placeholder="Ex: acima de 85%" value={usinaForm.qualidade} onChange={v => setUsinaForm(prev => ({ ...prev, qualidade: v }))} /><Field label="Recorrência" placeholder="Ex: diária, semanal ou mensal" value={usinaForm.recorrencia} onChange={v => setUsinaForm(prev => ({ ...prev, recorrencia: v }))} /><div style={{ display: "flex", gap: 10, marginTop: 8 }}><SecondaryButton onClick={() => setUsinaStep(0)} style={{ flex: 1 }}>← Voltar</SecondaryButton><PrimaryButton onClick={() => setUsinaStep(2)} style={{ flex: 2 }}>Continuar →</PrimaryButton></div></div>}
          {usinaStep === 2 && <div style={{ display: "flex", flexDirection: "column", gap: 14 }}><h3 style={{ color: colors.primaryDark, margin: "0 0 8px", fontSize: 16 }}>Confirme a solicitação</h3><Card>{[{ label: "Tipo de insumo", value: usinaForm.tipo || "Mix Padronizado" }, { label: "Volume", value: usinaForm.volume || "1.500 kg/semana" }, { label: "Prazo", value: usinaForm.data || "Até 24/05/2026" }, { label: "Qualidade mínima", value: usinaForm.qualidade || "Acima de 85%" }, { label: "Recorrência", value: usinaForm.recorrencia || "Semanal" }].map(r => <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${colors.cream}` }}><span style={{ color: colors.textLight, fontSize: 13, fontFamily: "sans-serif" }}>{r.label}</span><span style={{ color: colors.primaryDark, fontSize: 13, fontWeight: 800, fontFamily: "sans-serif", textAlign: "right" }}>{r.value}</span></div>)}</Card><Card style={{ background: `${colors.primary}11`, border: `1px solid ${colors.primary}33` }}><p style={{ margin: 0, color: colors.primaryDark, fontSize: 13, fontFamily: "sans-serif" }}>✅ A BioFlow buscará fornecedores compatíveis e priorizará lotes com rastreabilidade, separação correta na origem e melhor custo logístico.</p></Card><div style={{ display: "flex", gap: 10 }}><SecondaryButton onClick={() => setUsinaStep(1)} style={{ flex: 1 }}>← Voltar</SecondaryButton><PrimaryButton onClick={() => go(screens.USINA_CONFIRMACAO)} style={{ flex: 2 }}>Confirmar demanda ✓</PrimaryButton></div></div>}
        </div>
      </div>
      <NavBar />
    </Phone>
  );

  if (screen === screens.USINA_CONFIRMACAO) return (
    <Phone>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 54, marginBottom: 24, lineHeight: 1 }}>✅</div>
        <h2 style={{ color: colors.primaryDark, fontSize: 25, margin: "0 0 14px", fontWeight: 900 }}>Demanda Confirmada!</h2>
        <p style={{ color: colors.textMid, fontSize: 15, margin: "0 0 8px", fontFamily: "sans-serif", lineHeight: 1.6 }}>Código: <strong style={{ color: colors.primary }}>BF-US-004</strong></p>
        <p style={{ color: colors.textLight, fontSize: 14, margin: "0 0 28px", fontFamily: "sans-serif", lineHeight: 1.6 }}>Sua usina receberá opções de fornecimento compatíveis com volume, qualidade e prazo.</p>
        <Card style={{ background: colors.cream, width: "100%", marginBottom: 24 }}><p style={{ margin: 0, fontSize: 13, color: colors.primaryDark, fontFamily: "sans-serif" }}>⚡ Estimativa inicial: até <strong>225 m³ de biogás</strong> com a demanda solicitada.</p></Card>
        <PrimaryButton onClick={() => go(screens.USINA_RASTREAR, "rastrear")}>Monitorar entradas →</PrimaryButton>
      </div>
    </Phone>
  );

  if (screen === screens.USINA_RASTREAR) return (
    <Phone>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Header title="Entradas da Usina" subtitle="Rastreie matéria-prima, qualidade e chegada" icon="🚛" gradient="linear-gradient(135deg, #1a3a2a, #2d6040)" />
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>{insumosUsina.map(c => <button key={c.id} onClick={() => setUsinaRastrearId(c.id)} style={{ flex: 1, background: usinaRastrearId === c.id ? colors.primary : "#fff", border: `1.5px solid ${usinaRastrearId === c.id ? colors.primary : colors.cream}`, borderRadius: 10, padding: "8px 4px", cursor: "pointer", color: usinaRastrearId === c.id ? "#fff" : colors.textMid, fontSize: 10, fontWeight: 700, fontFamily: "sans-serif" }}>{c.id.replace("BF-US-", "#")}</button>)}</div>
          <Card style={{ marginBottom: 16 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}><div><StatusBadge status={currentInsumo.status} /><div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 15, marginTop: 6 }}>{currentInsumo.empresa}</div><div style={{ color: colors.textLight, fontSize: 12, fontFamily: "sans-serif" }}>{currentInsumo.tipo} · {currentInsumo.peso}</div></div><span style={{ fontSize: 30 }}>{currentInsumo.status === "em_transporte" ? "🚛" : currentInsumo.status === "disponivel" ? "🧾" : "🧪"}</span></div><div style={{ display: "flex", gap: 10 }}>{[{ l: "Qualidade", v: currentInsumo.qualidade }, { l: "Biogás", v: currentInsumo.biogasPrevisto }, { l: "Contam.", v: currentInsumo.contaminacao }].map(m => <div key={m.l} style={{ flex: 1, background: `${colors.primary}0f`, borderRadius: 12, padding: 10, textAlign: "center" }}><div style={{ color: colors.primaryDark, fontSize: 14, fontWeight: 900 }}>{m.v}</div><div style={{ color: colors.textLight, fontSize: 10, fontFamily: "sans-serif" }}>{m.l}</div></div>)}</div></Card>
          <Card><h4 style={{ margin: "0 0 16px", color: colors.primaryDark, fontSize: 14 }}>Linha do Tempo da Entrada</h4>{[{ icon: "✅", label: "Fornecedor validado", time: "Documento e origem conferidos", done: true }, { icon: "✅", label: "Qualidade pré-aprovada", time: `Índice BioFlow: ${currentInsumo.qualidade}`, done: currentInsumo.status !== "disponivel" }, { icon: currentInsumo.status === "em_transporte" ? "🚛" : "⏳", label: "Transporte até a usina", time: currentInsumo.status === "em_transporte" ? "ETA: 2h 50min" : "Aguardando aceite", active: currentInsumo.status === "em_transporte" }, { icon: "⭕", label: "Pesagem e triagem final", time: "Na chegada" }, { icon: "⭕", label: "Liberação para biodigestor", time: "Após aprovação" }].map((step, i) => <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><span style={{ fontSize: 18 }}>{step.icon}</span>{i < 4 && <div style={{ width: 2, height: 20, background: step.done || step.active ? colors.primaryLight : colors.cream, marginTop: 4 }} />}</div><div><div style={{ color: step.done || step.active ? colors.primaryDark : colors.textLight, fontWeight: step.active ? 900 : 600, fontSize: 13, fontFamily: "sans-serif" }}>{step.label}</div><div style={{ color: colors.textLight, fontSize: 11, fontFamily: "sans-serif" }}>{step.time}</div></div></div>)}</Card>
          {currentInsumo.status === "em_transporte" && <Card style={{ background: `${colors.primaryLight}22`, marginTop: 14, textAlign: "center" }}><div style={{ fontSize: 28 }}>🗺️</div><p style={{ margin: "8px 0 0", color: colors.primaryDark, fontSize: 13, fontFamily: "sans-serif" }}><strong>Rod. Anhanguera km 142</strong> · chegada estimada em <strong>2h 50min</strong></p><p style={{ margin: "4px 0 0", color: colors.textLight, fontSize: 12, fontFamily: "sans-serif" }}>Destino: {currentInsumo.destino}</p></Card>}
        </div>
      </div>
      <NavBar />
    </Phone>
  );

  if (screen === screens.USINA_HISTORICO) return (
    <Phone>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Header title="Histórico da Usina" subtitle="Recebimentos, qualidade e produção gerada" icon="📊" gradient="linear-gradient(135deg, #1a3a2a, #2d6040)" />
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <Card style={{ background: `linear-gradient(135deg, ${colors.primary}22, ${colors.cream})` }}><h4 style={{ margin: "0 0 12px", color: colors.primaryDark, fontSize: 14 }}>Resumo do Mês — Maio 2026</h4><div style={{ display: "flex", gap: 12 }}>{[{ v: "7,4 t", l: "Recebidas" }, { v: "1.090 m³", l: "Biogás" }, { v: "89%", l: "Qualidade média" }].map(m => <div key={m.l} style={{ flex: 1, textAlign: "center" }}><div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 16 }}>{m.v}</div><div style={{ color: colors.textLight, fontSize: 10, fontFamily: "sans-serif" }}>{m.l}</div></div>)}</div></Card>
          {[...insumosUsina, ...mockHistoricoUsina].map(c => <Card key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ color: colors.primaryDark, fontWeight: 800, fontSize: 13 }}>{c.empresa}</div><div style={{ color: colors.textLight, fontSize: 11, margin: "3px 0", fontFamily: "sans-serif" }}>{c.tipo || "Resíduo orgânico"} · {c.peso}</div><StatusBadge status={c.status} /></div><div style={{ textAlign: "right" }}><div style={{ color: colors.textLight, fontSize: 11, fontFamily: "sans-serif" }}>{c.data}</div><div style={{ color: colors.primary, fontSize: 12, fontWeight: 700, marginTop: 4 }}>⚡ {c.biogasGerado || c.biogasPrevisto}</div><div style={{ color: colors.textLight, fontSize: 10, fontFamily: "sans-serif" }}>Qual. {c.qualidade}</div></div></Card>)}
        </div>
      </div>
      <NavBar />
    </Phone>
  );

  if (screen === screens.USINA_PERFIL) return (
    <Phone>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ background: `linear-gradient(135deg, #1a3a2a, #2d6040)`, padding: "32px 24px 40px", borderRadius: "0 0 28px 28px", textAlign: "center" }}><div style={{ fontSize: 56, marginBottom: 8 }}>⚡</div><h2 style={{ color: "#fff", margin: "0 0 4px", fontSize: 20, fontWeight: 900 }}>Usina BioPower SP</h2><p style={{ color: colors.cream, margin: 0, fontSize: 13, fontFamily: "sans-serif", opacity: 0.8 }}>Capacidade operacional: 12 t/dia</p><div style={{ background: "#ffffff22", borderRadius: 10, padding: "6px 14px", display: "inline-block", marginTop: 10 }}><span style={{ color: colors.cream, fontSize: 12, fontFamily: "sans-serif" }}>✅ Parceira BioFlow · Fornecimento rastreável</span></div></div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>{[{ icon: "📍", label: "Endereço", val: "Campinas — SP" }, { icon: "📦", label: "Tipos aceitos", val: "Alimentares, cascas e efluentes" }, { icon: "🧪", label: "Qualidade mínima", val: "Acima de 85%" }, { icon: "📊", label: "Capacidade atual", val: "87% utilizada" }, { icon: "📄", label: "Relatório operacional", val: "Baixar PDF" }].map(m => <Card key={m.label} style={{ display: "flex", alignItems: "center", gap: 14 }}><span style={{ fontSize: 22 }}>{m.icon}</span><div style={{ flex: 1 }}><div style={{ color: colors.textLight, fontSize: 11, fontFamily: "sans-serif" }}>{m.label}</div><div style={{ color: colors.primaryDark, fontWeight: 700, fontSize: 13, fontFamily: "sans-serif" }}>{m.val}</div></div><span style={{ color: colors.textLight }}>›</span></Card>)}<button onClick={() => { limparDadosSalvos(); go(screens.WELCOME); }} style={{ background: "#fff2f0", border: "1.5px solid #ffcccc", borderRadius: 14, padding: 16, color: colors.red, fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 8, fontFamily: "sans-serif" }}>Sair da conta</button></div>
      </div>
      <NavBar />
    </Phone>
  );

  return null;
}

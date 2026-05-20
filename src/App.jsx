import { useState } from "react";

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

const StatusBadge = ({ status }) => {
  const map = {
    em_transporte: { label: "Em Transporte", color: colors.blue },
    agendada: { label: "Agendada", color: colors.primaryLight },
    concluida: { label: "Concluída", color: "#27ae60" },
    aguardando: { label: "Aguardando", color: colors.orange },
  };
  const s = map[status] || { label: status, color: "#999" };
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
    }}>{s.label}</span>
  );
};

export default function BioFlowApp() {
  const [screen, setScreen] = useState(screens.WELCOME);
  const [userType, setUserType] = useState(null);
  const [agendarStep, setAgendarStep] = useState(0);
  const [form, setForm] = useState({ tipo: "", peso: "", data: "", obs: "" });
  const [activeTab, setActiveTab] = useState("home");
  const [rastrearId, setRastrearId] = useState("BF-2024-001");

  const go = (s, tab) => {
    setScreen(s);
    if (tab) setActiveTab(tab);
  };

  const Phone = ({ children }) => (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e8ead8 0%, #d4d8c0 100%)",
      fontFamily: "'Georgia', serif",
    }}>
      <div style={{
        width: 390,
        minHeight: 780,
        background: colors.bg,
        borderRadius: 44,
        boxShadow: "0 40px 100px #1a241044, 0 0 0 8px #fff, 0 0 0 10px #e0debc",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}>
        {/* Status bar */}
        <div style={{ background: colors.primaryDark, height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>9:41</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ color: "#fff", fontSize: 11 }}>●●●●</span>
            <span style={{ color: "#fff", fontSize: 11 }}>WiFi</span>
            <span style={{ color: "#fff", fontSize: 11 }}>🔋</span>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      </div>
    </div>
  );

  const NavBar = () => (
    <div style={{
      display: "flex",
      borderTop: `1px solid ${colors.cream}`,
      background: "#fff",
      position: "sticky",
      bottom: 0,
    }}>
      {[
        { id: "home", icon: "⊞", label: "Início" },
        { id: "agendar", icon: "＋", label: "Agendar" },
        { id: "rastrear", icon: "◎", label: "Rastrear" },
        { id: "historico", icon: "≡", label: "Histórico" },
        { id: "perfil", icon: "◌", label: "Perfil" },
      ].map(tab => (
        <button key={tab.id} onClick={() => {
          setActiveTab(tab.id);
          if (tab.id === "agendar") { setAgendarStep(0); go(screens.AGENDAR, tab.id); }
          else if (tab.id === "rastrear") go(screens.RASTREAR, tab.id);
          else if (tab.id === "historico") go(screens.HISTORICO, tab.id);
          else if (tab.id === "perfil") go(screens.PERFIL, tab.id);
          else go(userType === "usina" ? screens.USINA_HOME : screens.HOME, tab.id);
        }} style={{
          flex: 1,
          border: "none",
          background: "transparent",
          padding: "10px 0 14px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          color: activeTab === tab.id ? colors.primary : "#aaa",
          transition: "color 0.2s",
        }}>
          <span style={{ fontSize: 20 }}>{tab.icon}</span>
          <span style={{ fontSize: 10, fontWeight: activeTab === tab.id ? 700 : 400, fontFamily: "sans-serif" }}>{tab.label}</span>
        </button>
      ))}
    </div>
  );

  // ── WELCOME ──────────────────────────────────────────
  if (screen === screens.WELCOME) return (
    <Phone>
      <div style={{
        flex: 1,
        background: `linear-gradient(160deg, ${colors.primaryDark} 0%, ${colors.primary} 60%, ${colors.primaryLight} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        gap: 0,
      }}>
        <div style={{ fontSize: 72, marginBottom: 8 }}>🌿</div>
        <h1 style={{ color: "#fff", fontSize: 42, fontWeight: 900, margin: 0, letterSpacing: -1 }}>BioFlow</h1>
        <p style={{ color: colors.cream, fontSize: 14, margin: "8px 0 0", letterSpacing: 2, textTransform: "uppercase", fontFamily: "sans-serif" }}>Energia do que sobra</p>

        <div style={{ width: "100%", marginTop: 60, display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={() => { setUserType("empresa"); go(screens.LOGIN); }} style={{
            background: "#fff",
            color: colors.primaryDark,
            border: "none",
            borderRadius: 16,
            padding: "18px 0",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "sans-serif",
          }}>Sou uma Empresa</button>
          <button onClick={() => { setUserType("usina"); go(screens.LOGIN); }} style={{
            background: "transparent",
            color: "#fff",
            border: "2px solid #ffffff88",
            borderRadius: 16,
            padding: "18px 0",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "sans-serif",
          }}>Sou uma Usina de Biogás</button>
        </div>

        <p style={{ color: "#ffffff66", fontSize: 12, marginTop: 32, textAlign: "center", fontFamily: "sans-serif" }}>
          Conectando resíduos orgânicos à energia renovável
        </p>
      </div>
    </Phone>
  );

  // ── LOGIN ──────────────────────────────────────────
  if (screen === screens.LOGIN) return (
    <Phone>
      <div style={{ flex: 1, padding: "32px 28px", display: "flex", flexDirection: "column" }}>
        <button onClick={() => go(screens.WELCOME)} style={{ background: "none", border: "none", color: colors.textMid, cursor: "pointer", alignSelf: "flex-start", fontSize: 22, marginBottom: 24 }}>←</button>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 32 }}>🌿</div>
          <h2 style={{ color: colors.primaryDark, fontSize: 28, margin: "8px 0 4px", fontWeight: 900 }}>Entrar</h2>
          <p style={{ color: colors.textLight, fontSize: 14, margin: 0, fontFamily: "sans-serif" }}>
            {userType === "usina" ? "Painel da Usina de Biogás" : "Painel da Empresa Geradora"}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "E-mail", placeholder: userType === "usina" ? "contato@usinabio.com.br" : "contato@empresa.com.br", type: "email" },
            { label: "Senha", placeholder: "••••••••", type: "password" },
          ].map(f => (
            <div key={f.label}>
              <label style={{ color: colors.primaryDark, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, fontFamily: "sans-serif" }}>{f.label.toUpperCase()}</label>
              <input type={f.type} placeholder={f.placeholder} style={{
                display: "block", width: "100%", marginTop: 6,
                border: `1.5px solid ${colors.cream}`,
                borderRadius: 12, padding: "14px 16px",
                fontSize: 15, fontFamily: "sans-serif",
                background: "#fff", color: colors.textDark,
                outline: "none", boxSizing: "border-box",
              }} />
            </div>
          ))}
          <button onClick={() => go(userType === "usina" ? screens.USINA_HOME : screens.HOME, "home")} style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
            color: "#fff",
            border: "none",
            borderRadius: 14,
            padding: "18px 0",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            marginTop: 8,
            fontFamily: "sans-serif",
            boxShadow: `0 8px 24px ${colors.primary}44`,
          }}>Entrar →</button>
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <span style={{ color: colors.textLight, fontSize: 13, fontFamily: "sans-serif" }}>Não tem conta? </span>
          <span style={{ color: colors.primary, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "sans-serif" }}>Cadastre-se</span>
        </div>
      </div>
    </Phone>
  );

  // ── HOME EMPRESA ──────────────────────────────────────────
  if (screen === screens.HOME) return (
    <Phone>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})`,
          padding: "28px 24px 32px",
          borderRadius: "0 0 28px 28px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <p style={{ color: colors.cream, fontSize: 12, margin: 0, fontFamily: "sans-serif", opacity: 0.8 }}>Bom dia,</p>
              <h2 style={{ color: "#fff", fontSize: 20, margin: "2px 0 0", fontWeight: 900 }}>Supermercado Pão de Mel 🏪</h2>
            </div>
            <div style={{ background: "#ffffff22", borderRadius: 12, padding: "8px 10px", fontSize: 20 }}>🔔</div>
          </div>

          {/* Impact cards */}
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "Resíduos coletados", value: "1.240 kg", icon: "♻️" },
              { label: "Biogás gerado", value: "183 m³", icon: "⚡" },
              { label: "CO₂ evitado", value: "420 kg", icon: "🌍" },
            ].map(c => (
              <div key={c.label} style={{
                flex: 1,
                background: "#ffffff15",
                borderRadius: 14,
                padding: "12px 10px",
                border: "1px solid #ffffff22",
              }}>
                <div style={{ fontSize: 18 }}>{c.icon}</div>
                <div style={{ color: "#fff", fontSize: 16, fontWeight: 900, marginTop: 4 }}>{c.value}</div>
                <div style={{ color: colors.cream, fontSize: 9, opacity: 0.8, fontFamily: "sans-serif", lineHeight: 1.3 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "20px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Quick actions */}
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "Agendar Coleta", icon: "📦", action: () => { setAgendarStep(0); go(screens.AGENDAR, "agendar"); } },
              { label: "Rastrear", icon: "📍", action: () => go(screens.RASTREAR, "rastrear") },
            ].map(a => (
              <button key={a.label} onClick={a.action} style={{
                flex: 1, background: "#fff", border: `1.5px solid ${colors.cream}`,
                borderRadius: 16, padding: "18px 0", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}>
                <span style={{ fontSize: 28 }}>{a.icon}</span>
                <span style={{ color: colors.primaryDark, fontSize: 12, fontWeight: 700, fontFamily: "sans-serif" }}>{a.label}</span>
              </button>
            ))}
          </div>

          {/* Próximas coletas */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, color: colors.primaryDark, fontSize: 16, fontWeight: 900 }}>Próximas Coletas</h3>
              <span onClick={() => go(screens.HISTORICO, "historico")} style={{ color: colors.primary, fontSize: 12, cursor: "pointer", fontFamily: "sans-serif" }}>Ver todas →</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {mockColetas.slice(0, 2).map(c => (
                <div key={c.id} onClick={() => { setRastrearId(c.id); go(screens.RASTREAR, "rastrear"); }} style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "16px",
                  border: `1.5px solid ${colors.cream}`,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <div>
                    <StatusBadge status={c.status} />
                    <div style={{ color: colors.primaryDark, fontWeight: 700, fontSize: 14, marginTop: 6 }}>{c.tipo}</div>
                    <div style={{ color: colors.textLight, fontSize: 12, marginTop: 2, fontFamily: "sans-serif" }}>{c.data} · {c.peso}</div>
                  </div>
                  <span style={{ color: colors.textLight, fontSize: 20 }}>›</span>
                </div>
              ))}
            </div>
          </div>

          {/* ESG badge */}
          <div style={{
            background: `linear-gradient(135deg, ${colors.cream}, #f0eed8)`,
            borderRadius: 16,
            padding: "16px",
            border: `1px solid ${colors.primaryLight}44`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <div style={{ fontSize: 36 }}>🏆</div>
            <div>
              <div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 14 }}>Selo ESG Verificado</div>
              <div style={{ color: colors.textMid, fontSize: 12, marginTop: 2, fontFamily: "sans-serif" }}>Seu impacto ambiental é monitorado e certificado pela BioFlow.</div>
            </div>
          </div>
        </div>
      </div>
      <NavBar />
    </Phone>
  );

  // ── AGENDAR COLETA ──────────────────────────────────────────
  if (screen === screens.AGENDAR) return (
    <Phone>
      <div style={{ flex: 1 }}>
        <div style={{ background: colors.primaryDark, padding: "28px 24px 20px", borderRadius: "0 0 24px 24px" }}>
          <h2 style={{ color: "#fff", fontSize: 22, margin: 0, fontWeight: 900 }}>Agendar Coleta</h2>
          <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{
                flex: 1, height: 4, borderRadius: 4,
                background: agendarStep >= s - 1 ? colors.primaryLight : "#ffffff33",
                transition: "background 0.3s",
              }} />
            ))}
          </div>
          <p style={{ color: colors.cream, fontSize: 12, margin: "8px 0 0", fontFamily: "sans-serif", opacity: 0.8 }}>
            {["Tipo de resíduo", "Data e quantidade", "Confirmação"][agendarStep]} — Passo {agendarStep + 1}/3
          </p>
        </div>

        <div style={{ padding: "24px 20px", flex: 1 }}>
          {agendarStep === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h3 style={{ color: colors.primaryDark, margin: "0 0 8px", fontSize: 16 }}>Qual tipo de resíduo?</h3>
              {[
                { label: "Restos Alimentares", icon: "🥦", sub: "Restaurantes, lanchonetes" },
                { label: "Cascas e Orgânicos", icon: "🍊", sub: "Frutas, legumes, hortifrutis" },
                { label: "Resíduos Industriais", icon: "🏭", sub: "Indústria alimentícia" },
                { label: "Efluentes Orgânicos", icon: "💧", sub: "Laticínios, frigoríficos" },
              ].map(t => (
                <button key={t.label} onClick={() => { setForm(f => ({ ...f, tipo: t.label })); setAgendarStep(1); }} style={{
                  background: form.tipo === t.label ? `${colors.primary}11` : "#fff",
                  border: `1.5px solid ${form.tipo === t.label ? colors.primary : colors.cream}`,
                  borderRadius: 14, padding: "16px",
                  cursor: "pointer", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 14,
                }}>
                  <span style={{ fontSize: 28 }}>{t.icon}</span>
                  <div>
                    <div style={{ color: colors.primaryDark, fontWeight: 700, fontSize: 14 }}>{t.label}</div>
                    <div style={{ color: colors.textLight, fontSize: 12, fontFamily: "sans-serif" }}>{t.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {agendarStep === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h3 style={{ color: colors.primaryDark, margin: "0 0 8px", fontSize: 16 }}>Detalhes da coleta</h3>
              {[
                { label: "Data preferida", placeholder: "22/05/2026", key: "data" },
                { label: "Volume estimado (kg)", placeholder: "Ex: 200", key: "peso" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ color: colors.primaryDark, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, fontFamily: "sans-serif" }}>{f.label.toUpperCase()}</label>
                  <input placeholder={f.placeholder} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} style={{
                    display: "block", width: "100%", marginTop: 6,
                    border: `1.5px solid ${colors.cream}`, borderRadius: 12, padding: "14px 16px",
                    fontSize: 15, fontFamily: "sans-serif", background: "#fff",
                    outline: "none", boxSizing: "border-box",
                  }} />
                </div>
              ))}
              <div>
                <label style={{ color: colors.primaryDark, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, fontFamily: "sans-serif" }}>OBSERVAÇÕES</label>
                <textarea placeholder="Ex: resíduos ficam no fundo do estabelecimento..." style={{
                  display: "block", width: "100%", marginTop: 6,
                  border: `1.5px solid ${colors.cream}`, borderRadius: 12, padding: "14px 16px",
                  fontSize: 14, fontFamily: "sans-serif", background: "#fff",
                  outline: "none", resize: "none", height: 80, boxSizing: "border-box",
                }} />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={() => setAgendarStep(0)} style={{ flex: 1, background: "#fff", border: `1.5px solid ${colors.cream}`, borderRadius: 14, padding: "16px 0", cursor: "pointer", color: colors.textMid, fontFamily: "sans-serif", fontWeight: 700 }}>← Voltar</button>
                <button onClick={() => setAgendarStep(2)} style={{ flex: 2, background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`, border: "none", borderRadius: 14, padding: "16px 0", cursor: "pointer", color: "#fff", fontFamily: "sans-serif", fontWeight: 700, fontSize: 15 }}>Continuar →</button>
              </div>
            </div>
          )}

          {agendarStep === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <h3 style={{ color: colors.primaryDark, margin: "0 0 8px", fontSize: 16 }}>Confirme os dados</h3>
              <div style={{ background: "#fff", borderRadius: 16, padding: "20px", border: `1.5px solid ${colors.cream}` }}>
                {[
                  { label: "Tipo de resíduo", value: form.tipo || "Restos Alimentares" },
                  { label: "Data", value: form.data || "22/05/2026" },
                  { label: "Volume estimado", value: (form.peso || "200") + " kg" },
                  { label: "Empresa", value: "Supermercado Pão de Mel" },
                  { label: "Destino", value: "Usina BioPower SP" },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${colors.cream}` }}>
                    <span style={{ color: colors.textLight, fontSize: 13, fontFamily: "sans-serif" }}>{r.label}</span>
                    <span style={{ color: colors.primaryDark, fontSize: 13, fontWeight: 700, fontFamily: "sans-serif" }}>{r.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: `${colors.primary}11`, borderRadius: 14, padding: "14px 16px", border: `1px solid ${colors.primary}33` }}>
                <p style={{ margin: 0, color: colors.primaryDark, fontSize: 13, fontFamily: "sans-serif" }}>
                  ✅ Nossa transportadora parceira entrará em contato com até <strong>2 horas</strong> para confirmar a janela de coleta.
                </p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setAgendarStep(1)} style={{ flex: 1, background: "#fff", border: `1.5px solid ${colors.cream}`, borderRadius: 14, padding: "16px 0", cursor: "pointer", color: colors.textMid, fontFamily: "sans-serif", fontWeight: 700 }}>← Voltar</button>
                <button onClick={() => go(screens.CONFIRMACAO)} style={{ flex: 2, background: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})`, border: "none", borderRadius: 14, padding: "16px 0", cursor: "pointer", color: "#fff", fontFamily: "sans-serif", fontWeight: 700, fontSize: 15 }}>Confirmar Coleta ✓</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <NavBar />
    </Phone>
  );

  // ── CONFIRMAÇÃO ──────────────────────────────────────────
  if (screen === screens.CONFIRMACAO) return (
    <Phone>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: colors.primaryDark, fontSize: 26, margin: "0 0 12px", fontWeight: 900 }}>Coleta Agendada!</h2>
        <p style={{ color: colors.textMid, fontSize: 15, margin: "0 0 8px", fontFamily: "sans-serif", lineHeight: 1.6 }}>
          Código: <strong style={{ color: colors.primary }}>BF-2024-003</strong>
        </p>
        <p style={{ color: colors.textLight, fontSize: 14, margin: "0 0 32px", fontFamily: "sans-serif", lineHeight: 1.6 }}>
          Você receberá uma notificação quando a transportadora confirmar a coleta.
        </p>
        <div style={{ background: colors.cream, borderRadius: 16, padding: "16px 24px", width: "100%", marginBottom: 24 }}>
          <p style={{ margin: 0, fontSize: 13, color: colors.primaryDark, fontFamily: "sans-serif" }}>🌍 Esta coleta vai gerar aproximadamente <strong>~45 m³ de biogás</strong>, evitando <strong>62 kg de CO₂</strong> na atmosfera.</p>
        </div>
        <button onClick={() => go(screens.HOME, "home")} style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`, color: "#fff", border: "none", borderRadius: 14, padding: "18px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>
          Ir para o Início →
        </button>
      </div>
    </Phone>
  );

  // ── RASTREAR ──────────────────────────────────────────
  if (screen === screens.RASTREAR) return (
    <Phone>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ background: colors.primaryDark, padding: "28px 24px 20px", borderRadius: "0 0 24px 24px" }}>
          <h2 style={{ color: "#fff", fontSize: 22, margin: "0 0 4px", fontWeight: 900 }}>Rastreamento</h2>
          <p style={{ color: colors.cream, fontSize: 13, margin: 0, fontFamily: "sans-serif", opacity: 0.8 }}>Acompanhe sua coleta em tempo real</p>
        </div>

        <div style={{ padding: "20px" }}>
          {/* Selector */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {mockColetas.map(c => (
              <button key={c.id} onClick={() => setRastrearId(c.id)} style={{
                flex: 1, background: rastrearId === c.id ? colors.primary : "#fff",
                border: `1.5px solid ${rastrearId === c.id ? colors.primary : colors.cream}`,
                borderRadius: 10, padding: "8px 4px",
                cursor: "pointer", color: rastrearId === c.id ? "#fff" : colors.textMid,
                fontSize: 10, fontWeight: 700, fontFamily: "sans-serif",
              }}>{c.id.replace("BF-2024-", "#")}</button>
            ))}
          </div>

          {(() => {
            const coleta = mockColetas.find(c => c.id === rastrearId) || mockColetas[0];
            return (
              <>
                <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: `1.5px solid ${colors.cream}`, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <StatusBadge status={coleta.status} />
                      <div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 15, marginTop: 6 }}>{coleta.id}</div>
                      <div style={{ color: colors.textLight, fontSize: 12, fontFamily: "sans-serif" }}>{coleta.tipo} · {coleta.peso}</div>
                    </div>
                    <span style={{ fontSize: 28 }}>{coleta.status === "em_transporte" ? "🚛" : "📅"}</span>
                  </div>
                </div>

                {/* Timeline */}
                <div style={{ background: "#fff", borderRadius: 16, padding: "20px", border: `1.5px solid ${colors.cream}` }}>
                  <h4 style={{ margin: "0 0 16px", color: colors.primaryDark, fontSize: 14 }}>Linha do Tempo</h4>
                  {[
                    { icon: "✅", label: "Coleta agendada", time: "Hoje, 09:00", done: true },
                    { icon: coleta.status === "em_transporte" ? "✅" : "⏳", label: "Transportadora a caminho", time: coleta.status === "em_transporte" ? "Hoje, 13:00" : "Aguardando", done: coleta.status === "em_transporte" },
                    { icon: coleta.status === "em_transporte" ? "🚛" : "⭕", label: "Em transporte para a usina", time: coleta.status === "em_transporte" ? "Hoje, 13:40" : "—", done: false, active: coleta.status === "em_transporte" },
                    { icon: "⭕", label: "Chegada na usina", time: "Previsto: 16:30", done: false },
                    { icon: "⭕", label: "Processamento e biogás gerado", time: "Previsto: amanhã", done: false },
                  ].map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <span style={{ fontSize: 18 }}>{step.icon}</span>
                        {i < 4 && <div style={{ width: 2, height: 20, background: step.done || step.active ? colors.primaryLight : colors.cream, marginTop: 4 }} />}
                      </div>
                      <div>
                        <div style={{ color: step.done || step.active ? colors.primaryDark : colors.textLight, fontWeight: step.active ? 900 : 600, fontSize: 13, fontFamily: "sans-serif" }}>{step.label}</div>
                        <div style={{ color: colors.textLight, fontSize: 11, fontFamily: "sans-serif" }}>{step.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {coleta.status === "em_transporte" && (
                  <div style={{ background: `${colors.primaryLight}22`, borderRadius: 14, padding: "14px", marginTop: 14, border: `1px solid ${colors.primaryLight}44`, textAlign: "center" }}>
                    <div style={{ fontSize: 28 }}>🗺️</div>
                    <p style={{ margin: "8px 0 0", color: colors.primaryDark, fontSize: 13, fontFamily: "sans-serif" }}>
                      <strong>SP-330 km 142</strong> · Chegada estimada em <strong>2h 50min</strong>
                    </p>
                    <p style={{ margin: "4px 0 0", color: colors.textLight, fontSize: 12, fontFamily: "sans-serif" }}>Destino: Usina BioPower SP, Campinas</p>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
      <NavBar />
    </Phone>
  );

  // ── HISTÓRICO ──────────────────────────────────────────
  if (screen === screens.HISTORICO) return (
    <Phone>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ background: colors.primaryDark, padding: "28px 24px 20px", borderRadius: "0 0 24px 24px" }}>
          <h2 style={{ color: "#fff", fontSize: 22, margin: "0 0 4px", fontWeight: 900 }}>Histórico</h2>
          <p style={{ color: colors.cream, fontSize: 13, margin: 0, fontFamily: "sans-serif", opacity: 0.8 }}>Todas as suas coletas e impacto gerado</p>
        </div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Summary */}
          <div style={{ background: `linear-gradient(135deg, ${colors.primary}22, ${colors.cream})`, borderRadius: 16, padding: "18px", border: `1px solid ${colors.primaryLight}44` }}>
            <h4 style={{ margin: "0 0 12px", color: colors.primaryDark, fontSize: 14 }}>Resumo do Mês — Maio 2026</h4>
            <div style={{ display: "flex", gap: 16 }}>
              {[{ v: "875 kg", l: "Coletados" }, { v: "131 m³", l: "Biogás" }, { v: "R$ 124", l: "Economizado" }].map(m => (
                <div key={m.l} style={{ textAlign: "center" }}>
                  <div style={{ color: colors.primaryDark, fontWeight: 900, fontSize: 16 }}>{m.v}</div>
                  <div style={{ color: colors.textLight, fontSize: 10, fontFamily: "sans-serif" }}>{m.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* All coletas */}
          {[...mockColetas, ...mockHistorico.map(h => ({ ...h, tipo: "Resíduos Alimentares", empresa: "Supermercado Pão de Mel" }))].map(c => (
            <div key={c.id} style={{
              background: "#fff",
              borderRadius: 14,
              padding: "14px 16px",
              border: `1.5px solid ${colors.cream}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <div style={{ color: colors.primaryDark, fontWeight: 700, fontSize: 13 }}>{c.id}</div>
                <div style={{ color: colors.textLight, fontSize: 11, margin: "3px 0", fontFamily: "sans-serif" }}>{c.tipo} · {c.peso || c.peso}</div>
                <StatusBadge status={c.status || "concluida"} />
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: colors.textLight, fontSize: 11, fontFamily: "sans-serif" }}>{c.data || c.data}</div>
                {c.biogasGerado && <div style={{ color: colors.primary, fontSize: 12, fontWeight: 700, marginTop: 4 }}>⚡ {c.biogasGerado}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <NavBar />
    </Phone>
  );

  // ── PERFIL ──────────────────────────────────────────
  if (screen === screens.PERFIL) return (
    <Phone>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ background: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})`, padding: "32px 24px 40px", borderRadius: "0 0 28px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>🏪</div>
          <h2 style={{ color: "#fff", margin: "0 0 4px", fontSize: 20, fontWeight: 900 }}>Supermercado Pão de Mel</h2>
          <p style={{ color: colors.cream, margin: 0, fontSize: 13, fontFamily: "sans-serif", opacity: 0.8 }}>CNPJ: 12.345.678/0001-99</p>
          <div style={{ background: "#ffffff22", borderRadius: 10, padding: "6px 14px", display: "inline-block", marginTop: 10 }}>
            <span style={{ color: colors.cream, fontSize: 12, fontFamily: "sans-serif" }}>🏆 Nível Verde · Cliente desde Jan 2025</span>
          </div>
        </div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { icon: "📍", label: "Endereço de coleta", val: "Av. Paulista, 1234 — São Paulo" },
            { icon: "📞", label: "Contato", val: "(11) 91234-5678" },
            { icon: "📧", label: "E-mail", val: "contato@paodemel.com.br" },
            { icon: "🔔", label: "Notificações", val: "Ativadas" },
            { icon: "📄", label: "Relatório ESG", val: "Baixar PDF" },
          ].map(m => (
            <div key={m.label} style={{ background: "#fff", borderRadius: 14, padding: "16px", border: `1.5px solid ${colors.cream}`, display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 22 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: colors.textLight, fontSize: 11, fontFamily: "sans-serif" }}>{m.label}</div>
                <div style={{ color: colors.primaryDark, fontWeight: 700, fontSize: 13, fontFamily: "sans-serif" }}>{m.val}</div>
              </div>
              <span style={{ color: colors.textLight }}>›</span>
            </div>
          ))}
          <button onClick={() => go(screens.WELCOME)} style={{ background: "#fff2f0", border: "1.5px solid #ffcccc", borderRadius: 14, padding: "16px", color: colors.red, fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 8, fontFamily: "sans-serif" }}>
            Sair da conta
          </button>
        </div>
      </div>
      <NavBar />
    </Phone>
  );

  // ── USINA HOME ──────────────────────────────────────────
  if (screen === screens.USINA_HOME) return (
    <Phone>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ background: `linear-gradient(135deg, #1a3a2a, #2d6040)`, padding: "28px 24px 32px", borderRadius: "0 0 28px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <p style={{ color: colors.cream, fontSize: 12, margin: 0, fontFamily: "sans-serif", opacity: 0.8 }}>Bem-vinda,</p>
              <h2 style={{ color: "#fff", fontSize: 20, margin: "2px 0 0", fontWeight: 900 }}>Usina BioPower SP ⚡</h2>
            </div>
            <div style={{ background: "#ffffff22", borderRadius: 12, padding: "8px 10px", fontSize: 20 }}>🔔</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "Entradas hoje", value: "2 coletas", icon: "📥" },
              { label: "Produção", value: "830 m³", icon: "⚡" },
              { label: "Capacidade", value: "87%", icon: "📊" },
            ].map(c => (
              <div key={c.label} style={{ flex: 1, background: "#ffffff15", borderRadius: 14, padding: "12px 10px", border: "1px solid #ffffff22" }}>
                <div style={{ fontSize: 18 }}>{c.icon}</div>
                <div style={{ color: "#fff", fontSize: 15, fontWeight: 900, marginTop: 4 }}>{c.value}</div>
                <div style={{ color: colors.cream, fontSize: 9, opacity: 0.8, fontFamily: "sans-serif", lineHeight: 1.3 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ margin: 0, color: colors.primaryDark, fontSize: 16, fontWeight: 900 }}>Recebimentos Programados</h3>
          {mockColetas.map(c => (
            <div key={c.id} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: `1.5px solid ${colors.cream}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: colors.primaryDark, fontWeight: 700, fontSize: 13 }}>{c.empresa}</div>
                <div style={{ color: colors.textLight, fontSize: 12, margin: "3px 0", fontFamily: "sans-serif" }}>{c.tipo} · {c.peso}</div>
                <StatusBadge status={c.status} />
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: colors.textLight, fontSize: 11, fontFamily: "sans-serif" }}>{c.data}</div>
              </div>
            </div>
          ))}
          <div style={{ background: `${colors.primary}11`, borderRadius: 14, padding: "16px", border: `1px solid ${colors.primary}33` }}>
            <h4 style={{ margin: "0 0 8px", color: colors.primaryDark, fontSize: 13 }}>Previsão de Produção — Semana</h4>
            <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 60 }}>
              {[40, 65, 55, 80, 45, 70, 87].map((v, i) => (
                <div key={i} style={{ flex: 1, background: i === 6 ? colors.primaryLight : colors.cream, borderRadius: "4px 4px 0 0", height: `${v}%` }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              {["S", "T", "Q", "Q", "S", "S", "D"].map((d, i) => (
                <span key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: colors.textLight, fontFamily: "sans-serif" }}>{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <NavBar />
    </Phone>
  );

  return null;
}

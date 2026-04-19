import React, {useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import FormularioConsulta from "../components/FormularioConsulta";
import "../styles/components.css";

const ITENS_POR_PAGINA=8;

export default function Consultas() {
    const [consultas, setConsultas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [filtroStatus, setFiltroStatus] = useState("todos");
    const [busca, setBusca] = useState("");
    const [pagina, setPagina] = useState(1);
    const [modalAberto, setModalAberto] = useState(false);
    const [consultaEditando, setConsultaEditando] = useState(null);
    const [alerta, setAlerta] = useState(null);

    const carregar = useCallback(() => {
        setCarregando(true);
        const filtros = {};
        if (filtroStatus !== "todos") filtros.status = filtroStatus;
        api.listarConsultas(filtros)
            .then(setConsultas)
            .catch(() => mostrarAlerta("erro", "Erro ao carregar consultas"))
            .finally(() => setCarregando(false));
    }, [filtroStatus]);

    useEffect(() => {carregar(); }, [carregar]);

    function mostrarAlerta(tipo, msg) {
        setAlerta({tipo, msg});
        setTimeout(()=> setAlerta(null), 3500);
    }

    async function handleStatus(id, novoStatus) {
        try {
            await api.atualizarStatus(id, novoStatus);
            mostrarAlerta("sucesso", "Status atualizado!")
            carregar();
        } catch (err) {
            mostrarAlerta("erro", err.message);
        }
    }

    async function handleDeletar(id, paciente) {
        if(!window.confirm(`Excluir consulta de ${paciente}? `)) return;
        try {
            await api.deletarConsultas(id);
            mostrarAlerta("sucesso", "Consulta excluída!");
            carregar();
        } catch (err){
            mostrarAlerta("erro", err.message);
        }
    }

    const filtradas = consultas.filter(
        (c) => c.paciente.toLowerCase().includes(busca.toLowerCase()) ||
               c.medico.toLowerCase().includes(busca.toLowerCase()) 
    );

    const totalPaginas = Math.ceil(filtradas.length/ ITENS_POR_PAGINA);
    const paginadas = filtradas.slice(
        (pagina-1) * ITENS_POR_PAGINA,
        pagina * ITENS_POR_PAGINA
    );

    function formatarData(data) {
        if (!data) return "-";
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    return (
        <div>
        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
            <h2>Consultas</h2>
            <p>Gerencie todos os agendamentos</p>
            </div>
            <button className="btn btn-acento" onClick={() => { setConsultaEditando(null); setModalAberto(true); }}>
            + Nova Consulta
            </button>
        </div>

            {alerta && (
                <div className={`alerta alerta-${alerta.tipo}`} style={{ marginBottom: 16 }}>
                {alerta.tipo === "sucesso" ? "✅" : "⚠️"} {alerta.msg}
                </div>
            )}

      
        <div className="filtros-bar">
            {["todos", "pendente", "confirmado", "cancelado"].map((s) => (
            <button
                key={s}
                className={`filtro-chip ${filtroStatus === s ? "ativo" : ""}`}
                onClick={() => { setFiltroStatus(s); setPagina(1); }}
            >
                {s === "todos" ? "Todos" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
            ))}
        </div>

        <div className="tabela-container">
            <div className="tabela-header">
            <span style={{ fontFamily: "var(--fonte-display)", fontWeight: 600 }}>
                {filtradas.length} consulta{filtradas.length !== 1 ? "s" : ""}
            </span>
            <input
                style={{ padding: "8px 14px", border: "1px solid var(--cor-borda)", borderRadius: 10, fontFamily: "var(--fonte-corpo)", fontSize: "0.88rem", background: "var(--cor-fundo)", width: 220 }}
                placeholder=" Buscar..."
                value={busca}
                onChange={(e) => { setBusca(e.target.value); setPagina(1); }}
            />
        </div>

            {carregando ? (
            <div className="loading-container"><div className="spinner" /><span>Carregando...</span></div>
            ) : paginadas.length === 0 ? (
            <div style={{ textAlign: "center", padding: 48, color: "var(--cor-texto-suave)" }}>
                <div style={{ fontSize: "3rem", opacity: 0.3 }}>📋</div>
                <p style={{ marginTop: 8 }}>Nenhuma consulta encontrada</p>
            </div>
            ) : (
            <table>
                <thead>
                <tr>
                    <th>Paciente</th>
                    <th>Médico</th>
                    <th>Data</th>
                    <th>Horário</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {paginadas.map((c) => (
                    <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.paciente}</td>
                    <td>
                        <div>{c.medico}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--cor-texto-muito-suave)" }}>{c.especialidade}</div>
                    </td>
                    <td>{formatarData(c.data)}</td>
                    <td>{c.horario}</td>
                    <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                    <td>
                        <div style={{ display: "flex", gap: 4 }}>
                        {c.status === "pendente" && (
                            <button className="btn btn-sm" style={{ background: "var(--cor-confirmado-bg)", color: "var(--cor-confirmado)", border: "1px solid #c3d9c7" }} onClick={() => handleStatus(c.id, "confirmado")}>✓</button>
                        )}
                        {c.status !== "cancelado" && (
                            <button className="btn btn-sm" style={{ background: "var(--cor-pendente-bg)", color: "var(--cor-pendente)", border: "1px solid #f0d56b" }} onClick={() => handleStatus(c.id, "cancelado")}>✕</button>
                        )}
                        <button className="btn btn-sm btn-secundario" onClick={() => { setConsultaEditando(c); setModalAberto(true); }}>✏️</button>
                        <button className="btn btn-sm btn-perigo" onClick={() => handleDeletar(c.id, c.paciente)}>🗑</button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}

        
        {totalPaginas > 1 && (
          <div className="paginacao">
            <span>Página {pagina} de {totalPaginas}</span>
            <div className="paginacao-btns">
              <button className="btn btn-sm btn-secundario" onClick={() => setPagina(p => p - 1)} disabled={pagina === 1}>‹</button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
                <button key={p} className={`btn btn-sm ${p === pagina ? "btn-primario" : "btn-secundario"}`} onClick={() => setPagina(p)}>{p}</button>
              ))}
              <button className="btn btn-sm btn-secundario" onClick={() => setPagina(p => p + 1)} disabled={pagina === totalPaginas}>›</button>
            </div>
          </div>
        )}
      </div>

     
      {modalAberto && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalAberto(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{consultaEditando ? "Editar" : "Nova Consulta"}</h3>
              <button className="modal-fechar" onClick={() => setModalAberto(false)}>✕</button>
            </div>
            <FormularioConsulta
              consulta={consultaEditando}
              aoSalvar={() => {
                setModalAberto(false);
                mostrarAlerta("sucesso", consultaEditando ? "Consulta atualizada!" : "Consulta agendada!");
                carregar();
              }}
              aoCancelar={() => setModalAberto(false)}
            />
          </div>
        </div>
      )}
    </div>
    );
}

    
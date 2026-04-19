import React , { useState } from "react";
import Dashboard from "./pages/Dashboard"
import Consultas from "./pages/Consultas";
import "./styles/global.css"
import "./styles/layout.css"

const PAGINAS = {
    dashboard: { label: "Dashboard", icone: "", componente: Dashboard},
    consultas: { label: "Consultas", icone: "", componente: Consultas},
};

export default function App(){
    const [ paginaAtual, setPaginaAtual] = useState("dashboard");

    const Componente = PAGINAS[paginaAtual].componente;

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <h1>MedAgenda</h1>
                    <span>Sistema de Consultas</span>
                </div>

                <nav style={{ padding: "0 8px", flex: 1 }}>
                    {Object.entries(PAGINAS).map(([chave, info])=>(
                        <button
                            key={chave}
                            className={`nav-item ${paginaAtual === chave ? "ativo" : ""}`}
                            onClick={() => setPaginaAtual(chave)}
                        >
                        <span>{info.icone}</span>
                        {info.label}
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="main-content">
                <Componente />
            </main>
        </div>
    );
}
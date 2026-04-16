import React, {useEffect, useState} from "react";
import {api} from "../services/api";
import "../styles/layout.css";

export default function Dashboard() {
    const [ stats, setStats] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        api.dashboard()
            .then(setStats)
            .catch(console.error)
            .finally(() => setCarregando(false));
    }, []);

    if (carregando) {
        return (
            <div className = "loading-container">
                <div className="spinner" />
                <span>Carregando...</span>
            </div>
        );
    }

    return(
        <div>
            <div className="page-header">
                <h2>Visão Geral</h2>
                <p>Resumo das consultas agendadas</p>
            </div>

        <div className= "dashboard-grid">
            <div className="stat-card acento">
                <div style = {{fontSize: "1.5rem", marginBottom: 8}}></div>
                <div className = "stat-numero">{stats?.total ?? 0}</div>
                <div className = "stat-label">Total</div>
            </div>
        </div>

        <div className="stat-card verde">
          <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>✅</div>
          <div className="stat-numero">{stats?.confirmadas ?? 0}</div>
          <div className="stat-label">Confirmadas</div>
        </div>

        <div className="stat-card amarelo">
          <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>⏳</div>
          <div className="stat-numero">{stats?.pendentes ?? 0}</div>
          <div className="stat-label">Pendentes</div>
        </div>

        <div className="stat-card vermelho">
          <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>❌</div>
          <div className="stat-numero">{stats?.canceladas ?? 0}</div>
          <div className="stat-label">Canceladas</div>
        </div>

        </div>
    );
}
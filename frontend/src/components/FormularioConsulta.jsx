import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import "../styles/components.css";

export default function FormularioConsulta({ consulta, aoSalvar, aoCancelar}) {
    const [medicos, setMedicos] = useState([]);
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
    const [salvando, setSalvando] = useState(false);
    const [erros, setErros] = useState({});
    const [alerta, setAlerta] = useState(null);

    const[form, setForm] = useState({
        paciente: "",
        medico: "",
        especialidade: "",
        data:"",
        horario:"",
        telefone:"",
        observacoes:"",
        ...(consulta || {}),
    });

    const modoEdicao = !!consulta?.id;

    useEffect(()=>{
        api.listarMedicos().then(setMedicos).catch(console.error);
    }, []);

    useEffect(() =>{
        if (form.medico && form.data) {
            api.horariosDisponiveis(form.medico, form.data)
            .then(setHorariosDisponiveis)
            .then(console.error);
        }
    }, [form.medico, form.data]);

    function handleChange(e) {
        const { name, value } = erros.target;

        if (name === "medico"){

            const med = medicos.find((m) => m.nome === value);
            setForm((f) => ({...f, medico: value, especialidade: med?.especialidade || "", horario: ""}));
        }else{
            setForm((f) => ({ ...f, [name]: value}));
                }
        setErros((er) => ({ ...er, [name]: null }));
        }

        function validar(){
            const e = {};
            if (!form.paciente.trim()) e.paciente = "Nome do paciente é obrigatório";
            if (!form.medico)          e.medico   = "Selecione um médico";
            if (!form.data)            e.data     = "Selecione uma data";
            if (!form.horario)         e.horario  = "Selecione um horário";
            setErros(e);
            return Object.keys(e).length === 0;
        }

        async function handleSubmit() {
            if(!validar()) return;
            setSalvando(true);
            setAlerta(null);
            try {
                if (modoEdicao){
                    await api.atualizarConsulta(consulta.id, form);
                } else {
                    await api.criarConsulta(form);
                }
                aoSalvar?.();
            } catch (err) {
                setAlerta({ tipo: "erro", msg:err.message });
            } finally{
                setSalvando(false);
            }
        }

        return (
            <div className="form-card">
                <div className="form-card-header">
                    <h3>{modoEdicao ? "Editar Consulta" : "Nova Consulta"}</h3>
                </div>

                <div className="form-card-body">
                    {alerta && (
                        <div className={`alerta alerta-${alerta.tipo}`}>
                            {alerta.msg}
                        </div>
                    )}

                    <div className="form-grid">
                        <div className="form-grupo col-full">
                            <label className="form-label">Paciente *</label>
                            <input
                                name="paciente"
                                className={`form-input ${erros.paciente ? "erro" : ""}`}
                                value={form.paciente}
                                onChange={handleChange}
                                placeholder="Nome completo"
                            />
                            {erros.paciente && <span className="form-erro">{erros.paciente}</span>}
                        </div>

                        <div className="form-grupo">
                            <label className="form-label">Médico *</label>
                            <select
                                name="medico"
                                className={`form-select ${erros.medico ? "erro" : ""}`}
                                value={form.medico}
                                onChange={handleChange}
                            >
                                <option value=""> Selecione...</option>
                                {medicos.map((m) => (
                                    <option key={m.id} value={m.nome}>{m.nome}</option>
                                ))}
                            </select>
                            {erros.medico && <span className="form-erro">{erros.medico}</span>}
                        </div>

                        <div className="form-grupo">
                            <label className="form-label">Especialidade</label>
                            <input 
                                name="especialidade"
                                className="form-input"
                                value={form.especialidade}
                                readOnly 
                                style={{ opacity: 0.7 }}
                             />   
                        </div>

                        <div className="form-grupo">
                            <label className="form-grupo">Data </label>
                            <input 
                                type="date"
                                name="data"
                                className={`form-inpu ${erros.data ? "erro" : ""}`}
                                value={form.data}
                                onChange={handleChange}
                                min={new Date().toISOString().split("T")[0]}
                              />
                              {erros.data && <span className="form-erro">{erros.data}</span>}  
                        </div>

                        <div className="form-grupo">
                            <label className="form-label">Horário *</label>
                            <select
                            name="horario"
                            className={`form-select ${erros.horario ? "erro" : ""}`}
                            value={form.horario}
                            onChange={handleChange}
                            disabled={!form.medico || !form.data} 
                            >
                            <option value="">
                                {!form.medico || !form.data ? "Selecione médico e data antes" : "Selecione..."}
                            </option>
                            {horariosDisponiveis.map((h) => (
                                <option key={h} value={h}>{h}</option>
                            ))}
                            </select>
                            {erros.horario && <span className="form-erro">{erros.horario}</span>}
                        </div>

                        <div className="form-grupo">
                            <label className="form-label">Telefone</label>
                            <input name="telefone" className="form-input" value={form.telefone} onChange={handleChange} placeholder="(86) 99999-0000" />
                        </div>

                        <div className="form-grupo col-full">
                            <label className="form-label">Observações</label>
                            <textarea name="observacoes" className="form-textarea" value={form.observacoes} onChange={handleChange} style={{ resize: "vertical", minHeight: 80 }} />
                        </div>
                        </div>
                    </div>

                    <div className="form-footer">
                        <button className="btn btn-secundario" onClick={aoCancelar} disabled={salvando}>
                        Cancelar
                        </button>
                        <button className="btn btn-primario" onClick={handleSubmit} disabled={salvando}>
                        {salvando ? "Salvando..." : modoEdicao ? "Salvar" : "Agendar"}
                        </button>
                    </div>                
                </div>        
        )
    };

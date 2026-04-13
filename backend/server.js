const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let consultas = [{
    id: uuidv4(),
    paciente: "Maria Silva da Costa",
    medico: "Dr. Carlos Mendes",
    especialidade: "Cardiologista",
    data: "2025-04-15",
    horario: "09:00",
    status: "confirmado",
    telefone: "(86) 99999-0001",
    observacoes: "Retorno",
    },
];

const medicos = [
    {id:1, nome: "Dr. Carlos Mendes", especialidade: "Cardiologia"},
    {id:2, nome: "Dra. Ana Ferreira", especialidade: "Dermatologia"},
    {id:3, nome: "Dr. Paulo Lima", especialidade: "Ortopedia"},
    {id:4, nome: "Dra. Juliana Rocha", especialidade: "Pediatria"},
    {id:5, nome: "Dr. Roberto Alves", especialidade: "Clínica geral"},
];

const horarios = [
    "08:00","08:30","09:00","09:30","10:00","10:30",
    "11:00","11:30","13:00","13:30","14:00","14:30",
    "15:00","15:30","16:00","16:30","17:00",
];

// ROTAS

app.get("/api/consultas", (req, res) => {
    const {status} = req.query;
    let resultado = [...consultas];

    if(status) {
        resultado = resultado.filter((c) => c.status === status);
    }

    res.json(resultado);
});

app.get("/api/consultas/:id", (req,res)=> {
    const consulta = consultas.find((c) => c.id === req.params.id);

    if (!consulta) {
        return res.status(404).json({ erro: "Consulta não encontrada"});
    }

    res.json(consulta);

});

app.post("/api/consultas", (req,res) => {
    const {paciente, medico, especialidade, data, horario, telefone, observacoes} = req.body;

    if (!paciente || !medico || !data || !horario) {
        return res.status(400).json ({ erro: "Campos obrigatórios faltando"});
    }

    const conflito = consultas.find(
        (c) => c.medico === medico && c.data === data && c.horario === horario && c.status !== "cancelado"
    );

    if (conflito) {
        return res.status(409).json ({ erro: "Horários já ocupado para este médico"});
    }

    const nova = {
        id: uuidv4(),
        paciente,
        medico,
        especialidade,
        data,
        horario,
        status:"pendente",
        telefone: telefone || "",
        observacoes: observacoes || "",
    };

    consultas.push(nova);

    res.status(201).json(nova);
});

app.put("/api/consultas/i:id", (req, res)=> {
    const index = consultas.findIndex((c) => c.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ erro: "Consultas não encontrada"});
    }

    consultas[index] = {...consultas[index], ...req.body, id: req.params.id};
    res.json(consultas[index]);
});

app.patch("/api/consultas/:id/status", (req, res)=> {
    const {status} = req.body;
    const index = consultas.findIndex((c) => c.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ erro: "Consulta não encontrada"});
    }

    consultas[index].status = status;
    res.json(consultas[index]);
});

app.delete("/api/consultas/:id", (req, res) => {
    const index = consultas.findIndex((c) => c.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ erro: "Consulta não encontrada"})
    }

    consultas.splice(index, 1);
    res.json({ mensagem: "Consulta removida"});
});

app.get("/api/horarios-disponíveis", (req, res)=> {
    const {medico, data } = req.query;

    if (!medico || !data) {
        return res.status(400).json ({ erro: "Informe médico e data"});
    }

    const ocupados = consultas
        .filter((c) => c.medico === medico && c.data === data && c.status !== "cancelado")
        .map((c) => c.horario)

        const disponiveis = horarios.filter((h) => !ocupados.includes(h));
        res.json(disponiveis);
});

app.get("/api/dashboard", (req,res) => {
    const hoje = new Date().toISOString().split("T")[0];

    res.json({
        total: consultas.length,
        confirmadas: consultas.filter((c)=> c.status === "confirmado").length,
        pendentes: consultas.filter((c)=> c.status === "pendente").length,
        canceladas: consultas.filter((c)=> c.status === "cancelado").length,
        hoje: consultas.filter((c)=> c.status === hoje).length,
    });
});

app.listen(PORT, ()=>{
    console.log(`Servidor rodando em http://localhost: ${PORT}`);
});

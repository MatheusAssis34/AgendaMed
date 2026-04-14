const BASE_URL = "http://localhost:3001/api";

async function requisicao(endpoint, opcoes = {}) {
    const resposta = await fetch(`${BASE_URL}${endpoint}`, {
        headers: { "Content-Type": "application/json"},
        ...opcoes,
    });

    if(!resposta.ok) {
        const erro = await resposta.json().catch(() => ({ erro: "Erro na requisição"}))
        throw new Error(erro.erro || `Erro ${resposta.status}`);
    }

    return resposta.json();
}

export const api = {
    listarConsultas: (filtros = {}) => {
        const params = new URLSearchParams(filtros).toString();
        return requisicao(`/consultas${params ? `?${params}` : ""}`);
    },

criarConsulta: (dados) =>
    requisicao("/consultas", {
        method: "POST",
        body: JSON.stringify(dados),
    }),

    atualizarConsulta:(id, dados) => 
        requisicao(`/consultas/${id}`, { method: "PUT", body: JSON.stringify(dados) }),

    atualizarStatus: (id, status) => 
        requisicao(`/consultas/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        }),

        deletarConsultas: (id) =>
            requisicao(`/consultas/${id}/status`, { method: "DELETE" }),

        listarMedicos : () => requisicao("/medicos"),

        horariosDisponiveis: (medico, data) =>
            requisicao(`/horarios-disponiveis?medico=${encodeURIComponent(medico)}&data=&{data}`),

        dashboard: () => requisicao("/dashboard"),
};
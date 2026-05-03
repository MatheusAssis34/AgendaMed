Sistema de agendamento de consultas médicas com React no frontend e Node.js no backend.

Sobre o projeto
O MedAgenda permite gerenciar consultas médicas de forma simples: agendar, confirmar, cancelar e acompanhar o histórico de atendimentos. O sistema verifica conflitos de horário automaticamente e exibe um dashboard com estatísticas em tempo real.

Funcionalidades
Listar consultas com filtro por status (pendente, confirmado, cancelado)
Busca em tempo real por paciente ou médico
Agendar e editar consultas via modal
Verificação automática de conflito de horários
Confirmar ou cancelar consultas com um clique
Dashboard com estatísticas gerais
Página de médicos com cards por especialidade
Paginação na listagem
Tecnologias
Frontend

React 18
CSS puro com variáveis customizadas (sem framework)
Fetch API para comunicação com o backend Backend
Node.js
Express
UUID para geração de IDs únicos
CORS para comunicação cross-origin
Estrutura do projeto
agendamento/
├── backend/
│   ├── server.js        # Servidor Express com todas as rotas
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── styles/
    │   │   ├── global.css       # Variáveis CSS e reset
    │   │   ├── layout.css       # Sidebar, dashboard, grid
    │   │   └── components.css   # Botões, tabela, form, modal
    │   ├── services/
    │   │   └── api.js           # Camada de comunicação HTTP
    │   ├── components/
    │   │   └── FormularioConsulta.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Consultas.jsx
    │   │   └── Medicos.jsx
    │   ├── App.jsx
    │   └── index.js
    └── package.json
Como rodar localmente
Pré-requisitos
Node.js v18 ou superior
npm (já vem com o Node)
1. Clone o repositório
git clone https://github.com/seu-usuario/medagenda.git
cd medagenda
2. Inicie o backend
cd backend
npm install
npm start
O servidor vai rodar em http://localhost:3001

3. Inicie o frontend
Abra um novo terminal:

cd frontend
npm install
npm start
A aplicação vai abrir em http://localhost:3000

Endpoints da API
Método	Endpoint	Descrição
GET	/api/consultas	Lista todas as consultas
GET	/api/consultas?status=pendente	Filtra por status
GET	/api/consultas/:id	Busca consulta por ID
POST	/api/consultas	Cria nova consulta
PUT	/api/consultas/:id	Atualiza consulta
PATCH	/api/consultas/:id/status	Atualiza apenas o status
DELETE	/api/consultas/:id	Remove consulta
GET	/api/medicos	Lista médicos disponíveis
GET	/api/horarios-disponiveis	Horários livres por médico e data
GET	/api/dashboard	Estatísticas gerais
Exemplo de requisição
# Criar uma nova consulta
curl -X POST http://localhost:3001/api/consultas \
  -H "Content-Type: application/json" \
  -d '{
    "paciente": "Maria Silva",
    "medico": "Dr. Carlos Mendes",
    "especialidade": "Cardiologia",
    "data": "2025-05-10",
    "horario": "09:00",
    "telefone": "(86) 99999-0001"
  }'
Observações
Os dados são armazenados em memória (array JavaScript). Reiniciar o servidor apaga as consultas cadastradas. Para um ambiente de produção, substitua pelo banco de dados de sua preferência (PostgreSQL, MongoDB, etc.).

Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

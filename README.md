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


Tecnologias:
Frontend
React 18
CSS puro com variáveis customizadas (sem framework)
Fetch API para comunicação com o backend Backend
Node.js
Express
UUID para geração de IDs únicos
CORS para comunicação cross-origin

Como rodar localmente:
Pré-requisitos -
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
GET	/api/consultas -Lista todas as consultas,
GET	/api/consultas?status=pendente-Filtra por status,
GET	/api/consultas/:id-Busca consulta por ID,
POST	/api/consultas-Cria nova consulta,
PUT	/api/consultas/:id-Atualiza consulta,
PATCH	/api/consultas/:id/status-Atualiza apenas o status,
DELETE	/api/consultas/:id-Remove consulta,
GET	/api/medicos-Lista médicos disponíveis,
GET	/api/horarios-disponiveis-Horários livres por médico e data,
GET	/api/dashboard-Estatísticas gerais
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


<img width="1899" height="904" alt="Captura de tela 2026-05-03 200548" src="https://github.com/user-attachments/assets/264596a8-8abc-4d00-bb87-496e6e74fe50" />

<img width="1904" height="909" alt="Captura de tela 2026-05-03 200558" src="https://github.com/user-attachments/assets/571a07e7-bc6f-4888-94eb-0a17efe18622" />



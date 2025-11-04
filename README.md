# 📚 Repositório Digital IFPR - Campus Assis Chateaubriand

Sistema web para gerenciamento e disponibilização de Projetos Finais de Curso (PFC) desenvolvidos pelos estudantes do IFPR Campus Assis Chateaubriand.

---

## 🎯 Sobre o Projeto

O Repositório Digital é uma plataforma desenvolvida para armazenar, preservar e disponibilizar os trabalhos finais de curso desenvolvidos pelos estudantes da instituição. O sistema permite que coordenadores gerenciem artigos, autores e cursos, enquanto visitantes podem navegar e acessar o conteúdo de forma organizada.

---

## 🛠️ Tecnologias Utilizadas

### **Backend**
- **Node.js** - Runtime JavaScript no servidor
- **Express.js** - Framework web para criação da API REST
- **MongoDB** - Banco de dados NoSQL para armazenamento
- **Mongoose** - ODM (Object Document Mapper) para MongoDB
- **JWT** - Autenticação e autorização
- **bcryptjs** - Criptografia de senhas

### **Frontend**
- **React** - Biblioteca JavaScript para construção de interfaces
- **React Router DOM** - Roteamento de páginas
- **Axios** - Cliente HTTP para comunicação com a API
- **React Icons** - Biblioteca de ícones

---

## ⚙️ Funcionalidades Principais

### **Para Visitantes**
- Navegação por cursos organizados por tipo (Técnico, Subsequente, Superior)
- Busca de artigos por título, palavras-chave ou ano
- Visualização detalhada de cada artigo
- Filtros avançados por curso e ano

### **Para Coordenadores**
- Sistema de autenticação seguro
- CRUD completo de artigos, cursos e autores
- Gerenciamento de usuários
- Área administrativa protegida

---

## 🔧 Funcionalidades Técnicas Importantes

### **Backend**

#### **Sistema de Autenticação**
- Autenticação via JWT com expiração de 24 horas
- Criptografia de senhas com bcrypt
- Validação de credenciais e proteção de rotas

#### **Gerenciamento de Artigos**
- CRUD completo com associação de múltiplos autores
- População automática de relacionamentos (autores, cursos)
- Processamento inteligente de autores para evitar duplicações
- Filtros por curso e ano

#### **Conexão com Banco de Dados**
- Conexão com MongoDB Atlas
- Validação de variáveis de ambiente
- Tratamento robusto de erros

### **Frontend**

#### **Context API**
- Gerenciamento global de autenticação
- Persistência de sessão no localStorage
- Validação automática de expiração de sessão

#### **Formulário de Cadastro**
- Seleção em duas etapas: tipo de curso → curso específico
- Pré-seleção automática do último artigo cadastrado
- Gerenciamento dinâmico de múltiplos autores

---

## 🚀 Como Executar

### **Pré-requisitos**
- Node.js (versão 14 ou superior)
- MongoDB Atlas
- npm ou yarn

### **Backend**

1. Instalar dependências:
```bash
cd backend
npm install
```

2. Configurar variáveis de ambiente no arquivo `config.env`:
```env
MONGODB_URI=sua_string_de_conexao_mongodb
JWT_SECRET=seu_segredo_jwt_seguro
PORT=3001
```

3. Iniciar servidor:
```bash
npm start
```

### **Frontend**

1. Instalar dependências:
```bash
cd frontend
npm install
```

2. Configurar variável de ambiente (opcional):
Crie um arquivo `.env` na pasta `frontend` com:
```env
REACT_APP_API_URL=https://repositorio-digital-ifpr.onrender.com
```

3. Iniciar aplicação:
```bash
npm start
```

---

## 📝 Scripts Úteis

### **Backend**
- `npm start` - Inicia o servidor
- `npm run dev` - Modo desenvolvimento
- `npm run create-user` - Cria usuário administrador
- `npm run test-db` - Testa conexão com banco
- `npm run countUsers` - Conta usuários registrados

---

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Autenticação via JWT
- Rotas protegidas no frontend e backend
- Variáveis sensíveis em arquivos de ambiente
- CORS configurável para produção

---

## 📊 Modelos de Dados

- **Artigo**: Título, ano, palavras-chave, link, referência ao curso e autores
- **Autor**: Nome e tipo (orientador, orientando, coorientador)
- **Curso**: Nome e tipo (Técnico, Subsequente, Superior)
- **Usuário**: Username, senha criptografada e role (admin/user)

---

## 🌐 Deploy

### **Variáveis de Ambiente Necessárias**

**Backend:**
- `MONGODB_URI` - String de conexão do MongoDB
- `JWT_SECRET` - Chave secreta para JWT
- `NODE_ENV` - Ambiente (production)
- `PORT` - Porta do servidor
- `CORS_ORIGIN` - URL do frontend (opcional)

**Frontend:**
- `REACT_APP_API_URL` - URL da API backend

---

## 👥 Desenvolvimento

Sistema desenvolvido para o IFPR Campus Assis Chateaubriand como Projeto Final de Curso.

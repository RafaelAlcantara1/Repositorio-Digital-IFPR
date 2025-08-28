# Migração para MongoDB

Este projeto foi migrado de MySQL/Sequelize para MongoDB/Mongoose.

## Mudanças Realizadas

### 1. Dependências
- Removido: `mysql2`, `sequelize`
- Adicionado: `mongoose`

### 2. Configuração do Banco
- Arquivo `src/config/db.js` atualizado para usar Mongoose
- Conexão configurada para MongoDB Atlas

### 3. Modelos
Todos os modelos foram convertidos de Sequelize para Mongoose:

- `userModel.js` - Modelo de usuário
- `artigoModel.js` - Modelo de artigo com referências aos autores
- `autorModel.js` - Modelo de autor
- `Curso.js` - Modelo de curso
- `projectModel.js` - Modelo de projeto

### 4. Controllers
Todos os controllers foram atualizados para usar Mongoose:

- `artigoController.js` - CRUD de artigos com população de autores
- `autorController.js` - CRUD de autores
- `cursoController.js` - CRUD de cursos
- `userController.js` - CRUD de usuários
- `authController.js` - Autenticação
- `projectController.js` - CRUD de projetos

### 5. Estrutura de Dados

#### Antes (MySQL/Sequelize):
- Tabelas relacionais com chaves estrangeiras
- Tabela de junção `artigo_autor` para relacionamento many-to-many

#### Depois (MongoDB/Mongoose):
- Documentos aninhados e referências
- Array de referências no modelo de artigo para autores
- Referência ao curso no modelo de artigo

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do backend com:
```
MONGODB_URI=mongodb+srv://repositorioUser:mr00bullhave@repositorioifpr.yrpdekc.mongodb.net/repositorio
JWT_SECRET=seu_segredo_jwt_aqui
```

3. Execute o script para criar usuário admin:
```bash
node src/scripts/createUser.js
```

4. Inicie o servidor:
```bash
npm start
```

## Principais Diferenças na API

### Artigos
- Agora incluem autores como array de referências
- População automática de autores e curso ao buscar artigos
- Não é mais necessário usar tabela de junção

### Autores
- Funcionamento similar, mas usando ObjectId do MongoDB
- Referenciados diretamente nos artigos

### Cursos
- Referenciados nos artigos via ObjectId
- População automática ao buscar artigos

## Endpoints Disponíveis

- `GET /api/artigos` - Listar todos os artigos (com autores e curso populados)
- `POST /api/artigos` - Criar artigo
- `GET /api/artigos/:id` - Buscar artigo por ID
- `PUT /api/artigos/:id` - Atualizar artigo
- `DELETE /api/artigos/:id` - Deletar artigo
- `GET /api/artigos/curso/:cursoId` - Buscar artigos por curso
- `GET /api/artigos/ano/:ano` - Buscar artigos por ano

- `GET /api/autores` - Listar todos os autores
- `POST /api/autores` - Criar autor
- `GET /api/autores/:id` - Buscar autor por ID
- `PUT /api/autores/:id` - Atualizar autor
- `DELETE /api/autores/:id` - Deletar autor

- `GET /api/cursos` - Listar todos os cursos
- `POST /api/cursos` - Criar curso
- `DELETE /api/cursos/:id` - Deletar curso

- `POST /api/auth/login` - Login de usuário
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

## Testes

- `GET /api/health` - Verificar saúde da API
- `GET /api/test-db` - Testar conexão com MongoDB

## Observações Importantes

1. **IDs**: Agora são ObjectIds do MongoDB ao invés de inteiros
2. **Relacionamentos**: Usam referências e população ao invés de JOINs
3. **Performance**: MongoDB pode ser mais rápido para consultas complexas
4. **Flexibilidade**: Schema mais flexível para futuras mudanças

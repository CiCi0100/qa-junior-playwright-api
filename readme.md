

# Automação de Testes de API - GoREST (Playwright)

Este projeto contém automações de testes de API usando **Playwright** em TypeScript, cobrindo os endpoints públicos da API [GoREST](https://gorest.co.in/). Ele realiza testes completos de **CRUD** para Usuários, Posts e Comentários, validando **status code**, **estrutura dos dados** e garantindo que os registros criados existam no GET subsequente.

---
```markdown
## Estrutura do Projeto

qa-junior-playwright-api/
├── tests/
│   ├── users.spec.ts        # Testes CRUD completos de Usuário
│   ├── posts.spec.ts        # Testes CRUD completos de Post
│   └── comments.spec.ts     # Testes CRUD completos de Comentário (com criação de usuário e post)
├── package.json
├── playwright.config.ts
└── README.md
````

### Descrição dos Arquivos

- `users.spec.ts` → Cria um usuário, valida GET, atualiza dados, deleta usuário e confirma exclusão.
- `posts.spec.ts` → Cria um post associado a um usuário, valida GET, atualiza post, deleta post e confirma exclusão.
- `comments.spec.ts` → Cria um usuário → cria um post → cria um comentário, valida GET, atualiza comentário, deleta comentário, post e usuário, confirmando exclusão de todos.

---

## O que está sendo testado

Para cada endpoint, os testes seguem o fluxo **CRUD completo**:

1. **CREATE** → Criação do recurso com dados válidos e únicos.  
2. **READ (GET)** → Confirma que o recurso existe após a criação.  
3. **UPDATE (PUT)** → Atualização de todos os campos relevantes e validação das alterações.  
4. **DELETE** → Exclusão do recurso e validação de que não existe mais (`GET` retorna 404).  

Além disso, os testes validam:

- **Status code** correto em todas as operações.  
- **Estrutura dos dados** retornados (`id`, `name`, `email`, `title`, `body`, `post_id`, `user_id`, `status`, etc.).  
- **Integridade de dependências** (ex: comentário só é criado se existir post e usuário).  

---

## Pré-requisitos

- Node.js v18+ instalado  
- NPM ou Yarn  
- Token de acesso GoREST válido (https://gorest.co.in/)  
- Playwright instalado  

---

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/qa-junior-playwright-api.git
cd qa-junior-playwright-api
````

2. Instale dependências:

```bash
npm install
```

3. Instale navegadores do Playwright (necessário apenas se for rodar testes de UI ou se Playwright pedir):

```bash
npx playwright install
```

4. Substitua `COLOQUE_SEU_TOKEN_AQUI` nos arquivos de teste pelo seu token GoREST.

---

## Como rodar os testes

Para executar todos os testes:

```bash
npx playwright test
```

Para rodar um teste específico, por exemplo `comments.spec.ts`:

```bash
npx playwright test tests/comments.spec.ts
```

Para gerar relatório HTML após execução:

```bash
npx playwright show-report
```

---

## Observações

* Todos os dados criados durante os testes são deletados ao final de cada fluxo para manter o ambiente limpo.
* Emails e títulos são gerados com `Date.now()` para garantir unicidade.
* Para testes de comentário, é necessário criar **primeiro um usuário e um post**, pois o comentário depende desses recursos.

---

## Tecnologias utilizadas

* [Playwright](https://playwright.dev/) – framework de automação de testes
* TypeScript – linguagem principal
* Node.js – runtime


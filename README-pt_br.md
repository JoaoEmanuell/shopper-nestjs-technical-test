- [Shopper Node Technical Test](#shopper-node-technical-test)
  - [Começando](#começando)
    - [Dependências](#dependências)
    - [Docker](#docker)
    - [Node](#node)
  - [Testes](#testes)
- [Documentação](#documentação)


# Shopper Node Technical Test

Teste técnico para a vaga de Desenvolvedor Web Full-Stack Júnior.

## Começando

Crie um arquivo `.env` na raiz do repositório

Preencha o arquivo com uma [chave de api do Gemini](https://ai.google.dev/gemini-api/docs/api-key).

```
GEMINI_API_KEY= api key for gemini
```

### Dependências

```
node >= 20.17.0
docker => 24.0.7
Docker Compose => 2.24.6
```

### Docker

Faça a build do projeto por meio do `docker compose`

```
docker compose build
```

Suba o projeto (Você também pode executar apenas essa etapa e o projeto já estará no ar)

```
docker compose up
```

Ele estará disponível na porta **8080**

### Node

Acesse o diretório `shopper-node-technical-test`

```
cd shopper-node-technical-test
```

Faça a instalação das dependências.

```
npm install -y
```

Execute o setup

```
node setup.mjs
```

Execute as migrations

```
npm run migration:run
```

Faça a build

```
npm run build
```

Execute o projeto

```
npm run start:prod
```

## Testes

Acesse o diretório `shopper-node-technical-test`

Execute os testes

```
npm run test
```

# Documentação

Para acessar a documentação, execute o container e acesse a rota `docs` ou veja a especificação da [openapi](./docs/openapi.yaml)
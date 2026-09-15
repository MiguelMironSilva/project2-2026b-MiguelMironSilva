# project2-2026b-MiguelMironSilva

## Introdução
Projeto de implementação de site interativo, com foco na implementação do backend, sobre pesquisa e avaliação de filmes, como parte da disciplina de Desenvolvimento de Software para Web (ELC1090), ministrada pela dra. Andrea Schwertner Charão (andrea@inf.ufsm.br), na Universidade Federal de Santa Maria (UFSM).

## Detalhes do projeto
Modalidade (A | B): A
Parceria: GABRIEL DA SILVA FRANÇA, RAFAEL PENTEADO KLAUE

### Proposta do trabalho
Cada usuário poderá criar sua própria conta, fazer login e ter acesso somente aos filmes favoritos e assistidos. O sistema deverá manter as informações de cada conta, incluindo seus filmes favoritados e assistidos. Ao fazer login novamente, o usuário deverá encontrar seus filmes exatamente como os encontrou.

### Funcionalidades
Browsing de filmes - capa, título, sinopse, gênero, ano, elenco, episódios, nota externa;
Poder salvar e favoritar filmes.
Todos os dados de filmes salvos e favoritados são persistentes.
Dados obtidos de uma API pública externa;
Backend próprio;
Persistência: base de dados NoSQL;
Dar notas aos títulos;

### Tecnologias usadas
Backend
- Linguagem: Python
- Framework: FastAPI 
- Banco de dados: SQLite + SQLAlchemy 
- Hospedagem: Render

Frontend
- HTML5 + CSS3 + JavaScript/TypeScript 
- Frameworks: React.js + Vite 
- Hospedagem: Netlify

## Processo de desenvolvimento

### Dia 10/09/2026: 
Estudo do projeto de estudo do aluno Gabriel Maroneze (https://github.com/elc1090/project1-2026b-gabriel-maroneze) feito para o Trabalho 1 da mesma disciplina. Usando a API TMDB (The Movie Database) para buscar os detalhes de filmes, ela faz um deploy completo de várias funcionalidades à serem implementadas no projeto em um webapp HTML/JavaScript/CSS (https://elc1090.github.io/project1-2026b-gabriel-maroneze/), sendo derivada de outro webapp para busca de filmes (https://github.com/mmj030703/Movie-Search-App/), com implementação funcional também  (https://movie-search-app-weld.vercel.app/).

Principal inspiração: Usar a API TMDB para fazer o fetching dos filmes. Foi feita uma conta no TMDB e requisicionada uma chave de API para uso próprio.

### Dia 14/09/2026:
Adicionada a espinha dorsal do backend. Foi criado uma versão minimamente viável de uma aplicação em FastAPI, que foi primeiro rodada localmente dentro de um ambiente virtual, usando o servidor web ASGI Uvicorn para testes locais. Após isso, foi feito um deploy de um web service no serviço de hosting Render com uma chave de API da TMDB, que por sua vez também foi testado (https://project2-2026b-miguelmironsilva.onrender.com/), e feitas as configurações básicas para se fazer o diálogo com um frontend futuro através da Fast API, com a adição de configurações, serviço de TMDB e roteador de filmes, e sua testagem.

## Code pieces

### Versão mínima da interface do FastAPI: ###

````
from fastapi import FastAPI

app = FastAPI(
    title="Webapp Filmes API",
    version="0.1.0",
)


@app.get("/")
def root():
    return {
        "message": "API Webapp Filmes está rodando"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }
````

## Fontes

Webapp para busca de filmes - projeto original
- https://github.com/mmj030703/Movie-Search-App/
- https://movie-search-app-weld.vercel.app/

Webapp para busca de filmes, com funcionalidades adicionais
- https://github.com/elc1090/project1-2026b-gabriel-maroneze
- https://elc1090.github.io/project1-2026b-gabriel-maroneze/

## E-mail para contato
 - misilva@inf.ufsm.br
 - miguelmironsilva@gmail.com



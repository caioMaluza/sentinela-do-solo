# Sentinela do Solo
Aplicação acadêmica FIAP Global Solution 2026.2 — Front-end Design e Web Development. Baseada no PDF Sentinela do Solo fornecido pelo usuário.

## Executar
Requisitos: Node.js 22+ e npm. Execute `npm install`, `npm run dev` e abra o endereço informado. A API local usa arquivos em `.local-data/`, ignorados pelo Git. `npm test` executa os testes; `npm run build` produz o frontend Vite e um Worker com os assets incorporados.

## Tecnologias e estrutura
React 19, Vite 6, Tailwind CSS 4, Leaflet e Lucide. Mais de 8 componentes em `src/components`, páginas operacionais em `src/pages`, acesso HTTP em `src/services`, regras puras em `src/lib`. Custom hooks: useReports, useWeather, useLocation e useStoredState. useState e useEffect usados para estado e efeitos.

## Funcionalidades
Três perfis demonstrativos; seleção de microzona; clima real Open-Meteo; mapa OpenStreetMap; GPS com alternativa por região; formulário com foto/câmera; CRUD de relatos; busca; triagem; checklist persistente; evacuação em duas confirmações; retorno bloqueado até estabilidade e vistoria; operação da empresa independente da evacuação pública.

## API REST
Frontend consome GET/POST `/api/relatos`, PUT/DELETE `/api/relatos/:id`. No deploy, API server-side com persistência R2 por registro. No desenvolvimento, o mesmo handler usa um adaptador de arquivos. Não há falso sucesso nem substituição por localStorage nos relatos. Falhas são exibidas ao usuário.
A API de relatos é própria e hospedada junto da aplicação, separada do React. Para avaliação que exija um provedor externo independente (MockAPI, por exemplo), ainda é necessário provisionar esse provedor e definir `VITE_API_URL` para uma API compatível com os mesmos caminhos e contrato. Não foi criada conta externa em nome do grupo. Open-Meteo é a API externa de leitura. O requisito de CRUD em provedor externo independente NÃO está concluído nessa interpretação.
Campos: id, type, description, address, clusterId, photo (data URL até 1,5 MB na interface), status, createdAt, updatedAt. GET retorna uma lista. POST retorna 201, PUT 200 e DELETE 204. Validações de campos são repetidas no servidor. Até 1.000 relatos por consulta nesta demonstração.

## Limites e dados
Sensores, microzonas, famílias, decisões e ponto de encontro são demonstrativos. Não existe hardware conectado, validação geotécnica, abrigo oficial, autenticação por função nem sistema de alertas reais. O site permanece privado por padrão. Os perfis são seletores de demonstração: qualquer visitante autorizado pode atuar nos relatos compartilhados. Checklist e decisões simuladas são locais ao navegador; relatos persistem no servidor. Não inserir dados pessoais. Antes de uso real, implementar autenticação/autorização por registro, proteção de dados, limites de uso, auditoria e validação de autoridades competentes. A rota de Google Maps usa um ponto fictício, claramente identificado; não usar em emergência.

## Entrega
- Preencher nomes e RMs da equipe; informações não fornecidas.
- Criar repositório privado no GitHub e conceder acesso de escrita aos professores (não realizado: conta GitHub não conectada).
- Preservar histórico real de commits. O ZIP inclui `historico.bundle`: em diretório vazio, execute `git clone historico.bundle sentinela` para recuperar o histórico; depois configure seu remoto GitHub.
- Entregar link GitHub, ZIP, README, AI.md e link do deploy separadamente nas duas disciplinas.
- Confirmar acesso dos professores ao deploy privado antes da entrega.

## Verificação
Testes automatizados cobrem CRUD, validação, limiares de risco, bloqueio de retorno e distância geográfica. Teste de navegador confirmou cadastro de relato e consulta na interface. Build de produção verificado. Tiles do mapa dependem de acesso ao OpenStreetMap; falhas de rede não indicam ausência de risco.

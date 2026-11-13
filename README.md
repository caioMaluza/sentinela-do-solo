# Sentinela do Solo

Protótipo acadêmico de monitoramento de riscos geológicos para a
Global Solution 2026.2 — FIAP.

A página pública apresenta o projeto. Os painéis separam cidadão,
Defesa Civil e a empresa ferroviária fictícia Via Serra.

## Integrantes

- Anderson Marcolino — RM 574066
- Caio Cesar — RM 572906
- Felipe Luan — RM 569565
- Pedro Alves — RM 569192
- Rafaella Pazzanese — RM 572296

## Executar

Requisitos: Node.js 20.19+ ou 22.12+ e npm.

```bash
npm install
npm run dev
```

Abra o endereço informado pelo Vite, normalmente http://localhost:5173.

O plugin existente em scripts/local-api.js atende /api/relatos
no desenvolvimento e grava em .local-data.
Não é necessário iniciar outro servidor.

```bash
npm test
npm run build
```

O build gera o frontend em dist/.
As Functions existentes em api/ atendem os relatos na Vercel.

## Logins demonstrativos

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Cidadão | cidadao@sentinela.demo | Sentinela@2026 |
| Defesa Civil | defesa@sentinela.demo | Sentinela@2026 |
| Empresa Via Serra | empresa@sentinela.demo | Sentinela@2026 |

Os cartões de perfil preenchem os dados.
Clique em entrar para acessar.

Use sair no menu lateral para trocar de perfil.
A conta permanece na aba durante recarregamentos e é removida ao sair.

São acessos de apresentação implementados no frontend,
sem autenticação ou autorização reais.
Um produto real precisa autenticar e filtrar dados no servidor.

## Perfis

### Cidadão

- Consulta de região e clima atual quando disponível.
- Relatos comunitários.
- Checklist familiar.
- Simulação de alerta vermelho com abrigos fictícios.

### Defesa Civil

- Seis áreas e 69 estacas ilustrativas.
- Mapa integrado, gráficos, alertas e tabela de áreas.
- Simulação de evacuação e retorno após vistoria.
- Triagem dos relatos com chave administrativa do servidor.

### Empresa

- Somente os trechos da Via Serra:
  Jaraguá, Perus e Franco da Rocha.
- 32 estacas demonstrativas.
- Consulta de riscos nos próprios ativos.
- Simulação de paralisação e retomada da circulação.

Checklist familiar e abrigos pertencem ao cidadão.
A empresa não emite evacuações públicas nem acessa a triagem.

## Demonstrar o alerta

1. Entre como cidadão e selecione Brasilândia.
2. Clique em "Simular alerta vermelho".
3. O aviso fica vermelho e aparecem três abrigos fictícios.
4. Selecione um abrigo para destacá-lo no mapa.
5. Clique em "Encerrar meu teste" para restaurar o cenário anterior.

As distâncias são em linha reta desde o centro da região.
Vagas e acessibilidade são simuladas.

M’Boi Mirim já começa crítico.
Se a região continua crítica ou tem uma evacuação da Defesa Civil
ativa, os abrigos permanecem após encerrar o teste pessoal.

Para integrar perfis:

1. Entre como Defesa Civil.
2. Selecione uma área.
3. Confirme as duas etapas do alerta vermelho.
4. Saia e entre como cidadão no mesmo navegador.
5. Selecione a mesma área.

O retorno exige evacuação anterior, leitura zero simulada
e vistoria técnica marcada.

## Persistência

Checklist, decisões civis e paralisações empresariais
ficam no localStorage.

O teste pessoal do cidadão dura enquanto seu painel estiver aberto.

Não há sincronização entre dispositivos nem envio de avisos reais.

Para reiniciar o cenário, execute no console do navegador:

```js
localStorage.removeItem('sentinela-checklist');
localStorage.removeItem('sentinela-decisions');
localStorage.removeItem('sentinela-company-stops-via-serra');
location.reload();
```

## Relatos e Vercel

A API aceita as regiões de src/data/clusters.js.

Editar ou excluir relatos continua exigindo a chave administrativa
do servidor. O login da Defesa Civil não substitui essa validação.

Localmente, o plugin usa ADMIN_API_KEY do processo ou a chave
demonstrativa demo-local-2026.

Informe a chave em "Triagem de relatos".
A API valida o valor na primeira alteração.

Na Vercel:

- Mantenha as Functions em api/.
- Conecte um Vercel Blob privado.
- Configure ADMIN_API_KEY no servidor com valor próprio de
  pelo menos 12 caracteres.
- O token de Blob vem da integração da plataforma.
- Nunca coloque segredos em variáveis VITE_*.
- Faça novo deploy após alterar código ou variáveis.

VITE_API_URL é opcional para uma API em outro endereço.
O padrão é /api.
Uma API externa precisa permitir CORS.

Use somente relatos fictícios e fotos que não identifiquem pessoas.

## Tecnologias

React 19, Vite 6, Leaflet, React Leaflet, Lucide React,
CSS e Tailwind 4.

Esta atualização não exige novas dependências da aplicação.

## Organização

- src/App.jsx: sessão e separação dos perfis.
- src/pages/Landing.jsx: apresentação pública.
- src/pages/Login.jsx: acesso demonstrativo.
- src/pages/PublicPages.css: estilos das páginas públicas.
- src/pages/Operations.jsx: dashboards operacionais.
- src/components/UI.jsx: navegação e componentes compartilhados.
- src/components/StatusBanner.jsx: avisos do cidadão.
- src/components/RegionMap.jsx: mapa e lista de abrigos.
- src/data/clusters.js: regiões e vínculo empresarial.
- src/data/shelters.js: abrigos fictícios e distâncias.
- src/lib/demoAuth.js: contas demonstrativas.
- src/styles.css: padrão visual dos painéis.
- worker/api.js: API compartilhada pelo Vite e Vercel.

Os demais arquivos do projeto continuam necessários.

## Limitações

Zonas, estacas, gráficos, famílias, abrigos e decisões são ilustrativos.

Os círculos do mapa não são limites geotécnicos.
A Via Serra é fictícia.

Os abrigos não representam locais existentes ou avaliados como seguros.
As distâncias não são rotas.

Nenhuma simulação substitui alertas oficiais.

O mapa base depende do OpenStreetMap.
O clima do cidadão consulta Open-Meteo.
Os gráficos operacionais são sempre fictícios.

Sem conexão, o mapa base ou o clima podem ficar indisponíveis.

Repositório de referência:
https://github.com/caioMaluza/sentinela-do-solo
# Sentinela do Solo

Protótipo acadêmico de monitoramento de riscos geológicos desenvolvido para a **Global Solution 2026.2 — FIAP**.

O projeto conecta informações sobre o solo, leituras simuladas de estacas e participação comunitária em uma plataforma com três perfis: **cidadão, Defesa Civil e empresa**.

O recorte geográfico concentra-se em bairros e distritos das zonas Norte e Noroeste da **cidade de São Paulo**.

> Este projeto é uma demonstração acadêmica. As leituras, coberturas das estacas, classificações de risco e ações operacionais são simuladas e não substituem avaliações técnicas ou alertas oficiais.

Link do site: https://sentinela-do-solo-one.vercel.app

## Integrantes

- Anderson Marcolino — RM 574066
- Caio Cesar — RM 572906
- Felipe Luan — RM 569565
- Pedro Alves — RM 569192
- Rafaella Pazzanese — RM 572296

## Sobre o projeto

O Sentinela do Solo propõe reunir informações geográficas, condições meteorológicas, relatos comunitários e indicadores de movimentação do solo para facilitar a compreensão de cenários de risco.

A página pública apresenta a proposta e direciona o visitante ao login demonstrativo. Após o acesso, cada perfil encontra informações e funcionalidades relacionadas à sua responsabilidade.

O mapa permite explorar faixas ilustrativas de solo que atravessam referências de bairros, visualizar as estacas associadas e consultar uma camada oficial da Carta Geotécnica do GeoSampa.

## Recorte geográfico

A demonstração utiliza seis referências de bairros e distritos da cidade de São Paulo:

| Bairro ou distrito | Região |
| --- | --- |
| Brasilândia | Zona Norte |
| Jaraguá | Zona Noroeste |
| Vila Nova Cachoeirinha | Zona Norte |
| Perus | Zona Noroeste |
| Pirituba | Zona Noroeste |
| Freguesia do Ó | Zona Norte |

Os centros geográficos são aproximados. Os pontos e polígonos ilustrativos não representam limites administrativos oficiais.

O cenário contém **69 estacas ilustrativas**, distribuídas entre os seis bairros. Cada bairro possui uma estaca de referência identificada no mapa.

A empresa ferroviária fictícia **Via Serra** acompanha somente seus três trechos:

- Jaraguá;
- Perus;
- Pirituba.

Esses trechos reúnem **32 estacas demonstrativas**.

## Funcionalidades por perfil

### Cidadão

- Seleção de bairro.
- Consulta ao mapa de solos e às estacas de referência.
- Consulta meteorológica atual, quando disponível.
- Registro e consulta de relatos comunitários.
- Checklist de preparação familiar.
- Simulação de alerta vermelho.
- Visualização de abrigos fictícios no mapa e em uma lista.
- Destaque do abrigo selecionado.

As distâncias dos abrigos são calculadas em linha reta a partir do centro de referência do bairro. Não representam rotas de deslocamento.

### Defesa Civil

- Dashboard com todos os bairros do recorte.
- Visão integrada das 69 estacas ilustrativas.
- Mapa territorial com seleção de áreas.
- Gráficos e indicadores demonstrativos.
- Tabela das áreas monitoradas.
- Consulta aos alertas do cenário.
- Simulação de evacuação em duas etapas de confirmação.
- Liberação de retorno condicionada à leitura estabilizada e à vistoria simulada.
- Triagem de relatos mediante chave administrativa do servidor.

O checklist familiar e a lista de abrigos ficam no perfil cidadão.

### Empresa

- Dashboard exclusivo da Via Serra.
- Visualização apenas dos trechos e estacas vinculados à empresa.
- Consulta de riscos nos próprios ativos.
- Identificação dos trechos por quilometragem ilustrativa.
- Simulação de paralisação e retomada da circulação.

A empresa não acessa a triagem de relatos nem executa comandos de evacuação pública.

## Mapa de solos

O mapa começa enquadrado no recorte Norte/Noroeste de São Paulo. Os limites de navegação e de zoom mantêm o foco na cidade e em seus bairros.

Existem três camadas disponíveis.

### Tipos de solo

Exibe polígonos irregulares e contíguos com três categorias simplificadas:

| Categoria | Representação |
| --- | --- |
| Solo argiloso | Terracota |
| Solo arenoso | Amarelo |
| Solo siltoso | Verde |

Esses polígonos foram desenhados para o protótipo. Não são provenientes de sondagens, levantamento pedológico ou classificação oficial do solo.

As cores identificam os tipos de solo do exercício e não indicam, por si só, um nível de risco.

### Risco simulado

Aplica aos polígonos a maior classificação simulada entre as estacas vinculadas a cada zona.

A camada ajuda a explorar o comportamento da interface, mas não representa uma previsão de risco para todos os pontos da área.

### Carta GeoSampa

Exibe a camada oficial da **Carta Geotécnica 2024**, disponibilizada pela Prefeitura de São Paulo por meio do GeoSampa.

Essa carta apresenta unidades geotécnicas e informações relacionadas a rochas, relevo e aptidão geotécnica. Ela não equivale diretamente às categorias simplificadas de argila, areia e silte utilizadas no exercício.

A camada oficial fica separada dos polígonos ilustrativos e possui acesso à sua própria legenda.

**Serviço WMS:**

https://wms.geosampa.prefeitura.sp.gov.br/geoserver/geoportal/wms

**Configuração utilizada:**

- Camada: `carta_geotecnica`
- Versão: WMS 1.1.1
- Sistema de referência utilizado na integração: EPSG:3857
- Formato: PNG transparente

**Documentação pública:**

https://geoinfo-smdu.github.io/tutorial-geosampa-internet-2.0/

A disponibilidade dessa camada depende do serviço externo. Caso não carregue, selecione **Tipos de solo** ou **Risco simulado**.

## Cobertura ilustrativa das estacas

Ao selecionar uma zona ou estaca, o mapa destaca a área associada e apresenta os bairros e sensores vinculados.

O contorno tracejado identifica a cobertura ilustrativa selecionada.

Exemplos do cenário:

- Brasilândia e Vila Nova Cachoeirinha compartilham uma faixa argilosa.
- Jaraguá e Pirituba compartilham uma faixa arenosa.

Esses vínculos demonstram como uma zona de solo pode atravessar referências de bairros.

> Compartilhar o mesmo tipo de solo e estar próximo de outra estaca não comprova alcance de monitoramento nem capacidade de previsão. Uma aplicação real exige sondagens, calibração, análise topográfica, modelo geotécnico e avaliação profissional.

Os polígonos e vínculos demonstrativos são definidos localmente em `src/data/soilZones.js`. Eles não dependem da API do GeoSampa.

## Tecnologias

- React 19
- Vite 6
- JavaScript
- HTML e CSS
- Tailwind CSS 4
- Leaflet
- React Leaflet
- Lucide React
- Open-Meteo
- GeoSampa WMS
- Node.js
- Vercel Functions
- Vercel Blob

O mapa utiliza OpenStreetMap como base cartográfica.

## Requisitos

- Node.js 20.19+ ou 22.12+.
- npm.
- Navegador atualizado.
- Conexão com a internet para os mapas externos e a consulta meteorológica.

## Instalação e execução

Na pasta do projeto, instale as dependências:

```bash
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Abra o endereço informado pelo Vite, normalmente:

```text
http://localhost:5173
```

Para encerrar o servidor, pressione `Ctrl + C`.

O plugin existente em `scripts/local-api.js` atende as rotas de relatos durante o desenvolvimento e grava os registros em `.local-data`.

Não é necessário iniciar outro servidor local.

## Logins demonstrativos

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Cidadão | `cidadao@sentinela.demo` | `Sentinela@2026` |
| Defesa Civil | `defesa@sentinela.demo` | `Sentinela@2026` |
| Empresa Via Serra | `empresa@sentinela.demo` | `Sentinela@2026` |

Na tela de login:

1. Selecione um cartão de perfil para preencher os dados.
2. Clique em **Entrar na demonstração**.
3. Para trocar de perfil, utilize **Sair e voltar ao site**.

A conta demonstrativa permanece na aba durante recarregamentos e é removida ao sair.

Esses acessos são implementados no frontend para apresentação acadêmica. Não oferecem autenticação ou autorização reais. Em um produto real, a autenticação e a restrição de acesso aos dados devem ocorrer no servidor.

## Demonstrar o mapa

1. Entre em um dos perfis.
2. Abra o mapa.
3. Selecione **Tipos de solo**.
4. Clique em um polígono para consultar as estacas e os bairros associados.
5. Selecione uma estaca para explorar sua cobertura ilustrativa.
6. Alterne para **Risco simulado** para visualizar a classificação do cenário.
7. Selecione **Carta GeoSampa** para consultar a camada oficial.
8. Utilize **Ver recorte** para reenquadrar o mapa.

O perfil empresarial mantém a visualização dos ativos vinculados à Via Serra.

## Demonstrar o alerta vermelho

### Teste pelo cidadão

1. Entre como cidadão.
2. Selecione Brasilândia.
3. Clique em **Simular alerta vermelho**.
4. Observe o aviso e os três abrigos fictícios.
5. Selecione um abrigo para destacá-lo no mapa.
6. Clique em **Encerrar meu teste** para restaurar o cenário anterior.

Vagas e condições de acessibilidade são simuladas. Os pontos não representam abrigos existentes ou avaliados como seguros.

Vila Nova Cachoeirinha e Pirituba começam com leituras críticas no cenário. Se o bairro continuar crítico ou tiver uma evacuação simulada da Defesa Civil ativa, os abrigos permanecem visíveis após encerrar o teste pessoal.

### Integração entre os perfis

1. Entre como Defesa Civil.
2. Selecione um bairro.
3. Clique em **Simular alerta vermelho**.
4. Confirme as duas etapas do exercício.
5. Saia e entre como cidadão no mesmo navegador.
6. Selecione o mesmo bairro.

A decisão será refletida no cenário do cidadão.

Para liberar o retorno simulado, são necessários:

- Evacuação simulada anterior.
- Leitura estabilizada em zero no exercício.
- Vistoria técnica marcada como concluída.

Nenhuma dessas ações envia alertas públicos ou ordens reais de evacuação.

## Persistência das simulações

As seguintes informações são armazenadas no `localStorage`:

- Checklist pessoal.
- Decisões simuladas da Defesa Civil.
- Paralisações simuladas da Via Serra.

O teste pessoal de alerta do cidadão dura enquanto seu painel estiver aberto.

Não há sincronização dessas simulações entre dispositivos.

Para reiniciar o cenário, execute no console do navegador:

```js
localStorage.removeItem('sentinela-checklist');
localStorage.removeItem('sentinela-decisions');
localStorage.removeItem('sentinela-company-stops-via-serra');
location.reload();
```

## Relatos comunitários e triagem

A API utiliza os bairros cadastrados em `src/data/clusters.js`.

| Método | Endpoint | Operação |
| --- | --- | --- |
| GET | `/api/relatos` | Listar relatos |
| POST | `/api/relatos` | Criar relato |
| PUT | `/api/relatos/:id` | Atualizar relato |
| DELETE | `/api/relatos/:id` | Excluir relato |

Editar ou excluir relatos exige a chave administrativa do servidor. O login demonstrativo da Defesa Civil não substitui essa validação.

No desenvolvimento local, o plugin utiliza `ADMIN_API_KEY` do processo ou a chave demonstrativa:

```text
demo-local-2026
```

Informe a chave em **Triagem de relatos**. O servidor valida seu valor na primeira alteração realizada.

Use somente relatos fictícios e imagens que não identifiquem pessoas.

## Configuração na Vercel

Para disponibilizar os relatos na Vercel:

1. Mantenha as Functions existentes em `api/`.
2. Conecte um armazenamento Vercel Blob privado.
3. Configure `ADMIN_API_KEY` no servidor com um valor próprio de pelo menos 12 caracteres.
4. Utilize o token de Blob fornecido pela integração da plataforma.
5. Faça um novo deploy após alterar código ou variáveis de ambiente.

Nunca coloque chaves administrativas ou tokens em variáveis com prefixo `VITE_`, pois elas podem ser incluídas no frontend.

A variável `VITE_API_URL` é opcional para utilizar uma API em outro endereço. O padrão é:

```text
/api
```

Uma API externa precisa permitir as origens necessárias por meio de CORS.

## Testes

Execute:

```bash
npm test
```

Os testes do projeto verificam regras como classificação de risco, condições de retorno, cálculos de distância e operações da API.

Os testes adicionais do recorte de solos verificam as associações entre bairros, estacas e polígonos ilustrativos.

## Build de produção

Execute:

```bash
npm run build
```

O frontend compilado será gerado em:

```text
dist/
```

As Functions existentes em `api/` atendem os relatos na Vercel. O script de build não exige uma etapa adicional de geração de worker.

## Organização do projeto

```text
sentinela-do-solo/
├── api/
├── public/
├── scripts/
│   └── local-api.js
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   ├── territory.css
│   ├── components/
│   │   ├── Checklist.jsx
│   │   ├── RegionMap.jsx
│   │   ├── Reports.jsx
│   │   ├── StatusBanner.jsx
│   │   └── UI.jsx
│   ├── data/
│   │   ├── clusters.js
│   │   ├── shelters.js
│   │   └── soilZones.js
│   ├── hooks/
│   ├── lib/
│   │   ├── demoAuth.js
│   │   └── risk.js
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Operations.jsx
│   │   └── PublicPages.css
│   └── services/
│       └── api.js
├── tests/
├── worker/
│   └── api.js
├── index.html
├── package.json
└── vite.config.js
```

### Arquivos principais

- `src/App.jsx`: sessão demonstrativa e separação dos perfis.
- `src/pages/Landing.jsx`: apresentação pública do projeto.
- `src/pages/Login.jsx`: acessos demonstrativos.
- `src/pages/Operations.jsx`: dashboards da Defesa Civil e da empresa.
- `src/components/RegionMap.jsx`: mapa, camadas e abrigos.
- `src/data/clusters.js`: bairros, estacas e vínculo empresarial.
- `src/data/soilZones.js`: polígonos e coberturas ilustrativas.
- `src/data/shelters.js`: abrigos fictícios e distâncias.
- `src/lib/demoAuth.js`: contas demonstrativas.
- `worker/api.js`: API compartilhada pelo desenvolvimento local e pelas Functions da Vercel.

## Identidade visual

A interface utiliza verde escuro, creme, terracota e tons de solo, com formas assimétricas e uma ilustração das camadas do terreno.

O tema é aplicado à página pública, ao login e aos três painéis.

O arquivo `src/territory.css` complementa os estilos existentes e deve ser importado por último em `src/main.jsx`:

```js
import './styles.css';
import './territory.css';
```

Mantenha também `src/pages/PublicPages.css`, utilizado pelas páginas públicas.

## Limitações

- Leituras, quantidades de estacas, famílias, gráficos e decisões operacionais são demonstrativos.
- Os polígonos simplificados de solo e as coberturas das estacas são inventados para o exercício.
- Os contornos ilustrativos não são limites geotécnicos ou administrativos oficiais.
- A Carta GeoSampa é uma camada externa e não valida os vínculos simulados das estacas.
- A Via Serra é uma empresa fictícia.
- Os abrigos não representam locais existentes ou avaliados como seguros.
- As distâncias apresentadas não são rotas.
- Os gráficos operacionais são fictícios; o clima do cidadão consulta o Open-Meteo quando disponível.
- O mapa base e a carta oficial dependem da disponibilidade dos serviços externos.
- O login demonstrativo não implementa autenticação real.
- Nenhuma simulação substitui orientações ou alertas oficiais.

## Repositório

https://github.com/caioMaluza/sentinela-do-solo
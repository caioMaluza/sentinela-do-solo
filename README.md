# 🌱 Sentinela do Solo

**Site de referência:** https://sentinela-do-solo-one.vercel.app/

### Plataforma de Monitoramento de Riscos Geológicos e Proteção Comunitária

Projeto desenvolvido como parte da **Global Solution 2026.2 — FIAP**, com foco em tecnologia, prevenção de desastres e segurança da população.

---

## Integrantes

Anderson Marcolino - RM: 574066
Caio Cesar - RM: 572906
Felipe Luan - RM: 569565
Pedro Alves - RM: 569192
Rafaella Pazzanese - RM: 572296

---

## 📌 Sobre o Projeto

O **Sentinela do Solo** é uma aplicação web desenvolvida para auxiliar no monitoramento de áreas suscetíveis a riscos geológicos, especialmente regiões que podem apresentar movimentações do solo e deslizamentos.

A plataforma busca facilitar o acesso a informações sobre riscos ambientais, permitindo que cidadãos, empresas e órgãos de Defesa Civil acompanhem indicadores, consultem regiões monitoradas e participem de ações preventivas.

O sistema reúne informações geográficas, condições meteorológicas, classificações de risco e relatos comunitários em uma interface acessível.

O objetivo é contribuir para a prevenção de desastres, a conscientização da população e o apoio à tomada de decisões.

> **Importante:** O projeto é um protótipo acadêmico. As classificações de risco e decisões operacionais apresentadas na aplicação possuem caráter demonstrativo e não substituem avaliações técnicas ou alertas oficiais da Defesa Civil.

---

## 🎯 Objetivos

- Democratizar o acesso a informações sobre riscos geológicos.
- Facilitar a identificação de áreas potencialmente vulneráveis.
- Incentivar a participação da comunidade na prevenção de desastres.
- Disponibilizar informações meteorológicas e geográficas.
- Simular procedimentos de prevenção e resposta a emergências.
- Apoiar a conscientização sobre segurança ambiental.

---

## ⚙️ Funcionalidades

### 🗺️ Monitoramento Geográfico

- Visualização de regiões monitoradas em mapa interativo.
- Consulta de indicadores de movimentação do solo.
- Identificação de diferentes níveis de risco.
- Informações geográficas das regiões cadastradas.

### 🚨 Classificação de Riscos

O sistema utiliza uma função para classificar leituras de movimentação do solo em três categorias:

| Classificação | Condição |
|---|---|
| 🟢 Estável | Taxa inferior a 40% do limite crítico |
| 🟡 Atenção | Taxa entre 40% e menos de 100% do limite crítico |
| 🔴 Crítico | Taxa igual ou superior ao limite crítico |
| ⚪ Indisponível | Leitura inválida ou não disponível |

O limite crítico padrão utilizado no código é de `0.1`, e a classificação é calculada automaticamente.

Esses limites são parâmetros demonstrativos do projeto, não critérios oficiais para determinar segurança geológica.

### 🌧️ Informações Meteorológicas

Integração com a API Open-Meteo para consultar:

- Temperatura atual.
- Precipitação.
- Condições meteorológicas da região selecionada.

### 📝 Relatos Comunitários

- Cadastro de relatos.
- Consulta dos registros existentes.
- Atualização de informações.
- Exclusão de relatos.
- Comunicação de situações observadas pela comunidade.

### 🛡️ Painel da Defesa Civil

Ambiente demonstrativo para:

- Consultar regiões monitoradas.
- Simular evacuações preventivas.
- Verificar condições de estabilidade.
- Simular autorização de retorno após vistoria.

As ações realizadas nesse painel não emitem alertas públicos reais.

### 🏢 Painel Empresarial

Interface destinada à visualização de informações e ações relacionadas à prevenção de riscos em ambientes empresariais.

### 📋 Orientações Preventivas

Disponibilização de informações e orientações para auxiliar cidadãos na preparação diante de situações de risco.

---

## 💻 Tecnologias Utilizadas

| Tecnologia | Utilização |
|---|---|
| React 19 | Construção da interface |
| JavaScript | Lógica da aplicação |
| Vite 6 | Ambiente de desenvolvimento e build |
| HTML5 | Estrutura da aplicação |
| CSS3 | Estilização |
| Tailwind CSS 4 | Recursos de estilização |
| Leaflet | Mapas interativos |
| React Leaflet | Integração dos mapas com React |
| Lucide React | Ícones |
| Open-Meteo API | Dados meteorológicos |
| Node.js | Execução das ferramentas e testes |
| Git e GitHub | Versionamento do código |

O projeto também contém uma API para gerenciamento de relatos, com suporte a armazenamento por meio de um bucket configurado no ambiente de execução.

---

## 📋 Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- **Node.js:** versão 20 ou superior, preferencialmente uma versão LTS recente.
- **npm:** gerenciador de pacotes distribuído com o Node.js.
- **Git:** para clonar o repositório.
- **Visual Studio Code:** recomendado para edição do código.
- **Navegador atualizado:** Chrome, Edge ou Firefox.
- **Conexão com a internet:** necessária para consultar serviços externos, como a API meteorológica e os mapas.

### Verificar as instalações

Abra o terminal e execute:

```bash
node -v
```

```bash
npm -v
```

```bash
git --version
```

Se os comandos retornarem suas respectivas versões, as ferramentas estão disponíveis.

---

## 🚀 Instalação

### 1. Obter o projeto

Clone o repositório pelo terminal:

```bash
git clone https://github.com/caioMaluza/sentinela-do-solo.git
```

Ou baixe o projeto em formato ZIP pelo GitHub e extraia os arquivos.

### 2. Acessar a pasta

```bash
cd sentinela-do-solo
```

### 3. Instalar as dependências

```bash
npm install
```

Esse comando instalará as bibliotecas necessárias para executar a aplicação.

---

## ▶️ Como Executar

### 1. Iniciar o servidor de desenvolvimento

Dentro da pasta principal do projeto, execute:

```bash
npm run dev
```

### 2. Acessar a aplicação

O terminal exibirá o endereço local disponibilizado pelo Vite.

Normalmente:

```text
http://localhost:5173
```

Abra esse endereço no navegador para visualizar a aplicação.

### 3. Encerrar o servidor

Para interromper a execução, pressione:

```text
Ctrl + C
```

no terminal.

---

## 🔌 Configuração da API

O frontend utiliza o caminho `/api` como endereço padrão para as requisições.

Também é possível configurar um endereço externo por meio da variável de ambiente:

```env
VITE_API_URL=https://seu-servidor.com/api
```

Essa variável pode ser definida em um arquivo `.env` na raiz do projeto.

### Endpoints disponíveis

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/relatos` | Listar relatos |
| POST | `/api/relatos` | Criar relato |
| PUT | `/api/relatos/:id` | Atualizar relato |
| DELETE | `/api/relatos/:id` | Excluir relato |

O backend está implementado em `worker/api.js`.

Para utilizar a persistência de dados, é necessário configurar o ambiente de execução com um bucket de armazenamento acessível pela variável `BUCKET`.

**Atenção:** executar apenas `npm run dev` inicia o frontend Vite, mas não configura automaticamente o backend de relatos. Para utilizar todas as operações da API, é necessário disponibilizar o backend e configurar sua conexão.

---

## 🧪 Testes Automatizados

O projeto possui testes automatizados utilizando o módulo nativo de testes do Node.js.

Para executar:

```bash
npm test
```

Os testes incluem verificações relacionadas a:

- Classificação dos níveis de risco.
- Limites entre os estados de estabilidade, atenção e criticidade.
- Tratamento de leituras inválidas.
- Condições necessárias para o retorno simulado.
- Cálculo de distâncias geográficas.
- Comportamento da API.

---

## 📦 Build de Produção

Para gerar uma versão otimizada da aplicação, execute:

```bash
npm run build
```

O comando realiza o build com Vite e executa o script responsável pela preparação do worker.

Os arquivos gerados ficam na pasta:

```text
dist/
```

O script também prepara um arquivo de servidor em:

```text
dist/server/index.js
```

A publicação em produção exige a configuração de uma plataforma compatível com o worker e com o armazenamento utilizado pela API.

---

## 📁 Estrutura do Projeto

```text
sentinela-do-solo/
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
│
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   │
│   ├── components/
│   │   ├── UI.jsx
│   │   ├── Checklist.jsx
│   │   ├── RegionMap.jsx
│   │   ├── Reports.jsx
│   │   └── StatusBanner.jsx
│   │
│   ├── pages/
│   │   └── Operations.jsx
│   │
│   ├── hooks/
│   │   ├── useLocation.js
│   │   ├── useReports.js
│   │   ├── useStoredState.js
│   │   └── useWeather.js
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── data/
│   │   └── clusters.js
│   │
│   └── lib/
│       └── risk.js
│
├── worker/
│   └── api.js
│
├── scripts/
│   └── build-worker.mjs
│
└── tests/
    ├── api.test.js
    └── risk.test.js
```

### Principais diretórios

- **src/components:** componentes reutilizáveis da interface.
- **src/pages:** páginas e painéis operacionais.
- **src/hooks:** gerenciamento de estados e integrações.
- **src/services:** comunicação com a API.
- **src/data:** informações das regiões monitoradas.
- **src/lib:** regras de negócio e cálculos.
- **worker:** implementação do backend.
- **scripts:** automação do processo de build.
- **tests:** testes automatizados.

---

## 🌍 Impacto Social

O Sentinela do Solo busca contribuir para uma sociedade mais preparada diante de riscos ambientais.

A proposta está relacionada à prevenção de desastres, à proteção da população e ao uso de tecnologias digitais para facilitar o acesso à informação.

O projeto também incentiva a participação comunitária e a utilização de dados como ferramentas de apoio à prevenção.

### Objetivos de Desenvolvimento Sustentável

**ODS 11 — Cidades e Comunidades Sustentáveis**

Contribuir para comunidades mais seguras, resilientes e preparadas para situações de risco.

**ODS 13 — Ação Contra a Mudança Global do Clima**

Incentivar a adaptação, a conscientização e a preparação diante de eventos ambientais extremos.

---

## ⚠️ Limitações do Projeto

O Sentinela do Solo é um protótipo acadêmico e não constitui um sistema oficial de monitoramento geológico.

As leituras e os indicadores demonstrativos não devem ser utilizados isoladamente para determinar a necessidade de evacuação ou a segurança de uma região.

Decisões reais de emergência devem ser tomadas pelas autoridades competentes, com base em avaliações técnicas e informações oficiais.

---

## 👨‍💻 Desenvolvimento

Projeto acadêmico desenvolvido para a **Global Solution 2026.2 da FIAP**, no curso de Engenharia de Software.

**Repositório:** [Sentinela do Solo](https://github.com/caioMaluza/sentinela-do-solo)

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos e educacionais.

A disponibilização pública do código não implica automaticamente autorização para redistribuição ou uso comercial. As condições de uso devem ser definidas em um arquivo de licença específico.

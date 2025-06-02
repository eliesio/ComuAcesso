# ComuAcesso
App React Native cross-platform para otimizar entregas de encomendas na Favela da Kelson's. Conecta moradores e associação com notificações, cadastro simplificado e QR Code. Solução acadêmica com impacto social real em Android e iOS.

# 📱 ComuAcesso

> **Conectando comunidades através da tecnologia**

Um aplicativo mobile cross-platform que revoluciona o sistema de entrega de encomendas em comunidades, desenvolvido especificamente para a Favela da Kelson's.

## 🎯 Sobre o Projeto

O **ComuAcesso** é uma solução tecnológica que resolve problemas reais de logística de entregas em comunidades urbanas. Desenvolvido com **React Native**, o aplicativo funciona tanto em dispositivos **Android quanto iOS**, maximizando o alcance e a inclusão digital.

## ✨ Principais Funcionalidades

- 📦 **Cadastro Simplificado** de moradores e encomendas
- 🔔 **Notificações Inteligentes** para avisos de entrega
- 📱 **QR Code** para confirmação segura de retiradas
- 🌐 **Modo Offline** para áreas com conectividade limitada
- 👥 **Interface Intuitiva** adaptada para diferentes níveis de letramento digital
- 🔄 **Sincronização em Tempo Real** via Firebase

## 🚀 Tecnologias Utilizadas

- **React Native** - Framework cross-platform
- **Expo** - Plataforma de desenvolvimento
- **Firebase** - Backend e autenticação
- **JavaScript/TypeScript** - Linguagem de programação
- **React Navigation** - Navegação entre telas
- **AsyncStorage** - Armazenamento local

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### **Requisitos Essenciais:**
- **[Node.js](https://nodejs.org/)** (versão 16 ou superior - recomendado LTS)
- **npm** (vem com Node.js) ou **[yarn](https://yarnpkg.com/)**
- **[Expo CLI](https://docs.expo.dev/get-started/installation/)**

### **Verificar instalações:**
```bash
node --version
npm --version
Instalar Expo CLI:
npm install -g @expo/cli
Para testar no dispositivo móvel:
Android: Baixe o Expo Go na Google Play Store
iOS: Baixe o Expo Go na Apple App Store
🛠️ Instalação e Execução
1. Clone o repositório
git clone https://github.com/seu-usuario/ComuAcesso.git
cd ComuAcesso
2. Instale as dependências
npm install
3. Inicie o projeto
npx expo start
4. Execute no dispositivo
Após executar npx expo start, você verá um QR Code no terminal:

📱 Android: Abra o app Expo Go e escaneie o QR Code
🍎 iOS: Use a câmera nativa do iPhone para escanear o QR Code
💻 Emulador: Pressione a para Android ou i para iOS no terminal
📱 Como Testar
Opção 1: Dispositivo Físico (Recomendado)
Baixe o Expo Go na sua loja de aplicativos
Execute npx expo start no terminal
Escaneie o QR Code exibido
O aplicativo será carregado automaticamente
Opção 2: Emulador/Simulador
Android: Instale Android Studio e configure um AVD
iOS: Instale Xcode (apenas macOS) e use o iOS Simulator

## 🏗️ Estrutura do Projeto

```
ComuAcesso/
├── app/
│   ├── avisos/                 # Módulo de avisos e notificações
│   │   ├── [id].tsx           # Tela de detalhes do aviso específico
│   │   ├── index.tsx          # Lista de avisos
│   │   └── novo.tsx           # Criar novo aviso
│   │
│   ├── encomendas/            # Módulo de gestão de encomendas
│   │   ├── [id].tsx           # Detalhes da encomenda específica
│   │   ├── index.tsx          # Lista de encomendas
│   │   └── nova.tsx           # Cadastrar nova encomenda
│   │
│   ├── moradores/             # Módulo de gestão de moradores
│   │   ├── _layout.tsx        # Layout das telas de moradores
│   │   ├── estatisticas.tsx   # Estatísticas dos moradores
│   │   └── index.tsx          # Lista/cadastro de moradores
│   │
│   ├── assets/                # Recursos estáticos
│   │   ├── images/            # Imagens e ícones
│   │   └── fonts/             # Fontes customizadas
│   │
│   ├── constants/             # Constantes da aplicação
│   │   └── Colors.ts          # Paleta de cores
│   │
│   ├── src/                   # Código fonte principal
│   │   ├── components/        # Componentes compartilhados
│   │   ├── database/          # Configuração e conexão com banco
│   │   ├── model/             # Modelos de dados e entidades
│   │   ├── types/             # Definições de tipos TypeScript
│   │   └── utils/             # Funções utilitárias
│   │
│   └── styles/                # Estilos da aplicação
│
├── .gitignore                 # Arquivos ignorados pelo Git
├── app.json                   # Configurações do Expo
├── package-lock.json          # Lock de dependências
├── package.json               # Dependências e scripts
└── tsconfig.json              # Configurações do TypeScript
```

## 📂 Fluxo de Organização

### **1. Módulos Funcionais** (`app/`)

#### **📢 Avisos** (`avisos/`)
- **`index.tsx`** - Lista todos os avisos da comunidade
- **`[id].tsx`** - Exibe detalhes de um aviso específico
- **`novo.tsx`** - Formulário para criar novos avisos

#### **📦 Encomendas** (`encomendas/`)
- **`index.tsx`** - Lista todas as encomendas
- **`[id].tsx`** - Detalhes e rastreamento de encomenda
- **`nova.tsx`** - Cadastro de nova encomenda

#### **👥 Moradores** (`moradores/`)
- **`_layout.tsx`** - Layout compartilhado das telas
- **`index.tsx`** - Gestão de moradores cadastrados
- **`estatisticas.tsx`** - Dashboard com métricas

### **2. Código Fonte** (`app/src/`)
- **`components/`** - Componentes reutilizáveis (botões, cards, modais)
- **`database/`** - Configuração Firebase e operações de banco
- **`model/`** - Interfaces e classes de entidades (Morador, Encomenda, Aviso)
- **`types/`** - Definições de tipos TypeScript
- **`utils/`** - Funções auxiliares (validações, formatações, helpers)

### **3. Recursos e Configurações**
- **`assets/`** - Imagens, ícones e fontes
- **`constants/`** - Cores e valores fixos
- **`styles/`** - Estilos globais da aplicação

### **4. Arquivos de Configuração** (raiz)
- **`app.json`** - Configurações do Expo
- **`tsconfig.json`** - Configurações do TypeScript
- **`package.json`** - Dependências e scripts

## 🔧 Comandos Úteis

```bash
# Instalar dependências
npm install

# Iniciar o projeto
npx expo start

# Limpar cache
npx expo start --clear

# Verificar problemas no ambiente
npx expo doctor

# Reinstalar dependências (se necessário)
rm -rf node_modules && npm install

# Verificar tipos TypeScript
npx tsc --noEmit

## 🎨 Design System

O aplicativo segue princípios de **Design Inclusivo**, com:

- Cores de alto contraste para melhor legibilidade
- Fontes grandes e claras
- Ícones intuitivos e universais
- Interface simplificada e objetiva

## 📊 Compatibilidade

| **Plataforma** | **Versão Mínima** | **Status** |
|----------------|-------------------|------------|
| **Android** | API 21 (Android 5.0) | ✅ Suportado |
| **iOS** | iOS 12.0 | ✅ Suportado |
| **Node.js** | 16.x | ✅ Requerido |

## 🚨 Solução de Problemas

### **Erro de permissão (macOS/Linux):**
```bash
sudo chown -R $(whoami) ~/.npm
App não carrega no dispositivo:
Verifique se o dispositivo está na mesma rede Wi-Fi
Tente executar npx expo start --tunnel
Reinicie o Expo Go e escaneie novamente
Erro de dependências:
rm -rf node_modules
rm package-lock.json
npm install
🤝 Contribuindo
Este é um projeto acadêmico com impacto social. Contribuições são bem-vindas!

Faça um fork do projeto
Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)
Commit suas mudanças (git commit -m 'Add some AmazingFeature')
Push para a branch (git push origin feature/AmazingFeature)
Abra um Pull Request
📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo 4 para mais detalhes.

👥 Equipe
Desenvolvido por estudantes comprometidos com tecnologia social e inclusão digital.

📞 Contato
Para dúvidas, sugestões ou parcerias: +55 21 99125-8635

📧 Email: eliesio.jtl@gmail.com
💬 Issues: 5
ComuAcesso - Transformando comunidades através da tecnologia 🚀

💡 Dica: Este projeto utiliza Expo para desenvolvimento mais ágil e teste simplificado em dispositivos reais!
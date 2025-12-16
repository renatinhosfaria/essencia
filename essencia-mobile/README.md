# Essência Feliz - Mobile App

App mobile nativo para iOS e Android do sistema educacional Essência Feliz.

## 🚀 Stack Tecnológica

- **React Native** com **Expo SDK 54**
- **Expo Router** - Navegação file-based
- **Tamagui** - UI Components com design system customizado
- **TypeScript** - Strict mode habilitado
- **React Query** - Gerenciamento de estado e cache
- **Axios** - Cliente HTTP
- **Expo Secure Store** - Armazenamento seguro de tokens
- **React Hook Form** + **Zod** - Validação de formulários

## 📦 Instalação

```bash
# Instalar dependências
npm install --legacy-peer-deps

# Iniciar desenvolvimento
npm start
```

## 🏃 Comandos Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia o Expo Dev Server
npm run android        # Roda no emulador Android
npm run ios            # Roda no simulador iOS (requer macOS)
npm run web            # Roda versão web

# Build (EAS Build)
npm run build:ios      # Build de produção para iOS
npm run build:android  # Build de produção para Android
npm run build:preview  # Build preview para ambas plataformas

# Submit para lojas
npm run submit:ios     # Submeter para App Store
npm run submit:android # Submeter para Google Play
```

## 📁 Estrutura do Projeto

```
essencia-mobile/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Rotas de autenticação
│   │   ├── _layout.tsx
│   │   └── login.tsx
│   ├── (tabs)/            # Rotas com tabs
│   │   ├── _layout.tsx
│   │   ├── index.tsx      # Home
│   │   ├── diary.tsx      # Diário
│   │   ├── chat.tsx       # Chat
│   │   └── profile.tsx    # Perfil
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # Componentes reutilizáveis
│   ├── services/          # Serviços de API
│   ├── hooks/             # Custom hooks
│   ├── types/             # Tipos TypeScript
│   └── config/            # Configurações
│       └── env.ts         # Variáveis de ambiente
├── assets/                # Imagens, fontes
├── tamagui.config.ts      # Configuração do Tamagui
├── app.json               # Configuração do Expo
├── tsconfig.json          # Configuração do TypeScript
└── package.json
```

## 🎨 Design System

O app utiliza Tamagui com tema customizado baseado nas cores da marca do Colégio Essência Feliz:

### Cores (Light Theme)

- **Background:** `#FFFFFF` (Branco)
- **Color:** `#333333` (Preto suave - texto principal)
- **Primary:** `#CEDE6C` (Verde Lima - CTAs, sucesso)
- **Secondary:** `#F29131` (Laranja - ação, energia)
- **Placeholder:** `#9FA1A4` (Cinza - texto secundário)

### Cores Semânticas

- **Success:** `#22C55E` (Verde)
- **Warning:** `#F29131` (Laranja)
- **Error:** `#EF4444` (Vermelho)

Modo claro e escuro configurados.

## 🔐 Autenticação

- JWT Tokens armazenados com `expo-secure-store`
- Refresh token automático
- Suporte a autenticação biométrica (planejado)

## 📱 Navegação

Estrutura de navegação:

- **Auth Stack:** Login, Registro
- **Main Tabs:** Home, Diário, Chat, Perfil

Deep links suportados:

- `essencia://home`
- `essencia://diary`
- `essencia://chat`
- `essencia://profile`

## 🌐 API

O app se conecta à API REST em:

- **Development:** `http://localhost:3000`
- **Production:** (a configurar)

Configuração em `src/config/env.ts`

## 🧪 Requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI
- Android Studio (para emulador Android)
- Xcode (para simulador iOS - somente macOS)

## 📱 Testando

### Android

1. Instale o Android Studio
2. Configure um emulador Android
3. Execute `npm run android`

### iOS (somente macOS)

1. Instale o Xcode
2. Execute `npm run ios`

### Dispositivo Físico

1. Instale o app Expo Go
2. Execute `npm start`
3. Escaneie o QR code

## 🚢 Deploy

### Pré-requisitos para Deploy

1. **Conta Expo**: Crie uma conta em [expo.dev](https://expo.dev)
2. **EAS CLI**: Instalado globalmente (`npm install -g eas-cli`)
3. **Contas de Desenvolvedor**:
   - iOS: Apple Developer Program ($99/ano)
   - Android: Google Play Developer ($25 pagamento único)

### Login no EAS

```bash
eas login
```

### Configuração Inicial

O projeto já está configurado com `eas.json` contendo 3 profiles:

- **development**: Build de desenvolvimento com dev client
- **preview**: Build para testes internos (APK/IPA)
- **production**: Build de produção (AAB/IPA)

### Builds

#### Build de Produção iOS

```bash
npm run build:ios
```

Requisitos:

- Bundle Identifier: `com.essenciafeliz.app`
- Apple Developer Account configurado
- Certificados gerenciados automaticamente pelo EAS

#### Build de Produção Android

```bash
npm run build:android
```

Requisitos:

- Package Name: `com.essenciafeliz.app`
- Keystore gerenciado automaticamente pelo EAS
- Gera arquivo AAB (Android App Bundle)

#### Build de Preview (Teste Interno)

```bash
npm run build:preview
```

Gera:

- APK para Android (instalável diretamente)
- IPA para iOS (instalável via TestFlight ou ad-hoc)
- URL de download compartilhável

### Submissão para Lojas

#### iOS - App Store

```bash
npm run submit:ios
```

Antes de submeter:

1. Configure `appleId`, `ascAppId` e `appleTeamId` em `eas.json`
2. Prepare screenshots (6.5", 5.5")
3. Crie App Icon (1024x1024)
4. Configure Privacy Policy URL no App Store Connect

#### Android - Google Play

```bash
npm run submit:android
```

Antes de submeter:

1. Configure `serviceAccountKeyPath` em `eas.json`
2. Prepare screenshots (mínimo 2, máximo 8)
3. Crie Feature Graphic (1024x500)
4. Configure Privacy Policy URL no Google Play Console

### Versionamento

O projeto usa auto-incremento de versão habilitado em `eas.json`:

- iOS: `buildNumber` incrementado automaticamente
- Android: `versionCode` incrementado automaticamente

Para atualizar a versão semântica:

```json
// app.json
{
  "expo": {
    "version": "1.0.1" // Atualizar manualmente
  }
}
```

### Gerenciamento de Credenciais

```bash
# Visualizar credenciais configuradas
eas credentials

# Configurar credenciais manualmente
eas credentials --platform ios
eas credentials --platform android
```

### Checklist Pré-Deploy

- [ ] Testes em dispositivos reais (iOS e Android)
- [ ] Validar fluxo de autenticação completo
- [ ] Testar modo offline e sincronização
- [ ] Validar deep links
- [ ] Testar push notifications (quando implementado)
- [ ] Verificar performance (tempo de carregamento < 3s)
- [ ] Preparar screenshots para lojas
- [ ] Revisar política de privacidade
- [ ] Atualizar versão em `app.json`

### Links Úteis - Deploy

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)

## 📝 Notas de Desenvolvimento

- Usar `--legacy-peer-deps` ao instalar novas dependências devido a conflitos entre React 19.1 (Expo) e React 19.2 (Tamagui)
- TypeScript está configurado em modo strict
- Paths configurados: `@/*` aponta para `./src/*`

## 🔗 Links Úteis

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Tamagui](https://tamagui.dev/)
- [React Query](https://tanstack.com/query/latest)

---

**Desenvolvido para o Colégio Essência Feliz** 🌱

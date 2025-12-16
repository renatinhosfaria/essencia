# Essencia API - Contrato Canônico v1

## Base URLs (canônicos para clients)

- REST (via Gateway): `http(s)://<host>:3000/api/v1`
- WS (Socket.IO namespace `/messages`): o client conecta em `${WS_URL}/messages`

### Produção (host único via reverse proxy)

Para usar **um único host** público para REST + WebSocket (recomendado em produção), publique somente o reverse proxy e roteie:

- `/api/v1/*` -> Gateway (REST)
- `/socket.io/*` -> Engagement (transporte do Socket.IO)

Com isso:

- `API_URL = https://api.<domain>/api/v1`
- `WS_URL = https://api.<domain>`

O contrato WebSocket permanece o mesmo (namespace e eventos).

## Serviços (internos; não-canônicos para clients)

- Core: `http(s)://<host>:3001/api/v1`
- Engagement: `http(s)://<host>:3002/api/v1`

## Rotas (REST)

### Auth (Core via Gateway)

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/forgot-password`

### Users / Tenants / Students / Classes (Core via Gateway)

- `GET /users/me`
- `GET|POST|PUT|DELETE /users/*`
- `GET /tenants/by-slug`
- `GET|POST|PUT|DELETE /tenants/*`
- `GET|POST|PUT|DELETE /students/*`
- `GET|POST|PUT|DELETE /classes/*`

### Engagement (via Gateway)

- `GET|POST|PUT|PATCH /diary/*`
- `GET|POST|PUT|PATCH /messages/*`
- `GET|POST|PUT|PATCH /announcements/*`
- `GET|POST|PUT|PATCH /gallery/*`
- `GET /notifications`
- `POST /notifications/device-token`
- `DELETE /notifications/device-token/:deviceId`
- `POST /notifications/send`

## WebSocket (eventos v1)

### Endpoint

- Namespace Socket.IO: `/messages`
- URL base recomendada (dev): `http://<host>:3002`
- URL base recomendada (prod): `https://api.<domain>` (via reverse proxy)
- Conexão do client: `io("${WS_URL}/messages", ...)`

### Eventos do client → server

- `join` payload `{ userId, tenantId }`
- `joinConversation` payload `{ conversationId }`
- `leaveConversation` payload `{ conversationId }`
- `sendMessage` payload `{ tenantId, conversationId, senderId, content }`
- `typing` payload `{ conversationId, userId }`
- `stopTyping` payload `{ conversationId, userId }`
- `message:read` payload `{ conversationId, messageIds: string[] }`

### Eventos do server → client

- `newMessage` payload `Message`
- `userTyping` payload `{ conversationId, userId }`
- `userStoppedTyping` payload `{ conversationId, userId }`
- `message:read` payload `{ messageId, conversationId, readAt }`

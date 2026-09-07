# Salfate Abogados — Sitio web

Landing profesional para el estudio jurídico **Salfate Abogados** (Chile). Incluye CMS editable, formulario de contacto, diagnóstico legal orientativo y chatbot flotante con personalización por sesión.

**Desarrollado por:** [BugLab Soluciones](https://buglabsoluciones.com)

---

## Resumen ejecutivo (para IA / handoff)

| Aspecto | Detalle |
|---------|---------|
| **Cliente** | Salfate Abogados — Derecho Público y Administrativo |
| **Stack** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| **CMS** | Panel sencillo `/panel` (+ Sanity opcional en `/admin`) |
| **Email** | Resend (`/api/contact`) |
| **Chat** | Bot local basado en reglas (sin API de IA externa) |
| **Deploy** | Vercel (recomendado) |
| **Repo GitHub** | `calossalfate/SalfateAbogados-IA` |

El sitio **no usa base de datos propia**. El contenido editable vive en Sanity; si Sanity no está configurado, se usan valores por defecto en código (`src/lib/content/defaults.ts`).

---

## Comandos

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

---

## Variables de entorno

Copiar `.env.example` → `.env.local` (o configurar en Vercel):

| Variable | Uso |
|----------|-----|
| `RESEND_API_KEY` | Envío de correos del formulario |
| `CONTACT_TO_EMAIL` | Destino de consultas |
| `CONTACT_FROM_EMAIL` | Remitente (dominio verificado en Resend) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Proyecto Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset (ej. `production`) |
| `NEXT_PUBLIC_SITE_URL` | URL pública para `robots.txt` / `sitemap.xml` |

---

## Estructura del proyecto

```
derecho/
├── public/                    # Assets estáticos
│   ├── logo-salfate.jpeg      # Logo completo del estudio
│   ├── logo-mark.png          # Monograma SA (header, favicon)
│   ├── buglab-logo.png        # Logo BugLab (footer)
│   └── hero.jpg, etc.
├── sanity/
│   ├── schemas/               # Schema Sanity (siteContent)
│   └── lib/client.ts          # Cliente Sanity (solo lectura en producción)
├── src/
│   ├── app/
│   │   ├── (site)/            # Landing pública
│   │   │   ├── layout.tsx     # Metadata SEO + providers
│   │   │   └── page.tsx       # Página principal
│   │   ├── admin/[[...tool]]/ # Sanity Studio
│   │   ├── api/contact/       # POST formulario → Resend
│   │   ├── icon.png           # Favicon
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/            # UI (Header, Hero, Chat, Footer…)
│   ├── context/               # SiteContentContext
│   ├── lib/
│   │   ├── content/           # Tipos, defaults, merge, Sanity fetch
│   │   ├── legalChatBot.ts    # Lógica del chatbot
│   │   ├── legalAIDiagnostic.ts # Clasificación orientativa de casos
│   │   ├── chatSession.ts     # Sesión del chat (nombre + mensajes)
│   │   └── security/          # Rate limit, validación contacto
│   └── middleware.ts          # Rate limiting API contacto
├── docs/PANEL-ADMIN.md        # Guía para el owner del estudio
└── .env.example
```

---

## Flujo de contenido (Sanity + defaults)

1. `getSiteContent()` (`src/lib/content/getSiteContent.ts`) consulta Sanity.
2. Si no hay proyecto configurado o falla la query → usa `defaultSiteContent`.
3. `mergeSiteContent()` combina partial de Sanity con defaults.
4. `SiteContentProvider` expone el contenido a toda la app vía React Context.
5. El owner edita en **`/admin`** → Sanity → CDN → sitio (~1 min).

**Documento Sanity:** `siteContent` con `_id: "siteContent"` (singleton).

Campos editables: contacto, SEO, tema, hero, especialidades, FAQ, formulario, chat, footer.

---

## Secciones de la landing

| Sección | Componente | ID anchor |
|---------|------------|-----------|
| Header + nav | `Header.tsx` | `#inicio` |
| Hero | `Hero.tsx` | `#inicio` |
| Audiencia | `AudienceSection.tsx` | — |
| Especialidades | `PracticeAreas.tsx` | `#especialidades` |
| Diagnóstico legal | `LegalAIAssistant.tsx` | `#ia-legal` |
| Metodología | `Methodology.tsx` | `#metodologia` |
| FAQ | `FAQ.tsx` | `#faq` |
| Contacto | `ContactSection.tsx` | `#contacto` |
| Footer | `Footer.tsx` | — |
| Chat flotante | `FloatingLegalChat.tsx` | — |

---

## Chatbot legal (`FloatingLegalChat`)

### Comportamiento

- Bot **local por reglas** (`src/lib/legalChatBot.ts`), no LLM externo.
- Al abrir, **pide el nombre** antes de orientar.
- Personaliza saludos, despedidas y prompts con el primer nombre.
- Opción **«Omitir»** para continuar sin nombre.
- Clasifica casos por palabras clave → urgencia, documentos, acciones.
- Navega a secciones (`#contacto`, `#ia-legal`) vía hash.
- Teaser proactivo tras ~3.5 s en página.

### Sesión del chat (`src/lib/chatSession.ts`)

**Storage:** `sessionStorage` (clave `salfate-chat-session`).

| Dato persistido | Descripción |
|-----------------|-------------|
| `userName` | Nombre del visitante |
| `awaitingName` | Si aún no ha dado nombre |
| `messages` | Historial del chat |
| `messageCount` | Contador de mensajes |
| `lastDiagnostic` | Último diagnóstico del bot |

### Cuándo se limpia la sesión

| Evento | Efecto |
|--------|--------|
| Cerrar pestaña o navegador | `sessionStorage` se borra (nativo) |
| Botón **↺ Nueva conversación** en header del chat | Limpia chat + diagnóstico |
| **4 horas** sin actividad (`SESSION_TTL_MS`) | Sesión expirada al recargar |
| `clearChatSession()` | Borra `salfate-chat-session` y `salfate-legal-diagnostic` |

### Diagnóstico vinculado al formulario

- Clave: `salfate-legal-diagnostic` en `sessionStorage`.
- Lo escriben el chat y la sección `LegalAIAssistant`.
- `ContactSection` lo lee al montar y prellena tipo de caso + mensaje.

---

## API de contacto (`POST /api/contact`)

**Body JSON:** `{ name, email, phone?, caseType, message, website? }`

- `website` = honeypot anti-bots (debe ir vacío).
- Validación server-side en `src/lib/security/validateContact.ts`.
- Rate limit: 5 req / 15 min por IP (`src/middleware.ts`).
- Envía email vía Resend con HTML escapado.

---

## Seguridad implementada

- Headers HTTP (HSTS, X-Frame-Options, nosniff, etc.) en `next.config.mjs`
- Rate limiting en `/api/contact`
- Honeypot + validación de campos
- Sanitización de cabeceras de email
- `robots.txt` bloquea `/admin` y `/api/`
- Secretos solo en variables de servidor (nunca `NEXT_PUBLIC_*` para keys)

---

## Branding y assets

| Asset | Uso |
|-------|-----|
| `logo-mark.png` | Header (monograma transparente) + favicon |
| `logo-salfate.jpeg` | Footer (tarjeta blanca) |
| `buglab-logo.png` | Crédito BugLab en footer (`StudioCredit.tsx`) |

**Header:** monograma + texto «Salfate Abogados» (tipografía del sitio).  
**Footer:** logo completo + tarjeta BugLab clickeable → buglabsoluciones.com

---

## Panel de administración

- URL sencilla (recomendada): `/panel` — correo, teléfonos y textos
- URL avanzada (Sanity): `/admin`
- Guía: `docs/PANEL-ADMIN.md`

---

## Temas visuales

Presets en `src/lib/content/themes.ts`: `classic`, `corporate-blue`, `conservative`.  
`ThemeInjector.tsx` inyecta CSS variables según el tema del CMS.

---

## Archivos clave para modificar

| Si quieres cambiar… | Archivo |
|---------------------|---------|
| Textos por defecto | `src/lib/content/defaults.ts` |
| Lógica del chat | `src/lib/legalChatBot.ts` |
| Sesión / nombre del chat | `src/lib/chatSession.ts` |
| Diagnóstico legal | `src/lib/legalAIDiagnostic.ts` |
| Formulario contacto | `src/components/ContactSection.tsx` + `api/contact/route.ts` |
| SEO / metadata | Sanity o `(site)/layout.tsx` |
| Crédito BugLab | `src/components/StudioCredit.tsx` |
| Logo header | `src/components/Header.tsx` + `BrandLogo.tsx` |

---

## Despliegue (Vercel)

1. Conectar repo GitHub
2. Agregar variables de entorno (ver arriba)
3. Deploy automático en push a `main`
4. Verificar dominio en Resend para emails de producción
5. Invitar al owner en Sanity → Members

---

## Notas para IA que continúe el trabajo

1. **No romper el fallback:** si Sanity falla, el sitio debe seguir con `defaults.ts`.
2. **Chat sin API externa:** ampliar intents en `legalChatBot.ts`, no agregar OpenAI sin pedirlo.
3. **sessionStorage, no localStorage:** datos del chat deben expirar al cerrar pestaña.
4. **Personalización:** `ChatContext` incluye `userName` y `awaitingName`; mantener sincronizado con `chatSession.ts`.
5. **Formulario + diagnóstico:** cualquier cambio en claves de storage debe actualizar chat, asistente IA y contacto.
6. **Estilo UI:** dark premium, acentos dorados (`accent`), fuentes Cormorant + DM Sans.
7. **Scope mínimo:** preferir cambios focalizados; no refactorizar sin necesidad.
8. **Commits:** solo cuando el usuario lo pida explícitamente.

---

## Licencia / propiedad

Proyecto privado para Salfate Abogados. Código y diseño por BugLab Soluciones.

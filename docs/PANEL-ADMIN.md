# Panel de administración — Salfate Abogados

Tu hermano puede editar textos, contacto, colores y más **sin programar**.

## Acceso

1. Abre **https://[dominio-del-sitio]/admin**
2. Inicia sesión con la cuenta de Google (o email) autorizada en Sanity
3. Edita **Contenido del sitio web**
4. Pulsa **Publish** (Publicar)

Los cambios aparecen en la web en aproximadamente 1 minuto.

## Qué puede cambiar

| Sección | Ejemplos |
|---------|----------|
| **Contacto** | Email, teléfono, WhatsApp, cobertura |
| **SEO** | Título en Google, descripción |
| **Apariencia** | Tema: Clásico dorado / Azul corporativo / Conservador |
| **Inicio / Hero** | Título principal, subtítulo, botones |
| **Especialidades** | Agregar, quitar o editar áreas de práctica |
| **FAQ** | Preguntas y respuestas |
| **Formulario** | Tipos de caso, mensajes de éxito/error |
| **Chat** | Nombre del asistente, notificaciones, botones rápidos |
| **Pie de página** | Descripción y aviso legal |

## Configuración inicial (una sola vez)

### 1. Crear proyecto Sanity

1. Ve a [sanity.io/manage](https://www.sanity.io/manage)
2. Crea proyecto → nombre: `Salfate Abogados`
3. Copia el **Project ID**
4. En Vercel (o `.env.local`), agrega:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID=...`
   - `NEXT_PUBLIC_SANITY_DATASET=production`

### 2. Invitar al owner

En Sanity → **Project → Members → Invite**  
Agrega el email de tu hermano como **Editor** o **Administrator**.

### 3. Crear el documento inicial

1. Entra a `/admin`
2. Abre **Sitio web → Contenido del sitio web**
3. Si está vacío, completa los campos (puedes copiar los textos actuales de la web)
4. **Publish**

### 4. Formulario de contacto (Resend)

1. Cuenta en [resend.com](https://resend.com)
2. Verifica el dominio `salfateabogados.cl` (o usa `onboarding@resend.dev` para pruebas)
3. Variables en Vercel:
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL=contactoabogado@salfateabogados.cl`
   - `CONTACT_FROM_EMAIL=...`

## Si Sanity no está configurado

El sitio sigue funcionando con el contenido original del código. No hay error visible para los visitantes.

## Soporte técnico

Cambios de diseño avanzados, nuevas secciones o lógica del bot requieren desarrollo.  
El panel cubre el **contenido del día a día** que un bufete necesita actualizar solo.

# Panel de edición sencillo — Salfate Abogados

Tu hermano puede editar **correo, teléfonos y textos** sin programar.

## Acceso

1. Abre **https://www.salfateabogados.cl/panel**
2. Ingresa la contraseña del panel
3. Edita las pestañas **Contacto**, **Textos** o **Pie y CTA**
4. Pulsa **Guardar cambios**
5. Espera 1–2 minutos y revisa la web (Vercel vuelve a publicar solo)

## Qué puede cambiar

| Pestaña | Campos |
|---------|--------|
| **Contacto** | Nombre del estudio, correo, teléfono, WhatsApp, cobertura |
| **Textos** | Título y subtítulo del inicio, botones, textos de la sección contacto |
| **Pie y CTA** | Llamado a la acción y textos del pie |

## Configuración inicial (una sola vez, en Vercel)

En el proyecto de Vercel → **Settings → Environment Variables**, agrega:

```
ADMIN_PASSWORD=una-clave-segura
PANEL_GITHUB_TOKEN=github_pat_xxxx
PANEL_GITHUB_REPO=calossalfate/SalfateAbogados-IA
PANEL_GITHUB_BRANCH=main
```

### Cómo crear el token de GitHub

1. GitHub → Settings → Developer settings → **Personal access tokens** (fine-grained o classic)
2. Permiso de **Contents: Read and write** sobre el repo `SalfateAbogados-IA`
3. Copia el token en `PANEL_GITHUB_TOKEN`

Luego **redeploy** el proyecto en Vercel.

Opcional (recomendado para el formulario de contacto):

```
CONTACT_TO_EMAIL=contactoabogado@salfateabogados.cl
```

## Notas

- El panel **no** aparece en Google (`/panel` está bloqueado en robots).
- La sesión dura 12 horas.
- Sanity (`/admin`) sigue disponible para edición avanzada si está configurado.
- Si no configuras `PANEL_GITHUB_TOKEN`, el panel puede iniciar sesión pero **no podrá guardar** en producción.

## Soporte

Si olvida la contraseña, cámbiala en Vercel (`ADMIN_PASSWORD`) y vuelve a desplegar.

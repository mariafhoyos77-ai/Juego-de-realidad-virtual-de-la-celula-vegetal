# 🌿 Expedición VR: La Célula Vegetal

Juego interactivo de realidad virtual / 3D para explorar la **célula vegetal**: navega por 12 checkpoints (pared celular, vacuola, cloroplastos y más), responde preguntas, juega minijuegos de laboratorio y obtén tu **Certificado de Biólogo Celular**.

Construido con **React + Vite + Tailwind CSS + Three.js**.

## 🚀 Demo online

Una vez activado GitHub Pages, el juego queda disponible en:

`https://<tu-usuario>.github.io/<nombre-del-repo>/`

> El despliegue es automático: cada push a `main` compila el proyecto y lo publica (ver `.github/workflows/deploy.yml`).

### Activar GitHub Pages (solo una vez)

1. En GitHub, ve a **Settings → Pages**.
2. En **Source**, selecciona **GitHub Actions**.
3. Haz push a `main` y espera a que el workflow *Deploy a GitHub Pages* termine ✅

## 🛠️ Desarrollo local

Requisitos: Node.js 20+ y npm.

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # compila a dist/ (un solo HTML autocontenido)
npm run preview  # sirve el build de producción localmente
npm run typecheck
```

## 📁 Estructura

```
├── index.html            # entrada HTML
├── src/
│   ├── main.tsx          # punto de entrada React
│   ├── App.tsx           # lógica del juego y modales
│   ├── index.css         # Tailwind CSS
│   ├── components/       # Cell3DView, HUD, CheckpointModal, MiniGames, ...
│   ├── data/             # datos de los orgánulos
│   ├── types/            # tipos TypeScript
│   └── utils/            # audio, voz (TTS), utilidades
├── public/.nojekyll      # necesario para GitHub Pages
└── .github/workflows/deploy.yml  # CI: build + deploy a Pages
```

## 🌐 Otros hostings

El build (`npm run build`) genera un `dist/index.html` único y autocontenido (gracias a `vite-plugin-singlefile`) con rutas relativas (`base: "./"`), así que funciona tal cual en **Netlify, Vercel, Cloudflare Pages** o cualquier hosting estático: solo sube el contenido de `dist/`.

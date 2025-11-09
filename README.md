# 🚀 Interactive XML Prompt Builder

A visual tool for creating structured XML prompts for AI language models. Build complex, well-formatted prompts with an intuitive tree-based interface and keyboard shortcuts.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.5-black)
![React](https://img.shields.io/badge/React-19.1.0-61dafb)

## ✨ Features

- **Interactive Tree Editor** - Visual XML structure builder with hierarchical tag management
- **Keyboard Shortcuts** - Efficient navigation and editing with hotkeys
- **Live Preview** - Real-time formatted XML output with syntax highlighting
- **One-Click Export** - Copy to clipboard or send directly to AI platforms (ChatGPT, Claude, Gemini, etc.)
- **Smart Indentation** - Context-aware node movement and nesting
- **Error Prevention** - Built-in validation to prevent invalid XML structures

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15.5.5 (Pages Router) with Turbopack
- **UI Library**: React 19.1.0 with TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **XML Formatting**: xml-formatter
- **Keyboard Handling**: hotkeys-js
- **Component Library**: Radix UI primitives

### Project Structure

```
src/
├── components/
│   ├── Editor.tsx           # Tree-based XML structure editor
│   ├── Preview.tsx          # Formatted XML preview with copy/export
│   ├── TagInputDialog.tsx   # Tag name input modal
│   ├── TagContentDialog.tsx # Tag content input modal
│   ├── EditDialog.tsx       # Node editing modal
│   ├── HelpDialog.tsx       # Keyboard shortcuts help
│   └── ui/                  # shadcn/ui components
├── hooks/
│   └── useShortcuts.ts      # Keyboard shortcut manager
├── utils/
│   └── xmlFormatter.ts      # XML formatting logic
└── pages/
    └── index.tsx            # Main application page
```

### Core Data Model

```typescript
interface XmlNode {
  id: string;
  type: "tag" | "content";
  tagName?: string;
  content?: string;
  children?: XmlNode[];
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/cyrizon/prompt-builder.git
cd prompt-builder

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

### Build for Production

```bash
npm run build
```

### Docker Deployment

**Option 1: Avec Nginx intégré (port 8080)**

```bash
# Using Docker
docker build -t prompt-builder .
docker run -p 8080:80 prompt-builder

# Using Docker Compose
docker-compose up -d
```

Access the app at [http://localhost:8080](http://localhost:8080)

**Option 2: Sans Nginx - Pour intégration avec Nginx existant** ⭐ Recommandé

Cette option expose le container sur le réseau Docker sans mapper de port sur l'hôte.
Votre Nginx existant pourra communiquer directement avec le container.

```bash
# Build et démarrer le container
docker-compose -f docker-compose.standalone.yml up -d
```

**Configurer votre Nginx existant:**

Le container `prompt-builder` sera accessible via le réseau Docker sur le port 3001.
Ajoutez cette configuration à votre Nginx (exemple: `/etc/nginx/sites-available/prompt-builder`):

```nginx
# Sous-domaine
server {
    listen 80;
    server_name prompt.yourdomain.com;

    location / {
        proxy_pass http://prompt-builder:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ou pour un sous-chemin (ex: `yourdomain.com/prompt-builder`):

```nginx
location /prompt-builder {
    rewrite ^/prompt-builder(.*) $1 break;
    proxy_pass http://prompt-builder:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

Rechargez Nginx:

```bash
# Test de configuration
sudo nginx -t

# Recharger
sudo nginx -s reload
# ou
docker exec nginx nginx -s reload
```

To stop the container:

```bash
docker-compose down
# or
docker-compose -f docker-compose.standalone.yml down
```

## ⌨️ Keyboard Shortcuts

| Key               | Action                                    |
| ----------------- | ----------------------------------------- |
| `C`               | Create new tag                            |
| `E`               | Edit selected node                        |
| `Del`             | Delete selected node                      |
| `↑` / `↓`         | Navigate up/down                          |
| `Alt+↑` / `Alt+↓` | Move node up/down                         |
| `Tab`             | Indent node (nest under previous sibling) |
| `Shift+Tab`       | Unindent node (move up one level)         |
| `H`               | Show help                                 |

## 🎯 Usage Example

1. **Create a root tag** - Press `C` to create a tag (default: `<prompt>`)
2. **Add nested tags** - Navigate and press `C` to add child tags like `<context>`, `<instructions>`
3. **Add content** - When creating tags, optionally add text content
4. **Organize structure** - Use `Tab`/`Shift+Tab` to nest/unnest, `Alt+↑/↓` to reorder
5. **Export** - Copy the formatted XML or send directly to your AI platform

## 🤝 Contributing

This is an open-source project - feel free to fork, modify, and create your own version!

## 📝 License

MIT License - Feel free to use this project for any purpose.

## 🙏 Credits

Created by [Cyrizon](https://github.com/cyrizon)

Built with:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)

# Living Resume - Cameron Barnes Portfolio

An interactive portfolio website featuring a local AI assistant powered by WebLLM. This portfolio showcases professional experience, skills, and projects with a GitHub-style README aesthetic.

## Features

- 🎨 Clean, GitHub-inspired design with dark mode
- 🤖 Local AI assistant powered by WebLLM (runs entirely in browser)
- ⚡ Built with React, TypeScript, and Tailwind CSS v4
- 📱 Fully responsive design
- ♿ Accessible with proper ARIA labels

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Build Tool**: Vite
- **AI**: WebLLM (optional, browser-based)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This site can be deployed to any static hosting service:

### Vercel
1. Import your repository to Vercel
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`

### Netlify
1. Connect your repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

### GitHub Pages
1. Build the project: `npm run build`
2. Deploy the `dist` folder to GitHub Pages
3. Or use GitHub Actions for automated deployment

## Customization

To customize this portfolio for your own use:

1. Update personal information in [src/App.tsx](src/App.tsx):
   - Name, title, and contact information
   - Experience timeline
   - Skills and proficiency levels
   - Featured projects
   - AI assistant system prompt

2. Update colors in [src/index.css](src/index.css):
   - Modify CSS variables in `:root`
   - Adjust gradient backgrounds
   - Change accent colors

3. Replace social media links in the header

## AI Assistant

The portfolio includes an optional AI assistant powered by WebLLM that runs entirely in your browser. The first time a user opens the chat, it will download a ~1GB language model. After that, it works offline.

To modify the AI assistant's knowledge, update the `systemPrompt` variable in [src/App.tsx](src/App.tsx).

## License

MIT License - Feel free to use this template for your own portfolio!

## Contact

Cameron Barnes
- Email: ccbarnes88@icloud.com
- GitHub: [jhoseph88](https://github.com/jhoseph88)
- LinkedIn: [cameron-barnes](https://www.linkedin.com/in/cameron-barnes-923a9a188/)
# living-res

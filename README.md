# Educational Assistant

A modern React app that helps users learn any topic by providing AI-powered explanations and finding relevant educational videos from Khan Academy's YouTube channel.

## Features

- **Conversational AI**: Ask about any educational topic and receive clear explanations powered by Anthropic Claude.
- **YouTube Integration**: Automatically finds and displays the most relevant Khan Academy video for your query.
- **Query History**: Easily revisit your past questions and answers.
- **Responsive UI**: Adjustable panes for chat, video, and history, with a clean, modern design.

## Screenshots

![image](https://github.com/user-attachments/assets/a688a908-4095-466e-a40f-fdcc126a28f7)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

## Deployment (Vercel)

This project is ready to deploy on [Vercel](https://vercel.com/):

1. **Pull the repostiroy from GitHub: https://github.com/makeithjr/anthropic-assignment-mk.git**
2. **Import this repository into Vercel.**
3. **Set the following environment variables in your Vercel project dashboard:**
   - `VITE_APP_CLAUDE_API_KEY`
   - `VITE_APP_YOUTUBE_API_KEY`
4. **Vercel will automatically detect the Vite + React setup and use `npm run build` for production builds.**
5. **The app will be deployed and accessible via your Vercel domain.**

> **Note:**  
> - Get a [Claude API key](https://console.anthropic.com/settings/keys)
> - Get a [YouTube Data API v3 key](https://console.cloud.google.com/apis/credentials)

## Usage

- Type your educational question in the chat input and press Enter or click Send.
- The assistant will reply with an explanation and show a relevant Khan Academy video.
- Use the history pane to revisit previous queries or try suggested topics.

## Project Structure

- `src/App.tsx` — Main application logic and UI.
- `src/main.tsx` — App entry point.
- `index.html` — HTML template.
- `vite.config.ts` — Vite configuration.

## Technologies Used

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (for styling)
- [Lucide React](https://lucide.dev/) (for icons)
- [Anthropic Claude API](https://www.anthropic.com/)
- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- [Vercel](https://vercel.com/) (for deployment)

## Author

Core codebase created by Michael Keith (https://github.com/your-github-username) & Claude AI 

Email: michael.keith.jr@gmail.com

*Feel free to reach out for questions!*

## License

[MIT](LICENSE)

---

*This project is for educational purposes and is not affiliated with Khan Academy or Anthropic.*

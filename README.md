# Educational Assistant

A modern React app that supports learning on any educational topic with Claude-powered explanations and Khan Academy videos that supplement and reinforce understanding.

## Features

- **Conversational AI**: Ask about any educational topic and receive clear explanations powered by Anthropic Claude.
- **YouTube Integration**: Automatically finds and displays the most relevant Khan Academy video for your query.
- **Query History**: Easily revisit your past questions and answers.
- **Responsive UI**: Adjustable panes for chat, video, and history, with a clean, modern design.

## Screenshots

![image](https://github.com/user-attachments/assets/096a588b-2883-4e71-869d-98fdc168e4da)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

## Deployment (Vercel)

This project is ready to deploy on [Vercel](https://vercel.com/):

1. **Pull the repostiroy from GitHub: https://github.com/makeithjr/anthropic-assignment-mk.git**
2. **Import this repository into Vercel.**
3. **Set the following environment variables in your Vercel project dashboard:**
   - `ANTHROPIC_API_KEY`
   - `YOUTUBE_API_KEY`
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
- `api/*` — Serverless functions that handles API requests to Claude and fetches to YouTube.
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
- [Visual Studio Code](https://code.visualstudio.com/) (code editor for local development)
- [Vercel](https://vercel.com/) (for deployment)

## Author

Core codebase created by Michael Keith & Claude.ai 

Email: michael.keith.jr[at]gmail.com

*Feel free to reach out for questions!*

## License

[MIT](LICENSE)

---

*This project is for educational purposes and is not affiliated with Khan Academy or Anthropic.*

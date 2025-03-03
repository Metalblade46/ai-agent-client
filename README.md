# [Agentos](https://agent.sabbyasachi.online) AI Agent with Langgraph JS

This project is a Next.js application that serves as an AI agent utilizing Langchain and Langgraph JS. It integrates several functionalities including serving YouTube transcripts, Google Books data, Wikipedia data, and dummy customer orders and comments data.

## Features

- 📹**YouTube Transcripts:** Fetch and serve transcripts from YouTube videos.
- 📘**Google Books Data:** Retrieve information and details from Google Books API.
- 📑**Wikipedia Data:** Access and serve data from Wikipedia articles.
- 👤**Dummy Customer Data:** Simulated orders and comments data for testing and demonstration purposes.
- 🤖 **Cutting-edge AI chatbot powered by Gemini 1.5 pro for dynamic interactions**
- 🖌️ **Sleek and adaptive UI designed with Tailwind CSS for a seamless experience**
- 🔐 **Secure user authentication and management powered by Clerk**
- 📙 **Instant and scalable data storage solutions using Convex**
- ⚡ **Built with the latest Next.js 15 and React 19 for optimal performance**
- 🎏 **Enhanced real-time streaming capabilities with a custom implementation**
- 📱 **Fully responsive and mobile-friendly design for accessibility on all devices**
- 🧠 **Smart prompt caching mechanism to optimize token consumption**
- 🔧 **Efficient AI workflow and tool orchestration with LangGraph**
- 🔄 **Live updates and immediate execution feedback for a dynamic user experience**
- 📚 **Seamless integration with diverse data sources through wxflows**

## Technologies Used

- **Next.js:** React framework for server-rendered React applications for frontend as well as routes to stream responses.
- **Langchain:** Framework for building applications powered by large language models.
- **Langgraph TS:** Graph-based orchestration for AI agents.
- **Wx Flows:** Tool creation and imports.
- **Clerk:** For Authentication.
- **Convex:** For DB and Backend as a Service.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- Clerk account for authentication
- Convex account for database
- OpenAI/Anthropic API/Google AI key for AI capabilities
- Langsmith API key if trace is required

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Metalblade46/ai-agent-client.git
   cd ai-agent-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Rename `.env.example` to `.env` and fill in necessary API keys or configuration.
   ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    NEXT_PUBLIC_CONVEX_URL=your_convex_url
    ISSUER_URL=clerk_issuer_url

    # Deployment used by `npx convex dev`
    CONVEX_DEPLOYMENT=your_convex_deployment
    GOOGLE_API_KEY=your_google_ai_key

    WXFLOWS_APIKEY=your_wxflows_api_key
    WXFLOWS_ENDPOINT=your_wxflows_endpoint


    LANGSMITH_TRACING=true
    LANGSMITH_ENDPOINT="https://api.smith.langchain.com"
    LANGSMITH_API_KEY=your_langsmith_api_key
    LANGSMITH_PROJECT=default
    LANGCHAIN_CALLBACKS_BACKGROUND=false
```
   

### Running the Application

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000).
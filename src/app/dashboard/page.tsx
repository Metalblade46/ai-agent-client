import { BotIcon } from "lucide-react";

const Dashboard = () => {
  // Rest of the dashboard code...
  return (
    <div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-100 to-blue-50/50 rounded-3xl"></div>
        <div className="relative space-y-6 p-8 text-center">
          <div className="bg-white/60 backdrop-blur-sm shadow-sm ring-1 ring-blue-200/50 rounded-2xl p-6 space-y-4">
            <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-4 inline-flex">
              <BotIcon className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold bg-gradient-to-br from-blue-900 to-blue-600 bg-clip-text text-transparent">
              Welcome to Agentos, your own AI agent chat
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Start a new conversation from the sidebar or select an existing
              chat from the sidebar. Your AI agent is ready to assist you with
              everything.
            </p>
            <div className="pt-2 flex justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                Real Time responses
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Smart Assistance
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                Powerful Tools
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

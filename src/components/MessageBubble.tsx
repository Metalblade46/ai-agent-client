"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BotIcon } from "lucide-react";
import { formatMessage } from "@/lib/utils";

type MessageBubbleProps = {
  content: string;
  isUser?: boolean; // true if the message is from the user, false if from the assistant
};

const MessageBubble = ({ content, isUser = false}: MessageBubbleProps) => {
  const { user } = useUser();
  return (
    <div className={`flex  ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-2xl px-4 py-2.5 max-w-[75%]  shadow-sm ring-1 ring-inset relative 
            ${isUser ? "bg-blue-600 text-white rounded-br-none ring-blue-700" : "bg-white text-gray-900 rounded-bl-none ring-gray-700"}`}
      >
        <div className="whitespace-pre-wrap text-[15px] leading-relaxed overflow-x-auto">
          <div dangerouslySetInnerHTML={{ __html: formatMessage(content) }} />
        </div>
        <div
          className={`absolute bottom-0 ${isUser ? "right-0 translate-x-1/2 translate-y-1/2" : "left-0 -translate-x-1/2 translate-y-1/2"}`}
        >
            <div className={`w-8 h-8 rounded-full border-2 ${
                isUser? "bg-white border-gray-100" : "border-white bg-blue-600"
              } flex items-center justify-center shadow-sm`}>
                    {
                        isUser? (
                            <Avatar className="h-7 w-7">
                                <AvatarImage src={user?.imageUrl} />
                                <AvatarFallback>{`${user?.firstName?.charAt(0)} ${user?.lastName?.charAt(0)}`}</AvatarFallback>
                            </Avatar>

                        ): <BotIcon className="h-5 w-5 text-white"/>
                    }
            </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

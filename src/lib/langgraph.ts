import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// import { GoogleAICacheManager } from "@google/generative-ai/server"
import { ToolNode } from '@langchain/langgraph/prebuilt'
import wxflows from '@wxflows/sdk/langchain'
import { END, MemorySaver, MessagesAnnotation, START, StateGraph } from '@langchain/langgraph'
import { SYSTEM_MESSAGE } from '@/config'
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { AIMessage, BaseMessage, SystemMessage, trimMessages } from '@langchain/core/messages'
import { StreamEvent } from '@langchain/core/tracers/log_stream'
import { IterableReadableStream } from '@langchain/core/utils/stream'

//Customers at : 'https://introspection.pis.stepzen.com/customers'
// wxflows import curl https://introspection.apis.stepzen.com/customers --name customers --query-name customers --query-type Customers
//comments at : 'https://dummyjson.com/comments'
// wxflows import curl https://dummyjson.com/comments --name comments --query-name comments --query-type Comments
// const cacheManager = new GoogleAICacheManager(process.env.GOOGLE_API_KEY!)
// const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY!)
const toolClient = new wxflows({
    endpoint: process.env.WXFLOWS_ENDPOINT || "",
    apikey: process.env.WXFLOWS_APIKEY
})
const tools = await toolClient.lcTools
const toolNode = new ToolNode(tools)
const trimmer = trimMessages({
    maxTokens: 10,
    strategy: "last",
    tokenCounter: msgs => msgs.length,
    includeSystem: true,
    allowPartial: false,
    startOn: "human"
})
// function addCachingHeaders(messages: BaseMessage[]) {
//     if (!messages.length) return [];

//     // Create a copy of messages to avoid mutating the original
//     const cachedMessages = [...messages];

//     // Helper to add cache control
//     const addCache = (message: BaseMessage) => {
//         return {
//             role: message instanceof HumanMessage ? "user" : "assistant",
//             parts: [
//                 { text: message.content.toString(), }
//             ]
//         }
//     };

//     // Cache the last message
//     // console.log("🤑🤑🤑 Caching last message");
//     const lastMessage = addCache(cachedMessages.at(-1)!);
//     let secondLastHumanMessage = lastMessage

//     // Find and cache the second-to-last human message
//     let humanCount = 0;
//     for (let i = cachedMessages.length - 1; i >= 0; i--) {
//         if (cachedMessages[i] instanceof HumanMessage) {
//             humanCount++;
//             if (humanCount === 2) {
//                 // console.log("🤑🤑🤑 Caching second-to-last human message");
//                 secondLastHumanMessage = addCache(cachedMessages[i]);
//                 break;
//             }
//         }
//     }

//     return [lastMessage, secondLastHumanMessage];
// }
const initialiseModel = () => {
    // const systemContent = SYSTEM_MESSAGE
    // const cached =  addCachingHeaders(messages)
    // const cachedContent = await cacheManager.create({
    //     model: "models/gemini-1.5-flash-001",
    //     systemInstruction: systemContent,
    //     displayName: "system_prompt",
    //     ttlSeconds: 300,
    //     contents: cached
    // })
    const model = new ChatGoogleGenerativeAI({
        // model: "gemini-1.5-pro",
        model: "gemini-2.0-flash",
        temperature: 0.7,
        apiKey: process.env.GOOGLE_API_KEY,
        streaming: true,
        maxRetries: 2,
        maxOutputTokens: 1000,
        callbacks: [
            {
                handleLLMStart: () => console.log("Starting LLM Call"),
                handleLLMEnd: (output) => {
                    console.log("LLM Call finished:", output)
                    const usage = output.llmOutput?.usage
                    if (usage)
                        console.log("Token used", usage.totalTokens)
                },
                handleLLMNewToken: (token) => {
                    console.log("New token generated:", token)
                }
            }
        ]
    }).bindTools(tools);
    // model.useCachedContent(cachedContent);
    
    return model
}

// Define the function that determines whether to continue or not
function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
    const lastMessage = messages[messages.length - 1] as AIMessage;

    // If the LLM makes a tool call, then we route to the "tools" node
    if (lastMessage.tool_calls?.length) {
        return "tools";
    }
    // If the last message is a tool call, then we continue the conversation to the "agent" node
    if (lastMessage.content && lastMessage._getType() == "tool")
        return "agent"
    // Otherwise, we stop (reply to the user) using the special "__end__" node
    return END;
}
const createWorkFlow = () => {
    const model = initialiseModel();

  return new StateGraph(MessagesAnnotation)
    .addNode("agent", async (state) => {
      // Create the system message content
      const systemContent = SYSTEM_MESSAGE;

      // Create the prompt template with system message and messages placeholder
      const promptTemplate = ChatPromptTemplate.fromMessages([
        new SystemMessage(systemContent, {
          cache_control: { type: "ephemeral" },
        }),
        new MessagesPlaceholder("messages"),
      ]);

      // Trim the messages to manage conversation history
      const trimmedMessages = await trimmer.invoke(state.messages);

      // Format the prompt with the current messages
      const prompt = await promptTemplate.invoke({ messages: trimmedMessages });

      // Get response from the model
      const response = await model.invoke(prompt);

      return { messages: [response] };
    })
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent");
   
}
// const addCachingHeaders = (messages: BaseMessage[]): BaseMessage[] => {
//     //Rules
//     //1. Cache the first SYSTEM Message
//     //2. Cache the last message
//     //3. Cache second to last human message
//     if (!messages.length) return messages
//     const cachedMessages = [...messages]
//     // const firstSystem = cachedMessages.find(message => message.getType() == 'system');
//     const lastMessage = cachedMessages[messages.length - 1];
//     let secondToLastHumanMessage = lastMessage
//     let humanMessages =0;
//     for (let i = cachedMessages.length-1; i>=0 ;i--){
//         if(cachedMessages[i] && cachedMessages[i].getType() == 'human')
//             humanMessages++;
//         if(humanMessages== 2){
//             secondToLastHumanMessage = cachedMessages[i];
//             break;
//         } 
//     }
//     if ( lastMessage && secondToLastHumanMessage) {
//         console.log("Caching last and second last human messages");
//         [lastMessage, secondToLastHumanMessage].forEach(message => {
//             message.content = [
//                 {
//                     type: "text",
//                     text: message.content,
//                     cache_control: { type: "ephemeral" }
//                 }
//             ]
//         })
//     }
//     return cachedMessages;
// }
export const submitQuestion = async (messages: BaseMessage[], chatId: string): Promise<IterableReadableStream<StreamEvent>> => {
    // const cachedMessages = addCachingHeaders(messages)
    const stateGraph = createWorkFlow();
    //Create a checkpoint to save the state of the conversation
    const checkpointer = new MemorySaver();
    const app = stateGraph.compile({ checkpointer });
    // Run graph and stream
    const stream = app.streamEvents({
        messages: messages,
    }, {
        version: "v2",
        configurable: {
            thread_id: chatId
        },
        streamMode: "messages",
        runId: chatId
    })

    return stream
}
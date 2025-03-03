import { SSE_DATA_PREFIX, SSE_LINE_DELIMITER } from "@/config";
// import { getConvexClient } from "@/lib/convex";
import { ChatRequestBody, StreamMessage, StreamMessageType } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
// import { api } from "../../../../../convex/_generated/api";
import { AIMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { submitQuestion } from "@/lib/langgraph";

const sendSSEMessage = (writer: WritableStreamDefaultWriter<Uint8Array>, data: StreamMessage) => {
    const encoder = new TextEncoder();
    return writer.write(encoder.encode(`${SSE_DATA_PREFIX}${JSON.stringify(data)}${SSE_LINE_DELIMITER}`))
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth()
        if (!userId) return new Response("Unauthorized", { status: 401 });
        const body = await req.json()
        const { messages, newMessage, chatId } = body as ChatRequestBody;
        if (!messages || !newMessage || !chatId) return new Response("Invalid request body", { status: 400 });
        // const convexClient = getConvexClient();

        const stream = new TransformStream({}, { highWaterMark: 1024 })
        const writer = stream.writable.getWriter()
        const response = new Response(stream.readable, {
            headers: {
                'content-type': 'text/event-stream',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no' //Disable buffering for nginx required for SSE to work correctly
            }
        });
        const startStream = async () => {
            try {
                //send initial connection message to user
                // await sendSSEMessage(writer, { type: StreamMessageType.Connected })
                // //save the user message to convex
                // await convexClient.mutation(api.messages.storeMessage, {
                //     chatId,
                //     content: newMessage,
                //     role: 'user'
                // })
                //convert messages to Langchain format
                const langchainMessages = [
                    ...messages.map(msg => msg.role === 'user' ? new HumanMessage(msg) : new AIMessage(msg)),
                    new HumanMessage(newMessage)
                ]
                try {
                    //Create event stream
                    const eventStream = submitQuestion(langchainMessages, chatId)
                    //Process the events
                    for await (const event of await eventStream) {
                        if (event.event == "on_chain_stream") {
                            const token = event.data.chunk;
                            if (token) {
                                const text = token[0]?.content;
                                if (text)
                                    await sendSSEMessage(writer, {
                                        type: StreamMessageType.Token,
                                        token: text
                                    })
                            }
                        } else if (event.event == "on_tool_start") {
                            await sendSSEMessage(writer, {
                                type: StreamMessageType.ToolStart,
                                tool: event.name || "unknown",
                                input: event.data.input
                            })

                        } else if (event.event == "on_tool_end") {
                            const toolMessage = new ToolMessage(event.data.output)
                            await sendSSEMessage(writer, {
                                type: StreamMessageType.ToolEnd,
                                tool: toolMessage.lc_kwargs.name || "unknown",
                                output: event.data.output
                            })
                        }
                    }
                    await sendSSEMessage(writer, { type: StreamMessageType.Done })
                } catch (streamError) {
                    console.error("Error in Stream", streamError);
                    if (streamError instanceof Error) {
                        await sendSSEMessage(writer, {
                            type: StreamMessageType.Error,
                            error: streamError instanceof Error ? streamError.message : "Stream Processing Failed"
                        })
                    }
                }
            } catch (error) {
                console.error('Error in Strem', error)
                await sendSSEMessage(writer, {
                    type: StreamMessageType.Error,
                    error: error instanceof Error ? error.message : "Unknown Error"
                })
            } finally {
                try {
                    await writer.close();
                } catch (closeError) {
                    console.error("Error closing Writer", closeError)
                }
            }
        }
        startStream()
        return response;
    } catch (error) {
        console.error('Error in Chat API', error)
        return Response.json({ error: "Failed to process chat request" }, { status: 500 })
    }
}
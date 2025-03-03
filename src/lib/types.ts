import { Id } from "../../convex/_generated/dataModel";

export type ChatRequestBody= {
    messages:{
        role: "user" | "assistant",
        content: string
    }[];
    newMessage: string;
    chatId: Id<"chats">;
}
export enum StreamMessageType{
    Token = 'token',
    Error = 'error',
    Connected = 'connected',
    Done = 'done',
    ToolStart = 'tool_start',
    ToolEnd = 'tool_end'
}
export interface BaseStreamMesaage{
    type: StreamMessageType;
}

export interface TokenMessage extends BaseStreamMesaage{
    type: StreamMessageType.Token;
    token: string;
}

export interface ErrorMessage extends BaseStreamMesaage{
    type: StreamMessageType.Error;
    error: string;
}

export interface ConnectedMessage extends BaseStreamMesaage{
    type: StreamMessageType.Connected;
}

export interface DoneMessage extends BaseStreamMesaage{
    type: StreamMessageType.Done;
}

export interface ToolStartMessage extends BaseStreamMesaage{
    type: StreamMessageType.ToolStart;
    tool: string;
    input: unknown
}

export interface ToolEndMessage extends BaseStreamMesaage{
    type: StreamMessageType.ToolEnd;
    tool: string;
    output: unknown;
}
export type StreamMessage = TokenMessage | ErrorMessage | ConnectedMessage | DoneMessage | ToolStartMessage | ToolEndMessage
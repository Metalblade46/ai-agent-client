import { SSE_DATA_PREFIX, SSE_DONE_MESSAGE } from "@/config";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { StreamMessage, StreamMessageType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function createSSEParser(){
  let buffer = "";
  const parse = (chunk: string): StreamMessage[]=>{
    //combine buffer with new chunk
    const lines =(buffer+chunk).split('\n');
    buffer = lines.pop() || "";// save the last incomplete line
    return lines.map(line=>{
      const trimmedLine = line.trim();
      if(!trimmedLine || !trimmedLine.startsWith(SSE_DATA_PREFIX)) return null;
      const data = trimmedLine.substring(SSE_DATA_PREFIX.length);
      if(data == SSE_DONE_MESSAGE) return {type: StreamMessageType.Done};
      try {
          const parsed = JSON.parse(data) as StreamMessage
          return Object.values(StreamMessageType).includes(parsed.type) ? parsed : null
      } catch {
          return {
            type: StreamMessageType.Error,
            error: "Failed to Parse SSE Message"
          }        
      }
    }).filter((line): line is StreamMessage =>line!=null); 
  }
  return parse
}
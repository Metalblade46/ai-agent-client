import { ConvexHttpClient } from "convex/browser"
let convexClient: ConvexHttpClient | null = null;
export const getConvexClient = ()=>{
    if(convexClient) return convexClient;
    return convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
}
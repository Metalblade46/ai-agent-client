import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listChats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if(!identity)
      throw new Error("You must be authenticated to list chats");
    const chats = await ctx.db.query("chats").withIndex("by_user",q=>q.eq("userId",identity.subject)).order("desc").collect();
    return chats;
  },
});
export const createChat = mutation({
  args: {title: v.string()},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if(!identity)
      throw new Error("You must be authenticated to create a chat");
    const chatId = await ctx.db.insert("chats",{
      userId: identity.subject,
      title: args.title,
      createdAt: Date.now()
    });
    return chatId;
  },
})

export const deleteChat = mutation({
  args: {id:v.id('chats')},
  handler: async (ctx,args)=>{
    const chat  = await ctx.db.get(args.id);
    if(!chat)
      throw new Error("Chat not found");
    const identity = await ctx.auth.getUserIdentity();
    if(!identity || identity.subject!== chat.userId)
      throw new Error("You must be authenticated as the owner of chat to delete the chat");
    //delete all messages from the chat
    const messages = await ctx.db.query('messages').withIndex('by_chat',q=>q.eq("chatId",args.id)).collect();
    await Promise.all(messages.map(message=>ctx.db.delete(message._id)));
    await ctx.db.delete(args.id);
  }
})
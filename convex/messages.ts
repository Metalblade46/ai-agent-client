import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const SHOW_COMMENTS = false;
export const listMessages = query({
  args: { chatId: v.id('chats') },
  async handler(ctx, args) {
    const messages = await ctx.db.query('messages').withIndex('by_chat', q => q.eq('chatId', args.chatId)).order('asc').collect();
    if (SHOW_COMMENTS) {
      console.log('Received Messages:',{
        chatId: args.chatId,
        count : messages.length,
      })
    }
    return messages
  },
});

export const storeMessage = mutation({
  args: { chatId: v.id('chats'), content: v.string(), role: v.union(v.literal('user'),v.literal('assistant')) },
  async handler(ctx, args) {
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) throw new Error('You must be authenticated to send a message');
    const messageId = await ctx.db.insert('messages',{
      createdAt: Date.now(),
      chatId: args.chatId,
      content: args.content.replace(/\n/g,"\\n").replace(/\\/g,"\\\\"),
      role: args.role
    });
    return messageId;
  },
})

export const getLastMessage = query({
  args: {chatId: v.id('chats')},
  async handler(ctx,args){
    const identity = await ctx.auth.getUserIdentity();
    if(!identity)
      throw new Error("Not authenticated");
    const chat = await ctx.db.get(args.chatId);
    if(!chat || chat.userId!= identity.subject)
      throw new Error("Not authorized");
    const message = await ctx.db.query('messages').withIndex('by_chat',q=>q.eq("chatId",args.chatId)).order('desc').first();
    return message;
  }
})
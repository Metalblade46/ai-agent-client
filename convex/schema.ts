import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chats: defineTable({
    createdAt: v.number(),
    title: v.string(),
    userId: v.string(),
  }).index('by_user',["userId"]),
  messages: defineTable({
    createdAt: v.number(),
    chatId: v.id('chats'),
    content: v.string(),
    role: v.union(v.literal('user'),v.literal('assistant'))
  }).index('by_chat',["chatId"]),
});
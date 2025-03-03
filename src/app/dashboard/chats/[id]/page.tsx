import React from 'react'
import { Id } from '../../../../../convex/_generated/dataModel'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { getConvexClient } from '@/lib/convex';
import { api } from '../../../../../convex/_generated/api';
import ChatInterface from '@/components/ChatInterface';

const page = async ({params}:{params: Promise<{id:Id<"chats">}>}) => {
  const chatId = (await params).id;
  const {userId} = await auth();
  if(!userId)
    redirect('/');
  try {
    const convexClient = getConvexClient()
  const messages = await convexClient.query(api.messages.listMessages,{chatId})
  return (
    <div className='flex-1 overflow-hidden'>
      <ChatInterface chatId = {chatId} initialMessages = {messages}/>
    </div>
  )
  } catch (error) {
    console.error('Error Loading chat', error);
    redirect('/');
  }
  
}

export default page
import React, { use } from 'react'
import { Doc, Id } from '../../convex/_generated/dataModel'
import { usePathname, useRouter } from 'next/navigation'
import { NavigationContext } from '@/lib/NavigationProvider';
import { TrashIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

const ChatRow = ({chat,onDelete}: {chat: Doc<"chats">, onDelete: (id: Id<"chats">) => Promise<void>}) => {
    const router = useRouter();
    const pathName = usePathname()
    const {closeMobileNav} = use(NavigationContext)
    const handleclick = ()=>{
        router.push(`/dashboard/chats/${chat._id}`)
        closeMobileNav()
    }
    function handleDelete(e: React.MouseEvent<SVGElement, MouseEvent>): void {
        e.stopPropagation()
        onDelete(chat._id)
    }
    const getTimeDiff =(d1:Date,d2:Date)=>{
        const diffTime = Math.abs(d2.getTime() - d1.getTime())
        const diffHours = Math.floor(diffTime/(1000*60*60))
        return diffHours<1 ? '<1 hour ago' : diffHours< 24 ? `${diffHours} hours ago`: `${Math.floor(diffHours/24)} day(s) ago`
    }

  return (
    <div className={cn('group w-full border border-gray-200/30 mx-1 p-3 shadow-lg rounded-lg cursor-pointer',pathName.includes(chat._id)? 'bg-blue-600 text-white': 'bg-white hover:bg-blue-200/50 text-gray-600')} onClick={handleclick}>
        <div className='flex justify-between items-center text-sm'>{chat.title}
        <TrashIcon className='text-transparent group-hover:text-red-400 hover:scale-150 transition-all ease-in duration-200 cursor-pointer' onClick={handleDelete}/>
        </div>
        <div className='text-xs mt-2 opacity-60'>{getTimeDiff(new Date(chat.createdAt),new Date())}</div>
    </div>
  )
}

export default ChatRow
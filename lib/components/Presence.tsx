"use client"
import { useEditorStore } from "@/app/store/useEditorStore"

export default function Presence(){

    const users = useEditorStore((state) => state.users);

    return(<>
    <div className="flex items-center gap-2 text-sm
                    text-zinc-300">
        <span>
            Online({users.length}): 
        </span>
        {users.map((user) => (
            <span key={user.id} style={{color: user.color}} className="font-medium text">
                {user.name} 
                {user.cursor && `(L:${user.cursor.line},C:${user.cursor.col})`}
            </span>
        ))}
    </div>
    </>)
}
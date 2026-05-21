"use client"
import { useEditorStore } from "@/app/store/useEditorStore"
import { socket } from "@/lib/socket"


export default function Editor(){
    const setLocalText = useEditorStore((state) => state.setLocalText);
    const text = useEditorStore((state) => state.text);

    const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget;

        const textUpToCursor = textarea.value.substring(0,textarea.selectionStart);
        
        const lines = textUpToCursor.split('\n');
        const line = lines.length;
        
        const col = lines[lines.length -1].length + 1;
        
        socket.emit('cursor-move',{line,col})
    }
    return(
        <>
        <div>
        <textarea value={text} onSelect={handleSelect} onChange={(e) => setLocalText(e.target.value)} className="border-4 min-w-screen my-4 p-5 min-h-screen bg-black text-light-300">

        </textarea>
        </div>
        </>
    )
}
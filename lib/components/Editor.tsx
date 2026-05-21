"use client"
import { useEditorStore } from "@/app/store/useEditorStore"


export default function Editor(){
    const setLocalText = useEditorStore((state) => state.setLocalText);
    const text = useEditorStore((state) => state.text);
    return(
        <>
        <div>
        <textarea value={text} onChange={(e) => setLocalText(e.target.value)} className="border-4 min-w-screen my-4 p-5 min-h-screen bg-black text-light-300">

        </textarea>
        </div>
        </>
    )
}
"use client"
import { useEditorStore } from "@/app/store/useEditorStore"


export default function Editor(){
    const setLocalText = useEditorStore((state) => state.setLocalText);
    const text = useEditorStore((state) => state.text);
    return(
        <>
        <div>
        <textarea value={text} onChange={(e) => setLocalText(e.target.value)} className="border min-w-screen min-h-screen bg-gray-900 text-light-300">

        </textarea>
        </div>
        </>
    )
}
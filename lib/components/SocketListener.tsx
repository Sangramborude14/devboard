"use client"

import { useEffect } from "react";
import { socket } from "../socket";
import { useEditorStore } from "@/app/store/useEditorStore";


export default function SocketListener() {

const setConnected = useEditorStore((state) => state.setConnected);
const setRemoteText = useEditorStore((state) => state.setRemoteText);

    useEffect(() => {
    socket.on('connect',() => setConnected(true));
    socket.on('disconnect',() => setConnected(false));

    socket.on('document-update',(newText) => {
        setRemoteText(newText);
    });

    socket.connect();

    return() => {
        socket.off('connect')
        socket.off('disconnect');
        socket.off('document-update');
        socket.disconnect();
    }
},[setConnected,setRemoteText]);

return null;
}
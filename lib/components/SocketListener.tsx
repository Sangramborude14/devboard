"use client"

import { useEffect } from "react";
import { socket } from "../socket";
import { useEditorStore } from "@/app/store/useEditorStore";


export default function SocketListener({roomId}: {roomId: string}) {

const setConnected = useEditorStore((state) => state.setConnected);
const setRemoteText = useEditorStore((state) => state.setRemoteText);
const setUsers = useEditorStore((state) => state.setUsers);
const updateUserCursor = useEditorStore((state) => state.updateUserCursor);

    useEffect(() => {
    socket.on('connect',() => {setConnected(true);
        socket.emit('join-room', roomId);
    });
    socket.on('room-users',(users) => {setUsers(users)})
    socket.on('disconnect',() => setConnected(false));

    socket.on('document-update',(newText) => {
        setRemoteText(newText);
    });

    socket.on('cursor-update',({userId,line,col}) => {updateUserCursor(userId,line,col)})

    socket.connect();

    return() => {
        socket.off('connect')
        socket.off('disconnect');
        socket.off('document-update');
        socket.off('room-users');
        socket.off('cursor-update');
        socket.disconnect();
    }
},[setConnected,setRemoteText,roomId,setUsers,updateUserCursor]);

return null;
}
import {create} from 'zustand';
import {socket} from '@/lib/socket';

interface EditorStore {
    text: string;
    isConnected: boolean;
    setConnected: (status: boolean) => void;
    setLocalText: (status: string) => void;
    setRemoteText: (status: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
    text: "",
    isConnected: false,
    setConnected:(status) =>  set({isConnected: status }),
    setLocalText: (newText) => {
        set({text: newText});
        socket.emit('document-update',newText); //emits typing to socket server
    },
    setRemoteText: (newText) => set({text: newText}),

}))


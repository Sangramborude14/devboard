import {create} from 'zustand';
import {socket} from '@/lib/socket';

interface User {
    id: string;
    name: string;
    color: string;
   cursor?: {line: number; col: number};

}

interface EditorStore {
    text: string;
    isConnected: boolean;
    users: User[];
    setConnected: (status: boolean) => void;
    setLocalText: (status: string) => void;
    setRemoteText: (status: string) => void;
    setUsers:(users: User[]) => void;
    updateUserCursor: (userId: string, line: number, col: number) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
    text: "",
    isConnected: false,
    users: [],
    setConnected:(status) =>  set({isConnected: status }),
    setLocalText: (newText) => {
        set({text: newText});
        socket.emit('document-update',newText); //emits typing to socket server
    },
    setRemoteText: (newText) => set({text: newText}),
    setUsers: (users) => set({users}),
    updateUserCursor: (userId,line,col) => set((state) => ({
        users: state.users.map((user) => user.id === userId ? {...user,cursor: {line,col}} : user)
    }))

}))


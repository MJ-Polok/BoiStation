import { io, type Socket } from 'socket.io-client';
import { getAuthToken } from '../../lib/auth';
import type { BackendConversation, BackendMessage } from './api';

type ServerToClientEvents = {
    'message:new': (payload: { conversation: BackendConversation; message: BackendMessage }) => void;
    'conversation:updated': (payload: { conversation: BackendConversation; message: BackendMessage }) => void;
};

type ClientToServerEvents = {
    'conversation:join': (conversationId: string) => void;
    'conversation:leave': (conversationId: string) => void;
};

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_ORIGIN || 'http://localhost:5001';

export const getMessageSocket = () => {
    if (!socket) {
        socket = io(socketUrl, {
            autoConnect: false,
            transports: ['websocket', 'polling'],
            auth: () => ({
                token: getAuthToken(),
            }),
        });
    }

    if (!socket.connected) {
        socket.connect();
    }

    return socket;
};

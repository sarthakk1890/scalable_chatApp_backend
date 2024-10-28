'use client'
import React, { useCallback, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
    children?: React.ReactNode;
}

interface ISocketContext {
    sendMessage: (msg: string) => void;
    messages: string[]
}

const SocketContext = React.createContext<ISocketContext | null>(null);

// Custom hook
export const useSocket = () => {
    const state = useContext(SocketContext);

    if (!state) {
        throw new Error('state is undefined');
    }

    return state;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);

    const sendMessage: ISocketContext["sendMessage"] = useCallback((msg: string) => {
        if (socket) {
            socket.emit('event:message', { message: msg });  // Emit message to the server
            console.log("Message sent: ", msg);
        } else {
            console.error('Socket is not connected');
        }
    }, [socket]);

    const onMessageRec = useCallback((msg: string) => {
        console.log('From server Mss Recieved', msg)
        const { message } = JSON.parse(msg) as { message: string };
        setMessages(prev => [...prev, message]);
    }, [])

    useEffect(() => {
        const _socket = io("http://localhost:8000");
        _socket.on('message', onMessageRec)
        setSocket(_socket);

        _socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        return () => {
            _socket.disconnect();
            _socket.off('message');
            setSocket(undefined);
            console.log('Disconnected from socket server');
        };
    }, []);

    return (
        <SocketContext.Provider value={{ sendMessage, messages }}>
            {children}
        </SocketContext.Provider>
    );
};

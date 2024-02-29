import {io, ManagerOptions, SocketOptions} from 'socket.io-client';

export const initUserSocket= async()=>{
    const options: Partial<ManagerOptions & SocketOptions> ={
        "forceNew": true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ["websocket"]
    }
    console.log("connecting to server");
    return io("http://localhost:3000",options)

}



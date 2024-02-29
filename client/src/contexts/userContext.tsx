import React, { createContext, useState } from 'react';

interface ContextProps {
    musername: string;
    setmUsername: React.Dispatch<React.SetStateAction<string>>;
}

const UserContext = createContext<ContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [musername, setmUsername] = useState<string>("");

    return (
        <UserContext.Provider value={{ musername, setmUsername }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;

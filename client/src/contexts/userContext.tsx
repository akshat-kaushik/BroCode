import React, { createContext, useState } from 'react';

export interface ContextProps {
    musername: string;
    setmUsername: React.Dispatch<React.SetStateAction<string>>;
    loggedIn: boolean
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    language: string;
    setLanguage: React.Dispatch<React.SetStateAction<string>>;
}

const UserContext = createContext<ContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [musername, setmUsername] = useState<string>("");
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [language, setLanguage] = useState<string>("");

    return (
        <UserContext.Provider value={{ musername, setmUsername, loggedIn, setLoggedIn,language,setLanguage }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;

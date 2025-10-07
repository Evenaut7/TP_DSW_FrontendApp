import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { UsuarioLocal, UserContextType } from './types'; 




const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userLocal, setUserLocal] = useState<UsuarioLocal | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(false);

    return (
        <UserContext.Provider value={{ userLocal, setUserLocal, isLoadingUser, setIsLoadingUser }}>
            {children}
        </UserContext.Provider>
    );
};
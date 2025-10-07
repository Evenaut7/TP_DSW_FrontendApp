import { createContext, useState } from 'react';
import type {  UserContextType, UsuarioLocal } from './types';


const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = (props: userProviderProps) => {
    const [userLocal, setUserLocal] = useState<UsuarioLocal | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(false);

    return (
        <UserContext.Provider value={{ userLocal, setUserLocal, isLoadingUser, setIsLoadingUser }}>
            {props.children}
        </UserContext.Provider>
    );
};




type userProviderProps = {
    children: React.ReactNode;
}


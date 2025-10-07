import { createContext, useContext } from 'react';
import type {  UserContextType } from './types'; 




const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider = ({ children }: { children: ReactNode }) => {
//     const [userLocal, setUserLocal] = useState<UsuarioLocal | null>(null);
//     const [isLoadingUser, setIsLoadingUser] = useState(false);

//     return (
//         <UserContext.Provider value={{ userLocal, setUserLocal, isLoadingUser, setIsLoadingUser }}>
//             {children}
//         </UserContext.Provider>
//     );
// };

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser debe ser usado dentro de un UserProvider');
    }
    return context;
};
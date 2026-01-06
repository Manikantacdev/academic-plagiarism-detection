import { createContext, useContext } from 'react';

export interface UserInfo {
    name: string;
    email: string;
}

const UserContext = createContext<UserInfo | null>(null);

export const useUser = () => useContext(UserContext);

export { UserContext };

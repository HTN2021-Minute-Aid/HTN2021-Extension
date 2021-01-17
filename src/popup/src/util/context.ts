import React from 'react';

export interface IUserContext {
  userId: string|undefined;
  setUserId: React.Dispatch<React.SetStateAction<string>>|undefined;
  loggedIn: boolean|undefined;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>|undefined;
}


export const UserContext = React.createContext<IUserContext>({
  userId: undefined,
  setUserId: undefined,
  loggedIn: undefined,
  setLoggedIn: undefined,
});
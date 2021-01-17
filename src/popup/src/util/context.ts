import React from 'react';
import {Transcript} from '../../../common/types';

export interface IUserContext {
  userId: string|undefined;
  setUserId: React.Dispatch<React.SetStateAction<string>>|undefined;
  token: string|undefined;
  setToken: React.Dispatch<React.SetStateAction<string>>|undefined;
}


export const userContext = React.createContext<IUserContext>({
  userId: undefined,
  token: undefined,
  setUserId: undefined,
  setToken: undefined,
});
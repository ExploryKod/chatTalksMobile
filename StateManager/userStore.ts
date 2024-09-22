import {create} from 'zustand';
import * as Keychain from 'react-native-keychain';

interface LoggedState {
  token: string;
  username: string;
  admin: string;
  userId: string;
  setToken: (logged: string) => void;
  setUsername: (username: string) => void;
  setAdminStatus: (admin: string) => void;
  setUserId: (userId: string) => void;
  removeAdminStatus: () => void;
  removeToken: () => void;
  removeUsername: () => void;
}

export const useLoggedStore = create<LoggedState>(set => {
  let token = '';
  let username = '';
  let admin = '';
  let userId = '';

  (async () => {
    const tokenCredentials = await Keychain.getGenericPassword({
      service: 'token',
    });
    const usernameCredentials = await Keychain.getGenericPassword({
      service: 'username',
    });
    const adminCredentials = await Keychain.getGenericPassword({
      service: 'admin',
    });
    const userIdCredentials = await Keychain.getGenericPassword({
      service: 'userId',
    });
    if (tokenCredentials) {
      token = tokenCredentials.password;
    }
    if (usernameCredentials) {
      username = usernameCredentials.password;
    }
    if (adminCredentials) {
      admin = adminCredentials.password;
    }
    if (userIdCredentials) {
      userId = userIdCredentials.password;
    }
    set({token, username, admin, userId});
  })();

  return {
    token,
    username,
    admin,
    userId,
    setToken: async (token: string) => {
      await Keychain.setGenericPassword('myToken', token, {service: 'token'});
      set({token: token});
    },
    removeToken: async () => {
      await Keychain.resetGenericPassword({service: 'token'});
      set({token: ''});
    },
    setUsername: async (username: string) => {
      await Keychain.setGenericPassword('myUsername', username, {
        service: 'username',
      });
      set({username: username});
    },
    removeUsername: async () => {
      await Keychain.resetGenericPassword({service: 'username'});
      set({username: ''});
    },
    setAdminStatus: async (admin: string) => {
      await Keychain.setGenericPassword('myAdmin', admin, {service: 'admin'});
      set({admin: admin});
    },
    removeAdminStatus: async () => {
      await Keychain.resetGenericPassword({service: 'admin'});
    },
    setUserId: async (userId: string) => {
      await Keychain.setGenericPassword('myUserId', userId, {
        service: 'userId',
      });
    },
  };
});

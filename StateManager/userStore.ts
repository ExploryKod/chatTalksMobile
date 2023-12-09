import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';

interface LoggedState {
    token: string;
    username: string;
    admin: string;
    setToken: (logged: string) => void;
    setUsername: (username: string) => void;
    setAdminStatus: (admin: string) => void;
    removeAdminStatus: () => void;
    removeToken: () => void;
    removeUsername: () => void;
}

export const useLoggedStore = create<LoggedState>((set) => {
    let token = '';
    let username = '';
    let admin = '';

    (async () => {
        const tokenCredentials = await Keychain.getGenericPassword({ service: 'token' });
        const usernameCredentials = await Keychain.getGenericPassword({ service: 'username' });
        const adminCredentials = await Keychain.getGenericPassword({ service: 'admin' });
        if (tokenCredentials) {
            token = tokenCredentials.password;
        }
        if (usernameCredentials) {
            username = usernameCredentials.password;
        }
        if (adminCredentials) {
            admin = adminCredentials.password;
        }
        set({ token, username, admin });
    })();

    return {
        token,
        username,
        admin,
        setToken: async (token: string) => {
            await Keychain.setGenericPassword('myUsername', token, { service: 'token' });
            set({ token: token });
        },
        removeToken: async () => {
            await Keychain.resetGenericPassword({ service: 'token' });
            set({ token: '' });
        },
        setUsername: async (username: string) => {
            await Keychain.setGenericPassword('myUsername', username, { service: 'username' });
            set({ username: username });
        },
        removeUsername: async () => {
            await Keychain.resetGenericPassword({ service: 'username' });
            set({ username: '' });
        },
        setAdminStatus: async (admin: string) => {
            await Keychain.setGenericPassword('myUsername', admin, { service: 'admin' });
            set({ admin: admin });
        },
        removeAdminStatus: async () => {
            await Keychain.resetGenericPassword({ service: 'admin' });
        }
    };
});

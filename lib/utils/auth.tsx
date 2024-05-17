import * as React from "react";

export interface AuthContext {
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (username: string) => void;
    logout: () => void;
    user: string | null;
}

const AuthContext = React.createContext<AuthContext | null>(null);

const key = "tanstack.auth.user";

function getStoredUser() {
    return localStorage.getItem(key);
}

function setStoredUser(user: string | null) {
    if (user) {
        localStorage.setItem(key, user);
    } else {
        localStorage.removeItem(key);
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<string | null>(getStoredUser());
    const isAuthenticated = !!user;
    const isAdmin = false; // TODO change

    const logout = React.useCallback(() => {
        setStoredUser(null);
        setUser(null);
    }, []);

    const login = React.useCallback((username: string) => {
        setStoredUser(username);
        setUser(username);
    }, []);

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, isAdmin, user, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// handling visibility depending on the auth status of the user
// eslint-disable-next-line react-refresh/only-export-components
export enum Visibility {
    Always,
    OnlyUsers,
    OnlyAdmins,
}

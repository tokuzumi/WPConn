"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    username: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password?: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password?: string) => {
        try {
            // If password is provided, try real login
            if (password) {
                // Import api dynamically to avoid circular dependencies if any, or just use global
                const { api } = await import("@/services/api");
                const user = await api.login(username, password);

                // Map API user to Context user
                const contextUser: User = { username: user.email }; // Using email as username
                setUser(contextUser);
                localStorage.setItem("user", JSON.stringify(contextUser));
                router.push("/dashboard");
            } else {
                // Fallback for dev/mock (legacy)
                const newUser = { username };
                setUser(newUser);
                localStorage.setItem("user", JSON.stringify(newUser));
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

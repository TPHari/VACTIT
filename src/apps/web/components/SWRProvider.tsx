'use client';

import { SWRConfig, Cache } from 'swr';
import { ReactNode, useRef } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

//  Internal Next.js API routes (handled by Next.js, not backend)
const INTERNAL_ROUTES = ['/api/user', '/api/auth'];

// Global fetcher - distinguishes between internal Next.js routes and external backend API
const fetcher = async (url: string) => {
    const isInternalRoute = INTERNAL_ROUTES.some(route => url.startsWith(route));

    if (isInternalRoute) {
        const res = await fetch(url, { credentials: 'include' });
        if (!res.ok) throw new Error(`Failed to fetch ${url}`);
        return res.json();
    }

    const res = await fetch(`${API_BASE_URL}${url}`, { credentials: 'include' });
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    return res.json();
};

interface SWRProviderProps {
    children: ReactNode;
}

/**
 * Global SWR Provider with PERSISTENT cache
 * - Cache persists across page navigations
 * - User data fetched once and reused everywhere
 */
export default function SWRProvider({ children }: SWRProviderProps) {
    // ✅ FIX: Use ref to keep the same Map instance across re-renders
    const cacheRef = useRef<Map<string, any>>(new Map());

    return (
        <SWRConfig
            value={{
                fetcher,
                revalidateOnFocus: false,
                revalidateOnReconnect: false,
                revalidateIfStale: false, // ✅ Don't revalidate stale data automatically
                dedupingInterval: 300000, // 5 minutes - much longer deduping
                keepPreviousData: true,
                // ✅ FIX: Use stable ref instead of creating new Map each time
                provider: () => cacheRef.current,
            }}
        >
            {children}
        </SWRConfig>
    );
}

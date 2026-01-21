'use client';

import { useEffect } from 'react';
import { startKeepAlive } from '../lib/keep-alive';

/**
 * Provider component that initializes keep-alive mechanism.
 * This prevents Render free-tier from sleeping.
 */
export default function KeepAliveProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        startKeepAlive();
    }, []);

    return <>{children}</>;
}

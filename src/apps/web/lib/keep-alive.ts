'use client';

/**
 * Keep-Alive utility to prevent Render free-tier cold starts.
 * Pings the backend /health endpoint every 10 minutes while the browser tab is active.
 * This keeps the server warm and reduces navigation latency.
 */

const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes
const HEALTH_ENDPOINT = process.env.NEXT_PUBLIC_API_URL + '/health';

let intervalId: NodeJS.Timeout | null = null;
let isRunning = false;

async function pingHealth() {
    try {
        const response = await fetch(HEALTH_ENDPOINT, {
            method: 'GET',
            cache: 'no-store',
        });
        if (response.ok) {
            console.log('[KeepAlive] Backend ping successful');
        }
    } catch (error) {
        // Silently fail - this is just a keep-alive ping
        console.log('[KeepAlive] Backend ping failed (may be cold starting)');
    }
}

function handleVisibilityChange() {
    if (document.hidden) {
        // Tab is hidden - stop pinging to save resources
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            console.log('[KeepAlive] Paused (tab hidden)');
        }
    } else {
        // Tab is visible - resume pinging
        if (!intervalId && isRunning) {
            pingHealth(); // Immediate ping when tab becomes visible
            intervalId = setInterval(pingHealth, PING_INTERVAL);
            console.log('[KeepAlive] Resumed (tab visible)');
        }
    }
}

export function startKeepAlive() {
    // Only run in production and in browser
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV !== 'production') {
        console.log('[KeepAlive] Skipped (development mode)');
        return;
    }
    if (isRunning) return;

    isRunning = true;

    // Initial ping
    pingHealth();

    // Setup interval
    intervalId = setInterval(pingHealth, PING_INTERVAL);

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    console.log('[KeepAlive] Started - pinging every 10 minutes');
}

export function stopKeepAlive() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    isRunning = false;
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    console.log('[KeepAlive] Stopped');
}

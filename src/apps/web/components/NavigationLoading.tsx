'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Top loading bar component that shows during navigation.
 * Similar to YouTube/GitHub loading indicator.
 */
export default function NavigationLoading() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Reset loading when route changes
        setIsLoading(false);
        setProgress(0);
    }, [pathname, searchParams]);

    useEffect(() => {
        let progressInterval: NodeJS.Timeout;

        const handleStart = () => {
            setIsLoading(true);
            setProgress(10);

            // Simulate progress
            progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + Math.random() * 10;
                });
            }, 200);
        };

        const handleComplete = () => {
            setProgress(100);
            setTimeout(() => {
                setIsLoading(false);
                setProgress(0);
            }, 200);
        };

        // Listen for link clicks to start loading
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');

            if (anchor && anchor.href && !anchor.target && !anchor.download) {
                const url = new URL(anchor.href, window.location.origin);

                // Only show loading for internal navigation
                if (url.origin === window.location.origin && url.pathname !== pathname) {
                    handleStart();
                }
            }
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
            if (progressInterval) clearInterval(progressInterval);
        };
    }, [pathname]);

    if (!isLoading) return null;

    return (
        <div className="navigation-loading">
            <div
                className="navigation-loading__bar"
                style={{ width: `${progress}%` }}
            />
            <style jsx>{`
        .navigation-loading {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          z-index: 9999;
          background: transparent;
        }
        .navigation-loading__bar {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
          transition: width 0.2s ease-out;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
      `}</style>
        </div>
    );
}

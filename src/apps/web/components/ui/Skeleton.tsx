'use client';

// Skeleton components for loading states
// These provide instant visual feedback while data loads

export function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <div className={`animate-pulse rounded-2xl bg-slate-100 ${className}`}>
            <div className="h-full w-full" />
        </div>
    );
}

export function SkeletonText({ width = 'w-full', height = 'h-4' }: { width?: string; height?: string }) {
    return <div className={`animate-pulse rounded bg-slate-200 ${width} ${height}`} />;
}

export function SkeletonCircle({ size = 'w-12 h-12' }: { size?: string }) {
    return <div className={`animate-pulse rounded-full bg-slate-200 ${size}`} />;
}

// Result page skeleton
export function ResultPageSkeleton() {
    return (
        <div className="flex min-h-screen bg-brand-bg">
            <div className="flex flex-1 flex-col">
                <div className="flex flex-col px-4 pb-6 pt-3 lg:px-6 gap-4">
                    {/* Top row skeleton */}
                    <div className="flex gap-4">
                        {/* Score card skeleton */}
                        <div className="w-[580px] flex-shrink-0">
                            <SkeletonCard className="h-[320px]" />
                        </div>
                        {/* Subject cards skeleton */}
                        <div className="flex gap-2 flex-1">
                            {[1, 2, 3, 4].map((i) => (
                                <SkeletonCard key={i} className="flex-1 h-[320px]" />
                            ))}
                        </div>
                    </div>

                    {/* Bottom row skeleton */}
                    <div className="flex gap-4">
                        <div className="w-[800px] flex-shrink-0">
                            <SkeletonCard className="h-[400px]" />
                        </div>
                        <div className="flex-1">
                            <SkeletonCard className="h-[400px]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Exam list skeleton
export function ExamListSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((group) => (
                <div key={group} className="space-y-3">
                    <SkeletonText width="w-32" height="h-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((card) => (
                            <SkeletonCard key={card} className="h-[180px]" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Exam page skeleton
export function ExamPageSkeleton() {
    return (
        <div className="flex min-h-screen">
            {/* Main content */}
            <div className="flex-1 p-4">
                <SkeletonCard className="h-[600px]" />
            </div>
            {/* Sidebar */}
            <div className="w-64 p-4 border-l">
                <SkeletonText width="w-full" height="h-8" />
                <div className="mt-4 grid grid-cols-5 gap-2">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <SkeletonCircle key={i} size="w-8 h-8" />
                    ))}
                </div>
            </div>
        </div>
    );
}

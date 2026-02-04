'use client';

import useSWR from 'swr';

// Default SWR config for optimal performance
// Note: Global fetcher is defined in SWRProvider.tsx
export const swrConfig = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 30000, // Dedupe requests within 30s
    keepPreviousData: true,  // Keep showing old data while fetching new
};

// ========== Custom Hooks ==========

// Hook for current user (uses internal Next.js API route)
export function useCurrentUser() {
    const { data, error, isLoading, mutate } = useSWR('/api/user', {
        ...swrConfig,
        dedupingInterval: 120000, // 2 min - user doesn't change often
    });

    return {
        user: data?.user,
        userId: data?.user?.user_id as string | undefined,
        isLoading,
        isError: error,
        mutate,
    };
}

// Hook for student trials list
export function useStudentTrials(studentId: string | undefined) {
    const { data, error, isLoading, mutate } = useSWR(
        studentId ? `/api/students/${studentId}/trials` : null,
        swrConfig
    );

    return {
        trials: data?.data || [],
        count: data?.count || 0,
        isLoading,
        isError: error,
        mutate,
    };
}

// Hook for trial details
export function useTrialDetails(trialId: string | undefined) {
    const { data, error, isLoading, mutate } = useSWR(
        trialId ? `/api/trials/${trialId}/details` : null,
        {
            ...swrConfig,
            dedupingInterval: 60000, // Trial details rarely change
        }
    );

    return {
        details: data?.data || null,
        isLoading,
        isError: error,
        mutate,
    };
}

// Hook for tests list
export function useTests(params?: {
    query?: string;
    category?: string;
    status?: string;
    userId?: string;
    page?: number;
    limit?: number;
}) {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.set('query', params.query);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.userId) searchParams.set('userId', params.userId);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const queryString = searchParams.toString();
    const url = `/api/tests${queryString ? `?${queryString}` : ''}`;

    const { data, error, isLoading, mutate } = useSWR(url, swrConfig);

    return {
        tests: data?.data || [],
        total: data?.total || 0,
        isLoading,
        isError: error,
        mutate,
    };
}

// Hook for exam pages
export function useExamPages(trialId: string | undefined) {
    const { data, error, isLoading, mutate } = useSWR(
        trialId ? `/api/exam/${trialId}/pages` : null,
        {
            ...swrConfig,
            revalidateOnFocus: false,
            dedupingInterval: 300000, // Exam pages rarely change (5 min)
        }
    );

    return {
        pages: data?.pages || [],
        isLoading,
        isError: error,
        mutate,
    };
}

// Hook for leaderboard
export function useLeaderboard() {
    const { data, error, isLoading, mutate } = useSWR('/api/leaderboard/latest', {
        ...swrConfig,
        dedupingInterval: 300000, // 5 minutes
        revalidateOnFocus: false,
    });

    return {
        leaderboard: data?.data || [],
        testInfo: data?.testInfo || null,
        isLoading,
        isError: error,
        mutate,
    };
}

// Hook for user stats
export function useUserStats() {
    const { data, error, isLoading, mutate } = useSWR('/api/user/stats', {
        ...swrConfig,
        dedupingInterval: 300000, // 5 minutes
        revalidateOnFocus: false,
    });

    return {
        stats: data?.stats || null, // API returns { ok: true, stats: ... }
        isLoading,
        isError: error,
        mutate,
    };
}

// ✅ NEW: Aggregated hook for Overview page
// Fetches leaderboard + stats in ONE request instead of 3
export function useOverviewData(userId: string | undefined) {
    const url = userId ? `/api/overview-data?userId=${userId}` : null;

    const { data, error, isLoading, mutate } = useSWR(url, {
        ...swrConfig,
        dedupingInterval: 60000, // 1 minute
        revalidateOnFocus: false,
    });

    return {
        leaderboard: data?.leaderboard || [],
        testInfo: data?.testInfo || null,
        stats: data?.stats || null,
        isLoading,
        isError: error,
        mutate,
    };
}


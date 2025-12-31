"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api-client";
import type { StudentTrialsRes, TrialDetails, TrialListItem } from "./_types";

export function useUserId() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/user");
        const data = await res.json();
        if (cancelled) return;

        if (data?.ok) setUser(data.user);
        else setError(data?.message || "Failed to load user");
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load user");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return { userId: user?.user_id as string | undefined, loading, error };
}

export function useTrials(userId?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trials, setTrials] = useState<TrialListItem[]>([]);
  const [selectedTrialId, setSelectedTrialId] = useState<string>("");

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.trials.getByStudent(userId);
        const data: StudentTrialsRes = res;
        if (cancelled) return;

        const list = (data?.data || []).slice().sort(
          (a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
        );

        setTrials(list);
        setSelectedTrialId(list[0]?.trial_id || "");
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load trials");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [userId]);

  const selectedTrial = useMemo(
    () => trials.find((t) => t.trial_id === selectedTrialId) ?? null,
    [trials, selectedTrialId],
  );

  return { trials, selectedTrial, selectedTrialId, setSelectedTrialId, loading, error };
}

export function useTrialDetails(trialId?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<TrialDetails | null>(null);

  useEffect(() => {
    if (!trialId) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.trials.getDetails(trialId);
        const data: TrialDetails | null = res?.data ?? null;

        if (!cancelled) setDetails(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load trial details");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [trialId]);

  return { details, loading, error };
}

import { useEffect, useState } from "react";
import { api } from "./api";

interface ChallengeData {
  challenge: string;
  response: string;
  daysLeft: number;
}

export function useChallenge(groupId?: string) {
  const [data, setData] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        const params = groupId ? `?groupId=${groupId}` : "";
        const res = await api.get(`/challenge${params}`);
        setData(res?.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch challenge");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [groupId]);

  return { data, loading, error };
}
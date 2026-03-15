import { useEffect, useState } from "react";
import { api } from "./api";

interface ChallengeData {
  challenge: string;
  response: string;
  daysLeft: number;
}

export function useChallenge() {
  const [data, setData] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        const res = await api.get("/challenge");
        setData(res?.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch challenge");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, []);

  return { data, loading, error };
}
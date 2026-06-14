import { useEffect, useState } from "react";
import { api } from "./api";

interface Group {
  challenge: string;
  response: string;
  daysLeft: number;
}

export async function createGroup() {
    try {
        await api.post("/groups")
      } 
    catch (err) {
        console.error(err);
      } 
    finally {
      }
}

export function fetchGroups() {
  const [data, setData] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const res = await api.get("/groups");
        setData(res?.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch challenge");
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, []);

  return { data, loading, error };
}
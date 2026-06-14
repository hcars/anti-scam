import { useEffect, useState } from "react";
import { api } from "./api";

export interface Group {
  group_id: number;
  owner_id: number;
  group_name: string;
}

export interface Challenge {
  challenge: string;
  response: string;
  daysLeft: number;
}

export async function createGroup(groupName: string) {
    try {
        const res = await api.post("/groups", { group_name: groupName });
        return res?.data?.group;
      } 
    catch (err) {
        console.error(err);
        throw err;
      } 
}

export function fetchGroups() {
  const [data, setData] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupsList = async () => {
      try {
        setLoading(true);
        const res = await api.get("/groups");
        setData(res?.data?.groups || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch groups");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupsList();
  }, []);

  return { data, loading, error };
}
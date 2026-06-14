import { useLoaderData } from "react-router-dom";
import { Shield, AlertTriangle } from "lucide-react";
import type { LoaderFunctionArgs } from "react-router-dom";
import { api } from "@/lib/api";
import type { Challenge } from "@/lib/groups";
import { CallResponseDisplay } from "./Dashboard";
import { CardContent } from "@/components/ui/card";

interface GroupCodeData {
  groupName: string;
  code: string;
}

export async function loader({ params }: LoaderFunctionArgs): Promise<Challenge> {
  try {
  const res = await api.get(`/challenge/?groupId=${params["id"]}`);
    // const groupCode = res.data.groups?.filter((group: Array<Object>) => group.group_id === params["id"]);

    return res.data;
  } catch {
    // Return placeholder until backend is ready
    return {
      groupName: "Your Family Group",
      code: "MAPLE-9234",
    };
  }
}

export default function GroupCode() {
  const { challenge, response} = useLoaderData() as Challenge;

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm text-center">
        {/* Branding */}
        <div className="flex justify-center mb-2">
          <Shield className="size-7 text-blue-600" />
        </div>
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-1">
          TrustCode
        </p>
        {/* <p className="text-slate-500 text-sm mb-8">{groupName}</p> */}

        {/* Code card */}
        <div className="bg-white rounded-2xl shadow-md px-6 py-10 mb-6">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-4 font-medium">
            Today's Code
          </p>
        <CardContent className="space-y-4">
            <CallResponseDisplay value={challenge} valueTitle="Challenge Word" loading={false}/>
            <CallResponseDisplay value={response} valueTitle="Response Word" loading={false}/>
          </CardContent>
        </div>

        {/* Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
          <div className="flex gap-2">
            <AlertTriangle className="size-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800 leading-relaxed">
              If someone calls claiming to be a family member, ask them for the TrustCode.
              If they can't provide it, <strong>hang up</strong> and call back on a number
              you already have saved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

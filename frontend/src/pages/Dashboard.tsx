import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Copy, Check, Clock, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

interface Group {
  id: string;
  name: string;
  code: string;
  daysUntilRotation: number;
}

const MOCK_GROUPS: Group[] = [
  {
    id: "grp_abc123",
    name: "Johnson Family",
    code: "MAPLE-9234",
    daysUntilRotation: 4,
  },
];

function GroupCard({ group }: { group: Group }) {
  const [copied, setCopied] = useState(false);
  const shareLink = `${window.location.origin}/group/${group.id}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{group.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Clock className="size-3" />
          Code rotates in {group.daysUntilRotation} day{group.daysUntilRotation !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Code display */}
        <div className="bg-slate-50 rounded-xl py-6 px-4 text-center border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-medium">
            Current Code
          </p>
          <div className="text-4xl font-bold font-mono tracking-widest text-slate-900">
            {group.code}
          </div>
        </div>

        {/* Share link */}
        <div>
          <p className="text-xs text-slate-500 mb-1.5 font-medium">Family link</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0 bg-muted rounded-md px-3 py-2 text-sm text-slate-600 truncate font-mono">
              {shareLink}
            </div>
            <Button size="icon-sm" variant="outline" onClick={handleCopy} title="Copy link">
              {copied ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
            <Button size="icon-sm" variant="outline" asChild title="Open link">
              <a href={shareLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UpgradeBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2 text-blue-800">
          <Sparkles className="size-4" />
          Upgrade to Pro for Multiple Groups
        </CardTitle>
        <CardDescription className="text-blue-700">
          Pro gives you unlimited family groups for just $4/month — perfect for managing
          groups for both sides of the family.
        </CardDescription>
      </CardHeader>
      <CardFooter className="gap-2">
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          Upgrade to Pro
        </Button>
        <Button size="sm" variant="ghost" className="text-blue-700" onClick={onDismiss}>
          Maybe later
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleNewGroup = () => {
    if (user?.plan === "free") {
      setShowUpgrade(true);
    }
    // Pro users would open a create-group flow here
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-blue-600" />
            <span className="font-bold text-lg tracking-tight">TrustCode</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 hidden sm:block">
              Hello, {user?.name?.split(" ")[0]}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your Family Groups</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Share the link below with your family members.
            </p>
          </div>
          <Button onClick={handleNewGroup} size="sm">
            + New Group
          </Button>
        </div>

        {/* Upgrade banner */}
        {showUpgrade && (
          <div className="mb-6">
            <UpgradeBanner onDismiss={() => setShowUpgrade(false)} />
          </div>
        )}

        {/* Groups */}
        <div className="grid sm:grid-cols-2 gap-4">
          {MOCK_GROUPS.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>

        {/* Plan badge */}
        <div className="mt-8 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-white border rounded-full px-3 py-1">
            <span
              className={`size-1.5 rounded-full ${user?.plan === "pro" ? "bg-blue-500" : "bg-slate-400"}`}
            />
            {user?.plan === "pro" ? "Pro plan" : "Free plan"} ·{" "}
            {user?.plan === "free" ? (
              <button
                onClick={() => setShowUpgrade(true)}
                className="text-blue-600 hover:underline"
              >
                Upgrade
              </button>
            ) : (
              "All features unlocked"
            )}
          </span>
        </div>
      </main>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Shield, UserPlus, Share2, PhoneCall, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { backendUrl, backendUrl } from "@/lib/api";

const steps = [
  {
    icon: UserPlus,
    title: "Create a Group",
    description:
      "Sign up and create a family group in under a minute. It's free, and you're in control.",
  },
  {
    icon: Share2,
    title: "Share the Link",
    description:
      "Send a simple link to your family members. No app download or account needed to view the code.",
  },
  {
    icon: PhoneCall,
    title: "Verify the Caller",
    description:
      "When a call feels suspicious, ask for the TrustCode. Can't provide it? Hang up and call back on a number you trust.",
  },
];

const freeFeatures = [
  "1 family group",
  "Rotating code every 7 days",
  "Unlimited family members",
  "No login needed for family",
];

const proFeatures = [
  "Multiple family groups",
  "Rotating code every 7 days",
  "Unlimited family members",
  "No login needed for family",
  "Custom rotation schedule",
  "Priority support",
];


export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-blue-600" />
            <span className="font-bold text-lg tracking-tight">TrustCode</span>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`${backendUrl}/auth/signin`}>Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to={`${backendUrl}/auth/signin`}>Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 rounded-full p-5">
              <Shield className="size-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5">
            Stop AI Voice Scams
            <br />
            Before They Start
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-8 max-w-xl mx-auto">
            AI can now clone anyone's voice — including your grandchildren's. TrustCode gives
            your family a shared secret word so you always know who's really calling.
          </p>
          <Button size="lg" className="text-base px-8 py-6 h-auto" asChild>
            <Link to="/register">Create Your Family Group</Link>
          </Button>
          <p className="text-sm text-slate-400 mt-3">Free to start. No credit card required.</p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-3">
            How TrustCode Works
          </h2>
          <p className="text-center text-slate-500 mb-14">
            Three simple steps to protect the people you love.
          </p>
          <div className="grid sm:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="bg-blue-600 text-white rounded-full size-11 flex items-center justify-center font-bold text-lg">
                    {i + 1}
                  </div>
                </div>
                <step.icon className="size-8 text-blue-400 mb-3" />
                <h3 className="font-semibold text-lg text-slate-800 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="py-16 px-4 bg-amber-50 border-y border-amber-100">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-amber-800 text-lg leading-relaxed">
            <span className="font-semibold">Scammers are using AI to clone voices</span> and
            call elderly relatives pretending to be a son, daughter, or grandchild in distress.
            A shared code costs nothing and could save thousands.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-3">
            Simple, Honest Pricing
          </h2>
          <p className="text-center text-slate-500 mb-14">
            No hidden fees. No complicated tiers. Just family protection.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Free */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Free</CardTitle>
                <div className="text-4xl font-bold text-slate-900 mt-1">
                  $0
                  <span className="text-base font-normal text-slate-400"> / forever</span>
                </div>
                <CardDescription>Perfect for one family</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {freeFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="size-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to="/register">Get Started Free</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Pro */}
            <Card className="border-blue-500 border-2 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Pro</CardTitle>
                <div className="text-4xl font-bold text-slate-900 mt-1">
                  $4
                  <span className="text-base font-normal text-slate-400"> / month</span>
                </div>
                <CardDescription>For larger or extended families</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {proFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="size-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50" asChild>
                  <Link to="/register">Start Free Trial</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-blue-500" />
            <span className="font-medium text-slate-600">TrustCode</span>
          </div>
          <p>© 2026 TrustCode. Keeping families safe.</p>
        </div>
      </footer>
    </div>
  );
}

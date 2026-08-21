import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/theme/AppThemeProvider";

const pricingTiers = [
  {
    name: "Rural Initiative",
    price: "₹0",
    description: "Designed to make digital education accessible in rural areas.",
    features: ["Offline-first Learning System", "Basic Study Materials", "Assignment Management", "Community Support"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Coaching Pro",
    price: "₹2,999",
    description: "Perfect for coaching centers needing AI and gamification.",
    features: ["AI Chatbot & Assistant", "Gamification & Achievements", "Quiz Management", "Student Progress Tracking", "Up to 500 Students"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Institution",
    price: "Custom",
    description: "Scale across schools and colleges with full control.",
    features: ["Multi-Tenancy Architecture", "Role-Based Access Control", "Custom Branding", "Dedicated Server & Support", "Unlimited Students"],
    cta: "Contact Sales",
    popular: false,
  },
];

export function PricingSection() {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <section className={`py-24 relative z-10 w-full ${isDark ? "bg-slate-950" : "bg-white"}`} id="pricing">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold mb-6 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Simple, transparent pricing
          </h2>
          <p className={`text-lg ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Choose the perfect plan for your team's needs. No hidden fees, ever.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {pricingTiers.map((tier) => (
            <div 
              key={tier.name}
              className={`relative rounded-3xl p-8 flex flex-col ${
                isDark 
                  ? `bg-slate-900 border ${tier.popular ? 'border-teal-500 shadow-lg shadow-teal-500/10' : 'border-slate-700'}` 
                  : `bg-white border ${tier.popular ? 'border-teal-500 shadow-lg shadow-teal-500/10' : 'border-slate-200 shadow-sm'}`
              }`}
            >
              {tier.popular && (
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  isDark ? "bg-teal-600 text-white" : "bg-teal-600 text-white"
                }`}>
                  Most Popular
                </div>
              )}
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className={`text-4xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{tier.price}</span>
                {tier.price !== "Custom" && <span className={isDark ? "text-slate-500" : "text-slate-500"}>/mo</span>}
              </div>
              <p className={`text-sm mb-8 ${isDark ? "text-slate-400" : "text-slate-600"}`}>{tier.description}</p>
              
              <ul className="flex-1 space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className={`flex items-center gap-3 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    <Check className={`h-4 w-4 shrink-0 text-teal-500`} />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={tier.popular ? "default" : "outline"} 
                className={`w-full ${
                  tier.popular 
                    ? (isDark ? 'bg-teal-600 hover:bg-teal-500 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white') 
                    : (isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-50 text-slate-700')
                }`}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
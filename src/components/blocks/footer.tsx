import RuralSparkLogo from "@/components/ui/RuralSparkLogo"
import { useTheme } from '@/theme/AppThemeProvider';
export function Footer() {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <footer className={`py-12 border-t relative z-10 w-full ${isDark ? "bg-slate-950 border-white/5" : "bg-white border-slate-200"}`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <RuralSparkLogo isDark={isDark} showSubtitle={false} className="scale-90 origin-left -ml-2" />
            </div>
            <p className={`text-sm max-w-xs ${isDark ? "text-zinc-500" : "text-slate-600"}`}>Empowering rural communities through innovative technology solutions and accessible education.</p>
          </div>
          
          <div>
            <h4 className={`font-medium mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Product</h4>
            <ul className={`space-y-2 text-sm ${isDark ? "text-zinc-500" : "text-slate-600"}`}>
              <li><a href="#features" className={isDark ? "hover:text-white transition-colors" : "hover:text-slate-900 transition-colors"}>Features</a></li>
              <li><a href="#pricing" className={isDark ? "hover:text-white transition-colors" : "hover:text-slate-900 transition-colors"}>Pricing</a></li>
              <li><a href="#" className={isDark ? "hover:text-white transition-colors" : "hover:text-slate-900 transition-colors"}>Case Studies</a></li>
              <li><a href="#" className={isDark ? "hover:text-white transition-colors" : "hover:text-slate-900 transition-colors"}>Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className={`font-medium mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Company</h4>
            <ul className={`space-y-2 text-sm ${isDark ? "text-zinc-500" : "text-slate-600"}`}>
              <li><a href="#" className={isDark ? "hover:text-white transition-colors" : "hover:text-slate-900 transition-colors"}>About Us</a></li>
              <li><a href="#" className={isDark ? "hover:text-white transition-colors" : "hover:text-slate-900 transition-colors"}>Careers</a></li>
              <li><a href="#" className={isDark ? "hover:text-white transition-colors" : "hover:text-slate-900 transition-colors"}>Blog</a></li>
              <li><a href="#contact" className={isDark ? "hover:text-white transition-colors" : "hover:text-slate-900 transition-colors"}>Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className={`font-medium mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Legal</h4>
            <ul className={`space-y-2 text-sm ${isDark ? "text-zinc-500" : "text-slate-600"}`}>
              <li><a href="#" className={isDark ? "hover:text-white transition-colors" : "hover:text-slate-900 transition-colors"}>Privacy Policy</a></li>
              <li><a href="#" className={isDark ? "hover:text-white transition-colors" : "hover:text-slate-900 transition-colors"}>Terms of Service</a></li>
              <li><a href="#" className={isDark ? "hover:text-white transition-colors" : "hover:text-slate-900 transition-colors"}>Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${isDark ? "border-white/10" : "border-slate-200"}`}>
          <p className={`text-sm ${isDark ? "text-zinc-500" : "text-slate-600"}`}>© {new Date().getFullYear()} RuralSpark. All rights reserved.</p>
          <div className={`flex items-center gap-4 text-sm font-medium ${isDark ? "text-zinc-500" : "text-slate-600"}`}>
            <a href="#" className={isDark ? "hover:text-white transition-colors" : "hover:text-slate-900 transition-colors"}>Twitter</a>
            <a href="#" className={isDark ? "hover:text-white transition-colors" : "hover:text-slate-900 transition-colors"}>LinkedIn</a>
            <a href="#" className={isDark ? "hover:text-white transition-colors" : "hover:text-slate-900 transition-colors"}>GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

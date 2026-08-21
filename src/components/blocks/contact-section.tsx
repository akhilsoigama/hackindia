import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react"
import { FormProvider, useForm } from "react-hook-form"
import RHFFormField from "../hook-form/RHFFormFiled"
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTheme } from '@/theme/AppThemeProvider';
import { sendContactMessage } from "@/action/contact";

export function ContactSection() {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  const contactFormSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters long"),
    lastName: z.string().min(2, "Last name must be at least 2 characters long"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters long").transform((value) => value.trim()),
  });

  const methods = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  const { handleSubmit, reset } = methods;
  
  const onSubmit = async (data: z.infer<typeof contactFormSchema>) => {
    try {
      const success = await sendContactMessage(data);
      if (success) {
        reset();
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <section
      id="contact"
      className={`relative overflow-hidden border-t py-24 ${isDark ? "border-white/10 bg-slate-950" : "border-slate-200 bg-slate-50"}`}
    >
      <div className="absolute inset-0">
        <div className={`absolute left-0 top-0 w-125 h-125 rounded-full blur-3xl ${isDark ? "bg-slate-500/10" : "bg-slate-200/50"}`} />
        <div className={`absolute bottom-0 right-0 w-125 h-125 rounded-full blur-3xl ${isDark ? "bg-slate-500/10" : "bg-slate-100/70"}`} />
        <div className={`absolute inset-0 ${isDark ? "bg-[radial-linear(circle_at_top,rgba(255,255,255,0.06),transparent_40%)]" : "bg-[radial-linear(circle_at_top,rgba(59,130,246,0.06),transparent_40%)]"}`} />
      </div>

      <div className="relative z-10 mx-auto grid max-w-screen-2xl gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        
        <div className="flex flex-col justify-center">      

          <h2 className={`max-w-xl text-4xl font-bold tracking-tight md:text-6xl ${isDark ? "text-white" : "text-slate-950/70"}`}>
            Empowering Rural Education Through AI
          </h2>

          <p className={`mt-6 max-w-xl text-lg leading-8 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
            Have questions about RuralSpark or want a live demo for your school,
            coaching center, or institution? Our team is here to help you bring
            modern digital education to every student — even offline.
          </p>

          <div className="mt-10 space-y-4">
            
            <div className={`group flex items-center gap-4 rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 ${isDark ? "border-white/10 bg-white/5 hover:border-slate-500/30 hover:bg-white/10" : "border-slate-200 bg-white hover:border-slate-200 hover:bg-slate-50 shadow-sm"}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isDark ? "bg-slate-500/10 text-slate-400" : "bg-slate-50 text-slate-600"}`}>
                <Mail className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className={`text-sm ${isDark ? "text-zinc-500" : "text-slate-500"}`}>Email us</p>
                <p className={isDark ? "text-white" : "text-slate-900"}>ruralsparklearning@gmail.com</p>
              </div>

              <ArrowUpRight className={`h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${isDark ? "text-zinc-600 group-hover:text-white" : "text-slate-400 group-hover:text-slate-900"}`} />
            </div>

            <div className={`group flex items-center gap-4 rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 ${isDark ? "border-white/10 bg-white/5 hover:border-slate-500/30 hover:bg-white/10" : "border-slate-200 bg-white hover:border-slate-200 hover:bg-slate-50 shadow-sm"}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isDark ? "bg-slate-500/10 text-slate-400" : "bg-slate-50 text-slate-600"}`}>
                <Phone className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className={`text-sm ${isDark ? "text-zinc-500" : "text-slate-500"}`}>Call us</p>
                <p className={isDark ? "text-white" : "text-slate-900"}>+91 95101 59304</p>
              </div>

              <ArrowUpRight className={`h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${isDark ? "text-zinc-600 group-hover:text-white" : "text-slate-400 group-hover:text-slate-900"}`} />
            </div>

            <div className={`group flex items-center gap-4 rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 ${isDark ? "border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/10" : "border-slate-200 bg-white hover:border-slate-200 hover:bg-slate-50 shadow-sm"}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isDark ? "bg-purple-500/10 text-purple-400" : "bg-amber-50 text-amber-600"}`}>
                <MapPin className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className={`text-sm ${isDark ? "text-zinc-500" : "text-slate-500"}`}>Location</p>
                <p className={isDark ? "text-white" : "text-slate-900"}>
                  Gujarat, India
                </p>
              </div>

              <ArrowUpRight className={`h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${isDark ? "text-zinc-600 group-hover:text-white" : "text-slate-400 group-hover:text-slate-900"}`} />
            </div>
          </div>
        </div>

        <div className="relative">
          
          <div className={`absolute inset-0 rounded-2xl blur-3xl ${isDark ? "bg-linear-to-br from-slate-500/20 via-transparent to-slate-500/20" : "bg-linear-to-br from-slate-200/40 via-transparent to-slate-100/50"}`} />

          <div className={`relative overflow-hidden rounded-2xl border p-8 shadow-2xl backdrop-blur-2xl md:p-10 ${isDark ? "border-white/10 bg-white/4 shadow-black/40" : "border-slate-200 bg-white shadow-slate-200/50"}`}>
            
            <div className={`absolute inset-x-0 top-0 h-px ${isDark ? "bg-linear-to-r from-transparent via-white/30 to-transparent" : "bg-linear-to-r from-transparent via-slate-200 to-transparent"}`} />

            <div className="mb-8">
              <h3 className={`text-2xl font-semibold ${isDark ? "text-white" : "text-slate-950"}`}>
                Send us a message
              </h3>

              <p className={`mt-2 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
                Fill out the form and our team will reach out shortly.
              </p>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <RHFFormField
                  name="firstName"
                  label="First Name"
                  placeholder="Enter your first name" required
                />
                <RHFFormField
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter your last name" required
                />
                <RHFFormField
                  name="email"
                  label="Email Address"
                  placeholder="Enter your email address" required
                />
                <RHFFormField
                  name="message"
                  label="Message"
                  placeholder="Tell us about your institution or requirements..." required
                  type="textarea"
        
                />
                <Button 
                  type="submit"
                  className={`group h-12 w-full rounded-xl transition-all duration-300 hover:scale-[1.02] ${isDark ? "bg-white text-black hover:bg-zinc-200" : "bg-slate-600 text-white hover:bg-slate-700"}`}
                >
                  Send Message
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </section>
  )
}
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useState } from "react";
import { LockOutlined, PersonOutline, Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "sonner";
import RHFFormField from "../../components/hook-form/RHFFormFiled";
import RHFCheckbox from "../../components/hook-form/RHFCheckbox";
import api, { endpoints } from "../../utils/axios";
import { useUser } from "../../atoms/userAtom";
import type { User } from "../../types/user";
import { useTheme } from "@/theme/AppThemeProvider";
import { ParticleButton } from "@/components/ui/particle-button";

const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

const defaultValues: LoginFormValues = {
  email: "",
  password: "",
  rememberMe: false,
};

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();
  const { mode } = useTheme();
  const isDark = mode === "dark";

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues,
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      const res = await api.post(endpoints.auth.signIn, data, {
        withCredentials: true,
      });

      if (res.data?.success) {
        // Extract token
        const authorizationHeader =
          (res.headers?.authorization as string | undefined) ||
          (res.headers?.Authorization as string | undefined) ||
          (res.headers?.['x-access-token'] as string | undefined);

        const headerToken = authorizationHeader?.startsWith('Bearer ')
          ? authorizationHeader.slice(7).trim()
          : authorizationHeader;

        const resolvedToken =
          res.data?.token ||
          res.data?.accessToken ||
          res.data?.data?.token ||
          res.data?.data?.accessToken ||
          headerToken;

        if (resolvedToken) {
          window.localStorage.setItem('lms:authToken', String(resolvedToken));
          window.localStorage.setItem('authToken', String(resolvedToken));
          window.localStorage.setItem('token', String(resolvedToken));
        }

        if (res.data?.user) {
          const userData = res.data.user as User;
          setUser(userData);
          window.localStorage.setItem('user', JSON.stringify(userData));
          
          const redirectPath = "/dashboard";
          toast.success("Login Successful! Redirecting...");
          
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 500);
        } else {
          throw new Error('No user data received');
        }
      } else {
        throw new Error(res.data?.message || 'Login failed');
      }

    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Login failed'
          : error instanceof Error
            ? error.message
            : 'Login failed';

      if (message.includes('credentials') || message.includes('authentication')) {
        toast.error('Invalid email or password');
      } else {
        toast.error(message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className={cn(
      "relative w-full h-screen flex transition-colors duration-300",
    )}>
      {/* Rest of your JSX remains same */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1582886986754-51997372b668?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0"
          srcSet="https://images.unsplash.com/photo-1582886986754-51997372b668?q=80&w=768&auto=format&fit=crop&ixlib=rb-4.1.0 768w, https://images.unsplash.com/photo-1582886986754-51997372b668?q=80&w=1280&auto=format&fit=crop&ixlib=rb-4.1.0 1280w, https://images.unsplash.com/photo-1582886986754-51997372b668?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0 2070w"
          sizes="100vw"
          fetchPriority="high"
          decoding="async"
          alt="Login background"
          className="w-full h-full object-cover"
        />
        <div className={cn(
          "absolute inset-0 transition-colors duration-300",
          isDark ? "" : "bg-white/30"
        )} />
      </div>

      <div className={cn(
        "hidden lg:block absolute inset-y-0 left-0 w-10/12 z-0 transition-colors duration-300",
        isDark 
          ? "bg-linear-to-r from-slate-950 via-slate-950/20 to-transparent" 
          : "bg-linear-to-r from-white via-white/80 to-transparent"
      )} />

      <div className="relative z-10 flex flex-1 justify-center lg:justify-start items-center p-6 lg:p-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "w-full max-w-md rounded-2xl space-y-6 lg:rounded-xl shadow-2xl p-6 lg:p-8 transition-all duration-300",
            isDark
              ? "bg-linear-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 backdrop-blur-lg border border-slate-700/50"
              : "bg-linear-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-lg border border-slate-200/50"
          )}
        >
          <h2
            className={`text-3xl text-center font-bold ${isDark ? "text-slate-100" : "text-slate-950/70"} flex items-center`}
          >
            E-learning Platform
          </h2>

          <p
            className={cn(
              "",
              isDark ? "text-slate-400" : "text-slate-600"
            )}
          >
            Please enter your details to continue
          </p>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
              <div className="space-y-6">
                <RHFFormField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  icon={<PersonOutline />}
                />

                <RHFFormField
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  required
                  icon={<LockOutlined />}
                  endAdornment={
                    <motion.button
                      type="button"
                      onClick={togglePasswordVisibility}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "p-1 focus:outline-none transition-colors",
                        isDark ? "text-slate-400 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </motion.button>
                  }
                />

                <RHFCheckbox
                  name="rememberMe"
                  label="Remember me"
                  size="small"
                />

                <ParticleButton
                  type="submit"
                  className={`px-4 w-full flex items-center justify-center py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                    isDark
                      ? "bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
                      : "bg-slate-800/80 text-white hover:bg-slate-800 shadow-sm"
                  }`}
                  successDuration={800}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </ParticleButton>
              </div>
            </form>
          </FormProvider>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
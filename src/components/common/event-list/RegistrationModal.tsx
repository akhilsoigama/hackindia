import React from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import RHFFormField from "../../hook-form/RHFFormFiled";

type RegistrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  event: any;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, event }) => {
  const methods = useForm({ mode: "onTouched" });
  const { handleSubmit, formState: { isSubmitting } } = methods;

  if (!isOpen) return null;

  const onSubmit = async (data: any) => {
    toast.success("Registration submitted successfully!");
    console.log(data)
    onClose();
  };

  const handlePayment = () => {
    toast.info("Redirecting to payment gateway...");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl p-0 animate-fade-in max-h-[90vh] flex flex-col">
        <div className="overflow-y-auto scrollbar-hide p-7 flex-1">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={22} />
        </button>
        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white text-center">Register for Event</h3>
        <div className="mb-4 text-center text-sm text-gray-500 dark:text-gray-300">
          <span className="font-semibold">{event?.eventTitle}</span>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <RHFFormField
              name="name"
              label="Name"
              required
              placeholder="Your Name"
              validation={{ required: "Name is required" }}
            />
            <RHFFormField
              name="email"
              label="Email"
              type="email"
              required
              placeholder="you@email.com"
              validation={{ required: "Email is required" }}
            />
            <RHFFormField
              name="mobile"
              label="Mobile"
              type="tel"
              required
              placeholder="Mobile Number"
              validation={{ required: "Mobile is required" }}
            />
            <RHFFormField
              name="time"
              label="Preferred Time"
              type="time"
              required
              placeholder="Select time"
              validation={{ required: "Time is required" }}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-5 w-5 text-gray-500 dark:text-white"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                </svg>
              }
            />
            {!event?.isFree && (
              <button
                type="button"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 font-semibold mt-2 transition"
                onClick={handlePayment}
                disabled={isSubmitting}
              >
                Pay ₹{event.eventFee || "0"}
              </button>
            )}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 font-semibold mt-2 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </button>
          </form>
        </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;

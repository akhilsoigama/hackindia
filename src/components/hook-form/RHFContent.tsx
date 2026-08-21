"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import RHFTiptapEditor from "./RHFTipTapEditor";
import { useTheme } from "@/theme/AppThemeProvider";
import { Translated } from "../common/translator/translator";

interface RHFContentFormFieldProps {
  name: string;
  label?: string | React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const RHFContentFormField: React.FC<RHFContentFormFieldProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  className = "",

}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const error = errors[name];

  return (
    <Box mb={5} className={className}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-semibold mb-3 transition-colors duration-200 ${isDark ? "text-slate-300" : "text-slate-800"}`}
        >
          {typeof label === "string" ? <Translated text={label} /> : label}
          {required && <span style={{ color: "red" }}> *</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={
          required
            ? {
              required: `${typeof label === "string" && label.trim() ? label : "This field"} is required`,
            }
            : undefined
        }
        render={({ field }) => (
          <div className={`rounded-lg ${isDark ? "bg-slate-950/70 border-slate-700" : "bg-white border-slate-200"} border`}>

            <RHFTiptapEditor
              value={field.value ?? ""}
              onChange={field.onChange}
              disabled={disabled}
            />
          </div>
        )}
      />

      {error && (
        <Typography
          color="error"
          variant="caption"
          sx={{ mt: 1, display: "block" }}
        >
          <Translated text={error.message as string} />
        </Typography>
      )}
    </Box>
  );
};

export default RHFContentFormField;

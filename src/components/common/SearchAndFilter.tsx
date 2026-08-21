// components/SearchAndFilter.tsx
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTheme } from '@/theme/AppThemeProvider';
import { FormProvider, useForm } from "react-hook-form";
import RHFFormField from "../hook-form/RHFFormFiled";
import RHFDropDown from "../hook-form/RHFDropDown";
import { Translated } from "./translator/translator";

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onReset: () => void;
  filterOptions: {
    status: { value: string; label: string }[];
  };
  placeholder?: string | React.ReactNode;
}

const SearchAndFilter = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onReset,
  filterOptions,
  placeholder = "Search...",
}: SearchAndFilterProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const formMethods = useForm<{ searchTerm: string }>({
    defaultValues: { searchTerm },
  });
  const { setValue, watch, getValues } = formMethods;
  const searchFieldName = "searchTerm";
  const isSyncingRef = useRef(false);

  useEffect(() => {
    const currentValue = getValues(searchFieldName) || "";
    if (searchTerm !== currentValue) {
      isSyncingRef.current = true;
      setValue(searchFieldName, searchTerm, {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [getValues, searchTerm, setValue]);

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (name && name !== searchFieldName) return;
      const nextValue = (values as { searchTerm?: string }).searchTerm ?? "";
      if (isSyncingRef.current) {
        isSyncingRef.current = false;
        return;
      }
      if (nextValue !== searchTerm) {
        onSearchChange(nextValue);
      }
    });

    return () => subscription.unsubscribe();
  }, [onSearchChange, searchTerm, watch]);

  return (
    <FormProvider {...formMethods}>
      <div
        className={`relative z-20 mb-6 rounded-2xl border p-4 shadow-sm backdrop-blur-sm md:p-6 ${isDark
            ? "border-slate-700/70 bg-slate-950/70 shadow-black/20"
            : "border-slate-200/70 bg-white shadow-slate-200/60"
          }`}
      >
        <div className="flex flex-col gap-4 md:flex-row ">
          <div className="min-w-0 md:flex-1">
            <RHFFormField
              name={searchFieldName}
              label={<Translated text="Search" />}
              type="text"
              placeholder={placeholder}
              className="mb-0"
              icon={
                <svg
                  className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-400"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />
          </div>

          <div className="min-w-0 md:w-55">
            <RHFDropDown
              name="statusFilterDesktop"
              label={<Translated text="Status" />}
              options={filterOptions.status}
              value={statusFilter}
              onChange={(event) =>
                onStatusFilterChange(String(event.target.value))
              }
            />
          </div>

          <div className="w-full md:w-auto">
            <label className="invisible block text-sm font-semibold mb-3 select-none">Reset</label>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={onReset}
              className={`inline-flex h-12.5 w-full md:w-auto items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors ${isDark
                  ? "border-slate-700 bg-slate-950/70 text-slate-100 hover:bg-slate-800"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>
                <Translated text="Reset" />
              </span>
            </motion.button>
          </div>
        </div>

        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-3 md:hidden"
          >
            <RHFDropDown
              name="statusFilterMobile"
              label={<Translated text="Status" />}
              options={filterOptions.status}
              value={statusFilter}
              onChange={(event) => onStatusFilterChange(String(event.target.value))}
            />

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onReset();
                setIsFiltersOpen(false);
              }}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-base transition-colors ${isDark
                  ? 'border-slate-700 bg-slate-950/70 text-slate-100 hover:bg-slate-800'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span><Translated text="Reset Filters" /></span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </FormProvider>
  );
};

export default SearchAndFilter;

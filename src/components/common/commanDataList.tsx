import {
  useMemo,
  useState,
  useCallback,
  ReactNode,
  memo,
  useRef,
  useEffect,
  lazy,
  Suspense,
  ComponentType,
} from "react";
import {
  FaEdit,
  FaEye,
  FaTrash,
  FaSearch,
  FaTimes,
  FaPlus,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import {
  Box,
  Card,
  Typography,
  useTheme as useMuiTheme,
  useMediaQuery,
  Container,
  Skeleton,
  Chip,
} from "@mui/material";
import { useTheme } from "@/theme/AppThemeProvider";
import CommonTable from "./Table";
import ActionMenu, { type ActionMenuItem } from "./actionMenu";
import useTranslateWithAtom from "../../action/translate";
import { ParticleButton } from "../ui/particle-button";
import RHFFormField from "../hook-form/RHFFormFiled";
import { useDebouncedValue } from "../../utils/performance";
import { useUser } from "../../atoms/userAtom";

const CommonModal = lazy(() => import("./ViewModel")) as ComponentType<any>;

interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => string | number);
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  width?: string | number;
}

type SearchFormValues = {
  search: string;
};

export type ModalField<T> = {
  label: string;
  key?: keyof T;
  type?: "text" | "textarea" | "custom" | "section";
  disabled?: boolean;
  render?: {
    bivarianceHack: (value: unknown, data: T) => ReactNode;
  }["bivarianceHack"];
  onChange?: (value: string, data: T) => T;
};

export type CommonDataListProps<
  T extends { id: string | number } = { id: string | number },
> = {
  data: T[];
  title: string | React.ReactNode;
  columns: TableColumn<T>[];
  subtitle?: string | React.ReactNode;
  createButtonText?: string | React.ReactNode;
  searchPlaceholder?: string | React.ReactNode;
  emptyMessage?: string | React.ReactNode;
  emptyDescription?: string | React.ReactNode;
  onEdit?: (item: T) => void;
  onDelete?: (id: T["id"]) => void;
  onCreate?: () => void;
  onView?: (item: T) => void;
  viewModalFields?: ModalField<T>[];
  isLoading?: boolean;
  icon?: ReactNode;
  enableSearch?: boolean;
  enableStatusFilter?: boolean;
  statusFilterKey?: keyof T;
  customFilters?: unknown;
  getActionMenuItems?: (
    item: T,
    handlers: {
      view: () => void;
      edit: () => void;
      delete: () => void;
    },
  ) => ActionMenuItem[];
  stats?: Array<{
    title: string;
    value: string | number;
    icon?: ReactNode;
    color?: string;
  }>;
};

const CommonDataList = <T extends { id: string | number }>({
  data,
  title,
  columns,
  subtitle = "Manage and organize items",
  createButtonText = "Create New",
  searchPlaceholder = "Search...",
  emptyMessage = "No items found",
  emptyDescription = "Get started by creating your first item",
  onEdit,
  onDelete,
  onCreate,
  onView,
  viewModalFields,
  isLoading = false,
  icon,
  statusFilterKey = "isActive" as keyof T,
  getActionMenuItems,
}: CommonDataListProps<T>) => {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const { user, isSuperAdmin } = useUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchFormMethods = useForm<SearchFormValues>({
    defaultValues: { search: "" },
  });
  const watchedSearchTerm = useWatch({
    control: searchFormMethods.control,
    name: "search",
    defaultValue: "",
  });
  const debouncedSearchTerm = useDebouncedValue(watchedSearchTerm ?? "", 250);

  useEffect(() => {
    const nextSearch = debouncedSearchTerm;
    setSearchTerm(nextSearch);
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item[statusFilterKey]) ||
        (statusFilter === "inactive" && !item[statusFilterKey]);

      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, statusFilter, statusFilterKey]);

  const totalPages = useMemo(
    () => Math.ceil(filteredData.length / itemsPerPage),
    [filteredData.length],
  );
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const handleView = useCallback(
    (item: T) => {
      setSelectedItem(item);
      setViewOpen(true);
      onView?.(item);
    },
    [onView],
  );

  const handleEdit = useCallback(
    (item: T) => {
      onEdit?.(item);
    },
    [onEdit],
  );

  const handleDelete = useCallback(
    (id: T["id"]) => {
      onDelete?.(id);
    },
    [onDelete],
  );

  const handleCreate = useCallback(() => {
    onCreate?.();
  }, [onCreate]);

  const getCreatorId = useCallback((item: T): number | null => {
    const row = item as Record<string, unknown>;
    const candidateKeys = [
      "createdBy",
      "created_by",
      "createdById",
      "created_by_id",
      "userId",
      "user_id",
      "ownerId",
      "owner_id",
    ];

    for (const key of candidateKeys) {
      const value = row[key];
      if (typeof value === "number" && Number.isFinite(value)) return value;
      if (
        typeof value === "string" &&
        value.trim() !== "" &&
        !Number.isNaN(Number(value))
      )
        return Number(value);
      if (value && typeof value === "object") {
        const nestedId = (value as Record<string, unknown>).id;
        if (typeof nestedId === "number" && Number.isFinite(nestedId))
          return nestedId;
        if (
          typeof nestedId === "string" &&
          nestedId.trim() !== "" &&
          !Number.isNaN(Number(nestedId))
        )
          return Number(nestedId);
      }
    }
    return null;
  }, []);

  const canManageItem = useCallback(
    (item: T) => {
      if (isSuperAdmin) return true;

      const currentUserId = Number(user?.id);
      if (!Number.isFinite(currentUserId) || currentUserId <= 0) return false;

      const creatorId = getCreatorId(item);
      if (creatorId !== null) return creatorId === currentUserId;

      const row = item as Record<string, unknown>;
      const rowInstituteIdRaw = row.instituteId ?? row.institute_id;
      const rowInstituteId =
        typeof rowInstituteIdRaw === "string"
          ? Number(rowInstituteIdRaw)
          : rowInstituteIdRaw;
      const userInstituteIdRaw = user?.instituteId ?? user?.data?.instituteId;
      const userInstituteId =
        typeof userInstituteIdRaw === "string"
          ? Number(userInstituteIdRaw)
          : userInstituteIdRaw;

      if (
        (user?.userType === "institute" || user?.authType === "institute") &&
        typeof rowInstituteId === "number" &&
        Number.isFinite(rowInstituteId) &&
        typeof userInstituteId === "number" &&
        Number.isFinite(userInstituteId)
      ) {
        return rowInstituteId === userInstituteId;
      }

      return false;
    },
    [getCreatorId, isSuperAdmin, user],
  );

  const Translated = memo(({ text }: { text: unknown }) => {
    const { translateText, currentLanguage } = useTranslateWithAtom();
    const textStr = text === undefined || text === null ? "" : String(text);
    const [translated, setTranslated] = useState<string>(textStr);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
      let mounted = true;
      const currentText =
        text === undefined || text === null ? "" : String(text);

      const doTranslate = async () => {
        if (!currentText.trim()) {
          if (mounted) setTranslated(currentText);
          return;
        }
        const cacheKey = `${currentLanguage}_${currentText}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached && mounted) {
          setTranslated(cached);
          return;
        }
        try {
          const result = await translateText(currentText);
          if (mounted && result) {
            setTranslated(result);
            sessionStorage.setItem(cacheKey, result);
          }
        } catch (err) {
          console.error("Translation failed:", err);
          if (mounted) setTranslated(currentText);
        }
      };

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(doTranslate, 50);
      return () => {
        mounted = false;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, [text, currentLanguage, translateText]);

    return <span translate="no">{translated}</span>;
  });

  Translated.displayName = "Translated";

  const enhancedColumns = useMemo((): TableColumn<T>[] => {
    const hasCustomActionColumn = columns.some((col) => {
      const header =
        typeof col.header === "string" ? col.header.trim().toLowerCase() : "";
      return header === "action" || header === "actions";
    });

    if (hasCustomActionColumn) return columns;

    const actionColumn: TableColumn<T> = {
      header: "Actions",
      accessor: "id" as keyof T,
      width: 100,
      render: (item: T) => {
        const canManage = canManageItem(item);
        return (
          <ActionMenu
            data={item}
            items={
              getActionMenuItems?.(item, {
                view: () => handleView(item),
                edit: () => {
                  if (canManage) handleEdit(item);
                },
                delete: () => {
                  if (canManage) handleDelete(item.id);
                },
              }) ?? [
                {
                  label: "View Details",
                  onClick: () => handleView(item),
                  icon: <FaEye size={12} />,
                  variant: "default",
                },
                ...(canManage
                  ? [
                      {
                        label: "Edit",
                        onClick: () => handleEdit(item),
                        icon: <FaEdit size={12} />,
                        variant: "warning" as const,
                      },
                      {
                        label: "Delete",
                        onClick: () => handleDelete(item.id),
                        icon: <FaTrash size={12} />,
                        variant: "danger" as const,
                      },
                    ]
                  : []),
              ]
            }
          />
        );
      },
    };
    return [...columns, actionColumn];
  }, [
    columns,
    handleView,
    handleEdit,
    handleDelete,
    canManageItem,
    getActionMenuItems,
  ]);

  const pageBg = isDark ? "#101324" : "#f9fafb";

  if (isLoading) {
    return (
      <Box sx={{ minHeight: "100vh", py: 2, background: pageBg }}>
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
          <Skeleton
            variant="rectangular"
            height={isMobile ? 80 : 100}
            sx={{ borderRadius: 2, mb: 2 }}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
              },
              gap: 1.5,
              mb: 2,
            }}
          >
            {[1, 2, 3].map((item) => (
              <Skeleton
                key={item}
                variant="rectangular"
                height={80}
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Box>
          <Skeleton
            variant="rectangular"
            height={300}
            sx={{ borderRadius: 2 }}
          />
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        py: { xs: 2, sm: 4, lg: 6 },
        fontFamily: "Poppins, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          fontFamily: "Poppins, sans-serif",
          width: "100%",
          mx: "auto",
          boxSizing: "border-box",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              mb: 3,
              width: "100%",
              backgroundColor: isDark ? "#020c1c" : "#ffffff",
              border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
              borderRadius: "0.75rem",
              p: { xs: 2.5, sm: 4 },
              boxShadow: isDark
                ? "0 1px 2px rgba(0, 0, 0, 0.2)"
                : "0 1px 2px rgba(0, 0, 0, 0.05)",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                mb: 3,
                gap: 2,
                width: "100%",
                minWidth: 0,
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1, width: "100%" }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1.5rem", sm: "1.8rem" },
                    color: isDark ? "#ffffff" : "#424242",
                    fontFamily: "Poppins, sans-serif",
                    mb: 0.5,
                    letterSpacing: "-0.5px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                  }}
                >
                  <Translated text={title} />
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    color: isDark ? "#9ca3af" : "#6b7280",
                    fontFamily: "Poppins, sans-serif",
                    lineHeight: 1.4,
                    whiteSpace: { xs: "normal", sm: "nowrap" },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                  }}
                >
                  <Translated text={subtitle} />
                </Typography>
              </Box>

              {onCreate && (
                <ParticleButton
                  onClick={onCreate}
                  successDuration={1000}
                  variant="default"
                  className={`px-4 flex justify-center items-center gap-3 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                    isDark
                      ? "bg-white text-slate-900 hover:bg-gray-100 shadow-sm"
                      : "bg-slate-800/80 text-white hover:bg-gray-800 shadow-sm"
                  }`}
                >
                  <FaPlus /> <Translated text={createButtonText} />
                </ParticleButton>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, sm: 3 },
                alignItems: { xs: "stretch", sm: "center" },
                width: "100%",
                minWidth: 0,
                boxSizing: "border-box",
              }}
            >
              <Box sx={{ position: "relative", flex: 1, minWidth: 0 }}>
                <FormProvider {...searchFormMethods}>
                  <RHFFormField
                    name="search"
                    label=""
                    placeholder={searchPlaceholder}
                    useMUI={true}
                    size="small"
                    icon={<FaSearch />}
                    endAdornment={
                      searchTerm ? (
                        <button
                          type="button"
                          onClick={() => {
                            searchFormMethods.setValue("search", "");
                            searchInputRef.current?.focus();
                          }}
                          className={`p-1 rounded transition-colors ${
                            isDark
                              ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                              : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          <FaTimes size={14} />
                        </button>
                      ) : undefined
                    }
                    sx={{
                      mb: 0,
                      "& .MuiInputBase-root": {
                        borderRadius: "0.5rem",
                        backgroundColor: isDark ? "#020c1c" : "#f9fafb",
                        color: isDark ? "#f3f4f6" : "#111827",
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: isDark ? "#6b7280" : "#9ca3af",
                        opacity: 1,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: isDark ? "#374151" : "#e5e7eb",
                      },
                      "& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: isDark ? "#4b5563" : "#d1d5db",
                        },
                      "& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: isDark ? "#4b5563" : "#9ca3af",
                        },
                      "& .MuiFormHelperText-root": { display: "none" },
                    }}
                    InputProps={{
                      inputRef: (el) => {
                        searchInputRef.current = el;
                      },
                    }}
                  />
                </FormProvider>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                {(["all", "active", "inactive"] as const).map((filter) => (
                  <motion.button
                    key={filter}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setStatusFilter(filter);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      statusFilter === filter
                        ? filter === "active"
                          ? isDark
                            ? "bg-green-900/30 text-green-400 border border-green-800"
                            : "bg-green-100 text-green-700 border border-green-200"
                          : filter === "inactive"
                            ? isDark
                              ? "bg-red-900/30 text-red-400 border border-red-800"
                              : "bg-red-100 text-red-700 border border-red-200"
                            : isDark
                              ? "bg-gray-700 text-white border border-gray-600"
                              : "bg-gray-900 text-white border border-gray-800"
                        : isDark
                          ? "bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600"
                          : "bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Translated
                      text={
                        filter === "all"
                          ? "All"
                          : filter === "active"
                            ? "Active"
                            : "Inactive"
                      }
                    />
                  </motion.button>
                ))}
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Active Filters */}
        {(searchTerm || statusFilter !== "all") && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                mb: 4,
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                p: 3,
                backgroundColor: isDark ? "#111827" : "#f9fafb",
                borderRadius: "0.75rem",
                border: `1px solid ${isDark ? "#374151" : "#f3f4f6"}`,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: isDark ? "#9ca3af" : "#6b7280",
                }}
              >
                <Translated text="Active Filters:" />
              </Typography>
              {searchTerm && (
                <Chip
                  label={`"${searchTerm}"`}
                  onDelete={() => setSearchTerm("")}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 34,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    backgroundColor: isDark ? "#374151" : "#e5e7eb",
                    borderColor: isDark ? "#4b5563" : "#d1d5db",
                    color: isDark ? "#f3f4f6" : "#374151",
                    "& .MuiChip-deleteIcon": {
                      fontSize: 16,
                      color: isDark ? "#9ca3af" : "#6b7280",
                    },
                  }}
                />
              )}
              {statusFilter !== "all" && (
                <Chip
                  label={<Translated text={statusFilter} />}
                  onDelete={() => setStatusFilter("all")}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 34,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    backgroundColor: isDark ? "#374151" : "#e5e7eb",
                    borderColor: isDark ? "#4b5563" : "#d1d5db",
                    color: isDark ? "#f3f4f6" : "#374151",
                    "& .MuiChip-deleteIcon": {
                      fontSize: 16,
                      color: isDark ? "#9ca3af" : "#6b7280",
                    },
                  }}
                />
              )}
            </Box>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {filteredData.length === 0 ? (
            <Card
              sx={{
                p: { xs: 6, sm: 8 },
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "300px",
                background: isDark ? "#111827" : "#ffffff",
                borderRadius: "0.75rem",
                boxShadow: "none",
                border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
              }}
            >
              <Box
                sx={{
                  fontSize: { xs: 48, sm: 56 },
                  color: isDark ? "#6b7280" : "#d1d5db",
                  mb: 3,
                  opacity: 0.5,
                }}
              >
                {icon}
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                  fontWeight: 600,
                  mb: 2,
                  color: isDark ? "#f3f4f6" : "#111827",
                }}
              >
                <Translated text={emptyMessage} />
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 4,
                  fontSize: "0.875rem",
                  maxWidth: "320px",
                  lineHeight: 1.5,
                  color: isDark ? "#9ca3af" : "#6b7280",
                }}
              >
                <Translated
                  text={
                    searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search terms or filters to find what you're looking for."
                      : emptyDescription
                  }
                />
              </Typography>
              {!(searchTerm || statusFilter !== "all") && onCreate && (
                <ParticleButton
                  onClick={handleCreate}
                  successDuration={1000}
                  variant="default"
                  className={`px-4 flex gap-3 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                    isDark
                      ? "bg-white text-slate-900 hover:bg-gray-100 shadow-sm"
                      : "bg-slate-800/80 text-white hover:bg-gray-800 shadow-sm"
                  }`}
                >
                  <FaPlus /> <Translated text={createButtonText} />
                </ParticleButton>
              )}
            </Card>
          ) : (
            <>
              <Box
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  overflowY: "visible",
                }}
              >
                <CommonTable<T>
                  data={paginatedData}
                  columns={enhancedColumns}
                  rowKey={(row: T) =>
                    row.id?.toString() || Math.random().toString()
                  }
                />
              </Box>

              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      mt: 6,
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      alignItems: { xs: "stretch", sm: "center" },
                      gap: { xs: 4, sm: 3 },
                      p: { xs: 3, sm: 4 },
                      backgroundColor: isDark ? "#111827" : "#f9fafb",
                      border: `1px solid ${isDark ? "#374151" : "#f3f4f6"}`,
                      borderRadius: "0.75rem",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        color: isDark ? "#9ca3af" : "#6b7280",
                        order: { xs: 3, sm: 0 },
                      }}
                    >
                      <Translated
                        text={`Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredData.length)} of ${filteredData.length}`}
                      />
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        flexWrap: "wrap",
                        justifyContent: "center",
                        width: { xs: "100%", sm: "auto" },
                        order: { xs: 0, sm: 1 },
                      }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? "text-gray-200 bg-gray-800 border border-gray-700 hover:bg-gray-700" : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"}`}
                      >
                        ← <Translated text="Prev" />
                      </motion.button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) pageNum = i + 1;
                            else if (currentPage <= 3) pageNum = i + 1;
                            else if (currentPage >= totalPages - 2)
                              pageNum = totalPages - 4 + i;
                            else pageNum = currentPage - 2 + i;

                            return (
                              <motion.button
                                key={pageNum}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                                  currentPage === pageNum
                                    ? isDark
                                      ? "bg-gray-700 text-white border border-gray-600"
                                      : "bg-gray-900 text-white border border-gray-800"
                                    : isDark
                                      ? "text-gray-400 hover:bg-gray-800 border border-transparent hover:border-gray-700"
                                      : "text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-300"
                                }`}
                              >
                                {pageNum}
                              </motion.button>
                            );
                          },
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? "text-gray-200 bg-gray-800 border border-gray-700 hover:bg-gray-700" : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"}`}
                      >
                        <Translated text="Next" /> →
                      </motion.button>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        color: isDark ? "#9ca3af" : "#6b7280",
                        order: { xs: 2, sm: 2 },
                      }}
                    >
                      <Translated text={`${itemsPerPage} per page`} />
                    </Typography>
                  </Box>
                </motion.div>
              )}
            </>
          )}
        </motion.div>

        {viewModalFields && selectedItem && (
          <Suspense fallback={null}>
            <CommonModal
              isOpen={viewOpen}
              onClose={() => setViewOpen(false)}
              title={<Translated text={`${title} Details`} />}
              data={selectedItem}
              size="sm"
              fields={viewModalFields}
              footerContent={
                <ParticleButton
                  onClick={() => setViewOpen(false)}
                  successDuration={1000}
                  variant="default"
                  className={`px-4 flex gap-3 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                    isDark
                      ? "bg-white text-slate-900 hover:bg-gray-100 shadow-sm"
                      : "bg-slate-800/80 text-white hover:bg-gray-800 shadow-sm"
                  }`}
                >
                  <Translated text={"Close"} />
                </ParticleButton>
              }
            />
          </Suspense>
        )}
      </Box>
    </Box>
  );
};

export default CommonDataList;

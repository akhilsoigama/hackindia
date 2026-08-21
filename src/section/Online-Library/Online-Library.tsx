import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Search,
  ExternalLink,
  AlertCircle,
  X,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";
import { useTheme } from "@/theme/AppThemeProvider";
import axiosInstance, { endpoints } from "@/utils/axios";
import { ParticleButton } from "@/components/ui/particle-button";
import SearchAndFilter from "@/components/common/SearchAndFilter";

const RURALSPARK_LOGO = "/ruralspark.png";

type ArchiveDoc = {
  identifier: string;
  title: string;
  creator?: string | string[];
  language?: string | string[];
  licenseurl?: string;
  collection?: string | string[];
};

type ArchiveResponse = {
  response: {
    numFound: number;
    start: number;
    docs: ArchiveDoc[];
  };
};

type ArchiveFile = {
  name: string;
  format?: string;
};

type ArchiveMetadata = {
  files: ArchiveFile[];
};

const API_BASE = endpoints.onlineLibrary.search;
const IMG_BASE = "https://archive.org/services/img/";
const DOWNLOAD_BASE = "https://archive.org/download/";

const COLLECTIONS: Record<string, string> = {
  ncert: "identifier:ncert*",
  hindi: "language:Hindi AND mediatype:texts AND NOT language:Urdu",
  gujarati: "language:Gujarati AND mediatype:texts AND NOT language:Urdu",
};

const COLLECTION_OPTIONS = [
  { value: "ncert", label: "NCERT" },
  { value: "hindi", label: "Hindi Books" },
  { value: "gujarati", label: "Gujarati Books" },
];

const card = (isDark: boolean) =>
  [
    "rounded-3xl border backdrop-blur-xl shadow-sm",
    isDark
      ? "border-white/10 bg-slate-900/80 shadow-black/20"
      : "border-slate-200/80 bg-white/90 shadow-slate-200/70",
  ].join(" ");

const tone = (isDark: boolean) =>
  isDark ? "text-slate-300" : "text-slate-600";
const titleTone = (isDark: boolean) =>
  isDark ? "text-white" : "text-slate-950";

const getCoverUrl = (identifier: string) => `${IMG_BASE}${identifier}`;
const getFileUrl = (identifier: string, filename: string) =>
  `${DOWNLOAD_BASE}${identifier}/${encodeURIComponent(filename)}`;

const getCreatorName = (creator?: string | string[]) => {
  if (!creator) return "Unknown Author";
  return Array.isArray(creator) ? creator[0] : creator;
};

const containsUrduScript = (text: string) =>
  /[\u0600-\u06FF\u0750-\u077F]/.test(text);

const isUrdu = (doc: ArchiveDoc) => {
  const langs = Array.isArray(doc.language)
    ? doc.language
    : doc.language
      ? [doc.language]
      : [];
  const hasUrduLang = langs.some((l) => l.toLowerCase().includes("urdu"));
  return hasUrduLang || containsUrduScript(doc.title);
};

// --- Copyright safety ---
// NCERT is our own verified/whitelisted source (NCERT explicitly allows
// free educational distribution of its textbooks), so it's always safe
// to show regardless of Archive.org's licenseurl metadata.
const isVerifiedNcert = (doc: ArchiveDoc) => doc.identifier.startsWith("ncert");

// For everything else (general Hindi/Gujarati collections), only show
// items Archive.org explicitly tags as public domain or Creative
// Commons licensed. No licenseurl, or an unrecognized/restrictive one,
// means we hide it — better to under-show than risk surfacing a
// copyrighted scan that isn't ours to redistribute.
const SAFE_LICENSE_PATTERNS = [
  "publicdomain",
  "creativecommons.org/publicdomain",
  "creativecommons.org/licenses",
];

const hasVerifiedOpenLicense = (doc: ArchiveDoc) => {
  if (!doc.licenseurl) return false;
  const url = doc.licenseurl.toLowerCase();
  return SAFE_LICENSE_PATTERNS.some((pattern) => url.includes(pattern));
};

const isCopyrightSafe = (doc: ArchiveDoc) =>
  isVerifiedNcert(doc) || hasVerifiedOpenLicense(doc);

const labelChapterFile = (name: string, index: number) => {
  const lower = name.toLowerCase();
  if (/an\.pdf$/.test(lower)) return "Answers";
  if (/ps\.pdf$/.test(lower)) return "Preface";
  if (/\d+\.pdf$/.test(lower)) return `Chapter ${index + 1}`;
  return name.replace(/\.pdf$/i, "");
};

// Fallback image shown whenever a book cover fails to load
const FallbackImage = ({ isDark }: { isDark: boolean }) => (
  <div
    className={[
      "flex h-full w-full flex-col items-center justify-center p-8",
      isDark ? "bg-slate-800/50" : "bg-slate-100/50",
    ].join(" ")}
  >
    <img
      src={RURALSPARK_LOGO}
      alt="RuralSpark"
      className="h-20 w-20 object-contain opacity-70"
      onError={(e) => {
        e.currentTarget.style.display = "none";
        const parent = e.currentTarget.parentElement;
        if (parent) {
          const icon = document.createElement("div");
          icon.className =
            "flex h-full w-full items-center justify-center text-slate-400";
          icon.innerHTML = `<svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`;
          parent.appendChild(icon);
        }
      }}
    />
    <span className={["mt-2 text-xs font-medium", tone(isDark)].join(" ")}>
      RuralSpark
    </span>
  </div>
);

const BookCover = ({
  identifier,
  title,
  isDark,
  onError,
}: {
  identifier: string;
  title: string;
  isDark: boolean;
  onError: (id: string) => void;
}) => {
  const [imgError, setImgError] = useState(false);
  const coverUrl = getCoverUrl(identifier);

  const handleError = () => {
    setImgError(true);
    onError(identifier);
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const aspect = img.naturalWidth / img.naturalHeight;
    if (aspect > 0.85) {
      handleError();
    }
  };

  if (imgError) {
    return <FallbackImage isDark={isDark} />;
  }

  return (
    <img
      src={coverUrl}
      alt={title}
      className="h-full w-full object-cover"
      loading="lazy"
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};

export default function OnlineLibrary() {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const [collection, setCollection] = useState(
    searchParams.get("collection") ?? "",
  );
  const [page, setPage] = useState(
    Number(searchParams.get("page") ?? "1") || 1,
  );
  const [limit, setLimit] = useState(
    Number(searchParams.get("limit") ?? "12") || 12,
  );
  const [readError, setReadError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 450);
    return () => clearTimeout(timer);
  }, [query]);

  const [chapterModalBook, setChapterModalBook] = useState<ArchiveDoc | null>(
    null,
  );
  const [chapterFiles, setChapterFiles] = useState<ArchiveFile[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [chapterSearch, setChapterSearch] = useState("");

  const catalogParams = useMemo(() => {
    const baseQuery = collection ? (COLLECTIONS[collection] ?? COLLECTIONS.ncert) : "identifier:*";
    const hasSearch = !!debouncedQuery.trim();
    const rows = hasSearch ? limit : 5000;
    const pageParam = hasSearch ? page : 1;
    const searchQuery = hasSearch
      ? `${baseQuery} AND (title:*${debouncedQuery.trim()}* OR creator:*${debouncedQuery.trim()}*)`
      : baseQuery;
    return {
      q: searchQuery,
      rows: rows,
      page: pageParam,
    };
  }, [collection, limit, page, debouncedQuery]);

  const fetcher = async ([url, params]: [
    string,
    typeof catalogParams,
  ]): Promise<ArchiveResponse> => {
    try {
      const response = await axiosInstance.get<ArchiveResponse>(url, {
        params,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          throw new Error(
            "Network error: Please check your internet connection",
          );
        }
        if (error.response?.status === 429) {
          throw new Error(
            "Too many requests: Please wait a moment before trying again",
          );
        }
        throw new Error(error.message || "Failed to fetch books");
      }
      throw error;
    }
  };

  const { data, error, isLoading } = useSWR<ArchiveResponse>(
    [API_BASE, catalogParams],
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateIfStale: true,
    },
  );

  useEffect(() => {
    const params: Record<string, string> = {};
    if (page > 1) params.page = String(page);
    if (limit !== 12) params.limit = String(limit);
    if (debouncedQuery.trim()) params.search = debouncedQuery.trim();
    if (collection) params.collection = collection;
    setSearchParams(params, { replace: true });
  }, [collection, limit, page, debouncedQuery, setSearchParams]);

  const trimmedQuery = debouncedQuery.trim().toLowerCase();
  const docs = (data?.response.docs ?? [])
    .filter((doc) => !failedImages.has(doc.identifier))
    .filter((doc) => !isUrdu(doc))
    .filter((doc) => isCopyrightSafe(doc))
    .filter((doc) => {
      if (!trimmedQuery) return true;
      const title = (doc.title ?? "").toLowerCase();
      const creatorArray = Array.isArray(doc.creator) ? doc.creator : doc.creator ? [doc.creator] : [];
      const creator = creatorArray.join(' ').toLowerCase();
      return title.includes(trimmedQuery) || creator.includes(trimmedQuery);
    });

  const totalCount = data?.response.numFound ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const hasNext = page < totalPages;
  const hasPrevious = page > 1;

  const catalogErrorMessage =
    error instanceof Error ? error.message : error ? String(error) : null;

  const handleImageError = (identifier: string) => {
    setFailedImages((prev) => new Set(prev).add(identifier));
  };

  const getMetadataUrl = (identifier: string) =>
    endpoints.onlineLibrary.metadata(identifier);

  const handleReadBook = async (doc: ArchiveDoc) => {
    setReadError(null);
    setChapterModalBook(doc);
    setChaptersLoading(true);
    setChapterFiles([]);
    setChapterSearch("");

    try {
      const res = await axiosInstance.get<ArchiveMetadata>(
        getMetadataUrl(doc.identifier),
      );

      const pdfFiles = res.data.files
        .filter((f) => f.name.toLowerCase().endsWith(".pdf"))
        .sort((a, b) => a.name.localeCompare(b.name));

      if (pdfFiles.length === 0) {
        setReadError("No readable PDF found for this book.");
        setChapterModalBook(null);
        return;
      }

      setChapterFiles(pdfFiles);
    } catch (err) {
      setReadError(
        "Failed to load chapters: " +
        (err instanceof Error ? err.message : "Unknown error"),
      );
      setChapterModalBook(null);
    } finally {
      setChaptersLoading(false);
    }
  };

  const handleOpenChapter = (filename: string) => {
    if (!chapterModalBook) return;
    window.open(
      getFileUrl(chapterModalBook.identifier, filename),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const closeChapterModal = () => {
    setChapterModalBook(null);
    setChapterFiles([]);
    setChapterSearch("");
  };

  const handleResetFilters = () => {
    setPage(1);
    setLimit(12);
    setQuery("");
    setDebouncedQuery("");
    setCollection("ncert");
  };

  const filteredChapterFiles = chapterFiles.filter((file, idx) => {
    const label = labelChapterFile(file.name, idx).toLowerCase();
    const filename = file.name.toLowerCase();
    const term = chapterSearch.toLowerCase();
    return label.includes(term) || filename.includes(term);
  });

  return (
    <div
      className={
        isDark
          ? "min-h-screen bg-slate-950 text-slate-100"
          : "min-h-screen bg-slate-50 text-slate-900"
      }
    >
      <div aria-hidden="true"/>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        {readError && (
          <div
            className={[
              "flex items-center gap-3 rounded-2xl border p-4 text-sm",
              isDark
                ? "border-amber-500/20 bg-amber-500/10 text-amber-200"
                : "border-amber-300 bg-amber-50 text-amber-700",
            ].join(" ")}
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{readError}</span>
            <ParticleButton
              type="button"
              onClick={() => setReadError(null)}
              className="ml-auto text-sm underline hover:no-underline bg-transparent shadow-none p-0"
            >
              Dismiss
            </ParticleButton>
          </div>
        )}

        <SearchAndFilter
          searchTerm={query}
          onSearchChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          statusFilter={collection}
          onStatusFilterChange={(value) => {
            setCollection(value);
            setPage(1);
          }}
          onReset={handleResetFilters}
          filterOptions={{ status: COLLECTION_OPTIONS }}
          placeholder="Search Books Name or Author ..."
        />

        <div
          className={[
            "flex flex-wrap items-center justify-between gap-3 rounded-3xl border px-4 py-3 text-sm",
            isDark
              ? "border-white/10 bg-slate-900/80"
              : "border-slate-200/70 bg-white/80",
          ].join(" ")}
        >
          <ParticleButton
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={!hasPrevious || isLoading}
            className={[
              "inline-flex items-center gap-2 rounded-2xl px-3 py-2 font-medium transition",
              !hasPrevious || isLoading
                ? "cursor-not-allowed opacity-50"
                : isDark
                  ? "bg-white/5 text-slate-100 hover:bg-white/10"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200",
            ].join(" ")}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </ParticleButton>

          <div className="flex items-center gap-3">
            <div className={tone(isDark)}>
              Page {page} of {totalPages} ({totalCount.toLocaleString()} results)
            </div>

            <select
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.target.value));
                setPage(1);
              }}
              className={[
                "h-9 rounded-xl border px-3 text-xs outline-none transition",
                isDark
                  ? "border-white/10 bg-slate-950 text-slate-100 focus:border-cyan-400/40"
                  : "border-slate-200 bg-white text-slate-900 focus:border-cyan-300",
              ].join(" ")}
            >
              {[12, 24, 36, 48].map((option) => (
                <option key={option} value={option}>
                  {option} per page
                </option>
              ))}
            </select>
          </div>

          <ParticleButton
            type="button"
            onClick={() => setPage((current) => current + 1)}
            disabled={!hasNext || isLoading}
            className={[
              "inline-flex items-center gap-2 rounded-2xl px-3 py-2 font-medium transition",
              !hasNext || isLoading
                ? "cursor-not-allowed opacity-50"
                : isDark
                  ? "bg-white/5 text-slate-100 hover:bg-white/10"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200",
            ].join(" ")}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </ParticleButton>
        </div>

        {isLoading && (
          <div
            className={[
              card(isDark),
              "flex min-h-80 items-center justify-center",
            ].join(" ")}
          >
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-300">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading books...
            </div>
          </div>
        )}

        {catalogErrorMessage && (
          <div
            className={[
              card(isDark),
              "border-rose-300/30 bg-rose-50 p-5 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Error loading books</p>
                <p className="text-sm opacity-80">{catalogErrorMessage}</p>
                <ParticleButton
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-2 inline-flex items-center gap-2 rounded-lg border border-current px-3 py-1 text-sm hover:bg-white/10 bg-transparent shadow-none"
                >
                  <RefreshCw className="h-3 w-3" />
                  Retry
                </ParticleButton>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !catalogErrorMessage && docs.length === 0 && (
          <div className={[card(isDark), "p-8 text-center"].join(" ")}>
            <BookOpen className="mx-auto h-10 w-10 text-cyan-500" />
            <h2
              className={["mt-4 text-lg font-semibold", titleTone(isDark)].join(
                " ",
              )}
            >
              No books found
            </h2>
            <p className={["mt-2 text-sm", tone(isDark)].join(" ")}>
              Try adjusting your search or collection. Some results are
              hidden because we couldn't verify their licensing.
            </p>
          </div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {docs.map((doc, index) => {
            const creator = getCreatorName(doc.creator);
            const language = Array.isArray(doc.language)
              ? doc.language[0]
              : doc.language;

            return (
              <motion.article
                key={doc.identifier}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className={[
                  card(isDark),
                  "overflow-hidden border transition-all",
                  isDark
                    ? "border-white/10 hover:border-white/20"
                    : "border-slate-200 hover:border-slate-300",
                ].join(" ")}
              >
                <div className="relative aspect-3/4 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <BookCover
                    identifier={doc.identifier}
                    title={doc.title}
                    isDark={isDark}
                    onError={handleImageError}
                  />
                </div>

                <div className="p-4 space-y-3">
                  <h3
                    className={[
                      "text-sm font-semibold line-clamp-2",
                      titleTone(isDark),
                    ].join(" ")}
                  >
                    {doc.title}
                  </h3>

                  <div
                    className={["text-sm line-clamp-1", tone(isDark)].join(" ")}
                  >
                    {creator}
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {language && (
                      <span
                        className={[
                          "inline-block rounded-full px-2 py-0.5 font-medium",
                          isDark
                            ? "bg-cyan-500/10 text-cyan-300"
                            : "bg-cyan-50 text-cyan-700",
                        ].join(" ")}
                      >
                        {language}
                      </span>
                    )}
                    <span
                      className={[
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
                        isDark
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-emerald-50 text-emerald-700",
                      ].join(" ")}
                      title={
                        isVerifiedNcert(doc)
                          ? "NCERT — verified free educational source"
                          : "Public domain / Creative Commons licensed"
                      }
                    >
                      <ShieldCheck className="h-3 w-3" />
                      {isVerifiedNcert(doc) ? "NCERT" : "Open license"}
                    </span>
                  </div>

                  <ParticleButton
                    type="button"
                    className={`px-4 w-full flex gap-3 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${isDark
                        ? "bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
                        : "bg-slate-800/80 text-white hover:bg-slate-800 shadow-sm"
                      }`}
                    onClick={() => handleReadBook(doc)}
                    disabled={
                      chaptersLoading &&
                      chapterModalBook?.identifier === doc.identifier
                    }
                  >
                    {chaptersLoading &&
                      chapterModalBook?.identifier === doc.identifier ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                    Read
                  </ParticleButton>
                </div>
              </motion.article>
            );
          })}
        </motion.section>

        {/* Attribution / copyright disclaimer footer */}
        <div
          className={[
            card(isDark),
            "p-4 text-xs leading-relaxed",
            tone(isDark),
          ].join(" ")}
        >
          Content is sourced from{" "}
          <a
            href="https://ncert.nic.in"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            NCERT
          </a>{" "}
          and{" "}
          <a
            href="https://archive.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Internet Archive
          </a>
          . NCERT textbooks are freely distributable for educational use;
          all other titles shown are limited to items explicitly marked
          public domain or Creative Commons licensed. All rights remain
          with original publishers/authors. If you believe any content
          here infringes your copyright, please contact us and it will be
          removed.
        </div>
      </div>

      {/* Chapter picker modal */}
      <AnimatePresence>
        {chapterModalBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={closeChapterModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className={[
                card(isDark),
                "w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col",
              ].join(" ")}
            >
              <div className="flex items-center justify-between border-b p-4 border-slate-200 dark:border-white/10">
                <h3
                  className={[
                    "text-sm font-semibold line-clamp-1",
                    titleTone(isDark),
                  ].join(" ")}
                >
                  {chapterModalBook.title}
                </h3>
                <ParticleButton
                  type="button"
                  onClick={closeChapterModal}
                  className={[
                    "bg-transparent shadow-none p-1",
                    isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-500 hover:text-slate-900",
                  ].join(" ")}
                >
                  <X className="h-5 w-5" />
                </ParticleButton>
              </div>

              {!chaptersLoading && chapterFiles.length > 0 && (
                <div className="border-b p-3 border-slate-200 dark:border-white/10">
                  <div className="relative">
                    <Search
                      className={[
                        "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2",
                        tone(isDark),
                      ].join(" ")}
                    />
                    <input
                      value={chapterSearch}
                      onChange={(e) => setChapterSearch(e.target.value)}
                      placeholder="Search chapter or filename..."
                      className={[
                        "h-10 w-full rounded-xl border pl-9 pr-3 text-sm outline-none transition",
                        isDark
                          ? "border-white/10 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/40"
                          : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-300",
                      ].join(" ")}
                    />
                  </div>
                </div>
              )}

              <div className="overflow-y-auto p-3 space-y-1.5">
                {chaptersLoading ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500 dark:text-slate-300">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading chapters...
                  </div>
                ) : filteredChapterFiles.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    No matching chapter found
                  </div>
                ) : (
                  filteredChapterFiles.map((file) => {
                    const originalIdx = chapterFiles.findIndex(
                      (f) => f.name === file.name,
                    );
                    return (
                      <ParticleButton
                        key={file.name}
                        type="button"
                        onClick={() => handleOpenChapter(file.name)}
                        className={[
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition bg-transparent shadow-none justify-start",
                          isDark
                            ? "hover:bg-white/5 text-slate-200"
                            : "hover:bg-slate-50 text-slate-800",
                        ].join(" ")}
                      >
                        <FileText className="h-4 w-4 shrink-0 text-cyan-500" />
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium">
                            {labelChapterFile(file.name, originalIdx)}
                          </span>
                          <span
                            className={["text-xs truncate", tone(isDark)].join(
                              " ",
                            )}
                          >
                            {file.name}
                          </span>
                        </div>
                      </ParticleButton>
                    );
                  })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
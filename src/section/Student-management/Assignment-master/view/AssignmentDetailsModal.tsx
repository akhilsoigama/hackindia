import { ReactNode, useEffect, useState } from "react";
import { useTheme } from '@/theme/AppThemeProvider';import { IAssignmentItem } from "../../../../types/assignment";

type AssignmentWithCreatedAt = IAssignmentItem & {
    createdAt?: string | Date;
};

type AssignmentDetailsModalProps = {
    isOpen: boolean;
    assignment: IAssignmentItem | null;
    onClose: () => void;
    onEdit: (id: number) => void;
};

type InfoItemProps = {
    label: string;
    value: ReactNode;
    isDark: boolean;
};

type StatusBadgeProps = {
    isActive: boolean;
    isDark: boolean;
};

const InfoItem = ({ label, value, isDark }: InfoItemProps) => (
    <div>
        <p className={`mb-1 text-xs font-medium uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {label}
        </p>
        <p className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>{value || "-"}</p>
    </div>
);

const StatusBadge = ({ isActive, isDark }: StatusBadgeProps) => (
    <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            isActive
                ? isDark
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-emerald-100 text-emerald-700"
                : isDark
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-700"
        }`}
    >
        {isActive ? "Active" : "Inactive"}
    </span>
);

const formatDate = (date: Date | string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }

    return parsedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
};

const AssignmentDetailsModal = ({ isOpen, assignment, onClose, onEdit }: AssignmentDetailsModalProps) => {
    const { mode } = useTheme();
    const isDark = mode === "dark";
    const [isEntering, setIsEntering] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const animationFrame = window.requestAnimationFrame(() => {
                setIsEntering(true);
            });

            return () => {
                window.cancelAnimationFrame(animationFrame);
            };
        }

        setIsEntering(false);
        return undefined;
    }, [isOpen]);

    if (!isOpen || !assignment) {
        return null;
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity duration-300 ${
                isEntering ? "opacity-100" : "opacity-0"
            }`}
            onClick={onClose}
        >
            <div
                className={`max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border p-8 shadow-2xl transition-all duration-300 ${
                    isDark
                        ? "border-gray-700 bg-gray-900 text-gray-100"
                        : "border-gray-200 bg-white text-gray-900"
                } ${isEntering ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold">Assignment Details</h2>
                        <p className={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            View key metadata and description in a structured summary.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-lg transition active:scale-95 ${
                            isDark
                                ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        }`}
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
                    <InfoItem label="Title" value={assignment.assignmentTitle} isDark={isDark} />
                    <InfoItem label="Due Date" value={formatDate(assignment.dueDate)} isDark={isDark} />
                    <InfoItem label="Subject" value={assignment.subject} isDark={isDark} />
                    <InfoItem label="Marks" value={assignment.marks} isDark={isDark} />
                    <InfoItem label="Department" value={assignment.department?.departmentName ?? "-"} isDark={isDark} />
                    <InfoItem
                        label="Status"
                        value={<StatusBadge isActive={assignment.isActive} isDark={isDark} />}
                        isDark={isDark}
                    />
                    <InfoItem label="Faculty" value={assignment.faculty?.facultyName ?? "-"} isDark={isDark} />
                    <InfoItem
                        label="Created Date"
                        value={formatDate((assignment as AssignmentWithCreatedAt).createdAt ?? "")}
                        isDark={isDark}
                    />
                </div>

                <div className={`mt-6 border-t pt-5 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <p className={`mb-2 text-xs font-medium uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        Description
                    </p>
                    <p className={`whitespace-pre-line text-sm leading-relaxed ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                        {assignment.assignmentDescription || "No description available."}
                    </p>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition active:scale-95 ${
                            isDark
                                ? "border-gray-700 text-gray-200 hover:bg-gray-800"
                                : "border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => onEdit(assignment.id)}
                        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-95"
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignmentDetailsModal;
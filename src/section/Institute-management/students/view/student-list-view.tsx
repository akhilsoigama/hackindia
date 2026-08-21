import { useState, useEffect, useRef } from "react";
import { useRouter } from "../../../../hooks/useRouter";
import DeleteModal from "../../../../components/common/deleteModel";
import { useUser } from "../../../../atoms/userAtom";
import { IStudent } from "../../../../types/student";
import StudentList from "../student-list";
import { deleteStudent, useInstituteStudents } from "../../../../action/student";

const FacultyListView = () => {
    const router = useRouter();
    const { user, isLoading: userLoading } = useUser();

    const { students, studentsLoading, studentsMutate } = useInstituteStudents();
    const prevStudentsRef = useRef<IStudent[]>([]);

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        student: IStudent | null;
        isLoading: boolean;
    }>({
        isOpen: false,
        student: null,
        isLoading: false,
    });

    useEffect(() => {
        if (user?.userType === 'institute' && !studentsLoading) {
            studentsMutate();
        }
    }, [user, studentsLoading, studentsMutate]);

    useEffect(() => {
        if (students.length > 0) {
            prevStudentsRef.current = students;
        }
    }, [students]);

    const stableStudents = students.length > 0 ? students : prevStudentsRef.current;

    const handleEditStudent = (student: IStudent) => {
        router.push(`/dashboard/institute-management/student/${student.id}/edit?instituteId=${student.instituteId}`);
    };

    const handleDeleteStudent = (id: number) => {
        const studentDelete = stableStudents.find(f => f.id === id);
        if (!studentDelete) return;

        setDeleteModal({
            isOpen: true,
            student: studentDelete,
            isLoading: false,
        });
    };

    const handleConfirmDelete = async () => {
        if (!deleteModal.student) return;

        setDeleteModal(prev => ({ ...prev, isLoading: true }));

        try {
            const deleted = await deleteStudent(deleteModal.student.id);
            if (deleted) {
                await studentsMutate();
                setDeleteModal({
                    isOpen: false,
                    student: null,
                    isLoading: false,
                });
            }
        } catch {
            setDeleteModal(prev => ({ ...prev, isLoading: false }));
        }
    };

    const handleCloseModal = () => {
        if (!deleteModal.isLoading) {
            setDeleteModal({
                isOpen: false,
                student: null,
                isLoading: false,
            });
        }
    };

    const handleStudentCreate = () => {
        router.push('/dashboard/institute-management/student/new');
    };

    return (
        <>
            <StudentList
                students={stableStudents}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
                onCreate={handleStudentCreate}
                isLoading={studentsLoading || userLoading}
            />

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title="Delete Student"
                description="This will permanently delete the Student and remove all associated data. Are you sure you want to continue?"
                itemName={deleteModal.student?.studentName}
                isLoading={deleteModal.isLoading}
                confirmText="Delete Student"
                cancelText="Cancel"
            />
        </>
    );
};

export default FacultyListView;
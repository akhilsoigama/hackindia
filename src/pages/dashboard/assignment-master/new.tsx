import { useEffect } from "react";
import { AssignmentCreateView } from "../../../section/Student-management/Assignment-master/view";

export default function AssignmentCreatePage() {
    useEffect(() => {
        document.title = "Dashboard: Create New Assignment | Institute Management System";
    }, []);

    return <AssignmentCreateView/>
}
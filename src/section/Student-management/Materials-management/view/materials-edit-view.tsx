// src/components/materials/materials-new-edit-form.tsx
import { ILecture } from "../../../../types/material";

type MaterialNewEditFormProps = {
    currentData?: ILecture;
};

export default function MaterialNewEditForm({ currentData }: MaterialNewEditFormProps) {
    return <MaterialNewEditForm currentData={currentData}/>
}

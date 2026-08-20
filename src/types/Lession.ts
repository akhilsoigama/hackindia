export type Resource = {
    type: string;
    title: string;
    url: string;
}

export type Lesson = {
    title: string,
    subject: string,
    gradeLevel: string;
    duration?: string;
    objectives: string[];
    materials?: string[];
    introduction?: string;
    instruction?: string;
    practice?: string;
    conclusion?: string;
    assessment?: string;
    resources?: Resource[];
    standards?: string[];
    differentiation?: string;
    notes?: string;
    termsAccepted: boolean;
}
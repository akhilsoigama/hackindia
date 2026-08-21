export type IAssignmentItem = {
    id: number

    assignmentTitle: string
    assignmentDescription: string
    subject: string

    assignmentFile: string
    std: string
    instituteId: number

    facultyId: number
    faculty?: {
        id: number
        facultyName: string
    }
    dueDate: Date
    marks: number

    departmentId: number
    department?:{
        id: number
        departmentName: string
    }
    isActive: boolean

}

export type IcreateAssignment = {
    id: number

    assignmentTitle: string
    assignmentDescription: string
    subject: string

    assignmentFile: string | null
    std: string
    instituteId: number

    facultyId: number
    dueDate: string
    marks: number

    departmentId: number
    isActive: boolean

}

export type IupdateAssignment = {
    id: number

    assignmentTitle: string
    assignmentDescription: string
    subject: string

    assignmentFile: string | null
    std: string
    instituteId: number

    facultyId: number
    dueDate: string
    marks: number

    departmentId: number
    isActive: boolean

}
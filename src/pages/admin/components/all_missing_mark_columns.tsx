import { ColumnDef } from "@tanstack/react-table"

export type allMissingMarkColumn = {
    studentID: string;
    courseCode: string;
    
}

export const allMissingMarkColumns: ColumnDef<allMissingMarkColumn>[] = [
    {
        header: "Student",
        accessorKey: "studentID",
    },
    {
        header: "Courses",
        accessorKey: "courseCode",
    },
]
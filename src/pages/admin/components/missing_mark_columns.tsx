import { ColumnDef } from "@tanstack/react-table"

export type MissingMarkColumn = {
    studentID: string;
    courseCode: string;
    missingMarks: string;
}

export const missingMarkColumns: ColumnDef<MissingMarkColumn>[] = [
    {
        header: "Student",
        accessorKey: "studentID",
    },
    {
        header: "Courses",
        accessorKey: "courseCode",
    },
    {
        header: "Missing Marks",
        accessorKey: "missingMarks",
    },
]
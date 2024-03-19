import { ColumnDef } from "@tanstack/react-table"

export type YearFailColumn = {
    student: string;
    failedCourses: string;
}

export const yearFailColumns: ColumnDef<YearFailColumn>[] = [
    {
        header: "Students",
        accessorKey: "student",
    },
    {
        header: "Courses",
        accessorKey: "failedCourses",
    },
]
import { ColumnDef } from "@tanstack/react-table"

export type RetakesColumn = {
    studentID: string;
    courses: string;
}

export const retakeColumns: ColumnDef<RetakesColumn>[] = [
    {
        header: "Students",
        accessorKey: "studentID",
    },
    {
        header: "Courses",
        accessorKey: "courses",
    },
]
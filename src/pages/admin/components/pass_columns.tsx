import { ColumnDef } from "@tanstack/react-table"

export type YearPassColumn = {
    student: string;
}

export const yearPassColumns: ColumnDef<YearPassColumn>[] = [
    {
        header: "Students",
        accessorKey: "student",
    },
]
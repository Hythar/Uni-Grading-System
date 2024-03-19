import { ColumnDef } from "@tanstack/react-table"

export type SemPassColumn = {
    student: string;
}

export const semPassColumns: ColumnDef<SemPassColumn>[] = [
    {
        header: "Students",
        accessorKey: "student",
    },
]
import { ColumnDef } from "@tanstack/react-table"

export type SemFailColumn = {
    student: string;
}

export const semFailColumns: ColumnDef<SemFailColumn>[] = [
    {
        header: "Students",
        accessorKey: "student",
    },
]
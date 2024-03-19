import { ColumnDef } from "@tanstack/react-table"

export type SpecialsColumn = {
    studentName: string;
    specialCases: string;
}

export const specialsColumns: ColumnDef<SpecialsColumn>[] = [
    {
        header: "Students",
        accessorKey: "studentName",
    },
    {
        header: "Remarks",
        accessorKey: "specialCases",
    },
]
import { ColumnDef } from "@tanstack/react-table"
// import { LecCellAction } from "./lec_cell_action";

// export type StudentsMarksColumn = {
//     studentID: string;
//     courseCode: string;
//     ASN1?: string;
//     ASN2?: string;
//     CAT1?: string;
//     CAT2?: string;
//     EXAM?: string;
// }

interface Result {
    studentID: string;
    studentName: string;
    courseCode: string;
    [assessmentID: string]: string | undefined; //index signature
}
export const columns: ColumnDef<Result>[] = [
    // {
    //     header: "Student",
    //     accessorKey: "studentID",
    // },
    // {
    //     header: "Course Code",
    //     accessorKey: "courseCode",
    // },
    {
        header: "Student",
        accessorKey: "studentName",
    },
    {
        header: "ASN1",
        accessorKey: "ASN1",
    },
    {
        header: "ASN2",
        accessorKey: "ASN2",
    },
    {
        header: "CAT1",
        accessorKey: "CAT1",
    },
    {
        header: "CAT2",
        accessorKey: "CAT2",
    },
    {
        header: "EXAM",
        accessorKey: "EXAM",
    },
    // {
    //     id: "actions",
    //     cell: ({row}) => <LecCellAction data={row.original}/>
    // }
]
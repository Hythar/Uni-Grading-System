
import { ColumnDef } from "@tanstack/react-table"

import { EnrolledCellAction } from "./enrolled_cell_action";

export type EnrolledListColumn = {
    courseCode: string;
    academicYear:string;
    semesterID:string;
    courseStatus:string;

}

export const columns: ColumnDef<EnrolledListColumn>[] = [
    {
        header: "Course Code",
        accessorKey: "courseCode",
    },
    {
        header: "Academic Year",
        accessorKey: "academicYear",
    },
    {
        header: "Semester",
        accessorKey: "semesterID",
    },
    {
        header: "Course Status",
        accessorKey: "courseStatus",
    },
  
    {
        id: "actions",
        cell: ({row}) => <EnrolledCellAction data={row.original}/>
    }
]

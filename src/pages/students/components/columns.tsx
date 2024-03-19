
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type CourseListColumn = {
    courseCode: string,
    courseTitle: string,
    academicYear: string | undefined, // Update the type to allow for undefined values
    courseLecturer:string,
    courseStatus: string,
    semesterID: string,

}

export const columns: ColumnDef<CourseListColumn>[] = [
    {
        header: "Course Code",
        accessorKey: "courseCode",
    },
    {
        header: "Course Title",
        accessorKey: "courseTitle",
    },
    {
        header: "Course Status",
        accessorKey: "courseStatus",
    },
    {
        header: "Course Lecturer",
        accessorKey: "courseLecturer",
    },
    {
        header: "Semester",
        accessorKey: "semesterID",
    },
    {
        header: "Academic Year",
        accessorKey: "academicYear",
    },
    {
        id: "actions",
        cell: ({row}) => <CellAction data={row.original}/>
    }
]

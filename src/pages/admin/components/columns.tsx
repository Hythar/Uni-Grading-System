import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type CourseListColumn = {
    courseCode: string;
    courseTitle: string;
    courseLecturer: string;
    registrationStatus: string;
    semesterID: string;
    studentsEnrolled?: String[];
    academicYear:string;

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
        header: "Registration Status",
        accessorKey: "registrationStatus",
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
        header: "Students Enrolled",
        accessorKey: "studentsEnrolled",
    },
    {
        id: "actions",
        cell: ({row}) => <CellAction data={row.original}/>
    }
]

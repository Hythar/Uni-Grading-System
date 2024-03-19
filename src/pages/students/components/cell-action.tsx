import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CourseListColumn } from "./columns";
import { BookPlusIcon, MoreHorizontal, PlusCircle } from "lucide-react";
import { SemesterCourse, addEnrolledCourses } from "../../../../firebase/db_fun";
import { auth } from "../../../../firebase/firebaseApp";
import { useNavigate } from "react-router-dom";
import { refreshPage } from "@/lib/utils";

interface CellActionProps {
    data: CourseListColumn | undefined
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {

    const user = auth.currentUser;
    const studID = user?.uid;
    console.log(user?.uid);
    // const navigate = useNavigate();

    
    const selectCourse = async (data: CourseListColumn | undefined, student_id = studID) => {
        // console.log(semCourseData);
        try{
            console.log(data);
        
        if (student_id && data) {

            // add to db 
            await addEnrolledCourses({
                courseCode: data?.courseCode,
                academicYear: data?.academicYear || "",
                semesterID: data?.semesterID ,
                courseStatus: data?.courseStatus ,
            }, student_id);
            
        }
        alert("Course Enrolled Successfully");
        refreshPage();
        }
        catch(err){
            console.log("error")
            console.log(err);
        }

    }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />

                </Button>

            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={
                    () => selectCourse(data)
                }>
                    <BookPlusIcon className="h-4 mr-2 w-4" />
                    Select Course
                </DropdownMenuItem>

            </DropdownMenuContent>

        </DropdownMenu>
    )
}
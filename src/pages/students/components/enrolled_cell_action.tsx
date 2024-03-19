import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CourseListColumn } from "./columns";
import { BookPlusIcon, MoreHorizontal, PlusCircle, Trash2Icon } from "lucide-react";
import { SemesterCourse, deleteEnrolledCourse } from "../../../../firebase/db_fun";
import { auth } from "../../../../firebase/firebaseApp";
import { EnrolledListColumn } from "./enrolled_columns";
import { useNavigate } from "react-router-dom";
import { refreshPage } from "@/lib/utils";

interface EnrolledCellActionProps {
    data: EnrolledListColumn | undefined
}

export const EnrolledCellAction: React.FC<EnrolledCellActionProps> = ({ data }) => {

    const user = auth.currentUser;
    const studID = user?.uid;
    // const navigate = useNavigate();
    console.log(user?.uid);
    
    // const refreshPage = () => {
    //     // let currentUrl = window.location.pathname;
    //     // console.log(currentUrl);
    //     // // navigate(-1);
    //     // navigate(currentUrl);
    //     window.location.reload();
    //   };
    const dropCourse = async (data: EnrolledListColumn | undefined, student_id = studID) => {
        // console.log(semCourseData);
        try{
            console.log(data);
        
        if (student_id && data) {

            // add to db 
            await deleteEnrolledCourse(
                student_id,
                data?.courseCode,
                );
        }
        alert("Course Dropped Successfully");
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
                    () => dropCourse(data)
                }>
                    <Trash2Icon className="h-4 mr-2 w-4" />
                    Drop Course
                </DropdownMenuItem>

            </DropdownMenuContent>

        </DropdownMenu>
    )
}
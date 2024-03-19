import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { StudentsMarksColumn } from "./lec_columns";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PenLine } from "lucide-react";
import { Result } from "../lec_course_mgt";
import { useState } from "react";
import { AddMarksModal } from "@/components/modals/add_marks_modal";

interface LecCellActionProps {
    // data: StudentsMarksColumn|undefined
    data: Result | undefined
}

export const LecCellAction: React.FC<LecCellActionProps> = ({ data }) => {
    const [openAddMarksModal, setOpenAddMarksModal] = useState(false);

    // function to open modal
    const openModal = () => {
        setOpenAddMarksModal(true);
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />

                    </Button>

                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                    onClick={openModal}>
                        <PenLine className="h-4 mr-2 w-4" />
                        Add Marks
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>
                    <PlusCircle className="h-4 mr-2 w-4" />
                    Add Assessment
                </DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>

            <AddMarksModal
            isOpen={openAddMarksModal}
            onClose={() =>setOpenAddMarksModal(false)}
            data = {data}
            >

            </AddMarksModal>
        </>
    )
}
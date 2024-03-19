import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { StudentsMarksColumn } from "./lec_columns";
import { Button } from "@/components/ui/button";
import { EditIcon, MoreHorizontal, PenLine } from "lucide-react";

import { useState } from "react";

import { Result } from "../marks_edit";
import { EditMarksModal } from "@/components/modals/edit_marks_modal";

interface MarkCellActionProps {
    // data: StudentsMarksColumn|undefined
    data: Result | undefined
}

export const MarkViewCellAction: React.FC<MarkCellActionProps> = ({ data }) => {
    const [openEditMarksModal, setOpenEditMarksModal] = useState(false);

    // function to open modal
    const openModal = () => {
        setOpenEditMarksModal(true);
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
                        <EditIcon className="h-4 mr-2 w-4" />
                        Edit Student Marks
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>
                    <PlusCircle className="h-4 mr-2 w-4" />
                    Edit Assessment
                </DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>

            <EditMarksModal
            isOpen={openEditMarksModal}
            onClose={() =>setOpenEditMarksModal(false)}
            data = {data}
            >

            </EditMarksModal>
        </>
    )
}
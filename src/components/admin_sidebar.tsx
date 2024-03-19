import { FileSpreadsheetIcon, FilesIcon, GraduationCapIcon, HomeIcon, LibraryBig } from "lucide-react";
import Sidebar, { SidebarItem } from "./sidebar";

export default function AdminSidebar () {
    return (
        <>
            <Sidebar>
                <SidebarItem icon={<HomeIcon size={20} />} text="Dashboard" active alert={false} url="/admin-dashboard" />
                <SidebarItem icon={<LibraryBig size={20} />} text="Courses" active alert={false} url="/course-mgt" />
                <SidebarItem icon={<GraduationCapIcon size={20} />} text="Student Grades" active alert={false} url="/mark-edit" />
                <SidebarItem icon={<FileSpreadsheetIcon size={20} />} text="Reports" active alert={false} url="/reports" />

            </Sidebar>
        </>
    )
}
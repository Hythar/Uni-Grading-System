import { HomeIcon, LibraryBig } from "lucide-react";
import Sidebar, { SidebarItem } from "./sidebar";

export default function LecturerSidebar () {
    return (
        <>
            <Sidebar>
                <SidebarItem icon={<HomeIcon size={20} />} text="Dashboard" active alert={false} url="/lec-dashboard" />
                <SidebarItem icon={<LibraryBig size={20} />} text="Courses" active alert={false} url="/lec-course-view" />
            </Sidebar>
        </>
    )
}
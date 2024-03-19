import { GraduationCapIcon, HomeIcon, LibraryBig } from "lucide-react";
import Sidebar, { SidebarItem } from "./sidebar";

export default function StudSidebar () {
    return (
        <>
            <Sidebar>
                <SidebarItem icon={<HomeIcon size={20} />} text="Dashboard" active alert={false} url="/stud-dashboard" />
                <SidebarItem icon={<LibraryBig size={20} />} text="Courses" active alert={false} url="/stud-courses" />
                <SidebarItem icon={<GraduationCapIcon size={20} />} text="Marks" active alert={false} url="/grade-view" />
            </Sidebar>
        </>
    )
}
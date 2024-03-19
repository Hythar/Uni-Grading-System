import Navbar from "@/components/navbar";
import StudSidebar from "@/components/stud_sidebar";
import RegisterCourseForm from "./components/stud_register_course_form";

export default function StudCourseRegister() {
    return(
        <main>
            <Navbar />
            <section className="flex">
                <StudSidebar />
                <RegisterCourseForm/>
                </section>
        </main>
    )
}
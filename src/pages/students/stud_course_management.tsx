import Navbar from "@/components/navbar";
import StudSidebar from "@/components/stud_sidebar";
import { Pen, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const StudCoursesManagementPage = () => {
    return (
        <main>
            <Navbar />
            <section className="flex">
                <StudSidebar />
                <section className="mt-14 grow p-3">
                    <h1 className="m-3 text-center font-bold p-3 text-3xl text-indigo-900">Courses Management</h1>
                    <section>
                    <Link to="/course-register">
                    <div className="m-10 text-center bg-gradient-to-tr from-emerald-200 to-indigo-100 rounded-lg shadow-lg hover:shadow-indigo-500/50 p-12 ">
                            <div className="mb-2 flex justify-center items-center"> {/* Add flex and centering utilities */}
                                <Plus size={20} />
                            </div>
                            <h3 className="text-lg font-semibold">Register Course</h3>
                        </div>
                    </Link>
                        
                        
                    </section>
                </section>
            </section>
        </main>
    );
}

export default StudCoursesManagementPage;
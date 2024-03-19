import AdminSidebar from "@/components/admin_sidebar";
import Navbar from "@/components/navbar";
import { BookUserIcon, Pen, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const CoursesManagementPage = () => {
    return (
        <main>
            <Navbar />
            <section className="flex">
                <AdminSidebar />
                <section className="p-3 mt-14 grow">
                    <h1 className=" m-3 p-3 text-3xl text-center text-indigo-900  ">Courses Management</h1>
                    <section className="grid place-content-center">
                    <Link to="/add-course">
                        <div className="m-10 text-center bg-gradient-to-tr from-emerald-200 to-indigo-100 rounded-lg shadow-md p-4">
                            <div className="mb-2 flex justify-center items-center"> {/* Add flex and centering utilities */}
                                <Plus size={20} />
                            </div>
                            <h3 className="text-lg font-semibold">Add a Course</h3>
                        </div>
                    </Link>
                    <Link to="/specials-form">
                        <div className="m-10 text-center bg-gradient-to-tr from-emerald-200 to-indigo-100 rounded-lg shadow-md p-4">
                            <div className="mb-2 flex justify-center items-center"> {/* Add flex and centering utilities */}
                                <BookUserIcon size={20} />
                            </div>
                            <h3 className="text-lg font-semibold">Special Exams Form</h3>
                        </div>
                    </Link>
                        
                    </section>
                </section>
            </section>
        </main>
    );
}

export default CoursesManagementPage;
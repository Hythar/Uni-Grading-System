import LecturerSidebar from "@/components/lecturer_sidebar";
import Navbar from "@/components/navbar";
import { Folder } from "lucide-react";
import { Link } from "react-router-dom";

const LecturerDashboardPage = () => {



  return (
    <main>
      <Navbar />
      <div className="flex">
        <LecturerSidebar />
        <section className="mt-14 grow p-3">
          <h1 className=" m-3 text-center font-bold p-3 text-3xl text-indigo-900">Lecturer Dashboard</h1>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            <Link to="/lec-course-view">
              <div className="m-10 text-center bg-gradient-to-tr from-emerald-200 to-indigo-100 rounded-lg shadow-lg hover:shadow-indigo-500/50 p-12 ">
                <div className="mb-2 flex justify-center items-center"> {/* Add flex and centering utilities */}
                  <Folder size={20} />
                </div>
                <h3 className="text-lg font-semibold text-indigo-800">Courses</h3>
              </div>
            </Link>
          </section>
        </section>
      </div>


    </main>
  );
};

export default LecturerDashboardPage;
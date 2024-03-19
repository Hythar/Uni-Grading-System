import AdminSidebar from "@/components/admin_sidebar";
import Navbar from "@/components/navbar";
import { FileSpreadsheetIcon, GraduationCapIcon, HomeIcon, LibraryBig } from "lucide-react";
import { Link } from "react-router-dom";


const AdminDashboardPage = () => {



  return (
    <main>
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <section className="mt-14 grow p-3">
          <h1 className=" m-3 p-3 text-center text-3xl text-indigo-900">Report Management</h1>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            

            <Link to="/course-mgt">
              <div className="m-10 text-center bg-gradient-to-tr from-emerald-200 to-indigo-100 rounded-lg shadow-lg hover:shadow-indigo-500/50 p-12">
                <div className="mb-2 flex justify-center items-center"> {/* Add flex and centering utilities */}
                  <LibraryBig size={20} />
                </div>
                <h3 className="text-lg font-semibold">Course Management </h3>
              </div>
            </Link>
            <Link to="/mark-edit">
              <div className="m-10 text-center bg-gradient-to-tr from-emerald-200 to-indigo-100 rounded-lg shadow-lg hover:shadow-indigo-500/50 p-12">
                <div className="mb-2 flex justify-center items-center"> {/* Add flex and centering utilities */}
                  <GraduationCapIcon size={20} />
                </div>
                <h3 className="text-lg font-semibold">Student Marks</h3>
              </div>
            </Link>

            <Link to="/reports">
              <div className="m-10 text-center bg-gradient-to-tr from-emerald-200 to-indigo-100 rounded-lg shadow-lg hover:shadow-indigo-500/50 p-12">
                <div className="mb-2 flex justify-center items-center"> {/* Add flex and centering utilities */}
                  <FileSpreadsheetIcon size={20} />
                </div>
                <h3 className="text-lg font-semibold">Reports </h3>
              </div>

            </Link>
          </section>
        </section>



      </div>


    </main>
  );
};

export default AdminDashboardPage;
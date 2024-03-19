import AdminSidebar from "@/components/admin_sidebar";
import Navbar from "@/components/navbar";
import { BookCheckIcon, BookMarked, BookMinus, BookOpenIcon, BookOpenText, BookUp2Icon, FileSpreadsheetIcon } from "lucide-react";
import { Link } from "react-router-dom";

const ReportManagementPage = () => {
    return (
        <main>
            <Navbar />
            <section className="flex">
                <AdminSidebar />
                <section className="mt-14 grow p-3">
                    <h1 className=" m-3 p-3 text-center text-3xl text-indigo-900">Report Management</h1>
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                        <Link to="/passlists">
                            <div className="m-10  hover:shadow-indigo-500/50 text-center bg-gradient-to-tr from-emerald-200 to-indigo-100 rounded-lg shadow-lg p-12">
                                <div className="mb-2 flex justify-center items-center"> {/* Add flex and centering utilities */}
                                    <BookCheckIcon size={20} />
                                </div>
                                <h3 className="text-lg font-semibold">Pass List</h3>
                            </div>
                        </Link>

                        <Link to="/faillists">
                            <div className="m-10 text-center bg-gradient-to-tr from-emerald-200 to-indigo-100 rounded-lg shadow-lg hover:shadow-indigo-500/50 p-12">
                                <div className="mb-2 flex justify-center items-center"> {/* Add flex and centering utilities */}
                                    <BookMarked size={20} />
                                </div>
                                <h3 className="text-lg font-semibold">Fail List </h3>
                            </div>
                        </Link>
                        <Link to="/specials">
                            <div className="m-10 text-center bg-gradient-to-tr from-emerald-200 to-indigo-100 rounded-lg shadow-lg hover:shadow-indigo-500/50 p-12">
                                <div className="mb-2 flex justify-center items-center"> {/* Add flex and centering utilities */}
                                    <BookOpenText size={20} />
                                </div>
                                <h3 className="text-lg font-semibold">Special Cases </h3>
                            </div>
                        </Link>

                        <Link to="/missing-marks">
                            <div className="m-10 text-center bg-gradient-to-tr from-emerald-200 to-indigo-100 rounded-lg shadow-lg hover:shadow-indigo-500/50 p-12">
                                <div className="mb-2 flex justify-center items-center"> {/* Add flex and centering utilities */}
                                    <BookMinus size={20} />
                                </div>
                                <h3 className="text-lg font-semibold">Missing Marks List </h3>
                            </div>

                        </Link>
                        <Link to="/retake">
                            <div className="m-10 text-center bg-gradient-to-tr from-emerald-200 to-indigo-100 rounded-lg shadow-lg hover:shadow-indigo-500/50 p-12">
                                <div className="mb-2 flex justify-center items-center"> {/* Add flex and centering utilities */}
                                    <BookUp2Icon size={20} />
                                </div>
                                <h3 className="text-lg font-semibold">Retakes </h3>
                            </div>
                        </Link>
                        



                    </section>
                </section>
            </section>
        </main>
    );
}

export default ReportManagementPage;
import AdminSidebar from "@/components/admin_sidebar";
import Navbar from "@/components/navbar";
import { getStudentNameById, getStudentsRetakingCourse } from "../../../firebase/db_fun";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { retakeColumns } from "./components/retake_columns";

export default function RetakeListPage() {
    const [loading, setLoading] = useState(false);
    const [retakes, setRetakes] = useState<any[] | null>(null);

    const formatRetakes = async (data: any[]) => {
        let formattedData: any[] = [];
        for (let student of data) {
            const studentName = await getStudentNameById(student.studentID);
            if (student.retakingCourses && Array.isArray(student.retakingCourses)) {
                for (let course of student.retakingCourses) {
                    // const courseToRetake = course.r
                    formattedData.push({
                        studentID: studentName,
                        courseCode: course.join(", ")
                    });
                }
            }
        }
        return formattedData;
    }

    useEffect(() => {
        const populateRetakeTable = async () => {
            setLoading(true);
            const data = await getStudentsRetakingCourse();
            console.log("fetched data")
            console.log(data);
            const formattedData = await formatRetakes(data);
            console.log("fetched table data");
            console.log(formattedData);
            setRetakes(formattedData);
            setLoading(false);
        }

        populateRetakeTable();
    }, []);

    return (
        <main>
            <Navbar />
            <section className="flex">
                <AdminSidebar />
                <section className="text-center grow p-3 pb-4 mt-5">
                    <h1 className="m-3 p-3 text-3xl text-indigo-900">Retakes </h1>
                    <section className="mt-4">
                    <section className="mt-2">
                            <h2 className="my-8 text-xl font-semibold text-indigo-700">Missing Marks List</h2>
                            <DataTable columns={retakeColumns} data={retakes ? retakes : []} searchKey="studentID" />
                        </section>
                    </section>
                </section>
            </section>
        </main>
    )
}
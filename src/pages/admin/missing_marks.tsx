import AdminSidebar from "@/components/admin_sidebar";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { getStudentNameById, getStudentsMissingAllMarks, getStudentsMissingMarks } from "../../../firebase/db_fun";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { missingMarkColumns } from "./components/missing_mark_columns";
import { Separator } from "@/components/ui/separator";
import { allMissingMarkColumns } from "./components/all_missing_mark_columns";

export default function MissingMarksListPage() {
    const [loading, setLoading] = useState(false);
    const [missingMarks, setMissingMarks] = useState<any[] | null>(null);
    const [missingAllMarks, setMissingAllMarks] = useState<any[] | null>(null);

    const formatMissingMarks = async (data: any[]) => {
        let formattedData: any[] = [];

        for (const student of data) {
            const studentName = await getStudentNameById(student.studentID);
            if (student.courses && Array.isArray(student.courses)) {
                for (const course of student.courses) {
                    // Get the course code and missing marks from the course object
                    const courseCode = Object.keys(course)[0];
                    const missingMarks = course[courseCode];

                    formattedData.push({
                        studentID: studentName,
                        missingMarks: missingMarks.join(", "),
                        courseCode: courseCode
                    });
                }
            }
        }

        return formattedData;
    }

    useEffect(() => {
        const populateTable = async () => {
            setLoading(true);
            const data = await getStudentsMissingMarks();
            // console.log("fetched data")
            // console.log(data);
            const formattedData = await formatMissingMarks(data);
            // console.log("fetched table data");
            // console.log(formattedData);
            setMissingMarks(formattedData);
            setLoading(false);
        }

        populateTable();
    }, []);

    useEffect(() => {
        const populateAllMarksMissing = async () => {
            setLoading(true);
            const data = await getStudentsMissingAllMarks();
            console.log("fetched data")
            console.log(data);
            // const formattedData = await formatMissingMarks(data);
            // console.log("fetched choose no marks table data")
            // console.log(formattedData);
            // setMissingAllMarks(formattedData);
            setMissingAllMarks(data);
            setLoading(false);
        }
        populateAllMarksMissing();
    }
        , []);

    if (missingAllMarks && missingMarks) {
        console.log(missingMarks);
        console.log(missingAllMarks);
    }
    return (
        <main>
            <Navbar />
            <section className="flex">
                <AdminSidebar />
                <section className="text-center grow p-3 pb-4 mt-5">
                    <h1 className="m-3 p-3 text-3xl text-indigo-900">Missing Mark Lists </h1>
                    <section className="mt-4">
                        {/* <div className="grid place-items-center">
                            <Button disabled={loading} onClick={populateTable}>Populate Table</Button>
                        </div> */}

                        <section className="mt-2">
                            <h2 className="my-8 text-xl font-semibold text-indigo-700">Missing Marks List</h2>
                            <DataTable columns={missingMarkColumns} data={missingMarks ? missingMarks : []} searchKey="studentID" />
                        </section>
                        <Separator className="my-8" />

                        <section className="mt-2">
                            <h2 className="my-8 text-xl font-semibold text-indigo-700">Missing Marks List</h2>
                            <DataTable columns={allMissingMarkColumns} data={missingAllMarks ? missingAllMarks : []} searchKey="studentID" />
                        </section>
                    </section>
                </section>
            </section>
        </main>
    )
}
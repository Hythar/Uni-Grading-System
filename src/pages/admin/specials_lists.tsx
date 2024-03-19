import AdminSidebar from "@/components/admin_sidebar";
import Navbar from "@/components/navbar";
import { DataTable } from "@/components/ui/data-table";
import { getStudentsWithSpecialCases } from "../../../firebase/db_fun";
import { useEffect, useState } from "react";
import { specialsColumns } from "./components/specials_columns";


export default function SpecialsListPage() {
    const [loading, setLoading] = useState(false);
    const [specials, setSpecials] = useState<any[] | null>(null);
    useEffect(() => {
        const populateTable = async () => {
            setLoading(true);
            const data = await getStudentsWithSpecialCases();
            console.log("fetched data")
            console.log(data);
            // const formattedData = await formatMissingMarks(data);
            // console.log("fetched table data");
            // console.log(formattedData);
            setSpecials(data);
            setLoading(false);
        }

        populateTable();
    }, []);

    return (
        <main>
            <Navbar />
            <section className="flex">
                <AdminSidebar />
                <section className="text-center grow p-3 pb-4 mt-5">
                    <h1 className="m-3 p-3 text-3xl text-indigo-900">Special Exams Lists </h1>
                    <section className="mt-4">
                        <section className="mt-2">
                            {/* <h2 className="my-8 text-xl font-semibold text-indigo-700">Missing Marks List</h2> */}
                            <DataTable columns={specialsColumns} data={specials ? specials : []} searchKey="studentName" />
                        </section>
                    </section>
                </section>
            </section>
        
        </main >
    )
}
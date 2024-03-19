import AdminSidebar from "@/components/admin_sidebar";
import Navbar from "@/components/navbar";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AcademicYear, Semester, getAllAcademicYears, getAllSemesters, getStudentsFailedCoursesInYear, getStudentsFailedCoursesInSemester } from "../../../firebase/db_fun";
import { yearFailColumns } from "./components/fail_columns";
import { DataTable } from "@/components/ui/data-table";
import { semFailColumns } from "./components/sem_fail_columns";
import { Separator } from "@/components/ui/separator";


const formSchema = z.object(
    {
        academicYear: z.string(),
        semester: z.string(),
    })
type FailListFormValues = z.infer<typeof formSchema>


export default function FailListPage() {

    const [loading, setLoading] = useState(false);
    const [academicYears, setAcademicYears] = useState<AcademicYear[] | null>(null);
    const [semesterData, setSemesterData] = useState<Partial<Semester[]> | null>(null);
    const [semesterFailList, setSemesterFailList] = useState<any[] | null>(null);
    const [academicYearFailList, setAcademicYearFailList] = useState<any[] | null>(null);
    const [year, setYear] = useState<string>("");
    const [semester, setSemester] = useState<string>("");
    const form = useForm<FailListFormValues>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        const getAcademicYears = async () => {
            console.log("getting academic years");
            const data = await getAllAcademicYears();
            setAcademicYears(data);
            return data;
        }

        const getSemesterData = async () => {
            console.log("getting semester data");
            const data = await getAllSemesters();
            setSemesterData(data);
            return data;
        };

        getAcademicYears();
        getSemesterData();
    }, []);

    const getYearFailList = async (academicYear: string) => {
        try {
            setLoading(true);
            console.log(academicYear);
            // get students who passed all courses in the academic year
            const yearData = await getStudentsFailedCoursesInYear(academicYear);
            // console.log(yearData);
            // loop over the data and transform it to the format needed for the table [{ student: "s1", failedCourses: "c1, c2, c3"}]

            const transformedData:any[] =[];
            yearData.map((stud) => {
                // console.log(studentID);
                // const student = yearData[studentID];
                const student = stud.student;
                const failedCourses = stud.failedCourses;
                const failedCoursesString = failedCourses.join(", ");
                transformedData.push({student: student, failedCourses: failedCoursesString});
            })

            
            setAcademicYearFailList(transformedData);
            console.log(transformedData);
            
            console.log("year pass list set");
        }
        catch (e) {
            console.log(e);
        }
        finally {
            setLoading(false);
        }
    }

    const getSemesterFailList = async (semesterVal:string) => {
        try {
            setLoading(true);
            
            if (!year) {
                alert("No year selected")
                return "No year selected";
            }

            if (!semesterVal) {
                alert("No semester selected")
                return "No semester selected";
            }

            const semesterData = await getStudentsFailedCoursesInSemester(year, semesterVal);

            const transformedData:any[] =[];
            semesterData.map((stud) => {
                // console.log(studentID);
                // const student = yearData[studentID];
                const student = stud.student;
                const failedCourses = stud.failedCourses;
                const failedCoursesString = failedCourses.join(", ");
                transformedData.push({student: student, failedCourses: failedCoursesString});
            })

            // console.log(semesterData);
            console.log(transformedData);
            setSemesterFailList(transformedData);
            
            console.log("semester pass list set");
            
        }
        
        catch (e) {
            console.log(e);
        }
        finally {
            setLoading(false);
        }

    }



    const onSubmit = async (data: FailListFormValues) => {
        setLoading(true);
        console.log(data);
        setLoading(false);
    };



    return (
        <main>
            <Navbar />
            <section className="flex">
                <AdminSidebar />
                <section className="text-center grow p-3 pb-4 mt-5">
                    <h1 className="m-3 p-3 text-3xl text-indigo-900">Fail Lists </h1>
                    <section className="mt-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 px-4 items-center gap-5">
                                    <fieldset className="grid  p-7 border border-solid border-indigo-400 rounded">
                                        <legend className="text-indigo-800 font-semibold">Academic Year</legend>
                                        <div className="grid grid-cols-2 justify-between gap-5">
                                            <FormField
                                                control={form.control}
                                                name="academicYear"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-indigo-800 font-semibold">Academic Year</FormLabel>

                                                        <Select
                                                            disabled={loading}
                                                            onValueChange={(value) => {
                                                                field.onChange(value);
                                                                setYear(value);
                                                                getYearFailList(value);
                                                            }}
                                                            value={field.value}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue
                                                                        defaultValue={field.value}
                                                                        placeholder="Select Academic Year">

                                                                    </SelectValue>
                                                                </SelectTrigger>

                                                            </FormControl>
                                                            <SelectContent>
                                                                {academicYears?.map((sem) => (
                                                                    <SelectItem
                                                                        key={sem.year}
                                                                        value={sem.year}
                                                                    >
                                                                        {sem.year}

                                                                    </SelectItem>
                                                                ))}

                                                            </SelectContent>

                                                        </Select>

                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                        </div>
                                    </fieldset>

                                    <fieldset className="grid  p-7 border border-solid border-indigo-400 rounded">
                                        <legend className="text-indigo-800 font-semibold">Semester</legend>
                                        <div className="grid grid-cols-2 justify-between gap-5">
                                            <FormField
                                                control={form.control}
                                                name="semester"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-indigo-800 font-semibold">Semester</FormLabel>

                                                        <Select
                                                            disabled={loading}
                                                            onValueChange={(value) => {
                                                                field.onChange(value);
                                                                setSemester(value);
                                                                getSemesterFailList(value);

                                                            }}
                                                            value={field.value}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue
                                                                        defaultValue={field.value}
                                                                        placeholder="Select Semester">

                                                                    </SelectValue>
                                                                </SelectTrigger>

                                                            </FormControl>
                                                            <SelectContent>
                                                                {semesterData?.map((sem) => (
                                                                    <SelectItem
                                                                        key={sem?.semesterID}
                                                                        value={sem?.semesterID || ''}
                                                                    >
                                                                        {sem?.semesterID}

                                                                    </SelectItem>
                                                                ))}

                                                            </SelectContent>

                                                        </Select>

                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                        </div>



                                    </fieldset>
                                </div>
                            </form>
                        </Form>

                    </section>
                    <Separator className="my-16"/>
                    <section className="mt-8">
                        <h2 className="text-indigo-800 font-semibold">{year} Supplementary Exams List</h2>
                        <p className="text-indigo-800 font-normal">Select the academic Year to populate the table</p>
                        <DataTable columns={yearFailColumns} data={academicYearFailList ? academicYearFailList : []} searchKey="student" />
                    </section>
                    <section className="mt-8">
                        <h2 className="text-indigo-800 font-semibold">{semester} Semester Fail List</h2>
                        <p className="text-indigo-800 font-normal">Select the academic Year and Semester to populate the table</p>

                        <DataTable columns={semFailColumns} data={semesterFailList ? semesterFailList : []} searchKey="student" />
                    </section>
                </section>
            </section>
        </main>
    )
}
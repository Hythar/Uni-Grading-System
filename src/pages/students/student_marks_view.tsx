import Navbar from "@/components/navbar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import StudSidebar from "@/components/stud_sidebar";
import { EnrolledCourse, Marks, getMarksFromCourseByStudent, getStudentCourses } from "../../../firebase/db_fun";
import { auth } from "../../../firebase/firebaseApp";
import { Result, transformMarks } from "../lecturer/lec_course_mgt";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./components/grade_columns";

const formSchema = z.object(
    {
        courseCode: z.string().min(4).max(10),

    }
)
type ViewGradesFormSchema = z.infer<typeof formSchema>

export default function StudGradeView() {
    const form = useForm<ViewGradesFormSchema>({
        resolver: zodResolver(formSchema)
    });
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<EnrolledCourse[]>();
    const [marks, setMarks]  = useState<Result[] | null>(null);

    useEffect(() => {
        const userID = auth.currentUser?.uid;
        const getMyCourses = async () => {
            setLoading(true);
            if (!userID) return "No user ID";
            const data = await getStudentCourses(userID);
            setCourses(data);
            setLoading(false);
        }
        if(userID){

            getMyCourses();
        }
    }
    , [auth.currentUser]);

    // const data = await getStudentCourses(userID);
    console.log(courses);
    console.log(marks);

    const getEnrolledCourses = async (courseCode: string) => {
        setLoading(true);
        const userID = auth.currentUser?.uid;
        if (!userID) return "No user ID";
        const data = await getMarksFromCourseByStudent(userID, courseCode);
        console.log("fetched table data")
        console.log(data);
        const allMarks = [];

            for (const studentID in data) {
                allMarks.push(transformMarks(data[studentID]));
                // console.log(transformMarks(data[studentID]));
                console.log(studentID);
            }

            // create a new array of objects with the transformed data
            allMarks.map((mark) => {
                console.log("Marks:")
                console.log(mark);
            }
            );
            const resolvedMarks = await Promise.all(allMarks);
            console.log("resolved marks \n", resolvedMarks);
        setMarks(resolvedMarks);
        setLoading(false);
    }

    const onSubmit = async (values: ViewGradesFormSchema) => {
        console.log(values);
    }


    return (
        <main>
            <Navbar />
            <section className="flex">
                <StudSidebar />
                <section className="text-center grow p-3 pb-4 mt-5">
                    <h1 className="m-3 p-3 text-3xl text-indigo-900">View Course Grades </h1>
                    <section className="mt-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-2 px-4 items-center gap-5">
                                    <fieldset className="grid col-span-2 p-7 border border-solid border-indigo-400 rounded">
                                        <legend className="text-indigo-800 font-courseibold">Select Course Code</legend>
                                        <div className="grid grid-cols-2 justify-between gap-5">
                                            <FormField
                                                control={form.control}
                                                name="courseCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-indigo-800 font-bold">Course Code</FormLabel>

                                                        <Select
                                                            disabled={loading}
                                                            onValueChange={(value) => {
                                                                field.onChange(value);
                                                                getEnrolledCourses(value);
                                                            }}
                                                            value={field.value}
                                                            defaultValue={field.value}

                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue
                                                                        defaultValue={field.value}
                                                                        placeholder="Select Course Code">

                                                                    </SelectValue>
                                                                </SelectTrigger>

                                                            </FormControl>
                                                            <SelectContent>
                                                                {courses?.map((course) => (
                                                                    <SelectItem
                                                                        key={course?.courseCode}
                                                                        value={course?.courseCode ?? ''}
                                                                    >
                                                                        {course?.courseCode}

                                                                    </SelectItem>
                                                                ))}

                                                            </SelectContent>

                                                        </Select>

                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {/* <div className="grid justify-center ">
                                                <PlusCircle className="my-3 mx-10 w-6 h-6  text-indigo-800" onClick={openYearModal} />
                                                <p className="text-indigo-800 font-courseibold">Add Course Code </p>
                                            </div> */}
                                        </div>

                                    </fieldset>
                                </div>
                            </form>

                        </Form>
                    </section>
                    <section className="mt-2">
                        <DataTable columns={columns} data={marks ? marks : []} searchKey="studentName" />
                    </section>
                </section>

            </section>
        </main>
    )
}
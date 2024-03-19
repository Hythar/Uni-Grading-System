import LecturerSidebar from "@/components/lecturer_sidebar";
import Navbar from "@/components/navbar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { Course, getAllCoursesForLecturer, getMarksFromCourseGroupedByStudent, getStudentNameById } from "../../../firebase/db_fun";
import { auth } from "../../../firebase/firebaseApp";
import { columns } from "./components/lec_columns";
import { DataTable } from "@/components/ui/data-table";

export interface DisplayMark {
    studentID: string;
    assessmentID: string;
    score: number;
    total: number;
    courseCode: string;
}

export interface Result {
    studentID: string;
    studentName: string;
    courseCode: string;
    [assessmentID: string]: string | undefined; //index signature
}

const formSchema = z.object(
    {
        courseCode: z.string().min(4).max(10),

    }
)
type ViewCoursesFormSchema = z.infer<typeof formSchema>

export async function transformMarks(marks: DisplayMark[]): Promise<Result> {
    // const result: Result = {
    //     studentID: "",
    //     courseCode: ""
    // };
    const result: Result = {} as Result;
    await Promise.all(marks.map(async (mark: DisplayMark) => {
        const { studentID, assessmentID, score, total, courseCode } = mark;
        let studentName = await getStudentNameById(studentID);
        result['studentName'] = studentName;
        result['studentID'] = studentID;
        result['courseCode'] = courseCode;
        result[assessmentID] = `${score}/${total}`;
    }));

    return result;
}

const LecturerCourseMgt = () => {
    const form = useForm<ViewCoursesFormSchema>({
        resolver: zodResolver(formSchema),
    });
    const [loading, setLoading] = useState(false);
    const [studentDetails, setStudentDetails] = useState<Result[] | null>(null);
    const [courses, setCourses] = useState<Partial<Course[]> | null>(null);
    const [lecturer, setLecturer] = useState<string>('');

    // useEffect(() => {
    //     const getCourses = async () => {
    //         setLoading(true);
    //         const lecturer_id = auth.currentUser;
    //         console.log("Getting courses for lecturer: " + lecturer_id);
    //         if (lecturer_id){
    //             setLecturer(lecturer_id.uid);
    //             const data = await getAllCoursesForLecturer(lecturer_id.uid);
    //             setCourses(data);
    //         };

    //         setLoading(false);
    //     }
    //     if (auth.currentUser) {
    //         getCourses();
    //     }
    // }, [auth.currentUser]);

    // First useEffect to handle authentication
    useEffect(() => {
        if (auth.currentUser) {
            setLecturer(auth.currentUser.uid);
        }
    }, [auth.currentUser]);

    // Second useEffect to fetch courses once lecturer is set
    useEffect(() => {
        const getCourses = async () => {
            setLoading(true);
            console.log("Getting courses for lecturer: " + lecturer);
            if (lecturer) {
                const data = await getAllCoursesForLecturer(lecturer);
                setCourses(data);
            };
            setLoading(false);
        }
        if (lecturer) {
            getCourses();
        }
    }, [lecturer]);


    const [openAddMarksModal, setOpenAddMarksModal] = useState(false);

    // function to open modal
    const openModal = () => {
        setOpenAddMarksModal(true);
    }

    // function to close modal
    const closeModal = () => {
        setOpenAddMarksModal(false);
    }

    

    const getLecCourses = async (courseCode: string) => {
        try {
            setLoading(true);

            // const data = await getStudentNamesFromCourseByLecturer(lecturer, courseCode);
            // console.log("Names:", data);
            const student_marks = await getMarksFromCourseGroupedByStudent(courseCode);
            // setCourses(data);
            console.log(student_marks);
            const allMarks = [];

            for (const studentID in student_marks) {
                allMarks.push(transformMarks(student_marks[studentID]));
                // console.log(transformMarks(student_marks[studentID]));
            }


            // create a new array of objects with the transformed data
            allMarks.map((mark) => {
                console.log("Marks:")
                console.log(mark);
            }
            );



            // setStudentDetails(processedData);
            const resolvedMarks = await Promise.all(allMarks);
            setStudentDetails(resolvedMarks);
            console.log(resolvedMarks);
            console.log("student_marks");
            // console.log(processedData);
            setLoading(false);
        }
        catch (err) {
            console.log(err);
        }
    }
    console.log("Students details:", studentDetails);

    const onSubmit = async (data: ViewCoursesFormSchema) => {
        setLoading(true);
        console.log(data);
    }

    return (
        <main>
            <Navbar />
            <section className="flex">
                <LecturerSidebar />
                <section className="text-center grow p-3 pb-4 mt-5">
                    <h1 className="m-3 p-3 text-3xl text-indigo-900">View Course Details </h1>
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
                                                        <FormLabel className="text-indigo-800 font-courseibold">Course Code</FormLabel>

                                                        <Select
                                                            disabled={loading}
                                                            onValueChange={(value) => {
                                                                field.onChange(value);
                                                                getLecCourses(value);
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
                        <DataTable columns={columns} data={studentDetails ? studentDetails : []} searchKey="studentName" />
                    </section>
                </section>

            </section>
        </main>
    )
}

export default LecturerCourseMgt;

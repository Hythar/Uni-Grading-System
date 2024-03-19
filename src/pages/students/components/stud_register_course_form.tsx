import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course, EnrolledCourse, Semester, SemesterCourse, getAllSemesters, getCoursesForSemester, getEnrolledCourses } from "../../../../firebase/db_fun";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { CourseListColumn, columns } from "./columns";
import { columns as enrolledCol, EnrolledListColumn } from "./enrolled_columns";
import { auth } from "../../../../firebase/firebaseApp";




const registerCourseFormSchema = z.object({
    semester: z.string(),
    enrolledCourses: z.array(z.string()).length(5, "You must register for 5 courses"),

});

type studRegisterCourseValues = z.infer<typeof registerCourseFormSchema>;


export default function RegisterCourseForm() {
    const [semesterData, setSemesterData] = useState<Partial<Semester[]> | null>(null);// ["FS2021", "SS2021"]
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledListColumn[] | null>(null);


    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<Partial<Course[]> | null>(null);
    const [semCourses, setSemCourses] = useState<CourseListColumn[] | null>(null);

    const form = useForm<studRegisterCourseValues>({
        resolver: zodResolver(registerCourseFormSchema),

    });

    useEffect(() => {
        const getSemesterData = async () => {
            console.log("getting semester data");
            const data = await getAllSemesters();
            setSemesterData(data);
            return data;
        };

        getSemesterData();


    }, []);

    useEffect(() => {
        const getStudentCourses = async () => {
            const student_id = auth.currentUser;
            console.log("getting student courses");
            if (student_id) {
                const data = await getEnrolledCourses(student_id.uid);
                setEnrolledCourses(data);
            }
        }

        if (auth.currentUser) {
            getStudentCourses();
        }
    }, [auth.currentUser]);



    const getCourses = async (semester: string) => {
        setLoading(true);
        const fetchedCourses: Course[] = await getCoursesForSemester(semester);
        console.log(fetchedCourses);
        console.log(semesterData);
        console.log(enrolledCourses);
        // if (!semesterData) {
        //     console.log("No semester data");
        //     return "No semester data"
        // }

        const semCoursePayload = fetchedCourses.map((course) => ({
            courseCode: course.courseCode,
            semesterID: course.semesterID,
            academicYear: course.academicYear,
            // academicYear: semesterData?.academicYear,
            courseLecturer: course.courseLecturer,
            courseTitle: course.courseTitle,
            courseStatus: "Ongoing",
        }));

        setSemCourses(semCoursePayload);
        setCourses(fetchedCourses);
        setLoading(false);
    }


    // const dataPayload = [semCourses]


    const onSubmit = async (data: studRegisterCourseValues) => {
        console.log(data);
    };
    return (
        <section className="text-center grow p-3 pb-4 mt-5">
            <h1 className="m-3 p-3 text-4xl font-bold text-indigo-900">Register Course </h1>
            <section className="mt-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 px-4 items-center gap-5">
                            
                                <FormField
                                    control={form.control}
                                    name="semester"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-indigo-800 text-2xl font-semibold">Semester</FormLabel>
                                            <p className="text-gray-500">Choose semester to view courses</p>
                                            <Select
                                                disabled={loading}
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    getCourses(value);
                                                }}
                                                value={field.value}
                                                defaultValue={field.value}

                                            >
                                                <FormControl>
                                                    <SelectTrigger
                                                    >
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
                                                            value={sem?.semesterID ?? ''}
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
                            
                            <Separator className="my-5" />
                            <h2 className="text-indigo-800 my-6 text-3xl font-semibold">Courses</h2>
                            <DataTable columns={columns} data={semCourses ? semCourses : []} searchKey="courseCode" />

                            <Separator className="my-7" />
                            <h2 className="text-indigo-800 my-6 text-3xl font-semibold">Enrolled Courses</h2>
                            <DataTable columns={enrolledCol} data={enrolledCourses ? enrolledCourses : []} searchKey="courseCode" />

                        </div>
                    </form>
                </Form>
            </section>
        </section>
    );
}

import AdminSidebar from "@/components/admin_sidebar";
import Navbar from "@/components/navbar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { Lecturer, AcademicYear, Semester, addCourse, getAllAcademicYears, getAllLecturers, getAllSemesters, addSemesterDetails, getAllCourses } from "../../../../firebase/db_fun";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AcademicModal from "@/components/modals/academic-year-modal";
import SemesterModal from "@/components/modals/semester-modal";
import { refreshPage } from "@/lib/utils";
import { CourseListColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object(
    {
        courseCode: z.string().min(4).max(10),
        courseTitle: z.string().min(4).max(40),
        courseLecturer: z.string().min(4).max(40),
        registrationStatus: z.string().refine(value => value === "open" || value === "closed", {
            message: "Registration status must be either 'open' or 'close'",
        }),
        academicYear: z.string(),
        semester: z.string()
    }
)

type AddCourseFormValues = z.infer<typeof formSchema>;

export default function AddCourseForm() {
    const [loading, setLoading] = useState(false);
    const [lecturersData, setLecturersData] = useState<Lecturer[] | null>(null);
    const [academicYears, setAcademicYears] = useState<AcademicYear[] | null>(null);
    const [semesterData, setSemesterData] = useState<Partial<Semester[]> | null>(null);// ["FS2021", "SS2021"]
    const [open, setOpen] = useState(false);
    const [openSemester, setOpenSemester] = useState(false);
    const [Courses, setCourses] = useState<CourseListColumn[] | null>(null);
    const navigate = useNavigate();
    const form = useForm<AddCourseFormValues>({
        resolver: zodResolver(formSchema),
    });


    useEffect(() => {
        const getLecturerData = async () => {
            console.log("getting lecturer data");
            const data = await getAllLecturers();
            setLecturersData(data);
            return data;
        };

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

        const getCoursesData = async () => {
            console.log("getting courses data");
            const data = await getAllCourses();
            setCourses(data);
            return data;

        }

        getLecturerData();
        getAcademicYears();
        getSemesterData();
        getCoursesData();
    }, []);


    console.log("Data  '''''''''''''''''")

    // console.log(lecturersData);
    // console.log(academicYears);
    // console.log(semesterData);
    console.log(Courses);

    const openYearModal = () => {
        setOpen(true);
    }

    const openSemesterModal = () => {
        setOpenSemester(true);
    }

    const onSubmit = async (values: AddCourseFormValues) => {
        setLoading(true);
        try {
            console.log(values);
            // get Coourse payload
            const coursePayload = {
                courseCode: values.courseCode + "_" + values.semester,
                courseTitle: values.courseTitle,
                courseLecturer: values.courseLecturer,
                registrationStatus: values.registrationStatus,
                semesterID: values.semester,
                academicYear: values.academicYear,
            }

            try {
                // get semester payload

                // send to db
                await addCourse(coursePayload);

                // show success message
                alert("Course created successfully");
                // add semester to db
                await addSemesterDetails(values.semester, values.academicYear, coursePayload)
                alert("Semester details added successfully");
                refreshPage();

            } catch (error) {
                // handle error
                console.log(error);
                // show alert message
                alert("Error creating course");

                return null;
            }
        }
        catch (error) {
            // handle error
            console.log(error);
            //show alert message

            return null;
        } finally {
            setLoading(false);
        }
    }


    return (
        <main>
            <Navbar />
            <section className="flex">
                <AdminSidebar />
                <section className="text-center grow p-3 pb-4 mt-5">
                    <h1 className="m-3 p-3 text-3xl text-indigo-900">Create Course </h1>
                    <section className="mt-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 px-4 items-center gap-5">
                                    <fieldset className="grid col-span-2 p-7 border border-solid border-indigo-400 rounded">
                                        <legend className="text-indigo-800 font-semibold">Academic Year</legend>
                                        <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-5">
                                            <FormField
                                                control={form.control}
                                                name="academicYear"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-indigo-800 font-semibold">Academic Year</FormLabel>

                                                        <Select
                                                            disabled={loading}
                                                            onValueChange={field.onChange}
                                                            value={field.value || ''}
                                                            defaultValue={field.value || ''}
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
                                            <div className="grid justify-center ">
                                                <PlusCircle className="my-3 mx-10 w-6 h-6  text-indigo-800" onClick={openYearModal} />
                                                <p className="text-indigo-800 font-semibold">Add Academic Year </p>
                                            </div>
                                        </div>



                                    </fieldset>

                                    <fieldset className="grid col-span-2 p-7 border border-solid border-indigo-400 rounded">
                                        <legend className="text-indigo-800 font-semibold">Semester</legend>
                                        <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-5">
                                            <FormField
                                                control={form.control}
                                                name="semester"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-indigo-800 font-semibold">Semester</FormLabel>

                                                        <Select
                                                            disabled={loading}
                                                            onValueChange={field.onChange}
                                                            value={field.value || ''}
                                                            defaultValue={field.value || ''}
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
                                            <div className="grid justify-center ">
                                                <PlusCircle className="my-3 mx-10 w-6 h-6  text-indigo-800" onClick={openSemesterModal} />
                                                <p className="text-indigo-800 font-semibold">Add Semester </p>
                                            </div>
                                        </div>



                                    </fieldset>

                                    

                                        <FormField
                                            control={form.control}
                                            name="courseCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-indigo-800 font-semibold">Course Code</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" placeholder="Course Code" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="courseTitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-indigo-800 font-semibold">Course Title</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" placeholder="Course Title" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="courseLecturer"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-indigo-800 font-semibold">Course Lecturer</FormLabel>
                                                    <Select
                                                        disabled={loading}
                                                        onValueChange={field.onChange}
                                                        value={field.value || ''}
                                                        defaultValue={field.value || ''}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    defaultValue={field.value}
                                                                    placeholder="Select Lecturer">

                                                                </SelectValue>
                                                            </SelectTrigger>

                                                        </FormControl>
                                                        <SelectContent>
                                                            {lecturersData?.map((lecturer) => (
                                                                <SelectItem
                                                                    key={lecturer.lectId}
                                                                    value={lecturer.lectId}
                                                                >
                                                                    {lecturer.firstName + " " + lecturer.lastName}

                                                                </SelectItem>
                                                            ))}

                                                        </SelectContent>

                                                    </Select>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="registrationStatus"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-indigo-800 font-semibold">Registration Status</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            disabled={loading}
                                                            onValueChange={field.onChange}
                                                            value={field.value || ''}
                                                            defaultValue={field.value || ''}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue
                                                                        defaultValue={field.value}
                                                                        placeholder="Select Status">

                                                                    </SelectValue>
                                                                </SelectTrigger>

                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem
                                                                    key="open"
                                                                    value="open"
                                                                >
                                                                    Open

                                                                </SelectItem>
                                                                <SelectItem
                                                                    key="closed"
                                                                    value="closed"
                                                                >
                                                                    Closed

                                                                </SelectItem>

                                                            </SelectContent>

                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                   

                                </div>
                                <Button className="mt-16 hover:border-2 border-solid border-indigo-800" type="submit" disabled={loading}>Create Course</Button>
                            </form>
                        </Form>

                    </section>
                    <div className="grid grid-cols-1">
                        <Separator className="my-4" />
                        <h2 className="text-indigo-800 my-6 font-semibold">Courses List</h2>
                        <DataTable columns={columns} data={Courses ? Courses : []} searchKey="courseCode" />
                    </div>
                </section>
            </section>
            <AcademicModal
                isOpen={open}
                onClose={() => setOpen(false)}
            />
            <SemesterModal
                isOpen={openSemester}
                onClose={() => setOpenSemester(false)}
            />
        </main>
    )
} 
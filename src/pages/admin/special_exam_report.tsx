import AdminSidebar from "@/components/admin_sidebar";
import Navbar from "@/components/navbar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { Student, getAllStudents, getStudentCourses, saveSpecialCase } from "../../../firebase/db_fun";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";


const formSchema = z.object({
    studentID: z.string(),
    courseCode: z.string(),
    remarks: z.string()
});

type SpecialExamFormValues = z.infer<typeof formSchema>;

export default function SpecialExamReportPage() {




    const form = useForm<SpecialExamFormValues>({
        resolver: zodResolver(formSchema),
    });
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [students, setStudents] = useState<Student[] | null>(null);

    useEffect(() => {
        const getStudentsDetails = async () => {
            const data = await getAllStudents();
            console.log(data);
            setStudents(data);
            return data;
        }
        getStudentsDetails();
    }, []);

    const getStudCourses = async (studentId: string) => {
        setLoading(true);
        console.log(studentId);
        const data = await getStudentCourses(studentId);

        console.log(data);
        setCourses(data);
        setLoading(false);
    }

    const onSubmit = async (values: SpecialExamFormValues) => {
        setLoading(true);
        console.log(values);

        await saveSpecialCase(values.studentID , values.courseCode ,values.remarks);
        setLoading(false);
    }

    return (
        <main>
            <Navbar />
            <section className="flex">
                <AdminSidebar />
                <section className="text-center grow p-3 pb-4 mt-5">
                    <h1 className="m-3 p-3 text-3xl text-indigo-900">Special Exam Form </h1>
                    <section className="mt-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-2 px-4 items-center gap-5">
                                    <fieldset className="grid col-span-2 p-7 border border-solid border-indigo-400 rounded">
                                        <legend className="text-indigo-800 font-courseibold">Select Course Code to view marks</legend>
                                        <div className="grid grid-cols-2 justify-between gap-5">
                                            <FormField
                                                control={form.control}
                                                name="studentID"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-indigo-800 font-courseibold">Course Code</FormLabel>

                                                        <Select
                                                            disabled={loading}
                                                            onValueChange={(value) => {
                                                                field.onChange(value);
                                                                getStudCourses(value);

                                                            }}
                                                            value={field.value}
                                                            defaultValue={field.value}

                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue
                                                                        defaultValue={field.value}
                                                                        placeholder="Select Student">

                                                                    </SelectValue>
                                                                </SelectTrigger>

                                                            </FormControl>
                                                            <SelectContent>
                                                                {students?.map((student) => (
                                                                    <SelectItem
                                                                        key={student?.studId}
                                                                        value={student?.studId}
                                                                    >
                                                                        {student?.firstName + " " + student?.lastName}

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
                                    <fieldset className="grid col-span-2 p-7 border border-solid border-indigo-400 rounded">
                                        <legend className="text-indigo-800 font-courseibold">Select Course Code to view marks</legend>
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
                                                                // getStudCourses(value);
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

                                        </div>

                                    </fieldset>


                                    <div className="grid w-full col-span-2 ">
                                        <FormField
                                            control={form.control}
                                            name="remarks"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-indigo-800 font-bold">Course Code</FormLabel>
                                                    <FormControl>
                                                    <Textarea className="h-60" placeholder="Reason for special Exam " {...field} />
                                                    </FormControl>
                                                    

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <Button className="mt-16 hover:border-2 border-solid border-indigo-800" type="submit" disabled={loading}>Save</Button>

                            </form>

                        </Form>
                    </section>
                </section>

            </section>
        </main>


    )
}
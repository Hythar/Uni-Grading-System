import * as z from "zod";
import { Modal } from "../ui/modal";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Result } from "@/pages/lecturer/lec_course_mgt";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { auth } from "../../../firebase/firebaseApp";
import { AcademicYear, Lecturer, Semester, getAllAcademicYears, getAllLecturers, getAllSemesters, updateCourse, updateMarks } from "../../../firebase/db_fun";
import { refreshPage } from "@/lib/utils";
import { CourseListColumn } from "@/pages/admin/components/columns";

const EditCourseFormSchema = z.object({
    courseCode: z.string().min(4).max(10),
        courseTitle: z.string().min(4).max(40),
        courseLecturer: z.string().min(4).max(40),
        registrationStatus: z.string().refine(value => value === "open" || value === "closed", {
            message: "Registration status must be either 'open' or 'close'",
        }),
        academicYear: z.string(),
        semesterID: z.string()
})

type EditCourseFormSchemaType = z.infer<typeof EditCourseFormSchema>;

interface EditCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: CourseListColumn | undefined;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({ isOpen, onClose, data }) => {

    // const [open, setOpen] = useState(false);
    const adminID = auth.currentUser?.uid;
    const [loading, setLoading] = useState(false);
    const [lecturersData, setLecturersData] = useState<Lecturer[] | null>(null);
    const [academicYears, setAcademicYears] = useState<AcademicYear[] | null>(null);
    const [semesterData, setSemesterData] = useState<Partial<Semester[]> | null>(null);//
    const form = useForm<EditCourseFormSchemaType>({
        resolver: zodResolver(EditCourseFormSchema),
    });
    // const assessmentArray = ["ASN1", "ASN2", "CAT1", "CAT2", "EXAM"];
    // console.log("prop data")
    // console.log(data);

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

        getLecturerData();
        getAcademicYears();
        getSemesterData();
        
    }, []);

    const onSubmit = async (values: EditCourseFormSchemaType) => {
        // Edit to db
        try {
        setLoading(true);
        console.log("form values")
        console.log(values);

        // update
        if (data?.courseCode === values.courseCode){
        await updateCourse(data.courseCode, values);
        console.log("update done")
        }
        else{
            console.log("course code cannot be changed")
        }
            
        
    } catch (error) {
        console.log(error);
        
    }
    finally {
            refreshPage();
            setLoading(false);
        }
    }

    return (
        <Modal title="Edit Course" description="Edit Course Details" isOpen={isOpen} onClose={onClose}>
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                    <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-1 px-4 items-center gap-5">
                                    <fieldset className="grid col-span-2 p-7 border border-solid border-indigo-400 rounded">
                                        <legend className="text-indigo-800 font-semibold">Academic Year</legend>
                                        <div className="grid grid-cols-1 justify-between gap-5">
                                            <FormField
                                                control={form.control}
                                                name="academicYear"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-indigo-800 font-semibold">Academic Year</FormLabel>

                                                        <Select
                                                            disabled={loading}
                                                            onValueChange={field.onChange}
                                                            value={field.value || ""}
                                                            defaultValue={field.value || ""}
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

                                    <fieldset className="grid col-span-2 p-7 border border-solid border-indigo-400 rounded">
                                        <legend className="text-indigo-800 font-semibold">Semester</legend>
                                        <div className="grid grid-cols-1 justify-between gap-5">
                                            <FormField
                                                control={form.control}
                                                name="semesterID"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-indigo-800 font-semibold">Semester</FormLabel>

                                                        <Select
                                                            disabled={loading}
                                                            onValueChange={field.onChange}
                                                            value={field.value || ""}
                                                            defaultValue={field.value || ""}
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
                                                        <Input type="text" placeholder="Course Title"   {...field} />
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
                                                        value={field.value || ""}
                                                        defaultValue={field.value || ""}
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
                                                            value={field.value || ""}
                                                            defaultValue={field.value || ""}
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
                                <Button className="mt-16 hover:border-2 border-solid border-indigo-800" type="submit" disabled={loading}>Edit Course</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </Modal>)
}
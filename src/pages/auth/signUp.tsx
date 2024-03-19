import React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth"
import { auth, db } from "../../../firebase/firebaseApp";
import { collection, serverTimestamp, setDoc, doc, addDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"


const formSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(8),
    role: z.string().min(2),
});

type registerFormValues = z.infer<typeof formSchema>;

export default function () {

    // TODO: Add state for form inputs
    // const [email, setEmail] = React.useState("");
    // const [password, setPassword] = React.useState("");
    // const [confirmPassword, setConfirmPassword] = React.useState("");
    // const [role, setRole] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();

    const form = useForm<registerFormValues>({
        resolver: zodResolver(formSchema),
    });


    const registerStudentAccount = async (values: registerFormValues) => {
        // validate password and confirm password
        if (values.password !== values.confirmPassword) {
            return alert("Passwords do not match");
        }

        try {
            const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
            return user?.uid || null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }



    const addStudentDetails = async (values: registerFormValues) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const studentRef = doc(collection(db, 'Students'), user.uid);
                const studentData = {
                    studId: user.uid,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    role: values.role,
                    registrationDate: serverTimestamp(),
                }

                await setDoc(studentRef, studentData);

                // const academicYearRef = collection(studentRef, 'AcademicYears');
                // const academicYearDoc = await addDoc(academicYearRef, {});

                // // Create a reference to the newly added document
                // const semesterRef = doc(academicYearRef, academicYearDoc.id, 'Semesters', 'Fall 2023');
                // await setDoc(semesterRef, {});

                // const coursesRef = collection(semesterRef, 'Courses');
                // await addDoc(coursesRef, {});

                // const passedCoursesRef = collection(semesterRef, 'PassedCourses');
                // await addDoc(passedCoursesRef, {});

                // const failedCoursesRef = collection(semesterRef, 'FailedCourses');
                // await addDoc(failedCoursesRef, {});
                console.log("Firestore:User created");
                return studentRef;

            } else {
                console.log("No user found");
            }
        } catch (error) {
            console.error("Error adding student details:", error);
        }
    }

    const addLecturerDetails = async (values: registerFormValues) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const lecturerRef = doc(collection(db, 'Lecturers'), user.uid);
                const lecturerData = {
                    lectId: user.uid,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    role: values.role,
                    registrationDate: serverTimestamp(),
                }

                await setDoc(lecturerRef, lecturerData);
                console.log("Firestore:User(lec) created");
                return lecturerRef;

            } else {
                console.log("No user found");
            }
        } catch (error) {
            console.error("Error adding lecturer details:", error);
        }
    }

    const addAdminDetails = async (values: registerFormValues) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const adminRef = doc(collection(db, 'Admins'), user.uid);
                const adminData = {
                    adminId: user.uid,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    role: values.role,
                    registrationDate: serverTimestamp(),
                }

                await setDoc(adminRef, adminData);
                console.log("Firestore:User(admin) created");
                return adminRef;

            } else {
                console.log("No user found");
            }
        } catch (error) {
            console.error("Error adding admin details:", error);
        }
    }


    const onSubmit = async (values: registerFormValues) => {
        try {
            setLoading(true);
            console.log(values);
            let resp = await registerStudentAccount(values)
            console.log(resp);
            // check if role value is student
            if (values.role === 'student') {
            //     // add student details to firestore
           
            let sign_res = await addStudentDetails(values);
            sign_res ? console.log("User details created") : console.log("Users details not created");
            // navigate("/");
            }
            
            if (values.role === 'lecturer') {
                // add lecturer details to firestore
                let sign_res = await addLecturerDetails(values);
                sign_res ? console.log("User details created (lec)") : console.log("Users details not created");
                // navigate("/");
            }
            if (values.role === 'admin') {
                // add admin details to firestore
                let sign_res = await addAdminDetails(values);
                sign_res ? console.log("User details created (admin)") : console.log("Users details not created");
            }
            // show success message alert
            alert("User created successfully");
            // 
            navigate("/");

        } catch (error) {
            console.log(error);
        }
    };



    return (
        <div className="grid place-items-center justify-center h-screen">
            <Card className="w-[500px] shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="bg-indigo-400 text-white p-6">
                    <CardTitle className="text-2xl text-center">Sign Up!</CardTitle>
                    {/* <CardDescription>Card Description</CardDescription> */}
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid w-75 items-center gap-5 pt-4">
                                {/* <div className="w-full">
                                <FormLabel className="text-base font-semibold" htmlFor="email">Email</FormLabel>
                                <Input id="email" type="email" placeholder="Email" />
                            </div> */}
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="First Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Last Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* <div className="w-full">
                                <Label className="text-base font-semibold" htmlFor="password">Password</Label>
                                <Input id="password" type="password" placeholder="Password" />
                            </div> */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* <div className="w-full">
                                <Label className="text-base font-semibold" htmlFor="password">Confirm Password</Label>
                                <Input id="confirmPassword" type="password" placeholder="Password" />
                            </div> */}
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input id="confirmPassword" type="password" placeholder="Confirm Password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* <div className="w-full">
                                <Label className="text-base font-semibold" htmlFor="role">Role</Label>
                                <Select>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="lecturer">Lecturer</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        
                                    </SelectContent>
                                </Select>
                            </div> */}
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Role:</FormLabel>
                                            <FormControl>
                                                <Select
                                                    disabled={loading}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger id="role">
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="student">Student</SelectItem>
                                                        <SelectItem value="lecturer">Lecturer</SelectItem>
                                                        <SelectItem value="admin">Admin</SelectItem>

                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <CardFooter className="grid place-items-center">
                                    <Button disabled={loading} type="submit">Sign Up</Button>
                                </CardFooter>


                            </div>
                        </form>
                    </Form>
                </CardContent>

            </Card>
        </div>
    );

}
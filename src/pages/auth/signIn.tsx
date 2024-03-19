import React from "react"
import {
    Card,
    CardContent,
   
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
import { Link, useNavigate } from "react-router-dom"
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UserCredential, signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../../../firebase/firebaseApp";
import { doc, getDoc } from "firebase/firestore"

// set up form validation using zod
const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(8),
    role: z.string().min(3).max(10),
});

type SignInFormValues = z.infer<typeof formSchema>;

export default function () {
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const form = useForm<SignInFormValues>({
        resolver: zodResolver(formSchema),
    });

    const signInUser = async (values: SignInFormValues) => {
        setLoading(true);
        try {
            console.log(values);
            // make request to sign in
            const userCredential: UserCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
            return user?.uid || null;
        } catch (error) {
            // handle error
            console.log(error);
            //show alert message
            alert("Invalid Credentials: Sign Up or Try Again");
            return null;
        } finally {
            setLoading(false);
        }
    }

    const onSubmit = async (values: SignInFormValues) => {
        setLoading(true);
        try {
            // console.log(values);
            // make request to sign in
            let resp = await signInUser(values);
            console.log(resp);
            // get user data from firestore depending on the role

            //ref
            if (resp && values.role === "student") {
                const userRef = doc(db, "Students", resp);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    console.log("Document data:", userDoc.data());
                    // if successful, redirect to dashboard
                    // redirect to dashboard
                    console.log(userDoc.data()?.role);
                    if (userDoc.data()?.role === values.role) {
                        navigate("/stud-dashboard");
                    }
                } else {
                    console.log("Wrong credentials ")
                    alert("Invalid Credentials: Sign Up or Try Again");

                }
   
            }
            else if (resp && values.role === "lecturer") {
                const userRef = doc(db, "Lecturers", resp);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    console.log("Document data:", userDoc.data());
                    // if successful, redirect to dashboard
                    // redirect to dashboard
                    console.log(userDoc.data()?.role);
                    if (userDoc.data()?.role === "lecturer") {
                        navigate("/lec-dashboard");
                    }
                    else {
                        console.log("Wrong credentials ")
                        alert("Invalid Credentials: Sign Up or Try Again");
                    }

                }else {
                    console.log("Wrong credentials ")
                    alert("Invalid Credentials: Sign Up or Try Again");

                }
            } else if (resp && values.role === "admin") {
                const userRef = doc(db, "Admins", resp);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    console.log("Document data:", userDoc.data());
                    // if successful, redirect to dashboard
                    // redirect to dashboard
                    console.log(userDoc.data()?.role);
                    if (userDoc.data()?.role === "admin") {
                        navigate("/admin-dashboard");
                    }

                }
                else {
                    console.log("Wrong credentials ")
                    alert("Invalid Credentials: Sign Up or Try Again");

                }
            }
            else {
                // doc.data() will be undefined in this case

                console.log("No such document!");

            }
        }

        catch (error) {
            // handle error
            console.log(error);

        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="grid place-items-center justify-center h-screen">
            <Card className="w-[500px] shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="bg-indigo-400 text-white p-6">
                    <CardTitle className="text-2xl text-center">Welcome</CardTitle>
                    {/* <CardDescription>Card Description</CardDescription> */}
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid w-75 items-center gap-5 p-3">
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

                                <CardFooter className="grid place-items-center gap-5">
                                    <Button type="submit" disabled={loading}>Sign In</Button>
                                    <p className="text-sm"> Don't have an account?
                                        <Link to="/signUp" className="text-blue-500"> Sign Up</Link></p>
                                </CardFooter>
                            </div>
                        </form>
                    </Form>
                </CardContent>

            </Card>
        </div>
    );

}
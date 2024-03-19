import * as z from "zod";
import { Modal } from "../ui/modal";
import { useState } from "react";
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
import { updateMarks } from "../../../firebase/db_fun";
import { refreshPage } from "@/lib/utils";

const EditMarksFormSchema = z.object({
    // studentID: z.string(),
    // courseCode: z.string(),
    assessmentID: z.string(),
    score: z.string().max(3),
    total: z.string().max(3),
})

type EditMarksFormSchemaType = z.infer<typeof EditMarksFormSchema>;

interface EditMarksModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: Result | undefined;
}

export const EditMarksModal: React.FC<EditMarksModalProps> = ({ isOpen, onClose, data }) => {

    // const [open, setOpen] = useState(false);
    const adminID = auth.currentUser?.uid;
    const [loading, setLoading] = useState(false);
    const form = useForm<EditMarksFormSchemaType>({
        resolver: zodResolver(EditMarksFormSchema),
    });
    // const assessmentArray = ["ASN1", "ASN2", "CAT1", "CAT2", "EXAM"];
    console.log(data);

    const onSubmit = async (values: EditMarksFormSchemaType) => {
        // Edit to db
        try {
        setLoading(true);
        console.log(values);
        const marksPayload = {
            studentID: data?.studentID,
            markID: `${data?.studentID}_${data?.courseCode}_${values.assessmentID}`,       
            assessmentID: values.assessmentID,
            score: Number(values.score),
            total: Number(values.total),
            type: values.assessmentID.includes("CAT") ? "CAT" : values.assessmentID.includes("ASN") ? "assignment" : "exam",
        }
        console.log(marksPayload);
        if (adminID && data?.markID) {
            console.log("updating marks");
            console.log(data?.markID);
            console.log(adminID);

            await updateMarks(marksPayload, adminID, marksPayload.markID);
        }
        else {
            alert("Error: Parameters not found");
        }
            
            setLoading(false);
            refreshPage();
            // alert("Marks Edited Successfully");
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <Modal title="Edit Marks" description="Edit marks for a student" isOpen={isOpen} onClose={onClose}>
            <div>
            {loading ? (
                // Spinner
                <div className="flex justify-center items-center ">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : (
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-rows-1 space-y-2">
                            <FormField
                                    control={form.control}
                                    name="assessmentID"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Assessment:</FormLabel>
                                            <FormControl>
                                                <Select
                                                    disabled={loading}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger id="assessmentID">
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="ASN1">Assignment 1</SelectItem>
                                                        <SelectItem value="ASN2">Assignment 2</SelectItem>
                                                        <SelectItem value="CAT1">CAT 1</SelectItem>
                                                        <SelectItem value="CAT2">CAT 2</SelectItem>
                                                        <SelectItem value="EXAM">Exam</SelectItem>
                                                        </SelectContent>
                                                </Select>
                                                </FormControl>
                                                <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="score"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Score</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Score" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="total"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Total" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />

                                </div>

                                <Button className="mt-16 hover:border-2 border-solid border-indigo-800" type="submit" disabled={loading}>Edit Mark</Button>

                            </form>
                        </Form>
                    </div>
                </div>
            )}
            </div>
        </Modal>)
}
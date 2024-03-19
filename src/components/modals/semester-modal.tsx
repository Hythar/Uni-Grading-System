import * as z from "zod";
import { Modal } from "../ui/modal";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { addSemester } from "../../../firebase/db_fun";


const SemesterFormSchema = z.object({
    semesterID: z.string().min(6, "Please enter a valid semester").regex(/^([A-Za-z]{2})(\d{4})$/, "Please enter a valid semester format") // FS2023
})

type SemesterFormSchemaType = z.infer<typeof SemesterFormSchema>;

interface SemesterModalProps {
    isOpen: boolean;
    onClose: () => void;}

export const SemesterModal:React.FC<SemesterModalProps> =  ({isOpen, onClose}) => {

    const [open , setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const form = useForm<SemesterFormSchemaType>({
        resolver: zodResolver(SemesterFormSchema),
    });

    const onSubmit = async (values: SemesterFormSchemaType) => {
        setLoading(true);
        console.log(values);
        const semesterPayload = values.semesterID.toUpperCase();
        

        // add to db
        try {
            await addSemester(semesterPayload);
            setLoading(false);
            alert("Semester Year Added Successfully");
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }




    return(
        <Modal title="Add Semester " description="Add new Semester in the format, FS2023 for  Fall 2023" isOpen={isOpen} onClose={onClose}>
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            
                                <div className="grid grid-rows-1 space-y-2">
                                <FormField
                                        control={form.control}
                                        name="semesterID"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-indigo-800 font-semibold">Semester </FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Semester " {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                <Button className="mt-16 hover:border-2 border-solid border-indigo-800" type="submit" disabled={loading}>Create </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>

        </Modal>
    )
}

export default SemesterModal;
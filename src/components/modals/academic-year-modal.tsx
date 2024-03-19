import * as z from "zod";
import { Modal } from "../ui/modal";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { addAcademicYear } from "../../../firebase/db_fun";


const AcademicYearFormSchema = z.object({
    academicYear: z.string().min(4, "Please enter a valid acadamic year"),
    
})

type AcademicYearFormSchemaType = z.infer<typeof AcademicYearFormSchema>;

interface AcademicModalProps {
    isOpen: boolean;
    onClose: () => void;}

export const AcademicModal:React.FC<AcademicModalProps> =  ({isOpen, onClose}) => {

    const [open , setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const form = useForm<AcademicYearFormSchemaType>({
        resolver: zodResolver(AcademicYearFormSchema),
    });

    const onSubmit = async (values: AcademicYearFormSchemaType) => {
        setLoading(true);
        console.log(values);
        const yearPayload = values.academicYear;
        

        // add to db
        try {
            await addAcademicYear(yearPayload);
            setLoading(false);
            alert("Academic Year Added Successfully");
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }




    return(
        <Modal title="Add Academic Year" description="Add new Academic Year e.g 2023" isOpen={isOpen} onClose={onClose}>
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            
                                <div className="grid grid-rows-1 space-y-2">
                                <FormField
                                        control={form.control}
                                        name="academicYear"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-indigo-800 font-semibold">Academic Year</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="Academic Year" {...field} />
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

export default AcademicModal;
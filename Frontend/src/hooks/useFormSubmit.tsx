// src/hooks/useFormSubmit.ts
import axios from 'axios';
import { toast } from 'react-toastify';
import { z, ZodTypeAny } from 'zod';

export function useFormSubmit<T extends ZodTypeAny>(apiUrl: string,reset?:any) {
  const onSubmit = async (values: z.infer<T>) => {
    try {
      console.log(values)
      const response = await axios.post(apiUrl, values);
      console.log('Success:', response.data);  // Logging the server response
      toast.success('Submission successful!');  // Display a success toast
     reset && reset()
    } catch (error: any) {
      console.error('Error submitting form:', error.response ? error.response.data : error.message);
      toast.error(`Submission failed: ${error.response ? error.response.data.message : error.message}`);  // Display an error toast
    }
  };

  return onSubmit;
}

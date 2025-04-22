import axios from 'axios';
import { toast } from 'react-toastify';
import { z, ZodTypeAny } from 'zod';

export function useFormUpdate<T extends ZodTypeAny>(apiUrl: string,updateid?: number) {
  const onUpdate = async (data: z.infer<T>) => {
    const { id, ...values } = data; // Extract the id and values

    // Ensure data is the correct type for the API update
    if (id?!id:!updateid) {
      toast.error('Missing ID for update');
      return;
    }
console.log(data)
    try {
      const response = await axios.put(`${apiUrl}/${id?id:updateid}`, values);  // Use the id to update
      console.log('Update Success:', response.data);  // Logging the server response
      toast.success('Update successful!');  // Display a success toast
    } catch (error: any) {
      console.error('Error updating form:', error.response ? error.response.data : error.message);
      toast.error(`Update failed: ${error.response ? error.response.data.message : error.message}`);  // Display an error toast
    }
  };

  return onUpdate;
}

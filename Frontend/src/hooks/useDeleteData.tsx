import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';

export function useDeleteData() {
  const [loading, setLoading] = useState(false); // Manage loading state

  const onDelete = async (apiUrl: string, id: string | number) => {
    setLoading(true); // Set loading to true when the delete request starts
    try {
      const response = await axios.delete(`${apiUrl}/${id}`); // Perform the DELETE request
      console.log('Delete Success:', response.data); // Logging the server response
      toast.success('Delete successful!'); // Display a success toast
    } catch (error: any) {
      console.error('Error deleting data:', error.response ? error.response.data : error.message);
      toast.error(`Delete failed: ${error.response ? error.response.data.message : error.message}`); // Display an error toast
    } finally {
      setLoading(false); // Set loading to false once the request is completed (either success or failure)
    }
  };

  return { onDelete, loading }; // Return both the delete function and loading state
}

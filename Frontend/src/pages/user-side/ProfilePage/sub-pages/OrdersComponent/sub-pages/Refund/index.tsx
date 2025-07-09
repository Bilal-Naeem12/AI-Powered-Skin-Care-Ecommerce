import React, { useState } from "react";
import ImagePicker from "../LeaveReview/ImagePicker"; // ✅ re-use your existing picker!
import usePostAuthData from "@/hooks/usePostAuthData";
import useUserStore from "@/store/UserStore";

interface Props {
  orderId: string;
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export default function RefundRequestModal({
  orderId,
  open,
  onClose,
  onSubmitted,
}: Props) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const {user}= useUserStore()
const username = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  const { postData, loading, error } = usePostAuthData<
    { message: string },
    { reason: string; details?: string; images: string[],username:string }
  >();

  if (!open) return null;

  const submit = async () => {
    await postData(
      `${import.meta.env.VITE_API_BACKEND_URL}/refund-requests/${orderId}`,
      { reason, details, images ,username},
      "Refund request submitted!"
    );
    if (!error && onSubmitted) {
      onSubmitted();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-md shadow-lg w-full max-w-lg p-6 overflow-auto">
        <h2 className="text-lg font-semibold mb-4">Request Refund / Return</h2>

        {/* Reason */}
        <label className="block mb-4">
          <span className="block text-sm font-medium mb-1">Reason *</span>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="">Select reason</option>
            <option value="Item defective">Item defective</option>
            <option value="Wrong item received">Wrong item received</option>
            <option value="Changed my mind">Changed my mind</option>
            <option value="Other">Other</option>
          </select>
        </label>

        {/* Details */}
        <label className="block mb-4">
          <span className="block text-sm font-medium mb-1">Additional Details</span>
          <textarea
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
            placeholder="Add any additional information to support your request..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          ></textarea>
        </label>

        {/* Image Picker */}
        <div className="mb-6">
          <span className="block text-sm font-medium mb-1">Upload Proof Images</span>
       <ImagePicker
  productId={orderId}
  uploadUrl={`/refund-requests/${orderId}/images`}
  onUploaded={(urls) => setImages(urls)}
/>
        </div>

        {/* Submit */}
        <button
          onClick={submit}
          disabled={!reason || loading}
          className="w-full bg-orange-500 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>

        {/* Cancel */}
        <button
          onClick={onClose}
          className="mt-3 w-full text-center text-sm text-gray-500 underline"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

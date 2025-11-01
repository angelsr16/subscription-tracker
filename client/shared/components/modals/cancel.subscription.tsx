import { Subscription } from "@/types/subscription";
import { X } from "lucide-react";
import React from "react";

const CancelSubscriptionModal = ({
  subscription,
  onClose,
  onConfirm,
}: {
  subscription: Subscription;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/65 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-[450px] shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <h3 className="text-xl text-white">Cancel Subscription</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white cursor-pointer"
            type="button"
          >
            <X size={22} />
          </button>
        </div>

        <p className="text-gray-300 mt-4">
          Are you sure you want to cancel{" "}
          <span className="font-semibold text-white">{subscription.name}</span>
          ?
          <br />
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-white cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white cursor-pointer"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;

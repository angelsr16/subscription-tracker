import { ReactivateData } from "@/app/(routes)/dashboard/all-subscriptions/page";
import { Subscription } from "@/types/subscription";
import { X } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

type FormData = {
  startDate: Date;
};

const ReactivateSubscriptionModal = ({
  subscription,
  onClose,
  onConfirm,
}: {
  subscription: Subscription;
  onClose: () => void;
  onConfirm: (data: ReactivateData) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    onConfirm({
      subscriptionId: subscription._id,
      startDate: data.startDate,
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/65 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-[450px] shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <h3 className="text-xl text-white">Reactivate Subscription</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white cursor-pointer"
            type="button"
          >
            <X size={22} />
          </button>
        </div>

        <p className="text-gray-300 mt-4">
          Are you sure you want to reactivate{" "}
          <span className="font-semibold text-white">{subscription.name}</span>
          ?
          <br />
        </p>

        <hr className="mb-5 mt-2 text-slate-500" />

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block font-semibold text-gray-300 mb-1">
            Start Date / Last Renewal Date
          </label>

          <input
            type="date"
            className="w-full border outline-none border-zinc-600 bg-transparent p-2 rounded-md text-white"
            max={new Date().toISOString().split("T")[0]} // prevents future dates
            {...register("startDate", {
              required: "Start date is required",
              validate: (value) => {
                const selected = new Date(value);
                const now = new Date();
                if (selected > now) {
                  return "You cannot select a future date";
                }
                return true;
              },
            })}
          />

          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.startDate.message as string}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-white cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-md text-white cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReactivateSubscriptionModal;

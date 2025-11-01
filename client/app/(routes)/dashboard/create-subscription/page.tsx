"use client";
import axiosInstance from "@/utils/axiosInstance";
import { categories } from "@/utils/categories";
import { currencies } from "@/utils/currencies";
import { frecuencies } from "@/utils/frecuencies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormData = {
  name: string;
  price: number;
  currency: string;
  frecuency: string;
  category: string;
  paymentMethod: string;
  startDate: Date;
};

const CreateSubscription = () => {
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const createSubscriptionMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await axiosInstance.post("/api/v1/subscriptions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-subscriptions"] });
      toast.success("Subscription Added", {
        position: "top-right",
      });
      reset();
    },
  });

  const onSubmit = (data: FormData) => {
    createSubscriptionMutation.mutate(data);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10">Register Subscription</h1>

      <form
        className="rounded-lg lg:w-7/8 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex md:flex-row flex-col gap-2 mb-4">
          <div className="flex-1 mb-4">
            <label className="block font-semibold text-gray-300 mb-1">
              Name
            </label>

            <input
              type="text"
              className={`w-full border outline-none border-zinc-600 bg-transparent p-2 rounded-md text-white`}
              {...register("name", { required: "Name is required" })}
            />

            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div className="flex-1 mb-4">
            <label className="block font-semibold text-gray-300 mb-1">
              Price
            </label>

            <input
              type="number"
              step="any"
              className={`w-full border outline-none border-zinc-600 bg-transparent p-2 rounded-md text-white`}
              {...register("price", {
                valueAsNumber: true,
                min: { value: 1, message: "Price must be at least 1" },
                validate: (value) =>
                  !isNaN(value) || "Only numbers are allowed",
              })}
            />

            {errors.price && (
              <p className="text-red-500 text-xs mt-1">
                {errors.price.message as string}
              </p>
            )}
          </div>

          <div className="flex-1 mb-4">
            <label className="block font-semibold text-gray-300 mb-1">
              Currency
            </label>

            <Controller
              name="currency"
              control={control}
              rules={{ required: "Currency is required" }}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full border outline-none border-zinc-600 bg-transparent p-2 rounded-md"
                >
                  <option value="" className="bg-black">
                    Select currency
                  </option>

                  {currencies?.map((currency: string) => (
                    <option
                      value={currency}
                      key={currency}
                      className="bg-black"
                    >
                      {currency.toUpperCase()}
                    </option>
                  ))}
                </select>
              )}
            />

            {errors.currency && (
              <p className="text-red-500 text-xs mt-1">
                {errors.currency.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="flex md:flex-row flex-col gap-2 mb-4">
          <div className="flex-1 mb-4">
            <label className="block font-semibold text-gray-300 mb-1">
              Frecuency
            </label>

            <Controller
              name="frecuency"
              control={control}
              rules={{ required: "Frecuency is required" }}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full border outline-none border-zinc-600 bg-transparent p-2 rounded-md"
                >
                  <option value="" className="bg-black">
                    Select frecuency
                  </option>

                  {frecuencies?.map((frecuency: string) => (
                    <option
                      value={frecuency}
                      key={frecuency}
                      className="bg-black"
                    >
                      {frecuency.toUpperCase()}
                    </option>
                  ))}
                </select>
              )}
            />

            {errors.frecuency && (
              <p className="text-red-500 text-xs mt-1">
                {errors.frecuency.message as string}
              </p>
            )}
          </div>

          <div className="flex-1 mb-4">
            <label className="block font-semibold text-gray-300 mb-1">
              Category
            </label>

            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full border outline-none border-zinc-600 bg-transparent p-2 rounded-md"
                >
                  <option value="" className="bg-black">
                    Select category
                  </option>

                  {categories?.map((category: string) => (
                    <option
                      value={category}
                      key={category}
                      className="bg-black"
                    >
                      {category.toUpperCase()}
                    </option>
                  ))}
                </select>
              )}
            />

            {errors.category && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category.message as string}
              </p>
            )}
          </div>

          <div className="flex-1 mb-4">
            <label className="block font-semibold text-gray-300 mb-1">
              Payment Method
            </label>

            <Controller
              name="paymentMethod"
              control={control}
              rules={{ required: "Payment method is required" }}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full border outline-none border-zinc-600 bg-transparent p-2 rounded-md text-white"
                >
                  <option value="">Select payment method</option>

                  {[
                    "Credit Card",
                    "Debit Card",
                    "PayPal",
                    "Bank Transfer",
                    "Cash",
                  ].map((method) => (
                    <option value={method} key={method}>
                      {method.toUpperCase()}
                    </option>
                  ))}
                </select>
              )}
            />

            {errors.paymentMethod && (
              <p className="text-red-500 text-xs mt-1">
                {errors.paymentMethod.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="flex  gap-2 mb-4">
          <div className="md:w-1/3 w-full mb-4">
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
          </div>
        </div>

        <hr className="my-5 text-zinc-500" />

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-950 text-white rounded-md cursor-pointer"
            disabled={createSubscriptionMutation.isPending}
          >
            {createSubscriptionMutation.isPending ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSubscription;

"use client";
import axiosInstance from "@/utils/axiosInstance";
import { categories } from "@/utils/categories";
import { currencies } from "@/utils/currencies";
import { frecuencies } from "@/utils/frecuencies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

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
      queryClient.invalidateQueries({ queryKey: ["shop-discounts"] });
      reset();
    },
  });

  const onSubmit = (data: FormData) => {
    createSubscriptionMutation.mutate(data);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10">Subscription</h1>

      <form className="p-5 rounded-lg w-2/3" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-2 mb-4">
          <div className="w-1/3 mb-4">
            <label className="block font-semibold text-gray-300 mb-1">
              Subscription Name
            </label>

            <input
              type="text"
              className={`w-full border outline-none border-gray-700 bg-transparent p-2 rounded-md text-white`}
              {...register("name", { required: "Name is required" })}
            />

            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div className="w-1/3 mb-4">
            <label className="block font-semibold text-gray-300 mb-1">
              Price
            </label>

            <input
              type="number"
              step="any"
              className={`w-full border outline-none border-gray-700 bg-transparent p-2 rounded-md text-white`}
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

          <div className="w-1/3 mb-4">
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
                  className="w-full border outline-none border-gray-700 bg-transparent p-2 rounded-md"
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

        <div className="flex gap-2 mb-4">
          <div className="w-1/3 mb-4">
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
                  className="w-full border outline-none border-gray-700 bg-transparent p-2 rounded-md"
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

          <div className="w-1/3 mb-4">
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
                  className="w-full border outline-none border-gray-700 bg-transparent p-2 rounded-md"
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

          <div className="w-1/3 mb-4">
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
                  className="w-full border outline-none border-gray-700 bg-transparent p-2 rounded-md text-white"
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

        <div className="flex gap-2 mb-4">
          <div className="w-1/3 mb-4">
            <label className="block font-semibold text-gray-300 mb-1">
              Start Date / Last Renewal Date
            </label>

            <input
              type="date"
              className="w-full border outline-none border-gray-700 bg-transparent p-2 rounded-md text-white"
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

        <hr className="my-5 text-slate-700" />

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer"
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

"use client";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { format } from "date-fns";
import axiosInstance from "@/utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Subscription } from "@/types/subscription";
import { CalendarSync } from "lucide-react";
import { useState } from "react";
import RenewSubscriptionModal from "@/shared/components/modals/renew.subscription";

const Dashboard = () => {
  const queryClient = useQueryClient();

  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription>();
  const [showRenewModal, setShowRenewModal] = useState(false);

  useAuthRedirect({ requireAuth: true });

  const { data, isPending } = useQuery({
    queryKey: ["subscriptions-dashboard"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/api/v1/subscriptions/dashboard`);

        return res.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const renewSubscriptionMutation = useMutation({
    mutationKey: ["renew-subscription"],
    mutationFn: async (subscriptionId: string) => {
      await axiosInstance.put(`/api/v1/subscriptions/${subscriptionId}/renew`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions-dashboard"] });
      setShowRenewModal(false);
      setSelectedSubscription(undefined);
    },
  });

  return (
    <div>
      {isPending ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex flex-col gap-5">
            <h3 className="text-3xl font-bold">Dashboard</h3>

            <div className="flex flex-wrap gap-6">
              <div className="flex-1 px-3 py-2 rounded-lg border-4 border-green-600">
                <h3 className="font-semibold text-lg ">Active</h3>
                <p className="text-center font-bold text-4xl my-5">
                  {data.totalActive}
                </p>
              </div>

              <div className="flex-1 px-3 py-2 rounded-lg border-4 border-blue-600">
                <h3 className="font-semibold text-lg">Monthly Cost</h3>
                <p className="text-center font-bold text-4xl my-5">
                  ${data.monthlyRecurringCost}
                </p>
              </div>

              <div className="flex-1 px-3 py-2 rounded-lg border-4 border-blue-600">
                <h3 className="font-semibold text-lg">Yearly Cost</h3>
                <p className="text-center font-bold text-4xl my-5">
                  ${data.yearlyRecurringCost}
                </p>
              </div>

              <div className="flex-1 px-3 py-2 rounded-lg border-4 border-yellow-400">
                <h3 className="font-semibold text-lg">
                  Upcoming Renewals (next 10 days)
                </h3>
                <p className="text-center font-bold text-4xl my-5">
                  {data.upcomingRenewals.length}
                </p>
              </div>
            </div>

            <hr className="text-zinc-300 my-5" />

            <h3 className="text-2xl font-semibold">Pending to renew</h3>

            <table className="w-full table-fixed text-sm text-left rtl:text-right">
              <thead className="text-xs text-gray-700 uppercase bg-zinc-900 dark:text-white">
                <tr>
                  <th className="px-6 py-3 w-[120px]">Name</th>
                  <th className="px-6 py-3 w-[100px]">Price</th>
                  <th className="px-6 py-3 w-[120px]">Status</th>
                  <th className="px-6 py-3 w-[120px]">Renewal Status</th>
                  <th className="px-6 py-3 w-[160px] whitespace-nowrap">
                    Billing Cycle
                  </th>
                  <th className="w-[100px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.pendingRenewals.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <p className="p-5 text-lg">No pending renewals</p>
                    </td>
                  </tr>
                ) : (
                  <>
                    {data.pendingRenewals.map((subscription: Subscription) => (
                      <tr
                        key={subscription._id}
                        className="border-zinc-700 border-b text-white/80"
                      >
                        <td className="px-6 py-4 font-medium truncate">
                          {subscription.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${subscription.price} {subscription.currency}
                        </td>
                        <td
                          className={`px-6 py-4 font-semibold ${
                            subscription.status === "active"
                              ? "text-green-500"
                              : subscription.status === "expired"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {subscription.status}
                        </td>
                        <td
                          className={`px-6 py-4 font-semibold ${
                            subscription.renewalStatus === "active"
                              ? "text-green-500"
                              : subscription.renewalStatus === "pending" &&
                                "text-gray-500"
                          }`}
                        >
                          {subscription.renewalStatus}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(
                            new Date(subscription.startDate),
                            "dd/MM/yyyy"
                          )}{" "}
                          -{" "}
                          <span className="font-black">
                            {format(
                              new Date(subscription.renewalDate),
                              "dd/MM/yyyy"
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <CalendarSync
                            onClick={() => {
                              setSelectedSubscription(subscription);
                              setShowRenewModal(true);
                            }}
                            size={20}
                            className="text-blue-500 cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Renew subscription modal */}
          {showRenewModal && selectedSubscription && (
            <RenewSubscriptionModal
              subscription={selectedSubscription}
              onClose={() => setShowRenewModal(false)}
              onConfirm={() =>
                renewSubscriptionMutation.mutate(selectedSubscription?._id)
              }
            />
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;

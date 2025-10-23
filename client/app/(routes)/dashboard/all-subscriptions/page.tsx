"use client";
import useUser from "@/hooks/useUser";
import DeleteSubscriptionModal from "@/shared/components/modals/delete.subscription";
import { Subscription } from "@/types/subscription";
import axiosInstance from "@/utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { PenBox, Trash2 } from "lucide-react";
import { useState } from "react";

const AllSubscriptions = () => {
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const queryClient = useQueryClient();
  const { user, isFetched } = useUser();

  const { data: userSubscriptions = [] } = useQuery<Subscription[]>({
    queryKey: ["user-subscriptions"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(
          `/api/v1/subscriptions/user/${user._id}`
        );

        return res.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: !!user?._id && isFetched,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const deleteSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      await axiosInstance.delete(`/api/v1/subscriptions/${subscriptionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-subscriptions"] });
      setShowDeleteModal(false);
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Subscriptions</h1>

      <div className="relative overflow-x-auto mt-10">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-900 dark:text-white">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Last Renewal Date</th>
              <th className="px-6 py-3">Renewal Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userSubscriptions.map((subscription) => (
              <tr key={subscription._id} className="border-slate-800 border-b">
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {subscription.name}
                </td>
                <td className="px-6 py-4">
                  $ {subscription.price} {subscription.currency}
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
                <td className="px-6 py-4">
                  {format(new Date(subscription.startDate), "dd/MM/yyyy")}
                </td>
                <td className="px-6 py-4">
                  {format(new Date(subscription.renewalDate), "dd/MM/yyyy")}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {/* <PenBox className="text-blue-500 cursor-pointer" size={20} /> */}
                  <Trash2
                    onClick={() => {
                      setSelectedSubscription(subscription);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-500 cursor-pointer"
                    size={20}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete discount modal */}
      {showDeleteModal && selectedSubscription && (
        <DeleteSubscriptionModal
          subscription={selectedSubscription}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() =>
            deleteSubscriptionMutation.mutate(selectedSubscription?._id)
          }
        />
      )}
    </div>
  );
};

export default AllSubscriptions;

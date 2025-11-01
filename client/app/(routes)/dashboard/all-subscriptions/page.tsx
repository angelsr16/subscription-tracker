"use client";
import useUser from "@/hooks/useUser";
import CancelSubscriptionModal from "@/shared/components/modals/cancel.subscription";
import DeleteSubscriptionModal from "@/shared/components/modals/delete.subscription";
import EditSubscriptionModal from "@/shared/components/modals/edit.subscription";
import { Subscription } from "@/types/subscription";
import axiosInstance from "@/utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { PenBox, RefreshCcwDot, Trash2, X } from "lucide-react";
import { useState } from "react";

const AllSubscriptions = () => {
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
      setSelectedSubscription(undefined);
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      await axiosInstance.put(`/api/v1/subscriptions/${subscriptionId}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-subscriptions"] });
      setShowDeleteModal(false);
      setSelectedSubscription(undefined);
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Subscriptions</h1>

      <div className="overflow-x-auto mt-10">
        <table className="w-full table-fixed text-sm text-left rtl:text-right">
          <thead className="text-xs text-gray-700 uppercase bg-zinc-900 dark:text-white">
            <tr>
              <th className="px-6 py-3 w-[120px]">Name</th>
              <th className="px-6 py-3 w-[100px]">Price</th>
              <th className="px-6 py-3 w-[120px]">Status</th>
              <th className="px-6 py-3 w-[160px] whitespace-nowrap">
                Last Renewal Date
              </th>
              <th className="px-6 py-3 w-[160px] whitespace-nowrap">
                Renewal Date
              </th>
              <th className="px-6 py-3 w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userSubscriptions.map((subscription) => (
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
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(subscription.startDate), "dd/MM/yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(subscription.renewalDate), "dd/MM/yyyy")}
                </td>
                <td className="px-6 py-4 flex gap-2 shrink-0">
                  <PenBox
                    onClick={() => {
                      setSelectedSubscription(subscription);
                      // setShowEditModal(true);
                    }}
                    size={20}
                    className="text-blue-500 cursor-pointer"
                  />
                  {subscription.status === "active" ? (
                    <X
                      onClick={() => {
                        setSelectedSubscription(subscription);
                        setShowCancelModal(true);
                      }}
                      size={20}
                      className="text-red-400 cursor-pointer"
                    />
                  ) : (
                    <RefreshCcwDot size={20} className="cursor-pointer" />
                  )}

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

      {/* Delete subscription modal */}
      {showDeleteModal && selectedSubscription && (
        <DeleteSubscriptionModal
          subscription={selectedSubscription}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() =>
            deleteSubscriptionMutation.mutate(selectedSubscription?._id)
          }
        />
      )}

      {/* Cancel subscription modal */}
      {showCancelModal && selectedSubscription && (
        <CancelSubscriptionModal
          subscription={selectedSubscription}
          onClose={() => setShowCancelModal(false)}
          onConfirm={() =>
            cancelSubscriptionMutation.mutate(selectedSubscription?._id)
          }
        />
      )}

      {/* Edit subscription modal */}
      {showEditModal && selectedSubscription && (
        <EditSubscriptionModal
          subscription={selectedSubscription}
          onClose={() => setShowEditModal(false)}
          onConfirm={() => {}}
        />
      )}
    </div>
  );
};

export default AllSubscriptions;

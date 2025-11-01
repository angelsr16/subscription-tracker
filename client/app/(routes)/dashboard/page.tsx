"use client";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { format } from "date-fns";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
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

  console.log(data);

  return (
    <div>
      {isPending ? (
        <p>Loading...</p>
      ) : (
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
                <th className="px-6 py-3 w-[160px] whitespace-nowrap">
                  Last Renewal Date
                </th>
                <th className="px-6 py-3 w-[160px] whitespace-nowrap">
                  Renewal Date
                </th>
              </tr>
            </thead>
            <tbody>
              {data.upcomingRenewals.length !== 0 ? (
                <p className="p-5 text-lg">No pending renewals</p>
              ) : (
                <>
                  {data.upcomingRenewals.map((subscription: any) => (
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
                        {format(
                          new Date(subscription.renewalDate),
                          "dd/MM/yyyy"
                        )}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

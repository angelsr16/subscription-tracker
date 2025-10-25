'use client'
import useAuthRedirect from "@/hooks/useAuthRedirect";

const Dashboard = () => {
  useAuthRedirect({ requireAuth: true });
  return <div>Dashboard</div>;
};

export default Dashboard;

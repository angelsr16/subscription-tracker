"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";

export default function useAuthRedirect({ requireAuth = false }) {
  const router = useRouter();

  useEffect(() => {
    axiosInstance
      .get(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/logged-in-user`, {
        withCredentials: true,
      })
      .then(() => {
        if (!requireAuth) router.push("/dashboard");
      })
      .catch(() => {
        if (requireAuth) router.push("/login");
      });
  }, []);
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user`, {
          withCredentials: true,
        });
        router.replace("/dashboard");
      } catch {
        router.replace("/login");
      }
    };
    checkAuth();
  }, [router]);

  return <div>Loading...</div>;
}

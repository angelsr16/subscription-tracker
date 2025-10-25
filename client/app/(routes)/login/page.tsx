"use client";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  useAuthRedirect({ requireAuth: false });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/login-user`,
        data,
        { withCredentials: true }
      );

      return response.data;
    },
    onSuccess: (data) => {
      setServerError(null);
      router.push("/dashboard");
    },
    onError: (error: AxiosError) => {
      console.log(error);
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Invalid credentials";
      setServerError(errorMessage);
    },
  });

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full py-10 min-h-[85vh]">
      <h1 className="text-4xl font-Poppins font-semibold text-center">Login</h1>
      <p className="text-center text-lg font-medium py-3 text-[#ffffff99]">
        Home . Login
      </p>

      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 shadow rounded-lg border-white/30 border-2">
          <h3 className="text-3xl font-semibold text-center mb-2">
            Login to SubsTracker
          </h3>

          <p className="text-center text-gray-500 mb-4">
            Don&apos;t have an account?
            <Link href={"/signup"} className="text-blue-500">
              {" "}
              Sign up
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="email@gmail.com"
              className="w-full p-2 border border-gray-300 !rounded outline-0 mb-1"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {String(errors.email.message)}
              </p>
            )}

            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Min. 6 characters"
                className="w-full p-2 border border-gray-300 !rounded outline-0 mb-1"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <Eye /> : <EyeOff />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {String(errors.password.message)}
                </p>
              )}
            </div>
            <div className="flex justify-between items-center my-4">
              <label className="flex items-center text-gray-600">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>
              <Link href={"/forgot-password"} className="text-blue-500 text-sm">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full text-lg cursor-pointer bg-black text-white py-2 rounded-lg"
            >
              {loginMutation.isPending ? "Login in..." : "Login"}
            </button>

            {serverError && (
              <p className="text-red-500 text-sm mt-2">{serverError}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

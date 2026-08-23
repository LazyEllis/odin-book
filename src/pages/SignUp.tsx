import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "../lib/api-client";
import type { InputProps } from "../interfaces/props";
import Input from "../components/ui/Input";
import Loader from "../components/ui/Loader";
import ErrorAlert from "../components/ui/ErrorAlert";

const inputFields: InputProps[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "username", label: "Username", type: "text" },
  { name: "password", label: "Password", type: "password" },
  { name: "passwordConfirmation", label: "Confirm Password", type: "password" },
];

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    passwordConfirmation: "",
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      navigate("/sign-in");
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <main className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black dark:text-white">
          Create an account
        </h1>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {mutation.error && <ErrorAlert error={mutation.error} />}

          {inputFields.map((field) => (
            <Input
              {...field}
              required
              onChange={handleChange}
              key={field.name}
            />
          ))}

          <div>
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-black/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:bg-white dark:text-black dark:shadow-none dark:hover:bg-white/90 dark:focus-visible:outline-white"
            >
              {mutation.isPending && <Loader isButton />}{" "}
              {mutation.isPending ? "Signing up..." : "Sign up"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/sign-in"
            className="font-semibold text-black hover:text-black/90 dark:text-white dark:hover:text-white/90"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignUp;

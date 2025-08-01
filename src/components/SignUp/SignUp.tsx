import { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../../appwrite/auth/auth";
import { login as authLogin } from "../../features/authSlice";
import { useDispatch } from "react-redux";
import { type accountCredentials } from "../../appwrite/auth/auth";
import Logo from "../Logo/Logo";
import { Link, useNavigate } from "react-router-dom";
import Input from "../Input/Input";
import Button from "../Button/Button";

function SignUp() {
    const { register, handleSubmit } = useForm<accountCredentials>();
    const [error, setError] = useState("");
    const navigator = useNavigate();

    const dispatch = useDispatch();

    const create = async (data: accountCredentials) => {
        setError("");
        try {
            const session = await authService.authCreateAccount(data);
            if (session) {
                const userData = await authService.authGetCurrentUser();
                if (userData) {
                    dispatch(authLogin(userData));
                    navigator("/");
                }
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
                console.log(err?.message);
            } else {
                setError("unexpected error occurred");
                console.log("unexpected error occurred");
            }
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div
                className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
            >
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">
                    Sign up to create account
                </h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(create)}>
                    <div className="space-y-5">
                        <Input
                            type="text"
                            label="Full Name: "
                            placeholder="Enter your full name"
                            {...register("name", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                },
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;

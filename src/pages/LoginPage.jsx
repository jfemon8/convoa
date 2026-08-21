import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import {
  formatBangladeshPhone,
  validateBangladeshPhone,
} from "../utils/phoneValidation";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isLoading } = useAuth();

  const [form, setForm] = useState({
    phone: "",
    name: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");

  const handlePhoneChange = (event) => {
    const value = event.target.value;

    setForm((prev) => ({
      ...prev,
      phone: value,
    }));

    if (value.trim()) {
      setPhoneError(validateBangladeshPhone(value));
    } else {
      setPhoneError("");
    }
  };

  const handleNameChange = (event) => {
    const value = event.target.value;

    setForm((prev) => ({
      ...prev,
      name: value,
    }));

    if (value.trim()) {
      setNameError("");
    } else {
      setNameError("Name is required.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const phone = form.phone.trim();
    const name = form.name.trim();

    const phoneValidationError = validateBangladeshPhone(phone);
    const newNameError = !name ? "Name is required." : "";

    setPhoneError(phoneValidationError);
    setNameError(newNameError);

    // Both fields are empty/invalid
    if (phoneValidationError || newNameError) {
      if (phoneValidationError && newNameError) {
        toast.error("Please enter your phone number and name.");
      } else if (phoneValidationError) {
        toast.error(phoneValidationError);
      } else {
        toast.error(newNameError);
      }

      return;
    }

    try {
      setIsSubmitting(true);

      const normalizedPhone = formatBangladeshPhone(phone);

      await login({
        phone: normalizedPhone,
        name,
      });

      toast.success("Welcome to Convoa!");

      const destination = location.state?.from?.pathname || "/chat";

      navigate(destination, {
        replace: true,
      });
    } catch (error) {
      const message =
        error.response?.data?.error?.message ||
        "Unable to login. Please try again.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-4 lg:p-8 shadow-xl"
      >
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900">
            Welcome to Convoa
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Connect with people and start a conversation.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Phone number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handlePhoneChange}
              placeholder="+880 1XXXXXXXXX"
              inputMode="tel"
              autoComplete="tel"
              disabled={isSubmitting}
              aria-invalid={Boolean(phoneError)}
              aria-describedby="phone-error"
              className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                phoneError
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-300 focus:border-slate-500"
              }`}
            />
            {phoneError && (
              <p id="phone-error" className="mt-2 text-sm text-red-500">
                {phoneError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Your name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleNameChange}
              placeholder="Your name"
              autoComplete="name"
              disabled={isSubmitting}
              aria-invalid={Boolean(nameError)}
              aria-describedby="name-error"
              className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                nameError
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-300 focus:border-slate-500"
              }`}
            />

            {nameError && (
              <p id="name-error" className="mt-2 text-sm text-red-500">
                {nameError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Continue"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default LoginPage;

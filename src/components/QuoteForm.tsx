import React, { useState } from "react";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  message: string;
};

export const QuoteForm: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    source: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      action="https://formsubmit.co/06458ed5d477ca63918bf312b856c5ba"
      method="POST"
      className="bg-black text-white p-8 rounded-lg grid gap-6 md:grid-cols-2 max-w-6xl w-full"
    >
      {["fullName", "email", "phone", "company", "source"].map((field, i) => (
        <div key={field} className="flex flex-col">
          <label className="mb-2">
            {
              {
                fullName: "Full name*",
                email: "Email address*",
                phone: "Phone number*",
                company: "Company",
                source: "How did you hear about us?",
              }[field]
            }
          </label>
          <input
            name={field}
            onChange={handleChange}
            value={(form as any)[field]}
            required={
              field === "fullName" || field === "email" || field === "phone"
            }
            className="p-3 rounded bg-white text-black"
          />
        </div>
      ))}
      {/* spanning both columns */}
      <div className="md:col-span-2 flex flex-col">
        <label className="mb-2">Tell us about your request</label>
        <textarea
          name="message"
          onChange={handleChange}
          value={form.message}
          rows={5}
          className="p-3 rounded bg-white text-black"
        />
      </div>
      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-red-800 px-10 md:px-20 py-3 rounded-md hover:bg-red-700 transition font-bold cursor-pointer"
        >
          {status === "sending" ? "Sending…" : "Submit"}
        </button>
      </div>
      {status === "success" && (
        <p className="md:col-span-2 text-green-400">
          Thanks! We'll be in touch.
        </p>
      )}
      {status === "error" && (
        <p className="md:col-span-2 text-red-400">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
};

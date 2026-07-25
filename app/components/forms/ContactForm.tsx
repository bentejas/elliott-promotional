// components/ContactForm.tsx
import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useSubmit, useNavigation, useActionData } from "react-router";

export default function ContactForm() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData();
  const [formData, setFormData] = useState({
    fullName: "",
    emailOrPhone: "",
    company: "",
    message: "",
  });
  const [formStart, setFormStart] = useState<string>("");

  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    setFormStart(String(Date.now()));
  }, []);

  // Handle action data (success/error responses)
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        toast.success("Thanks! We'll be in touch shortly.");
        // Reset form on success
        setFormData({
          fullName: "",
          emailOrPhone: "",
          company: "",
          message: "",
        });
        setFormStart(String(Date.now()));
      } else if (actionData.error) {
        toast.error(actionData.error);
      }
    }
  }, [actionData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("fullName", formData.fullName);
    formDataToSubmit.append("emailOrPhone", formData.emailOrPhone);
    formDataToSubmit.append("company", formData.company);
    formDataToSubmit.append("message", formData.message);
    // honeypot fields
    formDataToSubmit.append("website", "");
    formDataToSubmit.append("middleName", "");
    // timing field
    formDataToSubmit.append("formStart", formStart);

    // Add form name to the form data instead of header
    formDataToSubmit.append("formName", "home-contact");

    // Submit to current route (should hit the home action)
    submit(formDataToSubmit, {
      method: "post",
    });
  };

  return (
    <div className="w-full">
      <h2 className="text-4xl font-bold text-gray-900 mb-8">Get in touch</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* honeypots */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <input
          type="text"
          name="middleName"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        {/* form start time */}
        <input type="hidden" name="formStart" value={formStart} />
        <div>
          <input
            type="text"
            name="fullName"
            placeholder="Full name"
            aria-label="Full name"
            autoComplete="name"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
            required
          />
        </div>

        <div>
          <input
            type="text"
            name="emailOrPhone"
            placeholder="Email address or phone number"
            aria-label="Email address or phone number"
            value={formData.emailOrPhone}
            onChange={handleInputChange}
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
            required
          />
        </div>

        <div>
          <input
            type="text"
            name="company"
            placeholder="Company"
            aria-label="Company"
            autoComplete="organization"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
          />
        </div>

        <div>
          <textarea
            name="message"
            placeholder="Your message..."
            aria-label="Your message"
            value={formData.message}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent resize-none"
            required
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="inline-flex items-center space-x-3 bg-black text-white px-6 pr-3 py-3 rounded-full hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
            disabled={isSubmitting}
          >
            <span className="text-lg font-medium">
              {isSubmitting ? "Sending..." : "Send"}
            </span>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Send className="w-4 h-4 text-black" />
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}

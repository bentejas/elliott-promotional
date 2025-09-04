// components/ContactForm.tsx
import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    emailOrPhone: "",
    company: "",
    message: "",
  });

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
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="w-full">
      <h2 className="text-4xl font-bold text-gray-900 mb-8">Get in touch</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="fullName"
            placeholder="Full name"
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
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
          />
        </div>

        <div>
          <textarea
            name="message"
            placeholder="Your message..."
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
          >
            <span className="text-lg font-medium">Send</span>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Send className="w-4 h-4 text-black" />
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}

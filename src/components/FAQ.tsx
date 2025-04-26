import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const faqItems: FAQItem[] = [
    {
      question: "Is there a minimum order quantity?",
      answer:
        "Yes, we typically have a minimum order quantity. However, we strive to offer flexible options whenever possible. If you need a smaller run, just reach out and we’ll do our best to accommodate your request. We believe in making promotional products accessible to businesses of all sizes.",
    },
    {
      question: "Can you ship my order directly to me?",
      answer:
        "Yes, we can ship orders directly to your address. We partner with reliable carriers to ensure your products arrive on time and in perfect condition. Whether you need them shipped to a single location or multiple drop-off points, we’ve got you covered.",
    },
    {
      question: "Can I request a product I don’t see on the website?",
      answer:
        "Absolutely! We work with a wide network of suppliers and can often source items not listed on our site. Just send us details about what you’re looking for, and we’ll get back to you promptly with options, pricing, and estimated delivery timelines.",
    },
    {
      question: "Do you offer discounts for larger orders?",
      answer:
        "Yes, volume drives discount. The more you order, the better the per-unit pricing. We’re happy to discuss bulk pricing tiers and find a cost-effective solution that meets your needs and budget.",
    },
    {
      question: "Do you provide samples of products before ordering?",
      answer:
        "Yes, we can provide product samples so you can see and feel the quality before committing to a bulk order. Keep in mind that sample availability may vary depending on the product. Feel free to reach out for specific details on the items you’re interested in.",
    },
  ];

  // Track which FAQ item is open
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="w-full mx-auto mt-8 space-y-4">
      {faqItems.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="rounded-xl overflow-hidden">
            {/* Question Button */}
            <button
              onClick={() => handleToggle(index)}
              className="w-full flex justify-between items-center px-6 py-6 bg-black text-white text-left font-normal cursor-pointer hover:bg-zinc-900"
            >
              <span className="text-sm md:text-lg">{item.question}</span>
              <span className="ml-2">
                {isOpen ? <ChevronUp /> : <ChevronDown />}
              </span>
            </button>
            {/* Answer container with expansion transition */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden bg-zinc-200 ${
                isOpen ? "max-h-[500px] p-6" : "max-h-0 p-0"
              }`}
            >
              {/* Inner text that fades and slides in smoothly */}
              <div
                className={`transition-all duration-500 ease-in-out origin-top ${
                  isOpen
                    ? "opacity-100 translate-y-0 delay-200"
                    : "opacity-0 -translate-y-2"
                }`}
              >
                <p className="text-black text-sm md:text-lg">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FAQSection;

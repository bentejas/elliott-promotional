// types/faq.ts

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    id: "minimum-order",
    question: "Is there a minimum order quantity?",
    answer:
      "Yes, we typically have minimum order quantities that vary by product. Most promotional items have a minimum of 25-50 pieces, but this can vary depending on the specific product and customization requirements. Contact us for specific minimums on your desired items.",
  },
  {
    id: "direct-shipping",
    question: "Can you ship my order directly to me?",
    answer:
      "Absolutely! We can ship your order directly to your business or personal address. We work with reliable shipping partners to ensure your promotional products arrive safely and on time. Shipping costs will be calculated based on your location and order size.",
  },
  {
    id: "custom-requests",
    question: "Can I request a product I don't see on the website?",
    answer:
      "Yes, definitely! Our website showcases our most popular items, but we have access to thousands of promotional products. If you have something specific in mind that you don't see listed, just reach out to us with details and we'll do our best to source it for you.",
  },
  {
    id: "bulk-discounts",
    question: "Do you offer discounts for larger orders?",
    answer:
      "Yes, we offer volume discounts for larger orders. The more you order, the better the per-unit pricing becomes. We'll provide you with a detailed quote that includes any applicable volume discounts based on your specific order quantity and requirements.",
  },
  {
    id: "product-samples",
    question: "Do you provide samples of products before ordering?",
    answer:
      "Yes, we can provide samples for most products so you can see and feel the quality before placing a large order. Sample costs vary by product and may be credited toward your final order. This helps ensure you're completely satisfied with your choice before committing to a full order.",
  },
];

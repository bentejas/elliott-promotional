import React from "react";
import { useState, useRef, useEffect } from "react";

interface Client {
  clientName: string;
  clientImage: string;
  clientWorkDescription: string;
}

const ClientSection: React.FC<{ client: Client; reverse?: boolean }> = ({
  client,
  reverse,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), 300);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row ${
        reverse ? "md:flex-row-reverse" : ""
      } my-8 transition-opacity duration-1000 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="md:w-1/2">
        <img
          src={client.clientImage}
          alt={client.clientName}
          className="w-full"
        />
      </div>
      <div className="md:w-1/2 flex flex-col justify-center p-8">
        <h3 className="text-3xl font-bold">{client.clientName}</h3>
        <p className="mt-4">{client.clientWorkDescription}</p>
      </div>
    </div>
  );
};

const ClientSections: React.FC = () => {
  const clientele: Client[] = [
    {
      clientName: "Auto Manufacturing Plants",
      clientImage: "/images/automotive.webp",
      clientWorkDescription: "Our trusted partner in the auto industry.",
    },
    {
      clientName: "Theme Parks",
      clientImage: "/images/jellystone.webp",
      clientWorkDescription: "Featuring Yogi Bear Jellystone Parks.",
    },
    {
      clientName: "Performing Arts",
      clientImage: "/images/stratford.webp",
      clientWorkDescription:
        "Showcasing National Ballet of Canada and Stratford Festival.",
    },
    {
      clientName: "Trucking Companies",
      clientImage: "/images/trucks.webp",
      clientWorkDescription: "Reliable solutions for the logistics sector.",
    },
    {
      clientName: "Industrial Factories",
      clientImage: "/images/industrial.webp",
      clientWorkDescription: "Innovative products for heavy industry.",
    },
  ];

  return (
    <>
      {clientele.map((client, index) => (
        <ClientSection
          key={client.clientName}
          client={client}
          reverse={index % 2 !== 0}
        />
      ))}
    </>
  );
};

export default ClientSections;

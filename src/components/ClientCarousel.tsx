import React from "react";
import { twMerge } from "tailwind-merge";
import ClientCard from "./ClientCard";
import type { ClientCardType } from "./ClientCard";

const ClientCarousel: React.FC = () => {
  // client cards
  const clientCards: ClientCardType[] = [
    {
      className: "",
      clientName: "Client One",
      clientImage: "./img-1.webp",
      clientWorkDescription: "client one work description...",
    },
    {
      className: "",
      clientName: "Client Two",
      clientImage: "./img-1.webp",
      clientWorkDescription: "client two work description...",
    },
    {
      className: "",
      clientName: "Client Three",
      clientImage: "./img-1.webp",
      clientWorkDescription: "client three work description...",
    },
    {
      className: "",
      clientName: "Client Four",
      clientImage: "./img-1.webp",
      clientWorkDescription: "client four work description...",
    },
    {
      className: "",
      clientName: "Client Five",
      clientImage: "./img-1.webp",
      clientWorkDescription: "client five work description...",
    },
    {
      className: "",
      clientName: "Client Six",
      clientImage: "./img-1.webp",
      clientWorkDescription: "client six work description...",
    },
  ];

  return (
    <div className="flex flex-row justify-center items-center">
      {/** carousel for past client work */}
      {clientCards.map((card) => (
        <ClientCard
          className={card.className}
          clientName={card.clientName}
          clientImage={card.clientImage}
          clientWorkDescription={card.clientWorkDescription}
        />
      ))}
    </div>
  );
};

export default ClientCarousel;

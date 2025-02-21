import React from "react";
import { twMerge } from "tailwind-merge";

interface ClientCardProps {
  clientName: string;
  clientImage: string;
  clientWorkDescription: string;
  className: string;
}

export type ClientCardType = {
  clientName: string;
  clientImage: string;
  clientWorkDescription: string;
  className: string;
};

const ClientCard: React.FC<ClientCardProps> = ({
  clientName,
  clientImage,
  clientWorkDescription,
  className,
}) => {
  return (
    <div
      className={twMerge(
        "flex flex-col justify-start items-center w-full max-w-lg p-4",
        className
      )}
    >
      <div className="flex justify-center items-center w-full my-4">
        <img src={clientImage} alt={clientName} className="w-32" />
      </div>
      <h3 className="text-xl font-bold">{clientName}</h3>
      <p>{clientWorkDescription}</p>
    </div>
  );
};

export default ClientCard;

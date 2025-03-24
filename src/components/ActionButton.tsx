import React from "react";

interface ActionButtonProps {
  text: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, onClick }) => {
  return (
    <button
      className="bg-red-800 text-white rounded-lg px-4 py-2 hover:bg-red-700 cursor-pointer font-bold"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default ActionButton;

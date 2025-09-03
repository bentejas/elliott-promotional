export default function BlackCallout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center items-center p-6 rounded-3xl space-y-2 bg-[#1E1E1E] text-white max-w-xl">
      {children}
    </div>
  );
}

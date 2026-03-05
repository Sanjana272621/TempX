'use client';

import { acknowledgeBreach } from "@/lib/data";
import { useRouter } from "next/navigation";

export default function AcknowledgeButton({ logId }: { logId: string }) {
  const router = useRouter();

  const handleClick = async () => {
    await acknowledgeBreach(logId);
    router.refresh(); // reload data
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
    >
      Acknowledge
    </button>
  );
}

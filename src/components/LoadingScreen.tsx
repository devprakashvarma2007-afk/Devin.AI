import { Loader2 } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#0F0F0F]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={32} className="text-[#6C63FF] animate-spin" />
        <p className="text-[#A0A0A0] text-sm">Loading Devin.AI...</p>
      </div>
    </div>
  );
}

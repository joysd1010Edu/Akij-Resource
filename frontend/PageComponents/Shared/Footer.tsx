/* ==========  frontend/PageComponents/Shared/Footer.tsx  ===============*/
import Image from "next/image";
import { FiMail, FiPhone } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-base md:flex-row md:text-lg">
        <div className="flex items-center gap-2 text-slate-200">
          <span>Powered by</span>
          <Image src="/logo.png" alt="AKIJ Resource" width={110} height={28} />
        </div>

        <div className="flex flex-wrap items-center gap-5 text-slate-300">
          <span className="font-medium">Helpline</span>
          <span className="inline-flex items-center gap-1.5">
            <FiPhone size={14} /> +88 011020202505
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FiMail size={14} /> support@akij.work
          </span>
        </div>
      </div>
    </footer>
  );
}

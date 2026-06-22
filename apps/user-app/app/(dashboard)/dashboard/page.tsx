
"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/signin");
  };

  return (
    <div className="p-8 w-full flex flex-col justify-between min-h-[calc(100vh-80px)]">
      <div>
        <h1 className="text-4xl font-extrabold text-[#6a51a6] tracking-tight mb-2">
          Dashboard Home
        </h1>
        <p className="text-slate-500 font-medium">
          Welcome back, <span className="text-[#6a51a6] font-semibold">{session?.user?.name || session?.user?.email || "User"}</span>!
        </p>

        {/* Quick actions/Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
            <h3 className="font-bold text-slate-700 text-lg">Send Money</h3>
            <p className="text-slate-500 text-sm mt-1">Initiate p2p transfers to friends instantly.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
            <h3 className="font-bold text-slate-700 text-lg">Add Funds</h3>
            <p className="text-slate-500 text-sm mt-1">Onramp money from your bank account.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
            <h3 className="font-bold text-slate-700 text-lg">Transactions</h3>
            <p className="text-slate-500 text-sm mt-1">View your ledger and payment history.</p>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-slate-200/60">
        <button
          onClick={handleSignOut}
          className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-150 active:scale-[0.98] flex items-center gap-2 w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}
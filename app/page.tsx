"use client";

import Ticket from "./components/Ticket";
import Sidebar from "./components/Sidebar";
import { TicketProvider } from "./TicketContext";

export default function Home() {
  return (
    <TicketProvider>
      <div className="flex h-screen">
        <div className="flex-1 flex items-center justify-center bg-gray-100 px-4">
          <Ticket />
        </div>

        <div className="min-w-[300px]">
          <Sidebar />
        </div>
      </div>
    </TicketProvider>
  );
}

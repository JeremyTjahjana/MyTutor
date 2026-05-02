import React from "react";
import PelajaranTersedia from "../../../components/Tutor/Schedule/PelajaranTersedia";
import Pesan from "../../../components/Tutor/Schedule/Pesan";
import Profile from "@/app/components/Tutor/Schedule/Profile";

const page = () => {
  return (
    <main className="h-auto bg-[#F7F8FC] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:p-8 lg:p-10">
        <Profile />
        <PelajaranTersedia />
        <div className="mt-6">
          <Pesan />
        </div>
      </div>
    </main>
  );
};

export default page;

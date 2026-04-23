import React from "react";
import PelajaranTersedia from "../../../components/Tutor/Schedule/PelajaranTersedia";
import Pesan from "../../../components/Tutor/Schedule/Pesan";
import Image from "next/image";
import Profile from "@/app/components/Tutor/Schedule/Profile";

const page = () => {
  return (
    <>
      <Profile />
      <PelajaranTersedia />
      <Pesan />
    </>
  );
};

export default page;

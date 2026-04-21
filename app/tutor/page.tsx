import React from "react";
import SearchTutor from "../components/Tutor/SearchTutor";
import Testimonies from "../components/Home/Testimonies";
import Judul from "../components/Tutor/Judul";
import ListTutor from "../components/Tutor/ListTutor";

const page = () => {
  return (
    <>
        <Judul />
        <SearchTutor />
        <ListTutor />
    </>
  );
};

export default page;

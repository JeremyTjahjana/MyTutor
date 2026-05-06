import React from "react";
import SearchTutor from "../components/Tutor/SearchTutor";
import Testimonies from "../components/Home/Testimonies";
import ListTutor from "../components/Tutor/ListTutor";

const TutorPage = () => {
  return (
    <>
      <h2 className="text-center text-[40px] sm:text-5xl md:text-7xl font-semibold text-[var(--biru)] pt-12">
        Tutors Available
      </h2>
      <SearchTutor />
      <ListTutor />
    </>
  );
};

export default TutorPage;

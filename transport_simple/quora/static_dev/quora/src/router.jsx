import {useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home.jsx";
import Navbar from "@/components/Navbar.jsx";
import NotFound from "@/components/NotFound.jsx";
import QuestionDetailView from "@/pages/QuestionDetailView.jsx";
import QuestionCreateView from "@/pages/QuestionCreateView.jsx";


import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return <></>;
};

function Paths() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/new" element={<QuestionCreateView />} />
          <Route exact path="/:uid" element={<QuestionDetailView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default Paths;

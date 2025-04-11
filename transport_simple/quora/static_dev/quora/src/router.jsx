import {useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Navbar from "@/components/Navbar";
import NotFound from "@/components/NotFound";
import QuestionDetailView from "@/pages/QuestionDetailView";
import QuestionCreateView from "@/pages/QuestionCreateView";
import ProfileQuestionListView from "@/pages/ProfileQuestionListView";
import ProfileAnswerListView from "@/pages/ProfileAnswerListView";


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
          <Route exact path="/your-questions" element={<ProfileQuestionListView />} />
          <Route exact path="/your-answers" element={<ProfileAnswerListView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default Paths;

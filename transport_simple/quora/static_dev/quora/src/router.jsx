import {useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/main/Home.jsx";
import Navbar from "@/components/nav/Navbar.jsx";
import NotFound from "@/components/NotFound.jsx";
import QuestionDetail from "@/pages/main/QuestionDetail.jsx";
import Login from "@/pages/login/Login.jsx";
// import Signup from "@/pages/login/Signup.jsx";
import LoginRoute from "@/pages/LoginRoute.jsx";


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
          <Route exact path="/:uid" element={<QuestionDetail />} />
          <Route element={<LoginRoute />}>
            <Route exact path="/login" element={<Login />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default Paths;

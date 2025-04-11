import React from "react";
import QuestionForm from "@/components/QuestionForm";
import { useNavigate } from "react-router-dom";

export default function QuestionCreateView() {
  const navigate = useNavigate();

  const handleSubmit = async (question) => {
    navigate(`/${question.uid}`);
  };

  return (
    <div className="small-container">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Ask a Question</h5>
          <QuestionForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

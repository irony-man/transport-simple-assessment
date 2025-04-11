import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apis from "@/apis";
import { HttpBadRequestError, HttpNotFound } from "@/apis/network";
import TextField from "./TextField";
import TextArea from "./TextArea";
import SmallLoader from "./SmallLoader";
import Error from "./Error";

export default function QuestionForm({ onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState({});
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const formData = question;
      const response = await apis.createQuestion(formData);
      setQuestion({ title: "", description: "" });
      alert("Saved the Question!!");
      onSubmit(response);
    } catch (error) {
      console.error(error);
      if (error instanceof HttpBadRequestError) {
        setErrors({ ...error.data });
      }
      alert("Error saving the Question!!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form method="POST" className="form" onSubmit={handleSubmit}>
      <TextField
        label="Title"
        className="mb-4"
        type="text"
        name="title"
        id="title"
        value={question.title}
        placeholder="Title"
        required
        maxLength={255}
        onChange={(e) => setQuestion({ ...question, title: e.target.value })}
        error={errors.title}
      />
      <TextArea
        label="Description"
        className="mb-4"
        type="text"
        name="description"
        id="description"
        value={question.description}
        placeholder="Write a Description"
        onChange={(e) => setQuestion({ ...question, description: e.target.value })}
        error={errors.description}
      />
      <div className="mb-4"><Error error={errors.user} /></div>
      <div>
        <button className="btn btn-primary w-100" type="submit">
          {loading ? (
            <SmallLoader />
          ) : (
            <span>Post</span>
          )}
        </button>
      </div>
    </form>
  );
}

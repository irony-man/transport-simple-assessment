import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apis from "@/apis";
import { HttpBadRequestError, HttpNotFound } from "@/apis/network";
import TextField from "./TextField";
import TextArea from "./TextArea";
import SmallLoader from "./SmallLoader";
import Error from "./Error";

export default function AnswerForm({ question, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState({});
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const formData = answer;
      formData.question = question.uid;
      const response = await apis.createAnswer(formData);
      setAnswer({ title: "", description: "" });
      alert("Saved the answer!!");
      onSubmit(response);
    } catch (error) {
      console.error(error);
      if (error instanceof HttpBadRequestError) {
        setErrors({ ...error.data });
      }
      alert("Error saving the answer!!");
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
        value={answer.title}
        placeholder="Title"
        maxLength={255}
        onChange={(e) => setAnswer({ ...answer, title: e.target.value })}
        error={errors.title}
      />
      <TextArea
        label="Description"
        className="mb-4"
        type="text"
        name="description"
        id="description"
        value={answer.description}
        placeholder="Write a Description"
        required
        onChange={(e) => setAnswer({ ...answer, description: e.target.value })}
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

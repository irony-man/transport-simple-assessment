import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NotFound from "@/components/NotFound";
import apis from "@/apis";
import { HttpNotFound } from "@/apis/network";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Loader from "@/components/Loader";
import { Helmet } from "react-helmet";
import ExpandableMarkdown from "@/components/ExpandableMarkdown";
import AnswerForm from "@/components/AnswerForm";
import SmallLoader from "@/components/SmallLoader";
import AnswerList from "../components/AnswerList";

dayjs.extend(relativeTime);

export default function QuestionDetailView() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState({});
  const [reset, setReset] = useState(false);
  const [ordering, setOrdering] = useState("-created");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { uid } = useParams();

  useEffect(() => {
    async function initiate() {
      try {
        const q = await apis.getQuestion(uid);
        setQuestion(q);
      } catch (err) {
        console.error(err);
        if (err instanceof HttpNotFound) {
          setQuestion({ ...question, not_found: true });
        }
      } finally {
        setLoading(false);
      }
    }
    initiate();
  }, [uid]);

  const removeQuestion = async () => {
    try {
      setDeleteLoading(true);
      if (confirm("Are you sure you want to delete this question?")) {
        await apis.deleteQuestion(uid);
        navigate("/");
      }
    } catch (error) {
      alert("Error deleting the question!!");
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOrderingChange = (e) => {
    setOrdering(e.target.value);
    setReset(!reset);
  }

  return (
    <>
      <Helmet>
        <title>{question.title}</title>
      </Helmet>

      {loading ? (
        <Loader />
      ) : question.not_found ? (
        <>
          <NotFound type="Question" />
        </>
      ) : (
        <div className="small-container">
          <div>
            <div className="d-flex justify-content-between mb-4">
              <div>
                Asked by: <strong>{question.username}</strong>
              </div>
              <small>
                Asked: <strong>{dayjs(question.created).fromNow()}</strong>
              </small>
            </div>
            <h4 className="mb-4">{question.title}</h4>
            <ExpandableMarkdown text={question.description || ""} />
          </div>
          <hr className="my-4" />
          <div className="mb-4">
            <div className="mb-3 d-flex justify-content-between">
              <h5>Answers ({question.answer_count})</h5>
              <div className="d-flex align-items-center">
                <span className="me-2">Sort:</span>
                <select
                  className="form-select"
                  value={ordering}
                  onChange={handleOrderingChange}
                >
                  <option value="-created">Recent</option>
                  <option value="created">Oldest</option>
                  <option value="-interaction">Interactions</option>
                </select>
              </div>
            </div>

            <AnswerList query={{ question: uid, ordering: ordering }} key={reset} />

            <div className="my-4">
              {question.is_yours ? (
                <button
                  className="btn btn-danger w-100"
                  onClick={() => removeQuestion()}
                >
                  {deleteLoading ? (
                    <SmallLoader />
                  ) : (
                    <>
                      <i className="fa-solid fa-trash-can me-2"></i>
                      Delete Question
                    </>
                  )}
                </button>
              ) : (
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Post an Answer</h5>
                    <AnswerForm
                      question={question}
                      onSubmit={() => setReset(!reset)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

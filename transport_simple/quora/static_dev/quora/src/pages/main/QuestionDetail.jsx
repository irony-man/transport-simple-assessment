import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NotFound from "@/components/NotFound";
import apis from "@/apis";
import { HttpNotFound } from "@/apis/network";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Markdown from "react-markdown";
import Loader from "@/components/Loader";
import { Helmet } from "react-helmet";
import ExpandableMarkdown from "@/components/ExpandableMarkdown";
import { HttpBadRequestError, HttpNotOkError } from "../../apis/network";

dayjs.extend(relativeTime);

const QuestionDetail = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { uid } = useParams();

  useEffect(() => {
    async function initiate() {
      try {
        const [q, a] = await Promise.all([
          apis.getQuestion(uid),
          apis.listAnswer({ question: uid }),
        ]);
        setQuestion(q);
        setAnswers(a.results);
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

  const handleReaction = async (value, uid) => {
    let fetchFunc = apis.deleteReactionAnswer;
    if (value === "downvote") {
      fetchFunc = apis.downvoteAnswer;
    } else if (value === "upvote") {
      fetchFunc = apis.upvoteAnswer;
    }
    try {
      const answer = await fetchFunc(uid);
      setAnswers((prev) => {
        return prev.map((a) => {
          if (a.uid === uid) {
            return answer;
          }
          return a;
        });
      });
    } catch (error) {
      if (error instanceof HttpNotOkError) {
        alert(error.data.detail);
      } else {
        alert("Error while reacting to the answer.");
      }
    }
  };

  const deletePost = async () => {
    try {
      setDeleteLoading(true);
      await apis.deleteQuestion(uid);
      setOpen(false);
      navigate("/");
    } catch (error) {
      dispatch(
        alertMessage({
          message: "Error deleting the question!!",
          type: "error",
          open: true,
        })
      );
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

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
          <div className="mb-">
            <div className="d-flex justify-content-between mb-4">
              <a href="" className="text-dark mb-0">
                Asked by: <strong>{question.username}</strong>
              </a>
              <small>
                Asked: <strong>{dayjs(question.created).fromNow()}</strong>
              </small>
            </div>
            <h4 className="mb-4">{question.title}</h4>
            <ExpandableMarkdown text={question.description} />
          </div>
          <hr className="my-4" />
          <div className="mb-5">
            <h5 className="mb-3">Answers</h5>
            {answers.length === 0 ? (
              <div className="display-6">No Answers Yet</div>
            ) : (
              answers.map((answer) => (
                <div key={answer.uid} className="mb-4 card">
                  <div className="card-header small">
                    <strong>{answer.username}</strong>
                    <span className="mx-1">&#183;</span>
                    {dayjs(answer.created).fromNow()}
                  </div>
                  <div className="card-body">
                    {answer.title && (
                      <h6 className="card-title">{answer.title}</h6>
                    )}
                    <div className="card-text">
                      <ExpandableMarkdown text={answer.description} />
                    </div>
                    <div className="btn-group btn-group-sm mt-3" role="group">
                      <button
                        type="button"
                        className={`btn ${
                          answer.is_upvoted
                            ? "btn-success"
                            : "btn-outline-success"
                        }`}
                        onClick={() =>
                          handleReaction(
                            answer.is_upvoted ? "remove" : "upvote",
                            answer.uid
                          )
                        }
                      >
                        <i className="fa-solid fa-arrow-up me-2"></i>
                        {answer.is_upvoted ? "Upvoted" : "Upvote"}
                        <span className="mx-1">&#183;</span>
                        {answer.upvote_count}
                      </button>

                      <button
                        type="button"
                        className={`btn ${
                          answer.is_downvoted
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() =>
                          handleReaction(
                            answer.is_downvoted ? "remove" : "downvote",
                            answer.uid
                          )
                        }
                      >
                        <i className="fa-solid fa-arrow-down"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionDetail;

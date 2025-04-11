import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import SmallLoader from "@/components/SmallLoader";
import apis from "@/apis";
import { HttpBadRequestError, HttpNotOkError } from "@/apis/network";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ExpandableMarkdown from "@/components/ExpandableMarkdown";

dayjs.extend(relativeTime);

export default function AnswerList({ query = {} }) {
  const [answers, setAnswers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const limit = 5;

  useEffect(() => {
    async function initiate() {
      try {
        setLoading(true);
        const response = await apis.listAnswer({
          limit: limit,
          offset: limit * (page - 1),
          ...query,
        });
        setAnswers([...answers, ...response.results]);
        setHasMore(response.next !== null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    initiate();
  }, [page]);

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
      if (error instanceof HttpBadRequestError) {
        const errors = error.data;
        alert(Object.values(errors)[0]);
      } else if (error instanceof HttpNotOkError) {
        alert(error.data.detail);
      } else {
        alert("Error while reacting to the answer.");
      }
    }
  };

  return (
    <InfiniteScroll
      style={{ overflow: "hidden" }}
      dataLength={answers.length}
      next={() => setPage(page + 1)}
      hasMore={hasMore}
      loader={
        <div className="text-center">
          <SmallLoader />
        </div>
      }
    >
      <div>
        {loading && page === 1 ? (
          Array(6)
            .fill()
            .map((_, idx) => (
              <div key={idx} className="mb-4 card">
                <div className="card-header placeholder-glow small">
                  <span className="placeholder col-4"></span>
                </div>
                <div className="card-body">
                  <h6 className="card-title placeholder-glow">
                    <span className="placeholder col-9"></span>
                  </h6>
                  <div className="card-text placeholder-glow">
                    <span className="placeholder col-12 h-36"></span>
                  </div>
                  <div className="mt-3 placeholder-glow">
                    <span className="placeholder col-3"></span>
                  </div>
                </div>
              </div>
            ))
        ) : answers.length === 0 ? (
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
                      answer.is_upvoted ? "btn-success" : "btn-outline-success"
                    }`}
                    disabled={answer.is_yours}
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

                  {!answer.is_yours && <button
                    type="button"
                    className={`btn ${
                      answer.is_downvoted
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    disabled={answer.is_yours}
                    onClick={() =>
                      handleReaction(
                        answer.is_downvoted ? "remove" : "downvote",
                        answer.uid
                      )
                    }
                  >
                    <i className="fa-solid fa-arrow-down"></i>
                  </button>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </InfiniteScroll>
  );
}

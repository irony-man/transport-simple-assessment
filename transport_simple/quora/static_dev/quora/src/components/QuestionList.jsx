import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import SmallLoader from "@/components/SmallLoader";
import apis from "@/apis";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function QuestionList({ query = {} }) {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const limit = 9;

  useEffect(() => {
    async function initiate() {
      try {
        setLoading(true);
        const response = await apis.listQuestion({
          limit: limit,
          offset: limit * (page - 1),
          ...query,
        });
        setQuestions([...questions, ...response.results]);
        setHasMore(response.next !== null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    initiate();
  }, [page]);

  return (
    <InfiniteScroll
      style={{ overflow: "hidden" }}
      dataLength={questions.length}
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
                <div className="card-body">
                  <h5 className="card-title placeholder-glow">
                    <span className="placeholder w-100"></span>
                  </h5>
                  <div className="card-text small d-flex justify-content-between placeholder-glow">
                    <span className="placeholder col-3"></span>
                    <span className="placeholder col-3"></span>
                    <span className="placeholder col-3"></span>
                  </div>
                </div>
              </div>
            ))
        ) : questions.length === 0 ? (
          <div className="display-6 text-center">No Questions Yet</div>
        ) : (
          questions.map((question) => (
            <Link
              key={question.uid}
              className="mb-4 card"
              to={`/${question.uid}`}
            >
              <div className="card-body">
                <h6 className="card-title">{question.title}</h6>

                <div className="d-flex justify-content-between">
                  <small className="text-muted">
                    Asked by: <strong>{question.username}</strong>
                  </small>
                  <small className="text-muted">
                    Asked: <strong>{dayjs(question.created).fromNow()}</strong>
                  </small>
                  <small className="text-muted">
                    Answers: <strong>{question.answer_count}</strong>
                  </small>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </InfiniteScroll>
  );
}

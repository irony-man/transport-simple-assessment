import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
// import DesignLoading from "./DesignLoading";
import Loader from "@/components/Loader";
import apis from "@/apis";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const QuestionsList = ({ query = {}, heading = "" }) => {
  const navigate = useNavigate();
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
        <div className="text-center mt-5">
          <Loader />
        </div>
      }
      endMessage={
        loading ? (
          <></>
        ) : (
          <h5 className="mt-5 text-center">
            That&apos;s all we have for you!!
          </h5>
        )
      }
    >
      <div>
        {loading
          ? Array(6)
              .fill()
              .map((_, idx) => (
                <div key={idx} className="col-xl-4 col-lg-4 col-md-6 col-12">
                  {/* <DesignLoading /> */}
                </div>
              ))
          : questions.map((question) => (
              <Link
                key={question.uid}
                className="mb-4 card"
                to={`/${question.uid}`}
              >
                <div className="card-body">
                  <h6 className="card-title">{question.title}</h6>

                  <div className="d-flex justify-content-between">
                    <small className="text-muted">
                      Asked by:{" "}
                      <strong>{question.username}</strong>
                    </small>
                    <small className="text-muted">
                      Asked:{" "}
                      <strong>{dayjs(question.created).fromNow()}</strong>
                    </small>
                    <small className="text-muted">
                      Answers:{" "}
                      <strong>{question.answer_count}</strong>
                    </small>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </InfiniteScroll>
  );
};

export default QuestionsList;

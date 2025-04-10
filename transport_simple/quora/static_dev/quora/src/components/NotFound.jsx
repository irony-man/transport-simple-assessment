import Helmet from "react-helmet";

const NotFound = (prop) => {
  return (
    <>
    <Helmet>
      <title>Not found | Quora</title>
    </Helmet>
      <div className="container text-center">
        <h1>404</h1>
        <h5>{prop.type || "Page"} not found</h5>
      </div>
    </>
  );
};

export default NotFound;

import React, { useState } from "react";
import Markdown from "react-markdown";

export default function ExpandableMarkdown({
  text,
  initialLength = 300,
  expanded = false,
}) {
  const [showMore, setShowMore] = useState(expanded);

  return (
    <>
      <Markdown>{showMore ? text : text.slice(0, initialLength)}</Markdown>
      {text.length > initialLength && !showMore ? (
        <button
          className="btn p-0 btn-link"
          onClick={() => setShowMore(true)}
        >
          Show {showMore ? "Less" : "More"}
        </button>
      ) : null}
    </>
  );
}

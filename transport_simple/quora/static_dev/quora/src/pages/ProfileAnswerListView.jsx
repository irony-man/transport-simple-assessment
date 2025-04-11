import AnswerList from "@/components/AnswerList";

export default function ProfileQuestionListView() {
  return (
    <div className="container">
      <AnswerList query={{user_designs: true}} questionSummary />
    </div>
  );
};

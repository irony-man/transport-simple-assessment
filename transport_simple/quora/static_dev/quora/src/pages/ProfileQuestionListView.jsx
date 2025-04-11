import QuestionList from "@/components/QuestionList";

export default function ProfileQuestionListView() {
  return (
    <div className="container">
      <QuestionList query={{user_designs: true}} />
    </div>
  );
};

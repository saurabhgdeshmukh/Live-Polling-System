import { useState } from "react";
import axios from "axios";

function QuestionList() {
  const [question, setQuestion] = useState("");
  const [duration, setDuration] = useState(60);
  const [options, setOptions] = useState([
    { text: "", correct: null },
    { text: "", correct: null },
  ]);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index].text = value;
    setOptions(updated);
  };

  const handleCorrectChange = (index, value) => {
    const updated = [...options];
    updated[index].correct = value;
    setOptions(updated);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, { text: "", correct: null }]);
    }
  };

  const handleSubmit = async () => {
    if (!question.trim() || options.some((o) => !o.text.trim())) {
      alert("Please fill the question and all option texts.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/questions", {
        question,
        duration,
        options,
      });
      alert("Question submitted successfully!");
      setQuestion("");
      setOptions([
        { text: "", correct: null },
        { text: "", correct: null },
      ]);
    } catch (error) {
      alert("Failed to submit question.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-4 py-8 font-sora">
      <div className="w-[134px] h-[31px] flex text-sm text-white bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] px-3 py-1 rounded-full mb-6">
        <div className="ml-1 mt-0.5 font-semibold">Intervue Poll</div>
      </div>

      <div className="w-full max-w-3xl text-left mb-2">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Let's <strong className="font-bold">Get Started</strong>
        </h1>
      </div>

      <p className="text-[#6E6E6E] text-md md:text-lg text-left mb-8 max-w-3xl">
        you’ll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
      </p>

      <div className="w-full max-w-3xl mb-8">
        <div className="flex justify-between items-center mb-2">
          <label className="text-left text-lg font-medium text-gray-700">
            Enter your question
          </label>
          <select
            className="text-sm rounded px-2 py-2 bg-[#F2F2F2]"
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            <option value={60}>60 seconds</option>
            <option value={45}>45 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={15}>15 seconds</option>
          </select>
        </div>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question..."
          maxLength={100}
          className="w-full bg-[#F2F2F2] h-40 px-3 py-2 text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-[#4D0ACD]"
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {question.length}/100
        </div>
      </div>

      <div className="w-full max-w-3xl mb-8">
        <div className="flex font-medium text-sm text-gray-700 mb-2">
          <span>Edit Options</span>
          <span className="ml-[440px]">Is it Correct?</span>
        </div>
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center justify-start mb-3 gap-2"
          >
            <div className="flex items-center w-[500px] h-[60px] gap-2">
              <span className="w-6 h-6 bg-[#8F64E1] rounded-full text-white flex items-center justify-center text-sm">
                {index + 1}
              </span>
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1 bg-[#F2F2F2] py-2 px-3 focus:outline-none"
              />
            </div>
            <div className="flex text-left ml-4 gap-4">
              <label className="flex gap-1">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  checked={option.correct === true}
                  onChange={() => handleCorrectChange(index, true)}
                />
                Yes
              </label>
              <label className="flex gap-1">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  checked={option.correct === false}
                  onChange={() => handleCorrectChange(index, false)}
                />
                No
              </label>
            </div>
          </div>
        ))}
        <div className="text-left">
          <button
            onClick={addOption}
            className="text-[#7451B6] text-sm border border-[#7451B6] rounded-lg p-2 font-medium mt-2"
          >
            + Add More option
          </button>
        </div>
      </div>

      <div className="w-full max-w-3xl flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 rounded-full text-white text-lg font-semibold bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] hover:opacity-90"
        >
          Ask Question
        </button>
      </div>
    </div>
  );
}

export default QuestionList;


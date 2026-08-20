import { useFormContext } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';

interface RHFOptionProps {
  qIndex: number;
  oIndex: number;
  onDelete: (qIndex: number, oIndex: number) => void;
  onCorrectChange: (qIndex: number, oIndex: number) => void;
  isCorrect: boolean;
  canDelete: boolean;
}

const RHFOption: React.FC<RHFOptionProps> = ({
  qIndex,
  oIndex,
  onDelete,
  onCorrectChange,
  isCorrect,
  canDelete
}) => {
  const { register, watch } = useFormContext();
  const options = watch(`questions.${qIndex}.options`);
  const value = options[oIndex];

  return (
    <div className="flex items-center p-3 shadow-md rounded-lg mb-2">
      <input
        type="radio"
        name={`question-${qIndex}`}
        checked={isCorrect}
        onChange={() => onCorrectChange(qIndex, oIndex)}
        className="h-4 w-4  text-indigo-600 focus:ring-indigo-500"
      />
      <input
        type="text"
        {...register(`questions.${qIndex}.options.${oIndex}`)}
        value={value}
        className="ml-3 flex-1 p-2 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
        placeholder={`Option ${oIndex + 1}`}
      />
      <button
        type="button"
        onClick={() => onDelete(qIndex, oIndex)}
        disabled={!canDelete}
        className={`ml-2 p-2 ${canDelete ? 'text-red-600 hover:text-red-800' : 'text-gray-400 cursor-not-allowed'}`}
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default RHFOption;
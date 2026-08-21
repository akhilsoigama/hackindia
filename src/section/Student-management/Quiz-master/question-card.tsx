import { Controller, UseFormReturn } from 'react-hook-form';
import { Plus, X, Trash2, GripVertical } from 'lucide-react';

import { ICreateOption, QuestionType } from '../../../types/quizzes';
import { CreateQuizInput } from './schemas/quiz.schema';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import RHFFormField from '../../../components/hook-form/RHFFormFiled';
import RHFDropDown from '../../../components/hook-form/RHFDropDown';
import { Translated } from '../../../components/common/translator/translator';

const Label = ({ children, className, htmlFor }: { children: React.ReactNode, className?: string, htmlFor?: string }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none ${className || ''}`}>
    {children}
  </label>
);

export interface QuestionCardProps {
  questionIndex: number;
  onRemove: () => void;
  onTypeChange: (type: QuestionType) => void;
  onAddOption: () => void;
  onRemoveOption: (optionIndex: number) => void;
  onSetCorrectAnswer: (optionIndex: number) => void;
  methods: UseFormReturn<CreateQuizInput>;
  isDark: boolean;
}

export function QuestionCard({
  questionIndex,
  onRemove,
  onTypeChange,
  onAddOption,
  onRemoveOption,
  onSetCorrectAnswer,
  methods,
  isDark,
}: QuestionCardProps) {
  const questionType = methods.watch(`questions.${questionIndex}.questionType`);
  const options = methods.watch(`questions.${questionIndex}.options`) || [];
  const correctOptionIndex = options.findIndex((opt: ICreateOption) => opt.isCorrect);
  const surfaceBaseClass = isDark
    ? 'border-slate-700  text-slate-100 shadow-black/30'
    : 'border-slate-200 bg-white text-slate-900 shadow-slate-200/80';
  const optionBaseClass = isDark
    ? 'border-slate-700  hover:border-slate-600 hover:bg-slate-900/70'
    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50';
  const optionSelectedClass = isDark
    ? 'border-teal-500 bg-teal-600/15 ring-1 ring-teal-500/50'
    : 'border-teal-600 bg-teal-50 ring-1 ring-teal-500/30';

  return (
    <section
      className={`w-full min-w-0 overflow-hidden rounded-2xl border bg-linear-to-br p-px transition-all duration-300 ${
        isDark
          ? 'border-slate-700 shadow-lg shadow-black/25'
          : 'border-slate-200 from-slate-50 via-white to-slate-100 shadow-lg shadow-slate-200/70'
      }`}
    >
      <div className={`w-full min-w-0 rounded-2xl p-4 transition-all duration-300 sm:p-6 ${surfaceBaseClass}`}>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <div className="hidden pt-3 sm:flex">
              <GripVertical className={`h-5 w-5 cursor-move ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <RHFFormField
                    name={`questions.${questionIndex}.questionText`}
                    label={<Translated text={`Question ${questionIndex + 1}`}/>}
                    placeholder="Enter your question here"
                    className="mb-0"
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onRemove}
                  className="h-10 w-10 shrink-0 rounded-xl border border-transparent text-destructive transition-all duration-200 hover:border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Remove question ${questionIndex + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div
            className={`rounded-2xl border p-4 transition-all duration-300 sm:p-5 ${
              isDark
                ? 'border-slate-700 '
                : 'border-slate-200'
            }`}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
              <div className="min-w-0">
                <RHFDropDown
                  name={`questions.${questionIndex}.questionType`}
                  label={<Translated text="Question Type"/>}
                  placeholder="Select question type"
                  options={[
                    { value: 'mcq', label: 'Multiple Choice (MCQ)' },
                    { value: 'true/false', label: 'True / False' },
                  ]}
                  onChange={(e) => onTypeChange(e.target.value as QuestionType)}
                  className="mb-0"
                />
              </div>

              <div className="min-w-0">
                <RHFFormField
                  name={`questions.${questionIndex}.marks`}
                  label={<Translated text="Marks"/>}
                  type="number"
                  placeholder="Enter marks"
                  className="mb-0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                <Translated text={questionType === 'mcq' ? 'Options (Select correct answer)' : 'Select correct answer'}/>
              </Label>

              {questionType === 'mcq' && (
                <Button
                  type="button"
                  onClick={onAddOption}
                  variant="ghost"
                  size="sm"
                  className={`gap-1 rounded-xl px-3 transition-all duration-200 ${
                    isDark
                      ? 'border border-slate-700 text-slate-100 hover:border-slate-600 hover:bg-slate-950/70'
                      : 'border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <Translated text="Add Option"/>
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {options.map((option: ICreateOption, optionIndex: number) => {
                const isSelected = correctOptionIndex === optionIndex;

                return (
                  <div
                    key={optionIndex}
                    className={`w-full min-w-0 rounded-2xl border p-3 transition-all duration-200 sm:p-4 ${
                      isSelected ? optionSelectedClass : optionBaseClass
                    }`}
                  >
                    <div className="flex w-full min-w-0 items-start gap-3">
                      <label className="mt-1 inline-flex shrink-0 cursor-pointer items-center">
                        <input
                          type="radio"
                          name={`question-${questionIndex}-correct-option`}
                          checked={isSelected}
                          onChange={() => onSetCorrectAnswer(optionIndex)}
                          className="h-4 w-4 accent-teal-600"
                        />
                      </label>

                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <span
                            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                              isSelected
                                ? 'bg-teal-600 text-white'
                                : isDark
                                  ? 'bg-slate-950/70 text-slate-200'
                                  : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {questionType === 'mcq' ? String.fromCharCode(65 + optionIndex) : optionIndex + 1}
                          </span>
                          {isSelected && (
                            <span className="text-xs font-medium text-teal-600 dark:text-teal-400"><Translated text="Correct answer"/></span>
                          )}
                        </div>

                        {questionType === 'mcq' ? (
                          <Controller
                            name={`questions.${questionIndex}.options.${optionIndex}.optionText`}
                            control={methods.control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                className={`w-full rounded-xl transition-all duration-200 ${
                                  isDark
                                    ? 'border-slate-700 bg-slate-950/70 text-slate-100 placeholder:text-slate-500 focus-visible:border-teal-500'
                                    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-teal-500'
                                }`}
                              />
                            )}
                          />
                        ) : (
                          <p className={`text-sm font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                            <Translated text={option.optionText}/>
                          </p>
                        )}
                      </div>

                      {questionType === 'mcq' && options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveOption(optionIndex)}
                          className={`ml-auto h-8 w-8 shrink-0 self-start rounded-lg transition-colors duration-200 ${
                            isDark
                              ? 'text-slate-300 hover:bg-slate-900 hover:text-red-300'
                              : 'text-slate-500 hover:bg-slate-100 hover:text-red-500'
                          }`}
                          aria-label={`Delete option ${optionIndex + 1}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {methods.formState.errors.questions?.[questionIndex]?.options && (
              <p className="mt-1 text-sm text-red-500">
                <Translated text={methods.formState.errors.questions[questionIndex].options.message || 'Please check your options'}/>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuestionCard;
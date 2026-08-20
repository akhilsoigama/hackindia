import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useLessonForm } from '../../../hooks/useLectureUploadForm';
import { ILecture } from '../../../types/material';
import { BasicInfoStep } from '../../../components/lecture-upload-constant';
import { toast } from 'sonner';
import { createLecture, updateLecture } from '../../../action/material';


type Props = {
  currentData?: ILecture;
};

const MaterialNewEditForm: React.FC<Props> = ({ currentData }) => {
  const { methods, currentStep } = useLessonForm(currentData);

const onSubmit = async (data: any) => {
  console.log("Submitting data", data);
  try {
    if (currentData?.id) {
      console.log("Updating lecture...");
      await updateLecture(currentData.id, { ...data, videoUrl: data.contentUrl });
    } else {
      console.log("Creating lecture...");
      await createLecture({ ...data, facultyId: 1, videoUrl: data.contentUrl });
    }
  } catch (error) {
    console.error("Error in onSubmit:", error);
    toast.error(`${error}`);
  }
};


  return (
    <FormProvider {...methods}>
      <div className="min-h-screen p-4">
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {currentStep === 1 && (
            <BasicInfoStep
              watch={methods.watch}
              setValue={methods.setValue}
              getValues={methods.getValues}
              currentData={currentData}
            />
          )}

          <div className="mt-4 flex gap-2">


            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 text-white"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default MaterialNewEditForm;

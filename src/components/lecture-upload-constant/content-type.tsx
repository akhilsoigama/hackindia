import React from "react";
import { UseFormWatch } from "react-hook-form";
import { ILecture } from "../../types/material";
import RHFFormField from "../hook-form/RHFFormFiled";
import RHFDropzoneField from "../hook-form/RHFImageUpload";
import VideoUpload from "../video-upload/video-upload";
import { contentTypeConfig } from "./lecture-upload-constant";
import { ContentType, LessonFormData } from "../../hooks/useLectureUploadForm";
import RHFPDFUpload from "../hook-form/RHFPDFUpload";
import RHFAudioUpload from "../hook-form/RHFAudioUpload";
import RHFContentField from "../hook-form/RHFContent";
import { Translated } from "../common/translator/translator";

interface ContentTypeFieldsProps {
  watch: UseFormWatch<LessonFormData>;
  currentData?: ILecture;
}

const ContentTypeFields: React.FC<ContentTypeFieldsProps> = ({
  watch,
  currentData,
}) => {
  const contentType = watch("contentType") as ContentType;
  const config = contentTypeConfig[contentType];

  if (!config) return null;

  const normalFields = config.fields.filter((f) => f !== "thumbnailUrl");
  const shouldShowThumbnail = config.fields.includes("thumbnailUrl");

  const renderField = (field: string) => {
    switch (field) {
      case "durationInSeconds":
        return (
          <RHFFormField
            key={field}
            name="durationInSeconds"
            label={<Translated text="Duration (seconds)"/>}
            type="number"
            placeholder="300"
          />
        );

      case "textContent":
        return (
          <div key={field} className="col-span-2">
            <RHFContentField name="textContent" label="Content" required />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="">
      {normalFields.map((field) => (
        <React.Fragment key={field}>{renderField(field)}</React.Fragment>
      ))}

      {/* PDF Upload - currentValue supported */}
      {contentType === "pdf" && (
        <RHFPDFUpload
          name="contentUrl"
          label="Upload Lesson PDF"
          required
          currentValue={currentData?.contentUrl ?? undefined}
        />
      )}

      {/* Audio Upload - temporary without currentValue */}
      {contentType === "audio" && (
        <RHFAudioUpload
          name="contentUrl"
          label={<Translated text="Upload Audio Lesson"/>}
          required
        />
      )}

      {/* Video Upload - temporary without currentValue */}
      {contentType === "video" && <VideoUpload name="contentUrl" />}
      {contentType === "image" && (
        <RHFDropzoneField
          name="contentUrl"
          helperText={<Translated text="Upload content image"/>}
        />
      )}
      {shouldShowThumbnail && (
        <div className="">
          <RHFDropzoneField
            name="thumbnailUrl"
            helperText={
              contentType === "image"
                ? <Translated text="Upload thumbnail image"/>
                : <Translated text="Upload your lecture thumbnail"/>
            }
          />
        </div>
      )}
    </div>
  );
};

export default ContentTypeFields;

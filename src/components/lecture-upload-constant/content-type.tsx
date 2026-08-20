import React from 'react';
import { UseFormWatch } from 'react-hook-form';
import RHFFormField from '../hook-form/RHFFormFiled';
import RHFDropzoneField from '../hook-form/RHFImageUpload';
import VideoUpload from '../video-upload/video-upload';
import { contentTypeConfig } from './lecture-upload-constant';
import { ContentType, LessonFormData } from '../../hooks/useLectureUploadForm';
import RHFPDFUpload from '../hook-form/RHFPDFUpload';
import RHFAudioUpload from '../hook-form/RHFAudioUpload';

interface ContentTypeFieldsProps {
    watch: UseFormWatch<LessonFormData>;
}

const ContentTypeFields: React.FC<ContentTypeFieldsProps> = ({ watch }) => {
    const contentType = watch('contentType') as ContentType;
    const config = contentTypeConfig[contentType];

    if (!config) return null;

    const normalFields = config.fields.filter((f) => f !== 'thumbnailUrl');
    const thumbnailFields = config.fields.filter((f) => f === 'thumbnailUrl');

    const renderField = (field: string) => {
        switch (field) {


            case 'durationInSeconds':
                return (
                    <RHFFormField
                        key={field}
                        name="durationInSeconds"
                        label="Duration (seconds)"
                        type="number"
                        placeholder="300"
                    />
                );

            case 'textContent':
                return (
                    <div key={field} className="col-span-2">
                        <RHFFormField
                            name="textContent"
                            label="Text Content"
                            placeholder="Enter your text content here..."
                            required={config.required.includes('textContent')}
                        />
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
            {watch('contentType') === 'pdf' &&
                <RHFPDFUpload
                    name="contentUrl"
                    label="Upload Lesson PDF"
                    required
                />
            }
            {watch('contentType') === 'audio' &&
                <RHFAudioUpload name="contentUrl" label="Upload Audio Lesson" required />
            }
            {(thumbnailFields.length > 0 || watch('contentType') === 'image') && (
                <div className="">
                    <RHFDropzoneField
                        name="thumbnailUrl"
                        helperText={
                            watch('contentType') === 'image'
                                ? 'Upload your image'
                                : 'Upload your lecture thumbnail'
                        }
                    />
                    {watch('contentType') === 'video' && <VideoUpload />}
                </div>
            )}
        </div>

    );
};

export default ContentTypeFields;

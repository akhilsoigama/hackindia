import { 
  FaVideo, 
  FaFilePdf, 
  FaImage, 
  FaLink,
  FaHeadphones,
  FaFileAlt
} from 'react-icons/fa';

export const subjects = ['Mathematics', 'Science', 'English', 'History', 'Art', 'Physical Education'];
export const gradeLevels = ['5 STD','6 STD','7 STD','8 STD','9 STD','10 STD','11 STD','12 STD'];

export const resourceTypes = [
  { value: 'link', label: 'Web Link', icon: <FaLink /> },
  { value: 'video', label: 'Video', icon: <FaVideo /> },
  { value: 'pdf', label: 'PDF Document', icon: <FaFilePdf /> },
  { value: 'image', label: 'Image', icon: <FaImage /> }
];

export const contentTypeConfig = {
  video: {
    label: 'Video',
    icon: <FaVideo />,
    fields: ['thumbnailUrl', 'contentUrl', 'durationInSeconds'],
    required: ['contentUrl']
  },
  pdf: {
    label: 'PDF',
    icon: <FaFilePdf />,
    fields: ['contentUrl'],
    required: ['contentUrl']
  },
  audio: {
    label: 'Audio',
    icon: <FaHeadphones />,
    fields: ['contentUrl', 'durationInSeconds'],
    required: ['contentUrl']
  },
  text: {
    label: 'Text',
    icon: <FaFileAlt />,
    fields: ['textContent'],
    required: ['textContent']
  },
  image: {
    label: 'Image',
    icon: <FaImage />,
    fields: ['contentUrl'],
    required: ['contentUrl']
  }
};
import { 
  FaVideo, 
  FaFilePdf, 
  FaImage, 
  FaLink,
  FaHeadphones,
  FaFileAlt
} from 'react-icons/fa';

export const subjects = ['Mathematics', 'Science', 'English', 'History', 'Art', 'Physical Education'];
export const gradeLevels = [
  '1st', '2nd', '3rd', '4th', '5th',
  '6th', '7th', '8th', '9th', '10th',
  '11th', '12th', '12 Commerce', 'Diploma'
];
export const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];

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
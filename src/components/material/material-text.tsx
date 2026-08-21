import { Copy, Check, BookOpen, User, Hash, Volume2 } from 'lucide-react';
import { ILecture } from '../../types/material';
import { useEffect, useState } from 'react';
import { useUser } from '../../atoms/userAtom';
import { useTheme } from '@/theme/AppThemeProvider';
import MarkdownPreview from '../markdown/markdown';
import MultiLanguageTTS from '../common/TTS';

const TextDetailView = ({ lecture }: { lecture: ILecture }) => {
    const [copied, setCopied] = useState(false);
    const [facultyName, setFacultyName] = useState('');
    const [plainTextForTTS, setPlainTextForTTS] = useState('');
    const { user } = useUser();
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    useEffect(() => {
        if (user?.facultyId === lecture.facultyId && user?.fullName) {
            setFacultyName(user.fullName);
        }
    }, [user, lecture.facultyId]);

    const handleCopyContent = async () => {
        try {
            await navigator.clipboard.writeText(lecture.textContent || '');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    };

    const handleTextExtracted = (plainText: string) => {
        setPlainTextForTTS(plainText);
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-xl transition-colors duration-300 ${isDark ? 'bg-sky-900/50' : 'bg-blue-100'}`}>
                            <BookOpen className={`w-6 h-6 transition-colors duration-300 ${isDark ? 'text-sky-400' : 'text-blue-700'}`} />
                        </div>
                        <div>
                            <h1 className={`text-3xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {lecture.title || 'Lecture Content'}
                            </h1>
                            <p className={`mt-1 transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-700'}`}>
                                Detailed lecture notes
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className={`rounded-xl p-4 border transition-all duration-300 ${isDark ? 'border-slate-700 bg-slate-800/50' : 'bg-white border-gray-300'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg transition-colors duration-300 ${isDark ? 'bg-indigo-950/50' : 'bg-indigo-100'}`}>
                                    <User className={`w-4 h-4 transition-colors duration-300 ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`} />
                                </div>
                                <div>
                                    <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Faculty</p>
                                    <p className={`font-medium transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {facultyName || 'Unknown Faculty'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={`rounded-xl p-4 border transition-all duration-300 ${isDark ? 'border-slate-700 bg-slate-800/50' : 'bg-white border-gray-300'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg transition-colors duration-300 ${isDark ? 'bg-amber-950/50' : 'bg-amber-100'}`}>
                                    <Hash className={`w-4 h-4 transition-colors duration-300 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
                                </div>
                                <div>
                                    <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Content Type</p>
                                    <p className={`font-medium transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>Text Lecture</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {lecture.textContent && (
                    <div className={`rounded-2xl shadow-lg border overflow-hidden transition-all duration-300 ${isDark ? 'border-slate-700 bg-slate-800/50' : 'bg-white border-gray-300'}`}>
                        <div className={`px-6 py-4 border-b transition-all duration-300 ${isDark ? 'border-slate-700 bg-slate-900/50' : 'bg-gray-50 border-gray-300'}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg transition-colors duration-300 ${isDark ? 'bg-sky-600' : 'bg-blue-600'}`}>
                                        <Volume2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className={`text-xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            Lecture Content
                                        </h2>
                                        <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-700'}`}>
                                            Full text with TTS support
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {plainTextForTTS && (
                                        <div className="mr-2">
                                            <MultiLanguageTTS
                                                text={plainTextForTTS}
                                                defaultLanguage="en"
                                                showTranslation={false}
                                                compact={true}
                                            />
                                        </div>
                                    )}

                                    <button
                                        onClick={handleCopyContent}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${copied
                                                ? isDark ? 'bg-green-600 text-white' : 'bg-green-600 text-white'
                                                : isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-800 text-white hover:bg-gray-900'
                                            }`}
                                    >
                                        {copied ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                        <span className="text-sm">
                                            {copied ? 'Copied!' : 'Copy'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={`p-6 md:p-8 transition-colors duration-300 ${isDark ? 'bg-slate-800/30 text-slate-100' : ''}`}>
                            <MarkdownPreview
                                content={lecture.textContent}
                                onTextExtracted={handleTextExtracted}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextDetailView;
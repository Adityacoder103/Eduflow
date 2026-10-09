import React, { useState } from 'react';
import { UploadCloud, FileCheck, AlertCircle, FileCode } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { StudentGroup, Project } from '../../types';

interface StudentSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: StudentGroup;
  project?: Project;
}

export const StudentSubmitModal: React.FC<StudentSubmitModalProps> = ({
  isOpen,
  onClose,
  group,
  project
}) => {
  const { currentUser, addSubmission } = useApp();

  const [milestoneId, setMilestoneId] = useState(
    project?.milestones[0]?.id || ''
  );
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('3.2 MB');
  const [notes, setNotes] = useState('');
  const [fileAttached, setFileAttached] = useState(false);

  const selectedMilestone = project?.milestones.find((m) => m.id === milestoneId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setFileAttached(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestone || !fileName) return;

    addSubmission({
      groupId: group.id,
      groupName: group.name,
      milestoneId: selectedMilestone.id,
      milestoneTitle: selectedMilestone.title,
      projectId: project?.id || group.projectId,
      fileName: fileName.trim(),
      fileSize,
      fileType: 'application/pdf',
      submissionNotes: notes.trim(),
      submittedById: currentUser.id,
      submittedByName: `${currentUser.name} (${currentUser.rollNumber || 'Student'})`
    });

    setNotes('');
    setFileName('');
    setFileAttached(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Milestone Deliverable"
      subtitle={`Turn in project work for ${group.name}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Target Project Milestone *
          </label>
          <select
            value={milestoneId}
            onChange={(e) => setMilestoneId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {project?.milestones.map((ms) => (
              <option key={ms.id} value={ms.id}>
                Milestone {ms.orderIndex}: {ms.title} (Weightage: {ms.weightage}%)
              </option>
            ))}
          </select>
        </div>

        {/* File Dropzone */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Attach Report / Code Archive / Document *
          </label>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-all">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.docx,.zip,.tar.gz,.pptx"
              className="hidden"
            />
            {fileAttached ? (
              <div className="flex flex-col items-center gap-1.5">
                <FileCheck className="w-10 h-10 text-emerald-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {fileName}
                </span>
                <span className="text-xs text-slate-500">{fileSize} • Click to replace file</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <UploadCloud className="w-10 h-10 text-indigo-500" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Click to select file or drag & drop
                </span>
                <span className="text-xs text-slate-500">
                  Supported formats: PDF, DOCX, ZIP, PPTX (Max: 50MB)
                </span>
              </div>
            )}
          </label>
        </div>

        {/* Fallback File Name Input if simulated */}
        {!fileAttached && (
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Or type file artifact name manually:
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => {
                setFileName(e.target.value);
                if (e.target.value.trim()) setFileAttached(true);
              }}
              placeholder="e.g., MedFlow_Prototype_Documentation_v2.pdf"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Submission Notes & Changelog *
          </label>
          <textarea
            rows={3}
            required
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe deliverables achieved, Git commit hash, or responses to previous teacher remarks..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-start gap-2.5 text-xs text-blue-800 dark:text-blue-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
          <span>
            This submission creates a timestamped version audit record. Prior versions remain accessible to faculty for plagiarism checks and continuous evaluation.
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!fileName.trim()}
            className="px-5 py-2.5 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            Submit Deliverable
          </button>
        </div>
      </form>
    </Modal>
  );
};

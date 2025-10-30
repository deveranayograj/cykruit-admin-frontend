/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import { 
  UserCheck, 
  TrendingUp, 
  MapPin, 
  Github, 
  Linkedin, 
  Globe,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Code
} from 'lucide-react';
import { UserDetail } from '@/types/user';

export const JobSeekerInfoCard: React.FC<{ user: UserDetail }> = ({ user }) => {
  if (!user.jobSeeker) return null;

  const { jobSeeker } = user;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Seeker Profile</h2>
        
        <div className="space-y-4">
          {jobSeeker.profileImage && (
            <div className="flex justify-center mb-4">
              <img 
                src={jobSeeker.profileImage} 
                alt={`${user.firstName} ${user.lastName}`}
                className="w-24 h-24 rounded-full border-4 border-blue-100"
              />
            </div>
          )}

          <div className="flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Onboarding Status</p>
              <p className="font-medium text-gray-900">
                {jobSeeker.onboardingCompleted ? '✓ Completed' : 'In Progress'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="w-full">
              <p className="text-sm text-gray-500 mb-2">Profile Completion</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${jobSeeker.profileCompletionPercentage}%` }}
                />
              </div>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {jobSeeker.profileCompletionPercentage}% Complete
              </p>
            </div>
          </div>

          {jobSeeker.location && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{jobSeeker.location}</p>
              </div>
            </div>
          )}

          {jobSeeker.bio && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Bio</p>
              <p className="text-sm text-gray-700">{jobSeeker.bio}</p>
            </div>
          )}

          {/* Social Links */}
          {(jobSeeker.github || jobSeeker.linkedin || jobSeeker.personalWebsite) && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Social Links</p>
              <div className="space-y-2">
                {jobSeeker.github && (
                  <a 
                    href={jobSeeker.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Github className="w-4 h-4" />
                    GitHub Profile
                  </a>
                )}
                {jobSeeker.linkedin && (
                  <a 
                    href={jobSeeker.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn Profile
                  </a>
                )}
                {jobSeeker.personalWebsite && (
                  <a 
                    href={jobSeeker.personalWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Globe className="w-4 h-4" />
                    Personal Website
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Skills Card */}
      {jobSeeker.skills && jobSeeker.skills.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {jobSeeker.skills.map((skill: any) => (
              <div 
                key={skill.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full"
              >
                <span className="text-sm font-medium text-blue-900">{skill.skill.name}</span>
                {skill.proficiencyLevel && (
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                    {skill.proficiencyLevel}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience Card */}
      {jobSeeker.experiences && jobSeeker.experiences.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
          </div>
          <div className="space-y-4">
            {jobSeeker.experiences.map((exp: any) => (
              <div key={exp.id} className="border-l-2 border-blue-200 pl-4">
                <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                <p className="text-sm text-gray-600">{exp.company}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                </p>
                {exp.description && (
                  <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Card */}
      {jobSeeker.educations && jobSeeker.educations.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Education</h3>
          </div>
          <div className="space-y-4">
            {jobSeeker.educations.map((edu: any) => (
              <div key={edu.id} className="border-l-2 border-green-200 pl-4">
                <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                </p>
                {edu.description && (
                  <p className="text-sm text-gray-700 mt-2">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Card */}
      {jobSeeker.jobSeekerCertifications && jobSeeker.jobSeekerCertifications.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
          </div>
          <div className="space-y-3">
            {jobSeeker.jobSeekerCertifications.map((cert: any) => (
              <div key={cert.id} className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Award className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{cert.certification?.name}</p>
                  {cert.issueDate && (
                    <p className="text-xs text-gray-600 mt-1">
                      Issued: {formatDate(cert.issueDate)}
                      {cert.expiryDate && ` • Expires: ${formatDate(cert.expiryDate)}`}
                    </p>
                  )}
                  {cert.credentialUrl && (
                    <a 
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                    >
                      View Credential →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumes Card */}
      {jobSeeker.resumes && jobSeeker.resumes.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Resumes</h3>
          </div>
          <div className="space-y-2">
            {jobSeeker.resumes.map((resume: any) => (
              <a
                key={resume.id}
                href={resume.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{resume.fileName}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded: {formatDate(resume.uploadedAt)}
                    </p>
                  </div>
                </div>
                <span className="text-blue-600 text-sm">View →</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Statistics Card */}
      {user.stats && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Statistics</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-3xl font-bold text-purple-700">{user.stats.totalApplications || 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
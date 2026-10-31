"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";

const subjects = [
  {
    name: "Biology",
    teacher: "Niru Koju",
    initials: "NK",
    headerColor: "#394E55",
    avatarColor: "#BDCACE",
  },
  {
    name: "Physics",
    teacher: "Suraj Thapa",
    initials: "ST",
    headerColor: "#423B58",
    avatarColor: "#9C93BA",
  },
  {
    name: "Chemistry",
    teacher: "Priya Bohaju",
    initials: "PB",
    headerColor: "#533955",
    avatarColor: "#A27EA5",
  },
];

const subjectItems = [
  {
    label: "Published notes",
    icon: (
      <>
        <path d="M7 3.5h8l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
        <path d="M15 3.5v4h4M9 11h7M9 14h7M9 17h5" />
      </>
    ),
  },
  {
    label: "Assigned quizzes",
    icon: (
      <>
        <rect x="5" y="4" width="14" height="16" rx="1.5" />
        <path d="m8 9 1.2 1.2L11.5 8M13 9h3M8 15h2M13 15h3" />
      </>
    ),
  },
  {
    label: "Announcements",
    icon: (
      <>
        <path d="M4 11v2a2 2 0 0 0 2 2h2l7 4V5l-7 4H6a2 2 0 0 0-2 2Z" />
        <path d="m8 15 1.5 5h3L11 16M18 9l2-2M18 15l2 2" />
      </>
    ),
  },
];

function SubjectIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 5.5c2.8-.9 5.4-.4 8 1.5v13c-2.6-1.9-5.2-2.4-8-1.5v-13Z" />
      <path d="M20 5.5c-2.8-.9-5.4-.4-8 1.5v13c2.6-1.9 5.2-2.4 8-1.5v-13Z" />
      <path d="M6.5 9c1.4-.2 2.6.1 3.7.8M6.5 12c1.4-.2 2.6.1 3.7.8M17.5 9c-1.4-.2-2.6.1-3.7.8M17.5 12c-1.4-.2-2.6.1-3.7.8" />
    </svg>
  );
}

export function StudentClassroomPage() {
  return (
    <div className="student-classroom-page">
      <PageHeader
        title="My Subjects"
        description="Access your enrolled subjects, notes, quizzes and announcements."
      />

      <div className="student-subject-grid">
        {subjects.map((subject) => (
          <article className="student-subject-card" key={subject.name}>
            <header
              className="student-subject-card-header"
              style={{ backgroundColor: subject.headerColor }}
            >
              <h2>{subject.name}</h2>
              <p>{subject.teacher}</p>
              <span
                className="student-subject-avatar"
                style={{ backgroundColor: subject.avatarColor }}
                aria-label={`Teacher ${subject.teacher}`}
              >
                {subject.initials}
              </span>
            </header>

            <div className="student-subject-card-body">
              <div className="student-subject-summary">
                <span className="student-subject-icon">
                  <SubjectIcon />
                </span>
                <div>
                  <h3>{subject.name}</h3>
                  <p>Your enrolled subject</p>
                </div>
              </div>

              <ul className="student-subject-links">
                {subjectItems.map((item) => (
                  <li key={item.label}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {item.icon}
                    </svg>
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}

        <div className="student-join-subject-card" aria-label="Join Subject">
          <span className="student-join-subject-icon" aria-hidden="true">+</span>
          <span>Join Subject</span>
        </div>
      </div>
    </div>
  );
}

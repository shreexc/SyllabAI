"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";

const classes = [
  { name: "Biology", teacher: "Niru Koju", initials: "NK", headerColor: "#394E55", avatarColor: "#BDCACE" },
  { name: "Physics", teacher: "Suraj Thapa", initials: "ST", headerColor: "#423B58", avatarColor: "#9C93BA" },
  { name: "Chemistry", teacher: "Priya Bohaju", initials: "PB", headerColor: "#533955", avatarColor: "#A27EA5" },
];

const classItems = [
  {
    label: "Students",
    icon: (
      <>
        <circle cx="9" cy="8" r="2.5" />
        <circle cx="16" cy="9" r="2" />
        <path d="M4.5 18c.4-3 2-4.5 4.5-4.5s4.1 1.5 4.5 4.5M14 14c2.8-.5 4.6.8 5.2 3.5" />
      </>
    ),
  },
  {
    label: "Learning materials",
    icon: (
      <>
        <path d="M6 3.5h8l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
        <path d="M14 3.5v4h4M8 12h7M8 15h7M8 18h5" />
      </>
    ),
  },
  {
    label: "Assignments & quizzes",
    icon: (
      <>
        <rect x="5" y="3.5" width="14" height="17" rx="1.5" />
        <path d="M8 8h8M8 12h2M13 12h3M8 16h2M13 16h3" />
      </>
    ),
  },
];

function ClassSubjectIcon() {
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

export function TeacherClassroomPage() {
  return (
    <div className="teacher-classroom-page">
      <PageHeader
        title="My Classes"
        description="Create and manage your classes, share learning materials, quizzes and assignments."
      />

      <div className="teacher-class-grid">
        {classes.map((classroom) => (
          <article className="teacher-class-card" key={classroom.name}>
            <header
              className="teacher-class-card-header"
              style={{ backgroundColor: classroom.headerColor }}
            >
              <h2>{classroom.name}</h2>
              <p>{classroom.teacher}</p>
              <span
                className="teacher-class-avatar"
                style={{ backgroundColor: classroom.avatarColor }}
                aria-label={`Teacher ${classroom.teacher}`}
              >
                {classroom.initials}
              </span>
            </header>

            <div className="teacher-class-card-body">
              <div className="teacher-class-summary">
                <span className="teacher-class-icon">
                  <ClassSubjectIcon />
                </span>
                <div>
                  <h3>{classroom.name}</h3>
                  <p>Your enrolled subject</p>
                </div>
              </div>

              <ul className="teacher-class-links">
                {classItems.map((item) => (
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

        <article className="teacher-create-class-card" aria-label="Create New Class">
          <span className="teacher-create-class-icon" aria-hidden="true">+</span>
          <span>Create New Class</span>
        </article>
      </div>
    </div>
  );
}

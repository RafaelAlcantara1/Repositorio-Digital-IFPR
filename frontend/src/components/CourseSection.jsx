// src/components/CourseSection.jsx
import React from 'react';
import { FaFileDownload } from 'react-icons/fa';

function CourseSection() {
  return (
    <div className="content-section course-section">
      <h2 className="course-title">Curso 2</h2>
      <div className="course-item">
        <p>AAAAAAAAAA AAAAAAAAAA AAAAAAAAAAAAAAAA</p>
        <div className="authors">
          <p>Michelle Castro Goularte, Gimolha de Amendeou, Von da Silva Morderna Soares Brito Alex</p>
        </div>
        <a href="#download" className="download-link">
          <FaFileDownload />
        </a>
      </div>
    </div>
  );
}

export default CourseSection;
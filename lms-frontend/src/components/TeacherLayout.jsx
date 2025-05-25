import React from 'react';
import { Outlet } from 'react-router-dom';
import TeacherSlidebar from './TeacherSlidebar';

const TeacherLayout = () => {
  return (
    <div className="teacher-layout">
      <TeacherSlidebar />
      <div className="teacher-content">
        <Outlet />
      </div>
    </div>
  );
};

export default TeacherLayout; 
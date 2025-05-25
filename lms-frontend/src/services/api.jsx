// Base API URL
export const API_BASE_URL = 'http://localhost:8080';

// API Endpoints
export const API_ENDPOINTS = {
    // Auth endpoints
    auth: {
        login: '/api/auth/login',
        getLoginById: (id) => `/api/auth/login/${id}`,
    },

    // Student endpoints
    student: {
        register: '/students/register',
        getAll: '/students',
        getById: (id) => `/students/${id}`,
        getProfile: (id) => `/students/profile/${id}`,
        update: (id) => `/students/${id}`,
        delete: (id) => `/students/${id}`,
    },

    // Teacher endpoints
    teacher: {
        create: '/teacher',
        update: (id) => `/teacher/${id}`,
        delete: (id) => `/teacher/${id}`,
        addQualification: (teacherId) => `/teacher/${teacherId}/qualifications`,
        removeQualification: (teacherId) => `/teacher/${teacherId}/qualifications`,
        getQualifications: (teacherId) => `/teacher/${teacherId}/qualifications`,
        updateQualifications: (teacherId) => `/teacher/${teacherId}/qualifications/full`,
    },

    // Course endpoints
    course: {
        getAll: '/api/courses',
        getById: (id) => `/api/courses/${id}`,
        create: '/api/courses',
        update: (id) => `/api/courses/${id}`,
        delete: (id) => `/api/courses/${id}`,
    },

    // Assignment endpoints
    assignment: {
        create: '/api/assignments',
        getById: (id) => `/api/assignments/${id}`,
        getAll: '/api/assignments',
        update: (id) => `/api/assignments/${id}`,
        delete: (id) => `/api/assignments/${id}`,
        getByStudent: (studentId) => `/api/assignments/student/${studentId}`,
        getByTeacher: (teacherId) => `/api/assignments/teacher/${teacherId}`,
        getByCourse: (courseId) => `/api/assignments/course/${courseId}`,
    },

    // Quiz endpoints
    quiz: {
        create: '/api/quizzes',
        getById: (id) => `/api/quizzes/${id}`,
        getAll: '/api/quizzes',
        update: (id) => `/api/quizzes/${id}`,
        delete: (id) => `/api/quizzes/${id}`,
    },

    // Question endpoints
    question: {
        create: '/api/questions',
        getById: (id) => `/api/questions/${id}`,
        getAll: '/api/questions',
        update: (id) => `/api/questions/${id}`,
        delete: (id) => `/api/questions/${id}`,
        getByQuiz: (quizId) => `/api/questions/quiz/${quizId}`,
    },

    // Attempt endpoints
    attempt: {
        create: '/api/attempts',
        update: (quizId, studentId) => `/api/attempts/quiz/${quizId}/student/${studentId}`,
        getAll: '/api/attempts',
        getByQuiz: (quizId) => `/api/attempts/quiz/${quizId}`,
        getByStudent: (studentId) => `/api/attempts/student/${studentId}`,
        delete: (quizId) => `/api/attempts/${quizId}`,
    },

    // Enrollment endpoints
    enrollment: {
        create: '/api/enroll',
        uploadPayment: '/api/enroll/upload-payment',
        getByStudent: (studentId) => `/api/enroll/student/${studentId}`,
        getSpecific: (studentId, courseId) => `/api/enroll/${studentId}/${courseId}`,
        getPending: '/api/enroll/pending',
        getAll: '/api/enroll/all',
        approve: (studentId, courseId) => `/api/enroll/approve/${studentId}/${courseId}`,
        reject: (studentId, courseId) => `/api/enroll/reject/${studentId}/${courseId}`,
        getStats: '/api/admin/enrollments/stats',
        downloadPaymentSlip: (filepath) => `/api/enroll/payment-slip/${filepath}`,
    },

    // Submission endpoints
    submission: {
        create: '/api/submissions',
        update: (assignmentId, studentId) => `/api/submissions/assignment/${assignmentId}/student/${studentId}`,
        getAll: '/api/submissions',
        getByStudent: (studentId) => `/api/submissions/student/${studentId}`,
        getByAssignment: (assignmentId) => `/api/submissions/assignment/${assignmentId}`,
        delete: (id) => `/api/submissions/${id}`,
    },
}; 
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth Services
export const authService = {
    login: async (credentials) => {
        const response = await api.post(API_ENDPOINTS.auth.login, credentials);
        return response.data;
    },
    getLoginById: async (id) => {
        const response = await api.get(API_ENDPOINTS.auth.getLoginById(id));
        return response.data;
    },
};

// Student Services
export const studentService = {
    register: async (studentData) => {
        const response = await api.post(API_ENDPOINTS.student.register, studentData);
        return response.data;
    },
    getAll: async () => {
        const response = await api.get(API_ENDPOINTS.student.getAll);
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(API_ENDPOINTS.student.getById(id));
        return response.data;
    },
    getProfile: async (id) => {
        const response = await api.get(API_ENDPOINTS.student.getProfile(id));
        return response.data;
    },
    update: async (id, studentData) => {
        const response = await api.put(API_ENDPOINTS.student.update(id), studentData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(API_ENDPOINTS.student.delete(id));
        return response.data;
    },
};

// Teacher Services
export const teacherService = {
    create: async (teacherData) => {
        const response = await api.post(API_ENDPOINTS.teacher.create, teacherData);
        return response.data;
    },
    update: async (id, teacherData) => {
        const response = await api.put(API_ENDPOINTS.teacher.update(id), teacherData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(API_ENDPOINTS.teacher.delete(id));
        return response.data;
    },
    addQualification: async (teacherId, qualification) => {
        const response = await api.post(API_ENDPOINTS.teacher.addQualification(teacherId), { qualification });
        return response.data;
    },
    removeQualification: async (teacherId, qualification) => {
        const response = await api.delete(API_ENDPOINTS.teacher.removeQualification(teacherId), { data: { qualification } });
        return response.data;
    },
    getQualifications: async (teacherId) => {
        const response = await api.get(API_ENDPOINTS.teacher.getQualifications(teacherId));
        return response.data;
    },
    updateQualifications: async (teacherId, qualifications) => {
        const response = await api.put(API_ENDPOINTS.teacher.updateQualifications(teacherId), { qualification: qualifications });
        return response.data;
    },
};

// Course Services
export const courseService = {
    getAll: async () => {
        const response = await api.get(API_ENDPOINTS.course.getAll);
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(API_ENDPOINTS.course.getById(id));
        return response.data;
    },
    create: async (courseData) => {
        const response = await api.post(API_ENDPOINTS.course.create, courseData);
        return response.data;
    },
    update: async (id, courseData) => {
        const response = await api.put(API_ENDPOINTS.course.update(id), courseData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(API_ENDPOINTS.course.delete(id));
        return response.data;
    },
};

// Assignment Services
export const assignmentService = {
    create: async (assignmentData) => {
        const response = await api.post(API_ENDPOINTS.assignment.create, assignmentData);
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(API_ENDPOINTS.assignment.getById(id));
        return response.data;
    },
    getAll: async () => {
        const response = await api.get(API_ENDPOINTS.assignment.getAll);
        return response.data;
    },
    update: async (id, assignmentData) => {
        const response = await api.put(API_ENDPOINTS.assignment.update(id), assignmentData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(API_ENDPOINTS.assignment.delete(id));
        return response.data;
    },
    getByStudent: async (studentId) => {
        const response = await api.get(API_ENDPOINTS.assignment.getByStudent(studentId));
        return response.data;
    },
    getByTeacher: async (teacherId) => {
        const response = await api.get(API_ENDPOINTS.assignment.getByTeacher(teacherId));
        return response.data;
    },
    getByCourse: async (courseId) => {
        const response = await api.get(API_ENDPOINTS.assignment.getByCourse(courseId));
        return response.data;
    },
};

// Quiz Services
export const quizService = {
    create: async (quizData) => {
        const response = await api.post(API_ENDPOINTS.quiz.create, quizData);
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(API_ENDPOINTS.quiz.getById(id));
        return response.data;
    },
    getAll: async () => {
        const response = await api.get(API_ENDPOINTS.quiz.getAll);
        return response.data;
    },
    update: async (id, quizData) => {
        const response = await api.put(API_ENDPOINTS.quiz.update(id), quizData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(API_ENDPOINTS.quiz.delete(id));
        return response.data;
    },
};

// Question Services
export const questionService = {
    create: async (questionData) => {
        const response = await api.post(API_ENDPOINTS.question.create, questionData);
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(API_ENDPOINTS.question.getById(id));
        return response.data;
    },
    getAll: async () => {
        const response = await api.get(API_ENDPOINTS.question.getAll);
        return response.data;
    },
    update: async (id, questionData) => {
        const response = await api.put(API_ENDPOINTS.question.update(id), questionData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(API_ENDPOINTS.question.delete(id));
        return response.data;
    },
    getByQuiz: async (quizId) => {
        const response = await api.get(API_ENDPOINTS.question.getByQuiz(quizId));
        return response.data;
    },
};

// Attempt Services
export const attemptService = {
    create: async (attemptData) => {
        const response = await api.post(API_ENDPOINTS.attempt.create, attemptData);
        return response.data;
    },
    update: async (quizId, studentId, attemptData) => {
        const response = await api.put(API_ENDPOINTS.attempt.update(quizId, studentId), attemptData);
        return response.data;
    },
    getAll: async () => {
        const response = await api.get(API_ENDPOINTS.attempt.getAll);
        return response.data;
    },
    getByQuiz: async (quizId) => {
        const response = await api.get(API_ENDPOINTS.attempt.getByQuiz(quizId));
        return response.data;
    },
    getByStudent: async (studentId) => {
        const response = await api.get(API_ENDPOINTS.attempt.getByStudent(studentId));
        return response.data;
    },
    delete: async (quizId) => {
        const response = await api.delete(API_ENDPOINTS.attempt.delete(quizId));
        return response.data;
    },
};

// Enrollment Services
export const enrollmentService = {
    create: async (enrollmentData) => {
        const response = await api.post(API_ENDPOINTS.enrollment.create, enrollmentData);
        return response.data;
    },
    uploadPaymentSlip: async (formData) => {
        const response = await api.post(API_ENDPOINTS.enrollment.uploadPayment, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    getByStudent: async (studentId) => {
        const response = await api.get(API_ENDPOINTS.enrollment.getByStudent(studentId));
        return response.data;
    },
    getSpecific: async (studentId, courseId) => {
        const response = await api.get(API_ENDPOINTS.enrollment.getSpecific(studentId, courseId));
        return response.data;
    },
    getPending: async () => {
        const response = await api.get(API_ENDPOINTS.enrollment.getPending);
        return response.data;
    },
    getAll: async () => {
        const response = await api.get(API_ENDPOINTS.enrollment.getAll);
        return response.data;
    },
    approve: async (studentId, courseId) => {
        const response = await api.put(API_ENDPOINTS.enrollment.approve(studentId, courseId));
        return response.data;
    },
    reject: async (studentId, courseId) => {
        const response = await api.put(API_ENDPOINTS.enrollment.reject(studentId, courseId));
        return response.data;
    },
    getStats: async () => {
        const response = await api.get(API_ENDPOINTS.enrollment.getStats);
        return response.data;
    },
    getPaymentSlipUrl: (filepath) => {
        return `${API_BASE_URL}${API_ENDPOINTS.enrollment.downloadPaymentSlip(filepath)}`;
    },
};

// Submission Services
export const submissionService = {
    create: async (submissionData) => {
        const response = await api.post(API_ENDPOINTS.submission.create, submissionData);
        return response.data;
    },
    update: async (assignmentId, studentId, submissionData) => {
        const response = await api.put(API_ENDPOINTS.submission.update(assignmentId, studentId), submissionData);
        return response.data;
    },
    getAll: async () => {
        const response = await api.get(API_ENDPOINTS.submission.getAll);
        return response.data;
    },
    getByStudent: async (studentId) => {
        const response = await api.get(API_ENDPOINTS.submission.getByStudent(studentId));
        return response.data;
    },
    getByAssignment: async (assignmentId) => {
        const response = await api.get(API_ENDPOINTS.submission.getByAssignment(assignmentId));
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(API_ENDPOINTS.submission.delete(id));
        return response.data;
    },
}; 
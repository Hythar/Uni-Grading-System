import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    where,
    query,
    updateDoc, serverTimestamp,
    DocumentSnapshot, DocumentReference,
    FirestoreDataConverter, DocumentData,
    QueryDocumentSnapshot,
    addDoc,
    deleteDoc,
    arrayUnion,
    arrayRemove,
    runTransaction,
} from "firebase/firestore";

import { db, auth } from "./firebaseApp";
import { CourseListColumn } from "@/pages/admin/components/columns";


//Define types

export interface Student {
    studId: string;
    firstName: string;
    lastName: string;
    email: string;
    
    role: string;
    
    registrationDate: string;
    specialCases?: string[];
}

export interface Marks {
    studentID: string;
    markID: string;
    courseCode: string;
    assessmentID: string;
    type: string;
    score: number;
    lecturerID: string;
    total: number;

}

export interface AdminEdits {
    editID: string;
    adminID: string;
    timestamp: string;

}

export interface EditedFields {
    assessmentID: string;
    oldScore: number;
    newScore: number;
}

export interface Lecturer {
    lectId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    registrationDate: string;
}

export interface AcademicYear {
    year: string;
}

export interface Semester {
    semesterID: string;
    academicYear: string;

}

export interface Course {
    courseCode: string;
    courseTitle: string;
    courseLecturer: string;
    registrationStatus: string;
    semesterID: string;
    studentsEnrolled?: string[];
    academicYear: string;
}

export interface SemesterCourse {
    courseCode: string;
    courseTitle: string;
    courseLecturer: string;
    courseStatus: string; //"Ongoing |Passed |Failed"
    studentsEnrolled?: string[];
    semesterID: string;
    academicYear?: string;
}
export interface EnrolledCourse {
    courseCode: string;
    academicYear: string;
    semesterID: string;
    courseStatus: string;
}
export interface AdminEdits {
    adminID: string;
    editID: string;
    timestamp: string;
    markID: string;
    oldScore: number;
    newScore: number;

}
// Database functions

// Helper function to convert serverTimestamp to date format
function convertServerTimestampToDate(data: any): any {
    if (!data || typeof data !== 'object') return data;

    if (data.hasOwnProperty('serverTimestamp')) {
        return new Date(data.serverTimestamp.seconds * 1000); // Convert serverTimestamp to Date format
    }

    // Handle nested objects or arrays
    if (Array.isArray(data)) {
        return data.map((item) => convertServerTimestampToDate(item));
    } else {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, convertServerTimestampToDate(value)])
        );
    }
}

// implement the Firestore DataConverter for Student
export const studentConverter: FirestoreDataConverter<Student> = {
    toFirestore(student: Student): DocumentData {
        return {
            studId: student.studId,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            
            role: student.role,
            
            registrationDate: student.registrationDate,
            specialCases: student.specialCases
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): Student {
        const data = snapshot.data();
        // Convert the category object to Firestore data
        return {
            studId: data.studId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            
            role: data.role,
            
            registrationDate: data.registrationDate,
            specialCases: data.specialCases
        };
    }
};

//get all students from the database
export const getAllStudents = async () => {
    try {
    const studentsRef = collection(db, "Students").withConverter(studentConverter);
    const studentsSnapshot = await getDocs(studentsRef);

    const students = studentsSnapshot.docs.map(doc => doc.data());

    return students;}
    catch (error) {
        console.log(`Error getting Students: ${error}`);
        return [];
    }
}

// implement the Firestore DataConverter for lecturer
export const lecturerConverter: FirestoreDataConverter<Lecturer> = {
    toFirestore(lecturer: Lecturer): DocumentData {
        return {
            lectId: lecturer.lectId,
            firstName: lecturer.firstName,
            lastName: lecturer.lastName,
            email: lecturer.email,
            role: lecturer.role,
            registrationDate: lecturer.registrationDate
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): Lecturer {
        const data = snapshot.data();
        // Convert the category object to Firestore data
        return {
            lectId: data.lectId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
            registrationDate: data.registrationDate
        };
    }
};
// get all lecturers from the database and return the first name and last name ofeach in an array
export const getAllLecturers = async () => {
    try {
        const lecturersRef = collection(db, "Lecturers").withConverter(lecturerConverter);
        const lecturersSnapshot = await getDocs(lecturersRef);
        const lecturers = lecturersSnapshot.docs.map((doc) => doc.data());
        return lecturers;
    } catch (error) {
        console.log(`Error getting Lecturers: ${error}`);
        return [];

    }
}

// get a lecturer by id from the database
export const getLecturerById = async (lectId: string) => {
    try {
        const lecturerRef = doc(db, "Lecturers", lectId).withConverter(lecturerConverter);
        const lecturerSnapshot = await getDoc(lecturerRef);
        const lecturer = lecturerSnapshot.data();
        return lecturer;
    } catch (error) {
        console.log(`Error getting Lecturer: ${error}`);
        return null;
    }
}


// add course to courses collection
export const addCourse = async (course: Partial<Course>) => {
    // check if course already exists
    const existingCourseQuery = (query(collection(db, "Courses"), where("courseCode", "==", course.courseCode)));
    const existingCourseSnapshot = await getDocs(existingCourseQuery);
    if (!existingCourseSnapshot.empty) {
        console.log(`Course ${course.courseCode} already exists`);
        return false;
    }

    const newCourse = {
        courseCode: course.courseCode?.toUpperCase(),
        courseTitle: course.courseTitle,
        courseLecturer: course.courseLecturer,
        registrationStatus: course.registrationStatus,
        semesterID: course.semesterID?.toUpperCase(),
    }

    try {
        // add with coursecode as the ID
        if (newCourse.courseCode) {
            const courseUID = newCourse.courseCode;
            const courseRef = doc(db, "Courses", courseUID);
            await setDoc(courseRef, newCourse);
            console.log(`Course ${newCourse.courseCode} added successfully`);
            return newCourse;
            // Rest of the code...
        } else {
            console.log("Course code is undefined.");
            return false;
        }

    } catch (error) {
        console.log(`Error adding Course: ${error}`);
        return false;
    }
}

export const updateCourse = async (courseCode: string, updatedCourse: Partial<Course>) => {
    try {
        // Get a reference to the course document
        const courseRef = doc(db, "Courses", courseCode.toUpperCase());

        // Update the course document
        await updateDoc(courseRef, updatedCourse);

        console.log(`Course ${courseCode} updated successfully`);
        return true;
    } catch (error) {
        console.log(`Error updating Course: ${error}`);
        return false;
    }
}

// add an academic year to academic years collection
export const addAcademicYear = async (year: string) => {
    try {
        // check if year already exists
        const existingYearQuery = (query(collection(db, "AcademicYears"), where("year", "==", year)));
        const existingYearSnapshot = await getDocs(existingYearQuery);
        if (!existingYearSnapshot.empty) {
            console.log(`Academic year ${year} already exists`);
            return false;
        }

        const newYear = {
            year: year
        }


        // add with year as the ID
        if (newYear.year) {
            const yearRef = doc(db, "AcademicYears", newYear.year);
            await setDoc(yearRef, newYear);
            console.log(`Academic year ${newYear.year} added successfully`);
            return newYear;
            // Rest of the code...
        } else {
            console.log("Academic year is undefined.");
            return false;
        }

    } catch (error) {
        console.log(`Error adding Academic year: ${error}`);
        return false;
    }
}


// implement the Firestore DataConverter for AcademicYear
export const academicYearConverter: FirestoreDataConverter<AcademicYear> = {
    toFirestore(academicYear: AcademicYear): DocumentData {
        return {
            year: academicYear.year,

        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): AcademicYear {
        const data = snapshot.data();
        // Convert the category object to Firestore data
        return {
            year: data.year,

        };
    }
};

//get all academic years from the database
export const getAllAcademicYears = async () => {
    try {
        const yearsRef = collection(db, "AcademicYears").withConverter(academicYearConverter);
        const yearsSnapshot = await getDocs(yearsRef);
        const years = yearsSnapshot.docs.map((doc) => doc.data());
        return years;
    } catch (error) {
        console.log(`Error getting Academic Years: ${error}`);
        return [];

    }
}

// add  semester to semesters collection
export const addSemester = async (semester: string) => {
    try {
        // check if semester already exists
        const existingSemesterQuery = (query(collection(db, "Semesters"), where("semester", "==", semester)));
        const existingSemesterSnapshot = await getDocs(existingSemesterQuery);
        if (!existingSemesterSnapshot.empty) {
            console.log(`Semester ${semester} already exists`);
            return false;
        }

        const newSemester = {
            semesterID: semester
        }


        // add with semester as the ID
        if (newSemester.semesterID) {
            const semesterRef = doc(db, "Semesters", newSemester.semesterID);
            await setDoc(semesterRef, newSemester);
            console.log(`Semester ${newSemester.semesterID} added successfully`);
            return newSemester;
            // Rest of the code...
        } else {
            console.log("Semester is undefined.");
            return false;
        }

    } catch (error) {
        console.log(`Error adding Semester: ${error}`);
        return false;
    }
}

// implement the Firestore DataConverter for Semester
export const semesterConverter: FirestoreDataConverter<Semester> = {
    toFirestore(semester: Semester): DocumentData {
        return {
            semesterID: semester.semesterID,
            academicYear: semester.academicYear,


        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): Semester {
        const data = snapshot.data();
        // Convert the category object to Firestore data
        return {
            semesterID: data.semesterID,
            academicYear: data.academicYear,

        };
    }
};

//get all semesters from the database
export const getAllSemesters = async () => {
    try {
        const semestersRef = collection(db, "Semesters").withConverter(semesterConverter);
        const semestersSnapshot = await getDocs(semestersRef);
        const semesters = semestersSnapshot.docs.map((doc) => doc.data());
        return semesters;
    } catch (error) {
        console.log(`Error getting Semesters: ${error}`);
        return [];

    }
}

//get all semesters from the database
// export const getAllSemesterz = async () => {
//     try {
//         const semestersRef = collection(db, "Semesters", "Courses", "CMS3788");
//         const semestersSnapshot = await getDocs(semestersRef);
//         const semesters = semestersSnapshot.docs.map((doc) => doc.data());

//         return semesters;
//     } catch (error) {
//         console.log(`Error getting Semesters: ${error}`);
//         return [];

//     }
// }
// implement the Firestore DataConverter for CourseSemester
export const courseSemesterConverter: FirestoreDataConverter<SemesterCourse> = {
    toFirestore(courseSemester: SemesterCourse): DocumentData {
        return {
            courseCode: courseSemester.courseCode,
            courseTitle: courseSemester.courseTitle,
            courseLecturer: courseSemester.courseLecturer,
            courseStatus: courseSemester.courseStatus,
            studentsEnrolled: courseSemester.studentsEnrolled,
            semesterID: courseSemester.semesterID,
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): SemesterCourse {
        const data = snapshot.data();
        // Convert the category object to Firestore data
        return {
            courseCode: data.courseCode,
            courseTitle: data.courseTitle,
            courseLecturer: data.courseLecturer,
            courseStatus: data.courseStatus,
            studentsEnrolled: data.studentsEnrolled,
            semesterID: data.semesterID,
        };
    }
};

// get all courses in the courses subcollection in the semester collection
export const getAllCoursesInSemester = async (semester: string) => {
    try {
        const coursesRef = collection(db, "Semesters", semester, "Courses");
        const coursesSnapshot = await getDocs(coursesRef);
        const courses = coursesSnapshot.docs.map((doc) => doc.data());
        return courses;
    } catch (error) {
        console.log(`Error getting Courses: ${error}`);
        return [];

    }
}

//add the fields AcademicYearID and a course collection with data to the semester collection
export const addSemesterDetails = async (semester: string, academicYear: string, course: Partial<Course>) => {
    try {

        // check if semester already exists
        if (!semester) {
            console.log(`Semester is undefined`);
            return false;
        }

        const existingSemesterQuery = (query(collection(db, "Semesters"), where("semesterID", "==", semester)));
        const existingSemesterSnapshot = await getDocs(existingSemesterQuery);
        if (existingSemesterSnapshot.empty) {
            console.log(`Semester ${semester} does not exist`);
            return false;
        }
        if (!course.courseCode) {
            console.log(`Course code is undefined`);
            return false;
        }

        // add the academic year to the semester
        const semesterRef = doc(db, "Semesters", semester);
        await updateDoc(semesterRef, {
            academicYear: academicYear,
        });


        const courseRef = doc(db, "Semesters", semester, "Courses", course.courseCode);
        await setDoc(courseRef, {
            ...course,

        });
        console.log(`Course ${course.courseCode} details added successfully to semester ${semester}`);
        return true;
    }
    catch (error) {
        console.log(`Error adding course details: ${error}`);
        return false;
    }
}

// get courses from course subcollection in semester collection
export const getCoursesForSemester = async (semester: string) => {
    try {
        const coursesRef = collection(db, "Semesters", semester, "Courses");
        const coursesSnapshot = await getDocs(coursesRef);
        const courses = coursesSnapshot.docs.map(async (doc) => {
            const courseData = doc.data();
            const lecturer = await getLecturerById(courseData.courseLecturer);
            const course: Course = {
                courseCode: courseData.courseCode,
                courseTitle: courseData.courseTitle,
                registrationStatus: courseData.registrationStatus,
                semesterID: courseData.semesterID,
                academicYear: courseData.academicYear,
                studentsEnrolled: courseData.studentsEnrolled,
                courseLecturer: `${lecturer?.firstName} ${lecturer?.lastName}`
            };
            return course;
        });
        return Promise.all(courses);
    } catch (error) {
        console.log(`Error getting Courses: ${error}`);
        return [];
    }
}

//add the subcollection EnrolledCourses and add a course collection with data to the student collection
export const addEnrolledCourses = async (selectedCoursePayload: EnrolledCourse, student_id: string) => {
    try {
        // Check if course already exists
        const existingCourseQuery = query(collection(db, "Student", student_id, "EnrolledCourses"), where("courseCode", "==", selectedCoursePayload.courseCode));
        const existingCourseSnapshot = await getDocs(existingCourseQuery);
        if (!existingCourseSnapshot.empty) {
            console.log(`Course ${selectedCoursePayload.courseCode} already exists`);
            return false;
        }

        // Add the course to the Students collection
        const enrolledCoursesRef = doc(db, "Students", student_id, "EnrolledCourses", selectedCoursePayload.courseCode);
        await setDoc(enrolledCoursesRef, {
            ...selectedCoursePayload,
        });

        // Add the student to the course in the Courses collection
        const courseRef = doc(db, "Courses", selectedCoursePayload.courseCode);
        // Start a new transaction
        await runTransaction(db, async (transaction) => {
            // Get the current course document
            const courseSnap = await transaction.get(courseRef);

            // Initialize studentsEnrolled as an empty array if it doesn't exist
            if (!courseSnap.exists() || !courseSnap.data().studentsEnrolled) {
                transaction.set(courseRef, { studentsEnrolled: [] }, { merge: true });
            }

            // Add the student to studentsEnrolled
            transaction.update(courseRef, {
                studentsEnrolled: arrayUnion(student_id)
            });
        });
        console.log(`Course ${selectedCoursePayload.courseCode} added successfully to student ${student_id}`);
    } catch (error) {
        console.log(`Error adding enrolled courses: ${error}`);
        return false;
    }
}


// implement the Firestore DataConverter for EnrolledCourse
export const enrolledCourseConverter: FirestoreDataConverter<EnrolledCourse> = {
    toFirestore(enrolledCourse: EnrolledCourse): DocumentData {
        return {
            courseCode: enrolledCourse.courseCode,
            academicYear: enrolledCourse.academicYear,
            semesterID: enrolledCourse.semesterID,
            courseStatus: enrolledCourse.courseStatus,
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): EnrolledCourse {
        const data = snapshot.data();
        // Convert the category object to Firestore data
        return {
            courseCode: data.courseCode,
            academicYear: data.academicYear,
            semesterID: data.semesterID,
            courseStatus: data.courseStatus,
        };
    }
};
// get enrolled courses from EnrolledCourses subcollection in student collection
export const getEnrolledCourses = async (student_id: string) => {
    try {
        const enrolledCoursesRef = collection(db, "Students", student_id, "EnrolledCourses").withConverter(enrolledCourseConverter);
        const enrolledCoursesSnapshot = await getDocs(enrolledCoursesRef);
        const enrolledCourses = enrolledCoursesSnapshot.docs.map((doc) => doc.data());
        return enrolledCourses;
    } catch (error) {
        console.log(`Error getting enrolled courses: ${error}`);
        return [];
    }
}

// delete enrolled course from EnrolledCourses subcollection in student collection
export const deleteEnrolledCourse = async (student_id: string, courseCode: string) => {
    try {
        const enrolledCoursesRef = doc(db, "Students", student_id, "EnrolledCourses", courseCode);
        await deleteDoc(enrolledCoursesRef);
        // delete the student from the course in the Courses collection
        const courseRef = doc(db, "Courses", courseCode);
        await updateDoc(courseRef, {
            studentsEnrolled: arrayRemove(student_id)
        });
        console.log(`Course ${courseCode} deleted successfully from student ${student_id}`);
        return true;
    } catch (error) {
        console.log(`Error deleting enrolled course: ${error}`);
        return false;
    }
}

// implement the firestore data converter for courses
export const courseConverter: FirestoreDataConverter<Course> = {
    toFirestore(course: Course): DocumentData {
        return {
            courseCode: course.courseCode,
            courseTitle: course.courseTitle,
            courseLecturer: course.courseLecturer,
            registrationStatus: course.registrationStatus,
            semesterID: course.semesterID,
            academicYear: course.academicYear,
            studentsEnrolled: course.studentsEnrolled
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): Course {
        const data = snapshot.data();
        // Convert the category object to Firestore data
        return {
            courseCode: data.courseCode,
            courseTitle: data.courseTitle,
            courseLecturer: data.courseLecturer,
            registrationStatus: data.registrationStatus,
            semesterID: data.semesterID,
            academicYear: data.academicYear,
            studentsEnrolled: data.studentsEnrolled
        };
    }
};

// get all courses in the courses collection
export const getAllCourses = async () => {
    try {
        const coursesRef = collection(db, "Courses");
        const coursesSnapshot = await getDocs(coursesRef);
        // const courses = coursesSnapshot.docs.map((doc) => doc.data());
        const courses = coursesSnapshot.docs.map(async (doc) => {
            const courseData = doc.data();
            const lecturer = await getLecturerById(courseData.courseLecturer);
            // const studentName = courseData.studentsEnrolled.map(async(name:string) =>{const jina = await getStudentNameById(name); })
            // console.log(studentName);

            let studentsEnrolled: string[] = [];
            if (Array.isArray(courseData.studentsEnrolled)) {
                studentsEnrolled = await Promise.all(courseData.studentsEnrolled.map(async (id: string) => {
                    const studentName = await getStudentNameById(id);
                    return studentName;
                }));
            }

            console.log(typeof (courseData.studentsEnrolled));
            console.log(courseData.studentsEnrolled);
            const course: CourseListColumn = {
                courseCode: courseData.courseCode,
                courseTitle: courseData.courseTitle,
                registrationStatus: courseData.registrationStatus,
                semesterID: courseData.semesterID,
                academicYear: courseData.academicYear,
                studentsEnrolled: [studentsEnrolled.length.toString()],
                courseLecturer: `${lecturer?.firstName} ${lecturer?.lastName}`
            };
            return course;
        });
        return Promise.all(courses);
    } catch (error) {
        console.log(`Error getting Courses: ${error}`);
        return [];

    }
}

// get all courses assigned to a lecturer
export const getAllCoursesForLecturer = async (lecturer_id: string) => {
    try {
        const coursesRef = collection(db, "Courses").withConverter(courseConverter);
        const q = query(coursesRef, where("courseLecturer", "==", lecturer_id));
        const querySnapshot = await getDocs(q);
        const lecturerCourses = querySnapshot.docs.map((doc) => doc.data());
        return lecturerCourses;
    } catch (error) {
        console.log(`Error getting Courses: ${error}`);
        return [];
    }
}

// get students enrolled in a course by lecturer id and course code 
// export const getStudentNamesFromCourseByLecturer = async (lecturerId: string, courseCode: string) => {
//     try {
//         const coursesRef = collection(db, "Courses");
//         const q = query(coursesRef, where("courseCode", "==", courseCode), where("courseLecturer", "==", lecturerId));
//         const courseSnapshot = await getDocs(q);
//         const courseData = courseSnapshot.docs.map((doc) => doc.data());

//         if (courseData.length > 0) {
//             const studentIds = Object.keys(courseData[0].studentsEnrolled);
//             const students = [];

//             for (const id of studentIds) {
//                 const studentRef = doc(collection(db, "Students"), id);
//                 const studentSnapshot = await getDoc(studentRef);
//                 const studentData = studentSnapshot.data();

//                 if (studentData) {
//                     students.push(`${studentData.firstName} ${studentData.lastName}`);
//                 }
//             }

//             return students;
//         } else {
//             console.log(`No course found with code: ${courseCode} and lecturerId: ${lecturerId}`);
//             return [];
//         }
//     } catch (error) {
//         console.log(`Error getting students from course: ${error}`);
//         return [];
//     }
// }

// get student name from student id
export const getStudentNameById = async (studentId: string) => {
    try {
        const studentRef = doc(db, "Students", studentId);
        const studentSnapshot = await getDoc(studentRef);
        const studentData = studentSnapshot.data();
        if (!studentData) {
            console.log(`No document found with id: ${studentId}`);
            return '';
        }
        if (studentData) {
            return `${studentData.firstName} ${studentData.lastName}`;
        } else {
            console.log(`No student found with id: ${studentId}`);
            return '';
        }
    } catch (error) {
        console.log(`Error getting student name: ${error}`);
        return '';
    }
}

// add marks for a specific student in a course
export const addMarks = async (marks: Partial<Marks>) => {
    try {
        // check if marks already exists
        const existingMarksQuery = (query(collection(db, "Marks"), where("studentID", "==", marks.studentID), where("courseCode", "==", marks.courseCode), where("assessmentID", "==", marks.assessmentID)));
        const existingMarksSnapshot = await getDocs(existingMarksQuery);
        if (!existingMarksSnapshot.empty) {
            console.log(`Marks for ${marks.studentID} already exists`);
            return false;
        }

        const newMarks = {
            studentID: marks.studentID,
            courseCode: marks.courseCode,
            assessmentID: marks.assessmentID,
            type: marks.type,
            score: marks.score,
            lecturerID: marks.lecturerID,
            markID: '',
            total: marks.total
        }

        // add with studentID, courseCode and assessmentID as the ID
        if (newMarks.studentID && newMarks.courseCode && newMarks.assessmentID) {
            const marksUID = `${newMarks.studentID}_${newMarks.courseCode}_${newMarks.assessmentID}`;
            const marksRef = doc(db, "Marks", marksUID);
            newMarks.markID = marksUID;
            await setDoc(marksRef, newMarks);
            console.log(`Marks for ${newMarks.studentID} added successfully`);
            alert(`Marks for ${newMarks.studentID} added successfully`);
            return newMarks;

        } else {
            console.log("Marks is undefined.");
            return false;
        }

    } catch (error) {
        console.log(`Error adding Marks: ${error}`);
        return false;
    }
}

// implement the Firestore DataConverter for Marks
export const marksConverter: FirestoreDataConverter<Marks> = {
    toFirestore(marks: Marks): DocumentData {
        return {
            studentID: marks.studentID,
            courseCode: marks.courseCode,
            assessmentID: marks.assessmentID,
            type: marks.type,
            score: marks.score,
            lecturerID: marks.lecturerID,
            markID: marks.markID,
            total: marks.total
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): Marks {
        const data = snapshot.data();
        // Convert the category object to Firestore data
        return {
            studentID: data.studentID,
            courseCode: data.courseCode,
            assessmentID: data.assessmentID,
            type: data.type,
            score: data.score,
            lecturerID: data.lecturerID,
            markID: data.markID,
            total: data.total
        };
    }
};

export const getMarksFromCourseGroupedByStudent = async (courseCode: string) => {
    try {
        console.log(`Getting marks for course: ${courseCode}`);
        const marksRef = collection(db, "Marks");
        const q = query(marksRef, where("courseCode", "==", courseCode));
        const marksSnapshot = await getDocs(q);
        const marks = marksSnapshot.docs.map((doc) => doc.data());
        console.log(marks);

        const marksByStudent = marks.reduce((groups, mark) => {
            const studentId = mark.studentID;
            if (!groups[studentId]) {
                groups[studentId] = [];
            }
            console.log(groups);
            console.log(mark);
            groups[studentId].push(mark);
            return groups;
        }, {});

        return marksByStudent;
    } catch (error) {
        console.log(`Error getting Marks: ${error}`);
        return {};
    }
}

//get marks from Marks collection for a certain student in a course
export const getMarksFromCourseByStudent = async (studID: string, courseCode: string) => {
    try {
        const marksRef = collection(db, "Marks");
        const q = query(marksRef, where("studentID", "==", studID), where("courseCode", "==", courseCode));
        const marksSnapshot = await getDocs(q);
        const marks = marksSnapshot.docs.map((doc) => doc.data());

        const marksByStudent = marks.reduce((groups, mark) => {
            const studentId = mark.studentID;
            if (!groups[studentId]) {
                groups[studentId] = [];
            }
            groups[studentId].push(mark);
            return groups;
        }, {});

        return marksByStudent;
    } catch (error) {
        console.log(`Error getting Marks: ${error}`);
        return {};
    }
}

// get all the courses a student is enrolled in return the courseCodes
export const getStudentCourses = async (student_id: string) => {
    try {
        const coursesRef = collection(db, "Students", student_id, "EnrolledCourses").withConverter(enrolledCourseConverter);
        const coursesSnapshot = await getDocs(coursesRef);
        const courses = coursesSnapshot.docs.map((doc) => doc.data());
        return courses;
    } catch (error) {
        console.log(`Error getting Courses: ${error}`);
        return [];

    }
}

// update the marks for a student in the marks collection only if a valid admin id is provided
export const updateMarks = async (marks: Partial<Marks>, admin_id: string, markID: string) => {

    try {
        // check if marks already exists using markID
        const marksRef = doc(db, "Marks", markID);
        const marksSnapshot = await getDoc(marksRef);
        const marksData = marksSnapshot.data();
        if (!marksData) {
            console.log(`Marks ${markID} does not exist`);
            return false;
        }

        // check if admin exists
        const adminRef = doc(db, "Admins", admin_id);
        const adminSnapshot = await getDoc(adminRef);
        const adminData = adminSnapshot.data();
        if (!adminData) {
            console.log(`Admin ${admin_id} does not exist`);
            return false;
        }

        // update the marks for the specific student
        await updateDoc(marksRef, marks);
        alert(`Marks for ${marks.studentID} updated successfully`);

        // save the edit history
        const timestamp = serverTimestamp();
        const EditID = `${admin_id}_${markID}_${Date.now()}`;
        const adminEditsRef = doc(db, "AdminEdits", EditID);
        const edit = {
            EditID: EditID,
            AdminID: admin_id,
            Timestamp: timestamp,
            FieldName: "Marks",
            oldValue: marksData.score,
            newValue: marks.score,
            markID: markID
        };
        await setDoc(adminEditsRef, edit);
        console.log(`Marks for ${marks.studentID} updated successfully`);
        console.log(`Edit history ${edit.EditID} created successfully`);

    }
    catch (error) {
        console.log(`Error updating Marks: ${error}`);
        return false;
    }

}

export async function updateCourseStatus(courseCode: string) {
    try {
        // const studentsRef = collection(db, "Students");
        // const q = query(studentsRef, where("EnrolledCourses", "array-contains", courseCode));
        // const studentsSnapshot = await getDocs(q);

        // Get all students enrolled in the course collection from the enrolledStudents array
        const courseRef = doc(db, "Courses", courseCode);
        const courseSnapshot = await getDoc(courseRef);
        const courseData = courseSnapshot.data();
        const studentsIds = courseData?.studentsEnrolled;

        studentsIds.map(async (studentId: string) => {
            // const studentData = studentDoc.data();
            // const studentID = studentDoc.id;

            const marksRef = collection(db, "Marks");
            const marksQuery = query(marksRef, where("studentID", "==", studentId), where("courseCode", "==", courseCode));
            const marksSnapshot = await getDocs(marksQuery);

            let totalMarks = 0;
            let isIncomplete = false;

            marksSnapshot.forEach((markDoc) => {
                const markData = markDoc.data();
                if (markData.CAT1 && markData.CAT2 && markData.ASN1 && markData.ASN2 && markData.Exam) {
                    totalMarks += markData.CAT1 + markData.CAT2 + markData.ASN1 + markData.ASN2 + markData.Exam;
                } else {
                    isIncomplete = true;
                }
            });

            const percentage = (totalMarks / 100) * 100; // Assuming each assessment is out of 100
            let courseStatus = "";

            if (isIncomplete) {
                courseStatus = "Incomplete";
            } else if (percentage >= 65) {
                courseStatus = "Passed";
            } else {
                courseStatus = "Failed";
            }

            const enrolledCourseRef = doc(db, "Students", studentId, "EnrolledCourses", courseCode);
            await updateDoc(enrolledCourseRef, { courseStatus });

            console.log(`Course status for ${studentId} in ${courseCode} updated successfully`);
        });
    } catch (error) {
        console.log(`Error updating course status: ${error}`);
    }
}

// get all students who passed in a semester
export async function getStudentsPassedAllCoursesInSemester(academicYear: string, semesterID: string) {
    const studentsRef = collection(db, "Students");
    const studentsSnapshot = await getDocs(studentsRef);
    let studentsPassedAllCourses = [];

    for (let studentDoc of studentsSnapshot.docs) {
        const studentID = studentDoc.id;
        const enrolledCoursesRef = collection(db, "Students", studentID, "EnrolledCourses");

        // Query for all courses the student is enrolled in for the semester
        const allCoursesQuery = query(enrolledCoursesRef, where("academicYear", "==", academicYear), where("semesterID", "==", semesterID));
        const allCoursesSnapshot = await getDocs(allCoursesQuery);

        // Query for all courses the student passed for the semester
        const passedCoursesQuery = query(enrolledCoursesRef, where("academicYear", "==", academicYear), where("semesterID", "==", semesterID), where("courseStatus", "==", "Passed"));
        const passedCoursesSnapshot = await getDocs(passedCoursesQuery);

        // If the number of all courses matches the number of passed courses, add the student to the list
        // console.log(allCoursesSnapshot.size);
        // console.log(passedCoursesSnapshot.size);
        if (allCoursesSnapshot.size == 0 || passedCoursesSnapshot.size == 0) {
            continue;
        }
        if (allCoursesSnapshot.size === passedCoursesSnapshot.size) {
            let student = await getStudentNameById(studentID);
            studentsPassedAllCourses.push({ "student": student });
        }
    }

    return studentsPassedAllCourses;
}


// get all students who passed in a year
export async function getStudentsPassedAllCoursesInYear(academicYear: string) {
    try {
        const studentsRef = collection(db, "Students");
        const studentsSnapshot = await getDocs(studentsRef);
        let studentsPassedAllCourses = [];

        for (let studentDoc of studentsSnapshot.docs) {
            const studentID = studentDoc.id;
            const enrolledCoursesRef = collection(db, "Students", studentID, "EnrolledCourses");
            // Query for all courses the student is enrolled in for the academic year
            const allCoursesQuery = query(enrolledCoursesRef, where("academicYear", "==", academicYear));
            const allCoursesSnapshot = await getDocs(allCoursesQuery);

            // Query for all courses the student passed for the academic year
            const passedCoursesQuery = query(enrolledCoursesRef, where("academicYear", "==", academicYear), where("courseStatus", "==", "Passed"));
            const passedCoursesSnapshot = await getDocs(passedCoursesQuery);

            if (allCoursesSnapshot.size == 0 || passedCoursesSnapshot.size == 0) {
                continue;
            }

            // If the number of all courses matches the number of passed courses, add the student to the list
            if (allCoursesSnapshot.size === passedCoursesSnapshot.size) {
                let student = await getStudentNameById(studentID);
                studentsPassedAllCourses.push({ "student": student });
            }
        }

        return studentsPassedAllCourses;
    }
    catch (error) {
        console.log(`Error getting students who passed in a year: ${error}`);
        return [];
    }
}

// get students who have failed one or more courses in a semester and the courses that they failed (List of Fails).

export async function getStudentsFailedCoursesInSemester(academicYear: string, semesterID: string) {
    const studentsRef = collection(db, "Students");
    const studentsSnapshot = await getDocs(studentsRef);
    let studentsFailedCourses = [];

    for (let studentDoc of studentsSnapshot.docs) {
        const studentID = studentDoc.id;
        const enrolledCoursesRef = collection(db, "Students", studentID, "EnrolledCourses");
        const q = query(enrolledCoursesRef, where("academicYear", "==", academicYear), where("semesterID", "==", semesterID));
        const enrolledCoursesSnapshot = await getDocs(q);

        let failedCourses = [];
        for (let courseDoc of enrolledCoursesSnapshot.docs) {
            const courseData = courseDoc.data();
            if (courseData.courseStatus === "Failed") {
                failedCourses.push(courseData.courseCode);
            }
        }

        if (failedCourses.length > 0) {
            let student = await getStudentNameById(studentID);
            studentsFailedCourses.push({ student, failedCourses });
        }
    }

    return studentsFailedCourses;
}

// get Students who have failed one or more courses in a year and the courses that they failed (List of Supplementary Examinations)
export async function getStudentsFailedCoursesInYear(academicYear: string) {
    const studentsRef = collection(db, "Students");
    const studentsSnapshot = await getDocs(studentsRef);
    let studentsFailedCourses = [];

    for (let studentDoc of studentsSnapshot.docs) {
        const studentID = studentDoc.id;
        const enrolledCoursesRef = collection(db, "Students", studentID, "EnrolledCourses");
        const q = query(enrolledCoursesRef, where("academicYear", "==", academicYear));
        const enrolledCoursesSnapshot = await getDocs(q);

        let failedCourses = [];
        for (let courseDoc of enrolledCoursesSnapshot.docs) {
            const courseData = courseDoc.data();
            if (courseData.courseStatus === "Failed") {
                failedCourses.push(courseData.courseCode);
            }
        }

        if (failedCourses.length > 0) {
            // console.log(studentID);
            const student = await getStudentNameById(studentID);
            // console.log(student);
            studentsFailedCourses.push({ student, failedCourses });
        }
    }

    return studentsFailedCourses;
}

// get Students who do not have marks (both CATs and Exam Marks) in at least one course.


export async function getStudentsMissingMarks() {
    const studentsRef = collection(db, "Students");
    const studentsSnapshot = await getDocs(studentsRef);
    let studentsMissingMarks = [];

    for (let studentDoc of studentsSnapshot.docs) {
        const studentID = studentDoc.id;
        const enrolledCoursesRef = collection(db, "Students", studentID, "EnrolledCourses");
        const enrolledCoursesSnapshot = await getDocs(enrolledCoursesRef);

        let missingMarksCourses: any[] = [];
        for (let courseDoc of enrolledCoursesSnapshot.docs) {
            const courseData = courseDoc.data();
            const courseCode = courseData.courseCode;

            const marksRef = collection(db, "Marks");
            const marksQuery = query(marksRef, where("studentID", "==", studentID), where("courseCode", "==", courseCode));
            const marksSnapshot = await getDocs(marksQuery);

            const markFields = ["ASN1", "ASN2", "CAT1", "CAT2", "Exam"];
            let missingMarks = [...markFields]; // Start with all marks as missing

            marksSnapshot.forEach((markDoc) => {
                const markData = markDoc.data();
                const assessmentID = markData.assessmentID;
                // If the assessmentID is found, remove it from the missingMarks array
                if (missingMarks.includes(assessmentID)) {
                    missingMarks = missingMarks.filter(mark => mark !== assessmentID);
                }
            });

            // If any marks are still missing, add them to the missingMarksCourses array
            if (missingMarks.length > 0) {
                missingMarksCourses.push({ [courseCode]: missingMarks });
            }
        }

        if (missingMarksCourses.length > 0) {
            // console.log(studentID);
            try {

                studentsMissingMarks.push({ studentID, courses: missingMarksCourses });
            } catch (error) {
                console.error(`Failed to get student name for ID ${studentID}: ${error}`);
            }
        }
    }

    return studentsMissingMarks;
}


// get missing marks
export async function getStudentsMissingAllMarks() {
    const studentsRef = collection(db, "Students");
    const studentsSnapshot = await getDocs(studentsRef);
    let studentsMissingAllMarks = [];

    for (let studentDoc of studentsSnapshot.docs) {
        const studentID = studentDoc.id;
        const enrolledCoursesRef = collection(db, "Students", studentID, "EnrolledCourses");
        const enrolledCoursesSnapshot = await getDocs(enrolledCoursesRef);

        for (let courseDoc of enrolledCoursesSnapshot.docs) {
            const courseData = courseDoc.data();
            const courseCode = courseData.courseCode;

            const marksRef = collection(db, "Marks");
            const marksQuery = query(marksRef, where("studentID", "==", studentID), where("courseCode", "==", courseCode));
            const marksSnapshot = await getDocs(marksQuery);

            if (marksSnapshot.empty) {
                const student = await getStudentNameById(studentID);
                studentsMissingAllMarks.push({ student, courseCode });
                break;
            }
        }
    }

    return studentsMissingAllMarks;
}

//get Students who are attempting a course for the second time (having failed in the first attempt)
export async function getStudentsRetakingCourse() {
    const studentsRef = collection(db, "Students");
    const studentsSnapshot = await getDocs(studentsRef);
    let studentsRetakingCourse = [];

    for (let studentDoc of studentsSnapshot.docs) {
        const studentID = studentDoc.id;
        const enrolledCoursesRef = collection(db, "Students", studentID, "EnrolledCourses");
        const enrolledCoursesSnapshot = await getDocs(enrolledCoursesRef);

        let retakingCourses = [];
        for (let courseDoc of enrolledCoursesSnapshot.docs) {
            const courseData = courseDoc.data();
            if (courseData.courseStatus === "Failed") {
                const currentEnrollmentQuery = query(enrolledCoursesRef, where("courseCode", "==", courseData.courseCode), where("courseStatus", "==", "Ongoing"));
                const currentEnrollmentSnapshot = await getDocs(currentEnrollmentQuery);
                if (!currentEnrollmentSnapshot.empty) {
                    retakingCourses.push(courseData.courseCode);
                }
            }
        }

        if (retakingCourses.length > 0) {
            const student = await getStudentNameById(studentID);
            studentsRetakingCourse.push({ student, retakingCourses });
        }
    }

    return studentsRetakingCourse;
}

export async function getNameByUID(uid: string) {
    const collections = ["Lecturers", "Students", "Admins"];
    let name = null;

    for (let collectionName of collections) {
        const userRef = doc(db, collectionName, uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            name = [{ firstName: userData.firstName, lastName: userData.lastName }];
            break;
        }
    }

    return name;
}

export async function getStudentsWithSpecialCases() {
    const studentsRef = collection(db, "Students");
    const studentsSnapshot = await getDocs(studentsRef);
    let studentsWithSpecialCases = [];

    for (let studentDoc of studentsSnapshot.docs) {
        const studentData = studentDoc.data() as Student;
        if (studentData.specialCases && studentData.specialCases.length > 0) {
            studentsWithSpecialCases.push({
                // studId: studentData.studId,
                studentName: studentData.firstName + " " + studentData.lastName,
                // email: studentData.email,
                specialCases: studentData.specialCases
            });
        }
    }

    return studentsWithSpecialCases;
}
export async function saveSpecialCase(studentId: string, courseCode: string, remark: string) {
    try {
        // Get a reference to the student document
        const studentRef = doc(db, "Students", studentId);

        // Create a special case object
        const specialCase = { courseCode, remark };

        // Update the specialCases field of the student document
        await updateDoc(studentRef, {
            specialCases: arrayUnion(specialCase)
        });

        console.log(`Special case for student ${studentId} updated successfully`);
        return true;
    } catch (error) {
        console.log(`Error updating special case: ${error}`);
        return false;
    }
}
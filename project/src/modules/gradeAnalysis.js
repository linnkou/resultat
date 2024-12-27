import { calculateFinalGrade } from './dataProcessor';

export function analyzeGrades(data, gradeComments) {
  const students = data.map(student => ({
    ...student,
    finalGrade: calculateFinalGrade(student),
    gradeComment: getGradeComment(calculateFinalGrade(student), gradeComments)
  }));

  const stats = calculateStats(students);
  const distributions = calculateDistributions(students);

  return {
    students,
    stats,
    distributions
  };
}

function getGradeComment(grade, comments) {
  if (grade < 10) return comments[0];
  if (grade < 12) return comments[1];
  if (grade < 14) return comments[2];
  if (grade < 16) return comments[3];
  if (grade < 18) return comments[4];
  return comments[5];
}

function calculateStats(students) {
  const grades = students.map(s => s.finalGrade);
  return {
    highest: Math.max(...grades),
    lowest: Math.min(...grades),
    average: grades.reduce((a, b) => a + b) / grades.length,
    aboveTen: students.filter(s => s.finalGrade >= 10).length,
    belowTen: students.filter(s => s.finalGrade < 10).length,
    total: students.length
  };
}

function calculateDistributions(students) {
  return students.reduce((acc, student) => {
    const comment = student.gradeComment;
    acc[comment] = (acc[comment] || 0) + 1;
    return acc;
  }, {});
}
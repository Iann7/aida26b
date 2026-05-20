// Table schema: defines the available tables, their fields, labels, and primary keys.
import type { InferType, TableStructure } from './types.js';

export const structure = {
  tables: {
    students: {
      columns: {
        numero_libreta: { type: 'string', label: 'Número de Libreta / Student ID:', required: true, readonlyOnEdit: true },
        dni: { type: 'string', label: 'DNI / ID Number:', required: true },
        first_name: { type: 'string', label: 'Nombre / First Name:', required: true },
        last_name: { type: 'string', label: 'Apellido / Last Name:', required: true },
        email: { type: 'string', label: 'Email:', input: 'email' },
        enrollment_date: { type: 'string', label: 'Fecha de Inscripción / Enrollment Date:', input: 'date' },
        status: {
          type: 'string',
          label: 'Estado / Status:',
          input: 'select',
          options: [
            { value: 'active', label: 'Activo / Active' },
            { value: 'graduated', label: 'Graduado / Graduated' },
            { value: 'interrupted', label: 'Interrumpido / Interrupted' },
          ],
        },
      },
      pk: 'numero_libreta',
      uiName: 'Student',
      title: 'Alumnos / Students',
      addButtonLabel: 'Agregar Alumno / Add Student',
    } satisfies TableStructure,
    subjects: {
      columns: {
        cod_mat: { type: 'string', label: 'Código / Code:', required: true, readonlyOnEdit: true },
        name: { type: 'string', label: 'Nombre / Name:', required: true },
        description: { type: 'string', label: 'Descripción / Description:', input: 'textarea' },
        credits: { type: 'number', label: 'Créditos / Credits:', input: 'number', nullable: false },
        department: { type: 'string', label: 'Departamento / Department:' },
      },
      pk: 'cod_mat',
      uiName: 'Subject',
      title: 'Materias / Subjects',
      addButtonLabel: 'Agregar Materia / Add Subject',
    } satisfies TableStructure,
    enrollments: {
      pk: ['numero_libreta', 'cod_mat'],
      uiName: 'Enrollment',
      columns: {
        numero_libreta: { type: 'string', label: 'Número de Libreta / Student ID:', required: true, readonlyOnEdit: true },
        student_name: { type: 'string', label: 'Nombre del Alumno / Student Name:', editable: false },
        cod_mat: { type: 'string', label: 'Código de Materia / Subject Code:', required: true, readonlyOnEdit: true },
        subject_name: { type: 'string', label: 'Nombre de Materia / Subject Name:', editable: false },
        enrollment_date: { type: 'string', label: 'Fecha de Inscripción / Enrollment Date:', input: 'date', required: true },
        grade: { type: 'number', label: 'Nota / Grade:', input: 'number', nullable: true },
        status: {
          type: 'string',
          label: 'Estado / Status:',
          input: 'select',
          options: [
            { value: 'enrolled', label: 'Inscrito / Enrolled' },
            { value: 'completed', label: 'Completado / Completed' },
            { value: 'failed', label: 'Fallido / Failed' },
          ],
        },
      },
      title: 'Inscripciones / Enrollments',
      addButtonLabel: 'Agregar Inscripción / Add Enrollment',
    } satisfies TableStructure,
  },
};

export type TableKey = keyof typeof structure.tables;

export type TableRecordMap = {
  [T in keyof typeof structure.tables]: InferType<(typeof structure.tables)[T]['columns']>;
};

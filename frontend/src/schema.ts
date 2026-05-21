// Table schema: defines the available tables, their fields, labels, and primary keys.
import type { InferType, TableStructure } from './types.js';

export const structure = {
  tables: {
    students: {
      columns: {
        numero_libreta: { type: 'string', label: { es: 'Número de Libreta', en: 'Student ID' }, required: true, readonlyOnEdit: true },
        dni: { type: 'string', label: { es: 'DNI', en: 'ID Number' }, required: true },
        first_name: { type: 'string', label: { es: 'Nombre', en: 'First Name' }, required: true },
        last_name: { type: 'string', label: { es: 'Apellido', en: 'Last Name' }, required: true },
        email: { type: 'string', label: { es: 'Email', en: 'Email' }, input: 'email' },
        enrollment_date: { type: 'string', label: { es: 'Fecha de Inscripción', en: 'Enrollment Date' }, input: 'date' },
        status: {
          type: 'string',
          label: { es: 'Estado', en: 'Status' },
          input: 'select',
          options: [
            { value: 'active', label: { es: 'Activo', en: 'Active' } },
            { value: 'graduated', label: { es: 'Graduado', en: 'Graduated' } },
            { value: 'interrupted', label: { es: 'Interrumpido', en: 'Interrupted' } },
          ],
        },
      },
      pk: 'numero_libreta',
      uiName: { es: 'Alumno', en: 'Student' },
      title: { es: 'Alumnos', en: 'Students' },
      addButtonLabel: { es: 'Agregar Alumno', en: 'Add Student' },
    } satisfies TableStructure,
    subjects: {
      columns: {
        cod_mat: { type: 'string', label: { es: 'Código', en: 'Code' }, required: true, readonlyOnEdit: true },
        name: { type: 'string', label: { es: 'Nombre', en: 'Name' }, required: true },
        description: { type: 'string', label: { es: 'Descripción', en: 'Description' }, input: 'textarea' },
        credits: { type: 'number', label: { es: 'Créditos', en: 'Credits' }, input: 'number', nullable: false },
        department: { type: 'string', label: { es: 'Departamento', en: 'Department' } },
      },
      pk: 'cod_mat',
      uiName: { es: 'Materia', en: 'Subject' },
      title: { es: 'Materias', en: 'Subjects' },
      addButtonLabel: { es: 'Agregar Materia', en: 'Add Subject' },
    } satisfies TableStructure,
    enrollments: {
      pk: ['numero_libreta', 'cod_mat'],
      uiName: { es: 'Inscripción', en: 'Enrollment' },
      columns: {
        numero_libreta: { type: 'string', label: { es: 'Número de Libreta', en: 'Student ID' }, required: true, readonlyOnEdit: true },
        student_name: { type: 'string', label: { es: 'Nombre del Alumno', en: 'Student Name' }, editable: false },
        cod_mat: { type: 'string', label: { es: 'Código de Materia', en: 'Subject Code' }, required: true, readonlyOnEdit: true },
        subject_name: { type: 'string', label: { es: 'Nombre de Materia', en: 'Subject Name' }, editable: false },
        enrollment_date: { type: 'string', label: { es: 'Fecha de Inscripción', en: 'Enrollment Date' }, input: 'date', required: true },
        grade: { type: 'number', label: { es: 'Nota', en: 'Grade' }, input: 'number', nullable: true },
        status: {
          type: 'string',
          label: { es: 'Estado', en: 'Status' },
          input: 'select',
          options: [
            { value: 'enrolled', label: { es: 'Inscrito', en: 'Enrolled' } },
            { value: 'completed', label: { es: 'Completado', en: 'Completed' } },
            { value: 'failed', label: { es: 'Fallido', en: 'Failed' } },
          ],
        },
      },
      title: { es: 'Inscripciones', en: 'Enrollments' },
      addButtonLabel: { es: 'Agregar Inscripción', en: 'Add Enrollment' },
    } satisfies TableStructure,
  },
};

export type TableKey = keyof typeof structure.tables;

export type TableRecordMap = {
  [T in keyof typeof structure.tables]: InferType<(typeof structure.tables)[T]['columns']>;
};

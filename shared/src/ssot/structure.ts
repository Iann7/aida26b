import { TableStructure } from '../types/types';

type LocalizedText = {
  es: string;
  en: string;
};

function getCurrentLanguage(): keyof LocalizedText {
  return globalThis.localStorage?.getItem('language') === 'en' ? 'en' : 'es';
}

function localizeText(text: LocalizedText): string {
  return text[getCurrentLanguage()] ?? text.es;
}

export const structure = {
  tables: {
    students: {
      columns: {
        numero_libreta: {
          type: 'string',
          label: { es: 'Número de Libreta', en: 'Student ID' },
          readonlyOnEdit: true,
          validator: {
            required: true,
            pattern: '^\\d{1,4}/\\d{2}$',
            patternMessage:
              'must match pattern NNNN/YY (1-4 digit number, slash, 2-digit year; leading zeros optional on the number)',
            normalize: {
              pattern: '^0+(?=\\d)',
              replacement: '',
            },
          },
        },

        dni: {
          type: 'string',
          label: { es: 'DNI', en: 'ID Number' },
          validator: {
            required: true,
            pattern: '^\\d{7,8}$',
            patternMessage: 'must be 7 or 8 digits',
          },
        },

        first_name: {
          type: 'string',
          label: { es: 'Nombre', en: 'First Name' },
          validator: {
            required: true,
            pattern: '^\\D+$',
            patternMessage: 'must not contain numbers',
          },
        },

        last_name: {
          type: 'string',
          label: { es: 'Apellido', en: 'Last Name' },
          validator: {
            required: true,
            pattern: '^\\D+$',
            patternMessage: 'must not contain numbers',
          },
        },

        email: {
          type: 'string',
          label: { es: 'Email', en: 'Email' },
          input: 'email',
          validator: {
            nullable: true,
            pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
            patternMessage: 'must be a valid email address',
          },
        },

        enrollment_date: {
          type: 'string',
          label: { es: 'Fecha de Inscripción', en: 'Enrollment Date' },
          input: 'date',
          validator: {
            nullable: true,
            minDate: '1821-08-09',
            maxDayOffset: 0,
          },
        },

        status: {
          type: 'string',
          label: { es: 'Estado', en: 'Status' },
          input: 'select',
          validator: {
            nullable: true,
          },
          options: [
            { value: 'active', label: { es: 'Activo', en: 'Active' } },
            { value: 'graduated', label: { es: 'Graduado', en: 'Graduated' } },
            {
              value: 'interrupted',
              label: { es: 'Interrumpido', en: 'Interrupted' },
            },
          ],
        },
      },
      pk: 'numero_libreta',
      uiName: { es: 'Alumno', en: 'Student' },
      title: { es: 'Alumnos', en: 'Students' },
      addButtonLabel: { es: 'Agregar Alumno', en: 'Add Student' },
    } satisfies TableStructure,

    vessels: {
      columns: {
        id: {
          type: 'string',
          label: { es: 'ID', en: 'ID' },
          readonlyOnEdit: true,
          validator: { required: true },
        },

        mmsi: {
          type: 'number',
          label: { es: 'MMSI', en: 'MMSI' },
          validator: { nullable: true },
        },

        name: {
          type: 'string',
          label: { es: 'Nombre', en: 'Name' },
          validator: { nullable: true },
        },

        vessel_type: {
          type: 'string',
          label: { es: 'Tipo de Barco', en: 'Vessel Type' },
          validator: { nullable: true },
        },

        call_sign: {
          type: 'string',
          label: { es: 'Call Sign', en: 'Call Sign' },
          validator: { nullable: true },
        },

        imo: {
          type: 'number',
          label: { es: 'IMO', en: 'IMO' },
          validator: { nullable: true },
        },

        flag_country: {
          type: 'string',
          label: { es: 'Bandera', en: 'Flag Country' },
          validator: { nullable: true },
        },

        length_m: {
          type: 'number',
          input: 'number',
          label: { es: 'Eslora (m)', en: 'Length (m)' },
          validator: { nullable: true },
        },

        width_m: {
          type: 'number',
          input: 'number',
          label: { es: 'Manga (m)', en: 'Width (m)' },
          validator: { nullable: true },
        },

        created_at: {
          type: 'string',
          input: 'date',
          label: { es: 'Creado', en: 'Created At' },
          validator: { nullable: true },
        },
      },
      pk: 'id',
      uiName: { es: 'Barco', en: 'Vessel' },
      title: { es: 'Barcos', en: 'Vessels' },
      addButtonLabel: { es: 'Agregar Barco', en: 'Add Vessel' },
    } satisfies TableStructure,

    regions: {
      columns: {
        id: {
          type: 'string',
          label: { es: 'ID', en: 'ID' },
          readonlyOnEdit: true,
          validator: { required: true },
        },
        name: {
          type: 'string',
          label: { es: 'Nombre', en: 'Name' },
          validator: { required: true },
        },
        description: {
          type: 'string',
          input: 'textarea',
          label: { es: 'Descripción', en: 'Description' },
          validator: { nullable: true },
        },
        min_lat: {
          type: 'number',
          input: 'number',
          label: { es: 'Lat Mín', en: 'Min Lat' },
          validator: { required: true },
        },
        max_lat: {
          type: 'number',
          input: 'number',
          label: { es: 'Lat Máx', en: 'Max Lat' },
          validator: { required: true },
        },
        min_lon: {
          type: 'number',
          input: 'number',
          label: { es: 'Lon Mín', en: 'Min Lon' },
          validator: { required: true },
        },
        max_lon: {
          type: 'number',
          input: 'number',
          label: { es: 'Lon Máx', en: 'Max Lon' },
          validator: { required: true },
        },
        created_at: {
          type: 'string',
          input: 'date',
          label: { es: 'Creado', en: 'Created At' },
          validator: { nullable: true },
        },
      },
      pk: 'id',
      uiName: { es: 'Región', en: 'Region' },
      title: { es: 'Regiones', en: 'Regions' },
      addButtonLabel: { es: 'Agregar Región', en: 'Add Region' },
    } satisfies TableStructure,

    packets: {
      columns: {
        id: {
          type: 'string',
          label: { es: 'ID', en: 'ID' },
          readonlyOnEdit: true,
          validator: { required: true },
        },
        vessel_id: {
          type: 'string',
          label: { es: 'Barco', en: 'Vessel' },
          input: 'select',
          validator: { nullable: true },
          foreignKey: {
            table: 'vessels',
            valueField: 'id',
            labelField: 'name',
          },
        },
        packet_type: {
          type: 'string',
          label: { es: 'Tipo de Paquete', en: 'Packet Type' },
          validator: { nullable: true },
        },
        sequence_number: {
          type: 'number',
          input: 'number',
          label: { es: 'Seq', en: 'Sequence' },
          validator: { nullable: true },
        },
        received_at: {
          type: 'string',
          input: 'date',
          label: { es: 'Recibido', en: 'Received At' },
          validator: { nullable: true },
        },
        source: {
          type: 'string',
          label: { es: 'Fuente', en: 'Source' },
          validator: { nullable: true },
        },
        // position fields removed: positions are stored in `positions` table
        payload: {
          type: 'string',
          input: 'textarea',
          label: { es: 'Payload (JSON)', en: 'Payload (JSON)' },
          validator: { nullable: true },
        },
        created_at: {
          type: 'string',
          input: 'date',
          label: { es: 'Creado', en: 'Created At' },
          validator: { nullable: true },
        },
      },
      pk: 'id',
      uiName: { es: 'Paquete', en: 'Packet' },
      title: { es: 'Paquetes', en: 'Packets' },
      addButtonLabel: { es: 'Agregar Paquete', en: 'Add Packet' },
      referencedTables: ['vessels'],
    } satisfies TableStructure
  },

  menu: {
    theme: {
      title: { es: 'Tema', en: 'Theme' },
      id: 'theme-picker',
      input_type: 'select',
      options: [
        { value: 'light', label: { es: 'Claro', en: 'Light' } },
        { value: 'dark', label: { es: 'Oscuro', en: 'Dark' } },
      ],
      initial: () => localStorage.getItem('theme') || 'light',
    },

    language: {
      title: { es: 'Idioma', en: 'Language' },
      id: 'language-picker',
      input_type: 'select',
      options: [
        { value: 'es', label: { es: 'Español', en: 'Spanish' } },
        { value: 'en', label: { es: 'Inglés', en: 'English' } },
      ],
      initial: () => localStorage.getItem('language') || 'es',
    },
    map: {
      title: { es: 'Mapa', en: 'Map' },
      id: 'map-button',
      input_type: 'button',
      options: [],
      initial: () => null,
    }
  },

  commonText: {
    actions: { es: 'Acciones', en: 'Actions' },
    add: { es: 'Agregar', en: 'Add' },
    appTitle: {
      es: 'Sistema de Gestión de Barcos',
      en: 'Vessel Management System',
    },
    cancel: { es: 'Cancelar', en: 'Cancel' },
    delete: { es: 'Eliminar', en: 'Delete' },
    edit: { es: 'Editar', en: 'Edit' },
    update: { es: 'Actualizar', en: 'Update' },
    login: { es: 'Ingresar', en: 'Login' },
    password: { es: 'Contraseña', en: 'Password' },
    changePassword: { es: 'Cambiar contraseña', en: 'Change Password' },
    currentPassword: { es: 'Contraseña actual', en: 'Current Password' },
    newPassword: { es: 'Nueva contraseña', en: 'New Password' },
    logout: { es: 'Salir', en: 'Logout' },
    addProfessor: { es: 'Agregar Profesor', en: 'Add Professor' },
    addAdmin: { es: 'Agregar Admin', en: 'Add Admin' },
    added: { es: 'agregado', en: 'added' },

    // Auth / session messages
    sessionExpired: { es: 'La sesión expiró', en: 'Session expired' },
    passwordChangeRequired: { es: 'Hay que cambiar la contraseña', en: 'Password change required' },
    noPermission: { es: 'No tenés permiso para esa acción', en: 'You do not have permission for that action' },
    invalidCredentials: { es: 'Credenciales inválidas', en: 'Invalid credentials' },
    loginError: { es: 'Error ingresando', en: 'Login error' },
    passwordChangeFailed: { es: 'No se pudo cambiar la contraseña', en: 'Password change failed' },
    passwordChangeError: { es: 'Error cambiando contraseña', en: 'Password change error' },
    themeChangeError: { es: 'Error al cambiar el tema', en: 'Error changing theme' },
    languageChangeError: { es: 'Error al cambiar el idioma', en: 'Error changing language' },

    // Data / record messages
    errorLoadingData: { es: 'Error cargando datos', en: 'Error loading data' },
    errorSaving: { es: 'Error guardando', en: 'Error saving' },
    errorDeleting: { es: 'Error eliminando', en: 'Error deleting' },
    errorLoadingRecord: { es: 'Error cargando registro', en: 'Error loading record' },

    // User management
    onlyAdminCanCreateUsers: { es: 'Solo admin puede crear usuarios', en: 'Only admin can create users' },
    errorCreatingUser: { es: 'Error creando usuario', en: 'Error creating user' },
    noEditPermission: { es: 'No tenés permiso para editar', en: 'You do not have edit permission' },
    studentAndUserCreated: { es: 'Alumno y usuario creados', en: 'Student and user created' },
    userAdded: { es: 'Usuario agregado', en: 'User added' },

    // Form labels
    initialPassword: { es: 'Contraseña inicial', en: 'Initial Password' },
    usernameLabel: { es: 'Usuario', en: 'Username' },
    emailLabel: { es: 'Email', en: 'Email' },
    professorRole: { es: 'Profesor', en: 'Professor' },
    adminRole: { es: 'Admin', en: 'Admin' },
    addUser: { es: 'Agregar usuario', en: 'Add user' },

    // Filters / pagination
    addFilter: { es: 'Agregar Filtro', en: 'Add Filter' },
    selectColumn: { es: 'Seleccionar columna', en: 'Select column' },
    pageInfo: { es: 'Página', en: 'Page' },
    pageOf: { es: 'de', en: 'of' },
    total: { es: 'Total', en: 'Total' },
    previous: { es: 'Anterior', en: 'Previous' },
    next: { es: 'Siguiente', en: 'Next' },
    filterPlaceholder: { es: 'Filtrar...', en: 'Filter...' },

    // Delete confirmation
    deleteConfirm: {
      es: '¿Está seguro de que desea eliminar este',
      en: 'Are you sure you want to delete this',
    },
  } satisfies Record<string, LocalizedText>,
};

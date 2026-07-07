import { TableStructure, menuStructure } from '../types/types';

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
    interesting_vessels: {
      columns: {
        id: {
          type: 'string',
          editable: false,
          label: { es: 'ID', en: 'ID' },
          visible: false,
        },
        vessel_mmsi: {
          type: 'string',
          label: { es: 'MMSI', en: 'MMSI' },
          readonlyOnEdit: true,
          validator: { required: true },
          visible: true,
          input: 'text'
        },
        color: {
          type: 'string',
          label: { es: 'Color', en: 'Color' },
          input: 'color',
          validator: { required: true },
          visible: true,
        },
        priority: {
          type: 'number',
          input: 'number',
          label: { es: 'Prioridad', en: 'Priority' },
          validator: { nullable: true },
          visible: true,
        },
        notes: {
          type: 'string',
          input: 'textarea',
          label: { es: 'Observaciones', en: 'Observations' },
          validator: { nullable: true },
          visible: true,
        },
        added_at: {
          type: 'date',
          input: 'date',
          editable: false,
          label: { es: 'Agregado', en: 'Added At' },
          validator: { nullable: true },
          visible: true,
        },
      },
      pk: 'vessel_mmsi',
      uiName: { es: 'Barco de Interés', en: 'Tracked Vessel' },
      title: { es: 'Barcos de Interés', en: 'Tracked Vessels' },
      addButtonLabel: {
        es: 'Agregar Barco de Interés',
        en: 'Add Tracked Vessel',
      },
      rowBehaviour: true
    } satisfies TableStructure,
    crew_members: {
      columns: {
        id: {
          type: 'string',
          editable: false,
          label: { es: 'ID', en: 'ID' },
          visible: false,
        },
        vessel_mmsi: {
          type: 'string',
          label: { es: 'MMSI', en: 'Vessel MMSI' },
          validator: { required: true },
          visible: true,
          input: 'text'
        },

        first_name: {
          type: 'string',
          label: { es: 'Nombre', en: 'First Name' },
          validator: { required: true },
          visible: true,
          input: 'text'
        },

        last_name: {
          type: 'string',
          label: { es: 'Apellido', en: 'Last Name' },
          validator: { required: true },
          input: 'text',
          visible: true,
        },

        rank: {
          type: 'string',
          label: { es: 'Cargo', en: 'Rank' },
          validator: { nullable: true },
          visible: true,
          input: 'select',
          options: [
            {
              value: "captain",
              label: { es: "Capitán", en: "Captain" },
            },
            {
              value: "chief_officer",
              label: { es: "Primer Oficial", en: "Chief Officer" },
            },
            {
              value: "second_officer",
              label: { es: "Segundo Oficial", en: "Second Officer" },
            },
            {
              value: "passanger",
              label: { es: "Pasajero", en: "Passanger" },
            },
            {
              value: "other",
              label: { es: "Otro", en: "Other" },
            },
            
          ]
        },

        nationality: {
          type: 'string',
          label: { es: 'Nacionalidad', en: 'Nationality' },
          validator: { nullable: true },
          visible: true,
          input: 'text'
        },

        status: {
          type: "string",
          label: { es: "Estado", en: "Status" },
          validator: { nullable: true },
          visible: true,
          input: 'select',
          options: [
            {value: 'On Board', label:{es:'Embarcado', en:'On Board'} },
            {value: 'Off Board', label: {es:'Desembarcado', en:'Off Board'}}
          ]
        },

        embarked_at: {
          type: 'date',
          input: 'date',
          label: { es: 'Embarcado', en: 'Embarked At' },
          validator: { nullable: true },
          visible: true,  
        },

        disembarked_at: {
          type: 'date',
          input: 'date',
          label: { es: 'Desembarcado', en: 'Disembarked At' },
          validator: { nullable: true },
          visible: true,
        },
      },

      pk: 'id',

      uiName: { es: 'Tripulante', en: 'Crew Member' },
      title: { es: 'Tripulación', en: 'Crew Members' },
      addButtonLabel: {
        es: 'Agregar Tripulante',
        en: 'Add Crew Member',
      },

      rowBehaviour: true,
      belongsTo: {
        table: "interesting_vessels",
        foreignKey: "vessel_mmsi",
      }
    } satisfies TableStructure,
    packets: {
      columns: {
         id: {
          type: 'string',
          editable: false,
          label: { es: 'ID', en: 'ID' },
          visible: false,
        },

        vessel_mmsi: {
          type: 'string',
          label: { es: 'MMSI', en: 'Vessel MMSI' },
          validator: { nullable: true },
          visible: true,
        },

        packet_code: {
          type: "string",
          label: { es: "Código", en: "Packet Code" },
          validator: { required: true },
          visible: true,
          input:'text'
        },

        packet_type: {
          type: 'string',
          label: { es: 'Tipo', en: 'Packet Type' },
          validator: { required: true },
          visible: true,
          input:'text'
        },

        source: {
          type: 'string',
          label: { es: 'Origen', en: 'Source' },
          validator: { nullable: true },
          visible: true,  
          input: 'text'
        },

        company: {
          type: "string",
          label: { es: "Empresa", en: "Company" },
          validator: { nullable: true },
          visible: true,
        },

        weight_kg: {
          type: "number",
          input: "number",
          label: { es: "Peso (kg)", en: "Weight (kg)" },
          validator: { nullable: true },
          visible: true,
        },
        received_at: {
          type: 'date',
          input: 'date',
          editable: false,
          label: { es: 'Recibido', en: 'Received At' },
          validator: { nullable: true },
          visible: true,
        },
      },

      pk: 'id',

      uiName: { es: 'Paquete AIS', en: 'AIS Packet' },
      title: { es: 'Paquetes AIS', en: 'AIS Packets' },
      addButtonLabel: {
        es: 'Agregar Paquete',
        en: 'Add Packet',
      },
      belongsTo: {
        table: "interesting_vessels",
        foreignKey: "vessel_mmsi",
      },
      rowBehaviour: true
    } satisfies TableStructure,
    regions: {
      columns: {
         id: {
          type: 'string',
          editable: false,
          label: { es: 'ID', en: 'ID' },
          visible: false,
        },
        name: {
          type: 'string',
          label: { es: 'Nombre', en: 'Name' },
          validator: { required: true },
          visible: true,
          input: 'text'
        },
        description: {
          type: 'string',
          input: 'textarea',
          label: { es: 'Descripción', en: 'Description' },
          validator: { nullable: true },
          visible: true,
        },
        min_lat: {
          type: 'number',
          input: 'number',
          label: { es: 'Lat Mín', en: 'Min Lat' },
          validator: { required: true },
          visible: true,
        },
        max_lat: {
          type: 'number',
          input: 'number',
          label: { es: 'Lat Máx', en: 'Max Lat' },
          validator: { required: true },
          visible: true,
        },
        min_lon: {
          type: 'number',
          input: 'number',
          label: { es: 'Lon Mín', en: 'Min Lon' },
          validator: { required: true },
          visible: true,
        },
        max_lon: {
          type: 'number',
          input: 'number',
          label: { es: 'Lon Máx', en: 'Max Lon' },
          validator: { required: true },
          visible: true,
        },
        created_at: {
          type: 'date',
          input: 'date',
          label: { es: 'Creado', en: 'Created At' },
          validator: { nullable: true },
          visible: true,
        },
      },
      pk: 'id',
      uiName: { es: 'Región', en: 'Region' },
      title: { es: 'Regiones', en: 'Regions' },
      addButtonLabel: { es: 'Agregar Región', en: 'Add Region' },
      rowBehaviour: true,
    } satisfies TableStructure,
    notes: {
        columns: {
         id: {
          type: 'string',
          editable: false,
          label: { es: 'ID', en: 'ID' },
          visible: false,
        },
        vessel_mmsi: {
          type: 'string',
          label: { es: 'MMSI', en: 'Vessel MMSI' },
          validator: { required: true },
          visible: true,
          input: 'text'
        },
        title: {
          type: "string",
          label: { es: "Título", en: "Title" },
          validator: { required: true },
          visible: true,
          input: 'text'
        },
        category: {
          type: "string",
          label: { es: "Categoría", en: "Category" },
          validator: { nullable: true },
          visible: true,
          input: 'select',
          options: [
            {
              value: "maintenance",
              label: { es: "Mantenimiento", en: "Maintenance" },
            },
            {
              value: "inspection",
              label: { es: "Inspección", en: "Inspection" },
            },
            {
              value: "security",
              label: { es: "Seguridad", en: "Security" },
            },
            {
              value: "navigation",
              label: { es: "Navegación", en: "Navigation" },
            },
            {
              value: "weather",
              label: { es: "Clima", en: "Weather" },
            },
          ]
        },
        content: {
          type: 'string',
          input: 'textarea',
          label: { es: 'Contenido', en: 'Content' },
          validator: { nullable: true },
          visible: true,
        },
        created_at: {
          type: 'string',
          input: 'date',
          label: { es: 'Creado', en: 'Created At' },
          validator: { nullable: true },
          visible: true,
        },
      },
      pk: 'id',
      uiName: { es: 'Nota', en: 'Note' },
      title: { es: 'Notas', en: 'Notes' },
      addButtonLabel: { es: 'Agregar Nota', en: 'Add Note' },
      rowBehaviour: false,
    } satisfies TableStructure,
  },
  menu: {
    map: {
      title: { es: 'Mapa', en: 'Map' },
      id: 'map-button',
      input_type: 'button',
      options: [],
      initial: () => null,
    } satisfies menuStructure,
    theme: {
      title: { es: 'Tema', en: 'Theme' },
      id: 'theme-picker',
      input_type: 'select',
      options: [
        { value: 'light', label: { es: 'Claro', en: 'Light' } },
        { value: 'dark', label: { es: 'Oscuro', en: 'Dark' } },
      ],
      initial: () => localStorage.getItem('theme') || 'light',
    } satisfies menuStructure,

    language: {
      title: { es: 'Idioma', en: 'Language' },
      id: 'language-picker',
      input_type: 'select',
      options: [
        { value: 'es', label: { es: 'Español', en: 'Spanish' } },
        { value: 'en', label: { es: 'Inglés', en: 'English' } },
      ],
      initial: () => localStorage.getItem('language') || 'es',
    } satisfies menuStructure
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
    remove: { es: 'Remover', en: 'Remove' },
    addAllVessels: { es: 'Agregar todos los barcos', en: 'Add all vessels' },
    removeAllVessels: { es: 'Remover todos los barcos', en: 'Remove all vessels' },
    addAllMapVessels: { es: 'Agregar todos al mapa', en: 'Add all to map' },
    addPageMapVessels: { es: 'Agregar barcos de esta página', en: 'Add vessels from this page' },
    removePageMapVessels: { es: 'Remover barcos de esta página', en: 'Remove vessels from this page' },
    removeAllMapVessels: { es: 'Remover todos del mapa', en: 'Remove all from map' },
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

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
    vessels: {
      columns: {
        mmsi: {
          type: 'string',
          label: { es: 'MMSI', en: 'MMSI' },
          readonlyOnEdit: true,
          validator: { required: true },
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

        flag_country: {
          type: 'string',
          label: { es: 'Bandera', en: 'Flag Country' },
          validator: { nullable: true },
        },

        latest_latitude: {
          type: 'number',
          input: 'number',
          label: { es: 'Latitud', en: 'Latitude' },
          editable: false,
          validator: { nullable: true },
          derivable: {
            originTable: 'vessels',
            sqlGenerationStatement:
              '(SELECT p.latitude FROM positions p WHERE p.vessel_mmsi = entityName.mmsi ORDER BY p.recorded_at DESC LIMIT 1)',
          },
        },

        latest_longitude: {
          type: 'number',
          input: 'number',
          label: { es: 'Longitud', en: 'Longitude' },
          editable: false,
          validator: { nullable: true },
          derivable: {
            originTable: 'vessels',
            sqlGenerationStatement:
              '(SELECT p.longitude FROM positions p WHERE p.vessel_mmsi = entityName.mmsi ORDER BY p.recorded_at DESC LIMIT 1)',
          },
        },

        latest_position_at: {
          type: 'string',
          label: { es: 'Última Posición', en: 'Last Position' },
          editable: false,
          validator: { nullable: true },
          derivable: {
            originTable: 'vessels',
            sqlGenerationStatement:
              '(SELECT p.recorded_at FROM positions p WHERE p.vessel_mmsi = entityName.mmsi ORDER BY p.recorded_at DESC LIMIT 1)',
          },
        },

        length_m: {
          type: 'number',
          input: 'number',
          label: { es: 'Largo (m)', en: 'Length (m)' },
          validator: { nullable: true },
        },

        width_m: {
          type: 'number',
          input: 'number',
          label: { es: 'Ancho (m)', en: 'Width (m)' },
          validator: { nullable: true },
        },

        created_at: {
          type: 'string',
          input: 'date',
          label: { es: 'Creado', en: 'Created At' },
          validator: { nullable: true },
        },
      },
      pk: 'mmsi',
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

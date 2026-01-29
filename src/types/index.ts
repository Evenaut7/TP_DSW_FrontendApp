// TIPOS CENTRALIZADOS DE LA APLICACIÓN

export type Provincia = {
    id?: number;
    nombre: string;
    codUta?: string;
    localidades?: Localidad[];
};

export type Localidad = {
    id: number;
    nombre: string;
    codUta: string;
    descripcion: string;
    latitud: number;
    longitud: number;
    imagen: string;
    provincia: {
        id: number;
        nombre: string;
        codUta: string;
    };
    puntosDeInteres?: PDI[];
};

export type PDI = {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    calle: string;
    altura: number;
    latitud?: number;
    longitud?: number;
    privado?: boolean;
    localidad: {
    id: number;
    nombre: string;
    };
    eventos?: Evento[];
    tags?: Tag[];
};


export type Evento = {
    id: number;
    titulo: string;
    descripcion: string;
    horaDesde: string;
    horaHasta: string;
};


export type TipoTag = 'Evento' | 'Punto de Interés' | 'Actividad';

export type Tag = {
    id?: number;
    nombre: string;
    tipo: TipoTag;
};

export type TipoUsuario = "creador" | "usuario" | "admin";

export type User = {
    id?: number;
    nombre?: string;
    gmail?: string;
    cuit?: string;
    tipo?: TipoUsuario;
    localidad?: Localidad | null;
    puntosDeInteres?: number[];
    favoritos?: PDI[];
    agendaPDI?: number[];
} | null;

export type UpdateUserData = {
    nombre?: string;
    gmail?: string;
    cuit?: string;
    localidad?: number;
};

// ==================== RESPUESTAS DE API ====================
export type ApiResponse<T = unknown> = {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
};

// ==================== TIPOS AUXILIARES ====================
export type FormFieldProps = {
    label: string;
    name: string;
    value?: string | number;
    type?: string;
    as?: 'input' | 'textarea';
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    required?: boolean;
    placeholder?: string;
};

export type FormSelectProps = {
    label: string;
    name: string;
    value?: string | number;
    options: Array<{ id: number; nombre: string }>;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    placeholder?: string;
};

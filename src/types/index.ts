export interface ApiError {
  status: number
  message: string
  data?: unknown
}

export type MessageLabel =
  | 'FAN'
  | 'PRUEBA_VIDA'
  | 'FUENTE'
  | 'OPINION'
  | 'ESTUDIANTE'
  | 'VENEZOLANO'
  | 'COLABORACION'
  | 'PRENSA'
  | 'PROYECTO'
  | 'SPAM'
  | 'AMENAZA'
  | 'OTRO'

export const MESSAGE_LABELS: MessageLabel[] = [
  'FAN',
  'PRUEBA_VIDA',
  'FUENTE',
  'OPINION',
  'ESTUDIANTE',
  'VENEZOLANO',
  'COLABORACION',
  'PRENSA',
  'PROYECTO',
  'SPAM',
  'AMENAZA',
  'OTRO',
]

export type MessageType =
  | 'TEXT'
  | 'IMAGE'
  | 'AUDIO'
  | 'VIDEO'
  | 'DOCUMENT'
  | 'LOCATION'
  | 'STICKER'

export type Platform = 'WHATSAPP' | 'INSTAGRAM' | 'MESSENGER' | 'TIKTOK'

export type Importance = 'alta' | 'media' | 'baja'
export type DerivedStatus = 'INVESTIGANDO' | 'VERIFICANDO' | 'DOCUMENTADO' | 'POR_PUBLICAR'

export interface Message {
  _id: string
  contactId?: string | null
  phone: string
  name?: string
  content: string
  messageType: MessageType
  label?: MessageLabel
  platform: Platform
  autoResponded?: boolean
  autoResponse?: string
  registeredInDb?: boolean
  metadata?: unknown
  read?: boolean
  createdAt: string
  updatedAt: string
}

export interface Contact {
  _id: string
  phone: string
  name?: string
  label?: MessageLabel
  notes?: string
  messageCount?: number
  lastMessageAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Paginated<T> {
  data: T[]
  pagination: Pagination
}

export interface MessagesStats {
  total?: number
  byLabel?: Record<string, number>
  byType?: Record<string, number>
  byPlatform?: Record<string, number>
  unreadLast7Days?: number
  totalAudio?: number
  totalDocuments?: number
  [key: string]: unknown
}

export interface ContactsStats {
  total?: number
  byLabel?: Record<string, number>
  [key: string]: unknown
}

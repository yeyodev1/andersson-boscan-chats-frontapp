import APIBase from './httpBase'
import type {
  Message,
  MessageLabel,
  MessageType,
  MessagesStats,
  Paginated,
  Platform,
} from '@/types'

export interface ListMessagesParams {
  label?: MessageLabel | ''
  phone?: string
  registered?: boolean
  page?: number
  limit?: number
}

interface RawListResponse {
  messages: RawMessage[]
  total: number
  page: number
  limit: number
}

interface RawMessage extends Omit<Message, 'messageType' | 'platform'> {
  messageType: string
  platform: string
}

interface RawStats {
  byLabel?: Array<{ _id: string; count: number }>
  byType?: Array<{ _id: string; count: number }>
  byPlatform?: Array<{ _id: string; count: number }>
  total?: number
  unread?: number
  registered?: number
}

function normalize(m: RawMessage): Message {
  return {
    ...m,
    messageType: (m.messageType || 'text').toUpperCase() as MessageType,
    platform: (m.platform || 'whatsapp').toUpperCase() as Platform,
  }
}

function arrayToRecord(arr?: Array<{ _id: string; count: number }>): Record<string, number> {
  const r: Record<string, number> = {}
  if (!arr) return r
  for (const item of arr) r[String(item._id).toUpperCase()] = item.count
  return r
}

class MessagesService extends APIBase {
  async list(params: ListMessagesParams = {}): Promise<Paginated<Message>> {
    const qs = new URLSearchParams()
    if (params.label) qs.set('label', params.label)
    if (params.phone) qs.set('phone', params.phone)
    if (params.registered !== undefined) qs.set('registered', String(params.registered))
    qs.set('page', String(params.page ?? 1))
    qs.set('limit', String(params.limit ?? 50))
    const res = await this.get<RawListResponse>(`messages?${qs.toString()}`)
    const total = res.data.total ?? 0
    const limit = res.data.limit ?? params.limit ?? 50
    const page = res.data.page ?? params.page ?? 1
    return {
      data: (res.data.messages || []).map(normalize),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / Math.max(1, limit))),
      },
    }
  }

  async stats(): Promise<MessagesStats> {
    const res = await this.get<RawStats>('messages/stats')
    const byType = arrayToRecord(res.data.byType)
    return {
      total: res.data.total,
      unread: res.data.unread,
      registered: res.data.registered,
      byLabel: arrayToRecord(res.data.byLabel),
      byType,
      byPlatform: arrayToRecord(res.data.byPlatform),
      totalAudio: byType.AUDIO,
      totalDocuments: byType.DOCUMENT,
    }
  }

  async getOne(id: string): Promise<Message> {
    const res = await this.get<RawMessage>(`messages/${id}`)
    return normalize(res.data)
  }

  async markRead(id: string): Promise<Message> {
    const res = await this.patch<RawMessage>(`messages/${id}/read`, {})
    return normalize(res.data)
  }

  async updateLabel(id: string, label: MessageLabel): Promise<Message> {
    const res = await this.patch<RawMessage>(`messages/${id}/label`, { label })
    return normalize(res.data)
  }
}

export const messagesService = new MessagesService()

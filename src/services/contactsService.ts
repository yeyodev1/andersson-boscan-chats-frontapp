import APIBase from './httpBase'
import type {
  Contact,
  ContactsStats,
  MessageLabel,
  Paginated,
} from '@/types'

export interface ListContactsParams {
  label?: MessageLabel | ''
  page?: number
  limit?: number
}

interface RawListResponse {
  contacts: Contact[]
  total: number
  page: number
  limit: number
}

interface RawStats {
  byLabel?: Array<{ _id: string; count: number }>
  total?: number
}

function arrayToRecord(arr?: Array<{ _id: string; count: number }>): Record<string, number> {
  const r: Record<string, number> = {}
  if (!arr) return r
  for (const item of arr) r[String(item._id).toUpperCase()] = item.count
  return r
}

class ContactsService extends APIBase {
  async list(params: ListContactsParams = {}): Promise<Paginated<Contact>> {
    const qs = new URLSearchParams()
    if (params.label) qs.set('label', params.label)
    qs.set('page', String(params.page ?? 1))
    qs.set('limit', String(params.limit ?? 50))
    const res = await this.get<RawListResponse>(`contacts?${qs.toString()}`)
    const total = res.data.total ?? 0
    const limit = res.data.limit ?? params.limit ?? 50
    const page = res.data.page ?? params.page ?? 1
    return {
      data: res.data.contacts || [],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / Math.max(1, limit))),
      },
    }
  }

  async stats(): Promise<ContactsStats> {
    const res = await this.get<RawStats>('contacts/stats')
    return {
      total: res.data.total,
      byLabel: arrayToRecord(res.data.byLabel),
    }
  }

  async getOne(phone: string): Promise<Contact> {
    const res = await this.get<Contact>(`contacts/${phone}`)
    return res.data
  }

  async update(phone: string, body: { label?: MessageLabel; notes?: string }): Promise<Contact> {
    const res = await this.patch<Contact>(`contacts/${phone}`, body)
    return res.data
  }
}

export const contactsService = new ContactsService()

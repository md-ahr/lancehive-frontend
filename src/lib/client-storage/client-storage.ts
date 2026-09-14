const CLIENT_ID_KEY = 'lancehive_client_id'

export function getClientId(): string | null {
  return localStorage.getItem(CLIENT_ID_KEY)
}

export function setClientId(id: string): void {
  localStorage.setItem(CLIENT_ID_KEY, id)
}

export function clearClientId(): void {
  localStorage.removeItem(CLIENT_ID_KEY)
}

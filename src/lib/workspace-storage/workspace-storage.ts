const FREELANCER_ID_KEY = 'lancehive_freelancer_id'

export function getFreelancerId(): string | null {
  return localStorage.getItem(FREELANCER_ID_KEY)
}

export function setFreelancerId(id: string): void {
  localStorage.setItem(FREELANCER_ID_KEY, id)
}

export function clearFreelancerId(): void {
  localStorage.removeItem(FREELANCER_ID_KEY)
}

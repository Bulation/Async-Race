export type Status = 'started' | 'stopped';
export type Success = { success: true };
export type Sort = 'id' | 'wins' | 'time';
export type Order = 'ASC' | 'DESC';
export type WinnerInfo = {
  id: number
  name: string,
  time: number
};

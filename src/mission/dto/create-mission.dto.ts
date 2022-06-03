export class CreateMissionDto {
  mission_id?: number
  mission_pid?: number

  recruit: number

  title: string
  content: string
  location: string

  action_date: string
  start_time: string
  end_time: string

  children: any[]

  created_at: string
  updated_at: string
}

export class CreateMissionDto {
  mission_id?: number
  mission_pid?: number

  title: string
  content: string

  action_date: string
  start_time: string
  end_time: string

  children: any[]

  created_at: string
  updated_at: string
}

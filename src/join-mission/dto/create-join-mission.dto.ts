export class CreateJoinMissionDto {
  join_id?: number
  mission_id: number
  submission_id: string
  user_id?: number
  sign_in_time?: string
  sign_out_time?: string
  vehicle: string
  create_type: number
}

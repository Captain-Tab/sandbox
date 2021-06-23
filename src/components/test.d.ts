export interface ActionInfo {
  name: string
  params: ParmsInfo
}

export interface DataInfo {
  [key: string]: number
}

export interface ParamsInfo {
  property: string
  value: number
}

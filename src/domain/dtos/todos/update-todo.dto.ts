

export class UpdateTodoDto {

  private constructor(
    public readonly id: number,
    public readonly text?: string,
    public readonly done?: boolean,
    public readonly createdAt?: Date
  ) { }

  get values() {
    const returnObj: { [key: string]: any } = {}
    
    if (this.text) returnObj.text = this.text
    if (this.done !== undefined) returnObj.done = this.done;
    if (this.createdAt) returnObj.createdAt = this.createdAt

    return returnObj
  }
  

  static update(props: { [key: string]: any }): [string?, UpdateTodoDto?] {
    const { text, done, createdAt, id } = props
    
    if(!id || isNaN(Number(id))) return ['Id is must be a valid number', undefined]

    let newCreatedAt = createdAt
    if (createdAt) {
      newCreatedAt = new Date(createdAt)
      if(newCreatedAt.toString() === 'Invalid Date') return ['Invalid date', undefined]
    }

    if(done !== undefined && typeof done !== 'boolean') return ['Done must be a boolean', undefined]

    return [undefined, new UpdateTodoDto(id, text, done, newCreatedAt)]

  }
}
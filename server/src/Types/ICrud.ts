export default interface ICrud<Entity> {
    findAll: () => Promise<Entity[]>
    findOneById: (id: number) => Promise<Entity | null>
    create: (model: Entity) => Promise<void>
    update: (id: number, model: Entity) => Promise<boolean>
    delete: (id: number) => Promise<boolean>
}
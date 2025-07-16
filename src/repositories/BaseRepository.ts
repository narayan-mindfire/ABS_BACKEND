export class BaseRepository<T> {
  protected model: any;

  constructor(model: any) {
    this.model = model;
  }

  findAll(): Promise<T[]> {
    return this.model.find();
  }

  findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }

  // ✅ Add this method
  findOne(query: object): Promise<T | null> {
    return this.model.findOne(query);
  }
}

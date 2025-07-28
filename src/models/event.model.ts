export class User {
  public name: string;

  public username: string;
}

export class Event {
  public id: string;

  public reference: string;

  public title: string;

  public description: string;

  public eventGroupId: string;

  public system: string;

  public systemName: string;

  public eventDate: Date;

  public isPublic: boolean;

  public user: User;

  public createdAt: number;
}

import { faker } from '@faker-js/faker';
import {builder} from './builder';

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
  }
  
  export interface IPost {
    id: string;
    authorId: string;
    title: string;
    content: string;
  }
  export const Users = new Map<string, IUser>();
  export const Posts = new Map<string, IPost>();
  
  faker.seed(123);
  
  // Create 100 users and posts
  for (let i = 1; i <= 100; i += 1) {
    Users.set(String(i), {
      id: String(i),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    });
  
    Posts.set(String(i), {
      id: String(i),
      authorId: String(faker.datatype.number({ min: 1, max: 100 })),
      title: faker.lorem.text(),
      content: faker.lorem.paragraphs(2),
    });
  }
  
  export const User = builder.objectRef<IUser>('User');
  export const Post = builder.objectRef<IPost>('Post');
  
  User.implement({
    fields: t => ({
      id: t.exposeID('id'),
      firstName: t.exposeString('firstName'),
      lastName: t.exposeString('lastName'),
      fullName: t.string({
        resolve: user => `${user.firstName} ${user.lastName}`,
      }),
      posts: t.field({
        type: [Post],
        resolve: user => [...Posts.values()].filter(post => post.authorId === user.id),
      }),
    }),
  });
  
  Post.implement({
    fields: t => ({
      id: t.exposeID('id'),
      title: t.exposeString('title'),
      content: t.exposeString('content'),
      author: t.field({
        type: User,
        nullable: true,
        resolve: post => Users.get(post.id),
      }),
    }),
  });
  
  const DEFAULT_PAGE_SIZE = 10;
  
  builder.queryType({
    fields: t => ({
      post: t.field({
        type: Post,
        nullable: true,
        args: {
          id: t.arg.id({ required: true }),
        },
        resolve: (root, args) => Posts.get(String(args.id)),
      }),
      posts: t.field({
        type: [Post],
        nullable: true,
        args: {
          take: t.arg.int(),
          skip: t.arg.int(),
        },
        resolve: (root, args) =>
          [...Posts.values()].slice(args.skip ?? 0, args.take ?? DEFAULT_PAGE_SIZE),
      }),
      users: t.field({
        type: [User],
        nullable: true,
        args: {
          take: t.arg.int(),
          skip: t.arg.int(),
        },
        resolve: (root, args) =>
          [...Users.values()].slice(args.skip ?? 0, args.take ?? DEFAULT_PAGE_SIZE),
      }),
      user: t.field({
        type: User,
        nullable: true,
        args: {
          id: t.arg.id({ required: true }),
        },
        resolve: (root, args) => Users.get(String(args.id)),
      }),
      hello: t.string({
        args: {
          name: t.arg.string(),
        },
        resolve: (parent, { name }) => `hello, ${name || 'World'}`,
      }),
    }),
  });


export const schema = builder.toSchema();

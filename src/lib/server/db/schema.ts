import { relations } from 'drizzle-orm';
import { timestamp, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';

export const comments = pgTable('comments', {
	id: uuid('id').primaryKey().defaultRandom(),
	postId: uuid('postId').notNull(),
	authorId: uuid('authorId').notNull(),
	content: text('content').notNull(),
	date: timestamp('date').notNull().defaultNow()
});

export const commentsRelations = relations(comments, ({ one }) => ({
	author: one(users, {
		fields: [comments.authorId],
		references: [users.id]
	}),
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.id]
	})
}));

export const follows = pgTable(
	'follows',
	{
		followerId: uuid('follower_id')
			.notNull()
			.references(() => users.id),
		followedId: uuid('followed_id')
			.notNull()
			.references(() => users.id),
		date: timestamp('date').notNull().defaultNow()
	},
	(table) => ({
		pk: primaryKey({ columns: [table.followerId, table.followedId] })
	})
);

export const followsRelations = relations(follows, ({ one }) => ({
	follower: one(users, {
		fields: [follows.followerId],
		references: [users.id],
		relationName: 'follower'
	}),
	followed: one(users, {
		fields: [follows.followedId],
		references: [users.id],
		relationName: 'followed'
	})
}));

export const likes = pgTable(
	'likes',
	{
		userId: uuid('userId')
			.notNull()
			.references(() => users.id),
		postId: uuid('postId')
			.notNull()
			.references(() => posts.id),
		date: timestamp('date').notNull().defaultNow()
	},
	(table) => ({
		pk: primaryKey({ columns: [table.postId, table.userId] })
	})
);

export const likesRelations = relations(likes, ({ one }) => ({
	user: one(users, {
		fields: [likes.userId],
		references: [users.id]
	}),
	post: one(posts, {
		fields: [likes.postId],
		references: [posts.id]
	})
}));

export const posts = pgTable('posts', {
	id: uuid('id').primaryKey().defaultRandom(),
	author: uuid('author').notNull(),
	content: text('content').notNull(),
	picture: text('picture'),
	date: timestamp('date').notNull().defaultNow()
});

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(users, {
		fields: [posts.author],
		references: [users.id]
	}),
	likes: many(likes)
}));

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	avatar: text('avatar'),
	email: text('email').notNull().unique(),
	name: text('name').notNull().unique(),
	password: text('password').notNull(),
	created: timestamp('created').notNull().defaultNow()
});

export const usersRelations = relations(users, ({ many }) => ({
	follows: many(follows),
	likes: many(likes)
}));

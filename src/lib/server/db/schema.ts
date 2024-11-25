import { relations } from 'drizzle-orm';
import { date, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	avatar: text('avatar'),
	email: text('email').notNull().unique(),
	name: text('name').notNull().unique(),
	password: text('password').notNull()
});

export const posts = pgTable('posts', {
	id: uuid('id').primaryKey().defaultRandom(),
	author: uuid('author').notNull(),
	content: text('content').notNull(),
	picture: text('picture'),
	date: date('date').notNull().defaultNow()
});

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(users, {
		fields: [posts.author],
		references: [users.id]
	})
}));

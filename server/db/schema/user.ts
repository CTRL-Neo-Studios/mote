import {sqliteTable, text} from "drizzle-orm/sqlite-core";
import {relations} from "drizzle-orm/relations";

const user = sqliteTable("user", {
    id: text().$defaultFn(() => crypto.randomUUID()).primaryKey(),
    name: text().default("Unnamed User")
})

export const userRelations = relations(user, ({many}) => ({

}))

export default user
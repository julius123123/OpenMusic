/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable("albums", {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        title: {
            type: 'TEXT',
            notNull: true
        },
        year: {
            type: 'INTEGER',
            notNull: true
        }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}n
 */
export const down = (pgm) => {
    pgm.dropTable('albums')
};

const getDataTableQuery = ({schema, table}) => {
    return `
    select DATA_TYPE as dataType, COLUMN_NAME as colName, IS_NULLABLE as isNullable
    from information_schema.COLUMNS 
    where TABLE_SCHEMA = '${schema}' 
    and TABLE_NAME = '${table}';
    `;
};

const getReferencesQuery = ({ schema, table }) => {
    return `
    select table_name as foreignTable
    from information_schema.REFERENTIAL_CONSTRAINTS
    where constraint_schema = '${schema}'
    and referenced_table_name = '${table}';
      `;
};

const getTablesBySchemaQuery = (schema) => {
    return `
    select DISTINCT table_name
    from information_schema.KEY_COLUMN_USAGE
    where table_schema = '${schema}'
      `;
};

const getForeignKeysQuery = ({schema, table}) => {
    return `
  select referenced_table_name as referencedTableName
  from information_schema.REFERENTIAL_CONSTRAINTS
  where constraint_schema = '${schema}'
  and table_name  = '${table}';
  ;
      `;
};

const getSchemasExcludingInternalSchemasQuery = () => {
    return `
    select schema_name as schemaName
    from information_schema.schemata
    where schema_name not in('mysql','performance_schema','phpmyadmin','information_schema') 
    order by schema_name;
    `;
};
export {
    getDataTableQuery,
    getReferencesQuery,
    getTablesBySchemaQuery,
    getForeignKeysQuery,
    getSchemasExcludingInternalSchemasQuery,
};

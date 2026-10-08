import { query } from "./db"
import { revalidatePath } from "next/cache"

// Helper to get next sort order
export async function getNextSortOrder(tableName: string, sortOrderColumn: string = "sort_order"): Promise<number> {
  const rows = await query<{ sort_order: number | string }>(
    `SELECT COALESCE(MAX(${sortOrderColumn}), -1) + 1 AS sort_order FROM ${tableName}`
  );
  return rows[0]?.sort_order != null 
    ? Number(rows[0].sort_order) 
    : 0;
}

// Standard revalidate paths
export const standardRevalidatePaths = (entityName: string): string[] => 
  ["/", `/dashboard/${entityName}`];

// Facility-specific revalidate paths (more complex)
export const facilityRevalidatePaths = (oldSlug: string | null = null, newSlug: string | null = null): string[] => {
  const paths = ["/facility", "/dashboard/facilities"];
  if (oldSlug) paths.push(`/facility/${oldSlug}`);
  if (newSlug) paths.push(`/facility/${newSlug}`);
  return paths;
};

// Generate SELECT clause
export const selectAll = "*";

// Generate INSERT columns and values placeholders
export function createInsertHelpers<T extends Record<string, any>>(columns: (keyof T)[]) {
  return {
    columns: columns.map(col => String(col)).join(", "),
    placeholders: columns.map((_, index) => `$${index + 1}`).join(", ")
  };
}

// Generate UPDATE SET clause
export function createUpdateSetter<T extends Record<string, any>>(columns: (keyof T)[]) {
  return (values: Partial<T>) => {
    const clauses: string[] = [];
    const vals: any[] = [];
    
    columns.forEach((col, index) => {
      if (values[col as keyof T] !== undefined) {
        clauses.push(`${String(col)} = $${index + 2}`); // +2 because $1 is usually the id
        vals.push(values[col as keyof T]);
      }
    });
    
    return {
      setClause: clauses.join(", "),
      values: vals
    };
  };
}

// Execute standard CRUD operations with error handling
export async function executeList<Table>(
  tableName: string,
  orderBy: string = "sort_order ASC, id ASC",
  whereClause: string = "",
  selectColumns: string = "*"
): Promise<Table[]> {
  const sql = `
    SELECT ${selectColumns}
    FROM ${tableName}
    ${whereClause ? `WHERE ${whereClause}` : ""}
    ORDER BY ${orderBy}
  `;
  return query<Table>(sql);
}

export async function executeGet<Table>(
  tableName: string,
  id: number,
  idColumn: string = "id",
  selectColumns: string = "*"
): Promise<Table | null> {
  const sql = `
    SELECT ${selectColumns}
    FROM ${tableName}
    WHERE ${idColumn} = $1
  `;
  const rows = await query<Table>(sql, [id]);
  return rows[0] ?? null;
}

export async function executeCreate<Table>(
  tableName: string,
  columns: string,
  placeholders: string,
  values: any[],
  revalidatePaths: string[] = ["/"]
): Promise<Table> {
  const sql = `
    INSERT INTO ${tableName} (${columns}) 
    VALUES (${placeholders}) 
    RETURNING *
  `;
  const rows = await query<Table>(sql, values);
  // Revalidate paths
  for (const path of revalidatePaths) {
    revalidatePath(path);
  }
  return rows[0];
}

export async function executeUpdate<Table>(
  tableName: string,
  setClause: string,
  idValue: any,
  updateValues: any[],
  idColumn: string = "id",
  revalidatePaths: string[] = ["/"]
): Promise<Table> {
  const sql = `
    UPDATE ${tableName} 
    SET ${setClause}, updated_at = NOW()
    WHERE ${idColumn} = $1
    RETURNING *
  `;
  const allValues = [idValue, ...updateValues];
  const rows = await query<Table>(sql, allValues);
  // Revalidate paths
  for (const path of revalidatePaths) {
    revalidatePath(path);
  }
  return rows[0];
}

export async function executeDelete(
  tableName: string,
  idValue: any,
  idColumn: string = "id",
  revalidatePaths: string[] = ["/"]
): Promise<void> {
  await query(`DELETE FROM ${tableName} WHERE ${idColumn} = $1`, [idValue]);
  // Revalidate paths
  for (const path of revalidatePaths) {
    revalidatePath(path);
  }
}

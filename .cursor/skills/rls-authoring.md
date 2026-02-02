# RLS authoring

- Enable RLS on every table.
- Policies: select/insert/update/delete scoped by auth.uid() or org_id/tenant_id as appropriate.
- Use service_role only in server-side jobs or migrations; never expose to client.
- Validate with Supabase MCP (list_tables, execute_sql) and document in docs/security.md.

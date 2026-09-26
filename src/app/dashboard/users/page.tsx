import { adminListUsers } from "@/lib/users"
import UsersManager from "./UsersManager"

export default async function UsersPage() {
  const users = await adminListUsers()
  return <UsersManager initial={users} />
}

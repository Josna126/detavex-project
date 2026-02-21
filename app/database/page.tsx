"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Database, AlertCircle } from "lucide-react"
import { PageTransition, FadeIn } from "@/components/page-transition"
import { fetchMe, fetchUsers, type DatabaseUser } from "@/lib/auth-client"

function SkeletonRow() {
  return (
    <tr className="border-t border-border/60 hover:bg-muted/20 transition-colors">
      <td className="px-4 py-3">
        <div className="shimmer-loading h-4 w-32 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="shimmer-loading h-4 w-48 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="shimmer-loading h-4 w-40 rounded" />
      </td>
    </tr>
  )
}

export default function DatabasePage() {
  const router = useRouter()
  const [users, setUsers] = useState<DatabaseUser[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const currentUser = await fetchMe()
        if (!currentUser) {
          router.replace("/signin")
          return
        }

        const dbUsers = await fetchUsers()
        setUsers(dbUsers)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users")
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [router])

  return (
    <PageTransition>
      <div className="relative mx-auto max-w-5xl px-4 py-16 lg:px-8">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)",
          }}
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        <FadeIn>
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <motion.div
                className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-indigo/20 to-teal/20 border border-indigo/30"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Database className="h-6 w-6 text-gradient-cyber" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                  Database <span className="text-gradient-cyber">Users</span>
                </h1>
                <p className="mt-2 text-base text-muted-foreground">
                  Users created through signup and stored in PostgreSQL.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 overflow-hidden rounded-2xl border border-border/60 backdrop-blur"
            >
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40 border-b border-border/60">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <SkeletonRow key={i} />
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 flex items-center gap-4"
            >
              <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-destructive">Error</h3>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 overflow-hidden rounded-2xl border border-border/60 backdrop-blur"
            >
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40 border-b border-border/60 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-foreground">Name</th>
                    <th className="px-6 py-4 font-semibold text-foreground">Email</th>
                    <th className="px-6 py-4 font-semibold text-foreground">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr className="border-t border-border/60">
                      <td colSpan={3} className="px-6 py-12 text-center">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center gap-3"
                        >
                          <Users className="h-8 w-8 text-muted-foreground/40" />
                          <p className="text-muted-foreground">No users found in database.</p>
                        </motion.div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-t border-border/60 hover:bg-muted/30 transition-colors group"
                      >
                        <td className="px-6 py-4 font-medium text-foreground group-hover:text-gradient-cyber transition-colors">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground group-hover:text-foreground transition-colors">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">
                          {new Date(user.createdAt).toLocaleString()}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>

              {users.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="border-t border-border/60 bg-muted/20 px-6 py-4 text-sm text-muted-foreground"
                >
                  Showing <span className="font-semibold text-foreground">{users.length}</span> user{users.length !== 1 ? 's' : ''}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}

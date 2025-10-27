/**
 * Run this script with:
 * npx tsx scripts/backfill-user-conversions.ts
 *
 * Make sure you’ve already run your Prisma migration:
 * npx prisma migrate deploy
 */

import { PrismaClient, INRTransactionStatus, INRTransactionType } from "@prisma/client"

const db = new PrismaClient()

async function main() {
  console.log("🔄 Starting backfill of user conversion totals...")

  // Get all users
  const users = await db.user.findMany({
    select: { id: true },
  })

  console.log(`Found ${users.length} users to process.`)

  for (const user of users) {
    // Aggregate completed and pending conversion totals
    const [completedAgg, pendingAgg] = await Promise.all([
      db.iNRTransaction.aggregate({
        _sum: { inrAmount: true },
        where: {
          userId: user.id,
          type: INRTransactionType.CONVERT,
          status: INRTransactionStatus.COMPLETED,
        },
      }),
      db.iNRTransaction.aggregate({
        _sum: { inrAmount: true },
        where: {
          userId: user.id,
          type: INRTransactionType.CONVERT,
          status: INRTransactionStatus.PENDING,
        },
      }),
    ])

    const totalConversions = Number(completedAgg._sum.inrAmount || 0)
    const pendingConversions = Number(pendingAgg._sum.inrAmount || 0)

    // Update user record
    await db.user.update({
      where: { id: user.id },
      data: {
        totalConversions,
        pendingConversions,
      },
    })

    console.log(`✅ Updated user ${user.id} — total: ${totalConversions}, pending: ${pendingConversions}`)
  }

  console.log("🎉 Backfill completed successfully!")
}

main()
  .catch((err) => {
    console.error("❌ Error during backfill:", err)
  })
  .finally(async () => {
    await db.$disconnect()
  })

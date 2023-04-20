import type { User } from "@clerk/nextjs/dist/api"
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

// export type timeWorkedAndUsername = timeWorked & {
//   username: string
// }

export type timeWorkedAndUsername = {
  id: string, 
  begining: Date, 
  end: Date, 
  status: boolean,
  location: string 
  notes: string | null, 
  username: string
}


const filterUserForClient = (user: User) => {
    return {id: user.id, username: user.username, profileImageUrl: user.profileImageUrl}
}

export const worksRouter = createTRPCRouter({
  // Gets all non-rejected timeWorkeds
  getAll: publicProcedure.query(async ({ ctx }) => {
    const timeWorked = await ctx.prisma.timeWorked.findMany({
        take: 200,
    });

    const users = (await clerkClient.users.getUserList({
        userId: timeWorked.map(work => work.userId),
        limit: 100
    })).map(filterUserForClient);
    // Add filtering for admin accounts/users own at later date

    return timeWorked.map(timeWorked => {
        const user = users.find((user) => user.id === timeWorked.userId)

        if (!user || !user.username) throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "User for timeWorked not found"})

        return {timeWorked, user: {...user, username: user.username}}})
  }),

  getValidTime: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    const timeWorked = await ctx.prisma.timeWorked.findMany({
      where: {
        userId: userId
      }
    })

    const days = timeWorked.map(x => x.days).reduce((sum: number, current: number) => sum + current, 0);

    return {days}

  }),

  // Use zod to check range typing
  create: privateProcedure.input(z.object({
    start: z.date(),
    end: z.date(),
    location: z.string(),
    status: z.boolean().optional(),
    notes: z.string().optional(),
  })).mutation(async ({ctx, input}) => {
    const userId = ctx.userId;
    // TODO: Calculate days here
    const beg = dayjs(input.start)
    const end = dayjs(input.end)
    // Add one day here as should be inclusive
    const daysWorked = end.diff(beg, 'day') + 1
    const timeWorked = await ctx.prisma.timeWorked.create({
        data: {
            userId,
            begining: input.start,
            end: input.end,
            days: daysWorked,
            location: input.location,
            status: input.status,
            notes: input.notes,
        }
    })

    return timeWorked
  }),

  // Adjust valid status 
  updateStatus: privateProcedure.input(z.object({
    requestId: z.string(),
    valid: z.boolean()
  })).mutation(async ({ctx, input}) => {
    const newStatus = input.valid
    const timeWorked = await ctx.prisma.timeWorked.update({
      where: {id: input.requestId},
      data: {
          status: newStatus
      }
    })
    return timeWorked
  }),

  // Delete
  delete: privateProcedure.input(z.object({requestId: z.string()})).mutation(async ({ctx, input}) => {
    const deleted = await ctx.prisma.timeWorked.delete({
      where: {id: input.requestId}
    })
    console.log(`Deleted timeWorked - ${deleted.id} ${deleted.notes ? deleted.notes : ""}`)
  }),
});

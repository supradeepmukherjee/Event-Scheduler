import { clerkClient, currentUser } from "@clerk/nextjs/server"
import prisma from "./prisma"

export const checkUser = async () => {
    const user = await currentUser()
    if (!user) return null
    try {
        const loggedInUser = await prisma.user.findUnique({ where: { clerkUserID: user.id } })
        if (loggedInUser) return loggedInUser
        const name = `${user.firstName} ${user.lastName}`
        const username = `${user.firstName}-${user.lastName}` + user.id.slice(-4)
        await clerkClient().users.updateUser(user.id, { username })
        const newUser = await prisma.user.create({
            data: {
                clerkUserID: user.id,
                name,
                imgUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddress,
                username
            }
        })
        return newUser
    } catch (err) {
        console.log(err)
    }
}
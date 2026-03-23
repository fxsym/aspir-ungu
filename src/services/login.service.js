import { users } from "@/lib/users";
import { comparePassword } from "@/utils/encrypt";

export async function loginServices(credentials) {
    const isEmail = credentials.identifier.includes("@");
    // const user = await prisma.user.findUnique({
    //     where: isEmail
    //         ? { email: credentials.identifier }
    //         : { username: credentials.identifier },
    // });

    const user = users.find((item) => isEmail ? item.email === credentials.identifier : item.username === credentials.identifier)

    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const isPasswordValid = await comparePassword(
        credentials.password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("INVALID_CREDENTIALS");
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
    };
}
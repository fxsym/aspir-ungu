import { generateToken, verifyToken } from "@/lib/auth";
import { users } from "@/lib/users";
import { getToken } from "@/utils/cookies";
import { comparePassword } from "@/utils/encrypt";

export async function login(credentials) {
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

    const token = generateToken({ id: user.id, name: user.name, email: user.email });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        token
    };
}

export async function getCurrentUser() {
    const token = await getToken()
    if (!token) return null

    const payload = verifyToken(token)
    if (!payload) return null

    const user = users.find((item) => item.id === payload.id) 

    // Ambil data fresh dari database
    // const user = await userRepository.findById(payload.id)

    return user
}
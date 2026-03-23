import bcrypt from "bcrypt";

export const comparePassword = async (password, hash) => bcrypt.compare(password, hash);
import bcrypt from 'bcryptjs';

export async function create(pasword: string): Promise<string> {

    return bcrypt.hash(pasword, 11);

}

export async function compare(password: string, hash: string): Promise<boolean> {

    return bcrypt.compare(password, hash);

}
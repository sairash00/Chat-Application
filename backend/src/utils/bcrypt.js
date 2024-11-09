import bcrypt from 'bcrypt';

export const hashPassword  = (password) => {
    const hashedPassword = bcrypt.hash(password, 10)
    return hashedPassword
}

export const comparePassword = (password, hashedPassword) => {
    const isMatch = bcrypt.compare(password, hashedPassword)
    if(!isMatch) return null
    return isMatch
}
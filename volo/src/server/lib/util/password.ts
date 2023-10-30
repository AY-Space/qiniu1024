import { compare, hash } from 'bcrypt';

// 加密密码函数
export const encrypt = async (password: string,salt:string|number):Promise<string> => {
  return await hash(password, salt);
};

// 校验密码函数
export const check = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await compare(password, hashedPassword);
};


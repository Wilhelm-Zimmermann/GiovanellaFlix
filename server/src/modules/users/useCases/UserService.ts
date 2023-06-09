import { ILoginUserDTO } from "../dtos/ILoginUserDTO";
import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { IUsersRepository } from "../repositories/IUsersRepository";
import { IUserCreatedResponse } from "../responses/ICreatedUserResponse";
import { inject, injectable } from "tsyringe";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import jwtConfig from "../../../utils/jwtConfig";
import { AppError } from "../../../shared/errors/AppError";
import { ILoginResponse } from "../responses/ILoginResponse";
import { User } from "@prisma/client";
import { StorageProvider } from "../../../utils/Storage";


@injectable()
export class UserService {
	constructor(@inject("IUsersRepository") private usersRepository: IUsersRepository){ }

	async createUser(userInfo: ICreateUserDTO):Promise<User>{
		const hashedPassword = await hash(userInfo.password, 8);
		const userToCreate = {
			...userInfo,
			password: hashedPassword,
			profileImageUrl: ""
		};
		
		const userAlreadyExists = await this.usersRepository?.getUserByEmail(userInfo.email);		
		
		if(userAlreadyExists)
			throw new AppError("This email is already in use", 409);

		const user = await this.usersRepository.createUser(userToCreate);

		return user;
	}

	async login(userInfo: ILoginUserDTO): Promise<ILoginResponse> {
		// Procurando se existe um usuário no banco de dados com base no email
		const user = await this.usersRepository.getUserByEmail(userInfo.email);

		if(!user)
			throw new AppError("Email/Password might be wrong", 400);
		
		// Utilizar o método "compare" para verificar se as senhas coincidem
		const passwordMatch = await compare(userInfo.password, user.password);

		if(!passwordMatch)
			throw new AppError("Email/Password might be wrong", 400);

		const token = sign(
			{
				userId: user.id
			}, 
			jwtConfig.secretKey, 
			jwtConfig.options
		);

		return {token};
	}

	async uploadUserPhoto(userId: string, profilePhoto: string): Promise<User> {
		// Procurando se existe um usuário no banco de dados com base no email
		const user = await this.usersRepository.getUserById(userId);
		
		if(!user){
			throw new AppError("User not found", 404);
		}

		const storageProvider = new StorageProvider();

		if(user.profileImageUrl.length > 2)
			await storageProvider.delete(user.profileImageUrl, "");

		const userUpdated = await this.usersRepository.updateUserProfilePhoto(user.id, profilePhoto);

		return userUpdated;
	}

	async updateUserPassword(email: string, passwordToReset: string): Promise<User>{
		const user = await this.usersRepository.getUserByEmail(email);

		passwordToReset = await hash(passwordToReset, 8);

		if(!user)
			throw new AppError("User not found", 404);

		const updatedUser = await this.usersRepository.updateUserPassword(user.id,passwordToReset);

		return updatedUser;
	}

	async getUserProfile(id: string): Promise<User> {
		const user = await this.usersRepository.getUserById(id);

		if(!user) 
			throw new AppError("User not found", 404);

		return user;
	}
}
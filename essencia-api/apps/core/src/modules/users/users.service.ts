import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and, sql } from 'drizzle-orm';
import { DB, DrizzleDB, users } from '@app/database';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

export interface UserDto {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: string;
  status: string;
  passwordHash: string;
}

export type PublicUserDto = Omit<UserDto, 'passwordHash'>;

export interface CreateUserDto {
  tenantId: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: string;
}

export interface UpdateUserDto {
  name?: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

export interface UpdateUserAdminDto extends UpdateUserDto {
  role?: string;
  status?: string;
}

@Injectable()
export class UsersService {
  constructor(@Inject(DB) private readonly db: DrizzleDB) {}

  async findAll(tenantId: string, query?: any): Promise<PublicUserDto[]> {
    await this.setTenantContext(tenantId);
    
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.tenantId, tenantId));

    return (result as UserDto[]).map((user) => this.toPublicUser(user));
  }

  async findById(tenantId: string, id: string): Promise<PublicUserDto | null> {
    await this.setTenantContext(tenantId);

    const result = await this.db
      .select()
      .from(users)
      .where(and(eq(users.tenantId, tenantId), eq(users.id, id)))
      .limit(1);

    const user = (result[0] as UserDto) || null;
    return user ? this.toPublicUser(user) : null;
  }

  async findByEmail(tenantId: string, email: string): Promise<UserDto | null> {
    await this.setTenantContext(tenantId);
    
    const result = await this.db
      .select()
      .from(users)
      .where(and(eq(users.tenantId, tenantId), eq(users.email, email.toLowerCase())))
      .limit(1);

    return (result[0] as UserDto) || null;
  }

  async create(dto: CreateUserDto): Promise<PublicUserDto> {
    await this.setTenantContext(dto.tenantId);
    
    const passwordHash = await argon2.hash(dto.password);
    const id = uuidv4();

    const [user] = await this.db
      .insert(users)
      .values({
        id,
        tenantId: dto.tenantId,
        email: dto.email.toLowerCase(),
        passwordHash,
        name: dto.name,
        phone: dto.phone,
        role: dto.role,
        status: 'active',
      })
      .returning();

    return this.toPublicUser(user as UserDto);
  }

  async updateProfile(
    tenantId: string,
    id: string,
    dto: UpdateUserDto,
  ): Promise<PublicUserDto> {
    await this.setTenantContext(tenantId);

    const update = this.buildUpdateSet(dto, { allowRoleAndStatus: false });

    const [user] = await this.db
      .update(users)
      .set({
        ...update,
        updatedAt: new Date(),
      })
      .where(and(eq(users.tenantId, tenantId), eq(users.id, id)))
      .returning();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toPublicUser(user as UserDto);
  }

  async updateAdmin(
    tenantId: string,
    id: string,
    dto: UpdateUserAdminDto,
  ): Promise<PublicUserDto> {
    await this.setTenantContext(tenantId);

    const update = this.buildUpdateSet(dto, { allowRoleAndStatus: true });

    const [user] = await this.db
      .update(users)
      .set({
        ...update,
        updatedAt: new Date(),
      })
      .where(and(eq(users.tenantId, tenantId), eq(users.id, id)))
      .returning();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toPublicUser(user as UserDto);
  }

  async updatePassword(
    tenantId: string,
    id: string,
    passwordHash: string,
  ): Promise<void> {
    await this.setTenantContext(tenantId);

    await this.db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(and(eq(users.tenantId, tenantId), eq(users.id, id)));
  }

  async delete(tenantId: string, id: string): Promise<void> {
    await this.setTenantContext(tenantId);

    await this.db
      .update(users)
      .set({
        status: 'inactive',
        updatedAt: new Date(),
      })
      .where(and(eq(users.tenantId, tenantId), eq(users.id, id)));
  }

  private toPublicUser(user: UserDto): PublicUserDto {
    const { passwordHash: _passwordHash, ...publicUser } = user;
    return publicUser;
  }

  private buildUpdateSet(
    dto: UpdateUserAdminDto,
    options: { allowRoleAndStatus: boolean },
  ): Partial<UpdateUserAdminDto> {
    const update: Partial<UpdateUserAdminDto> = {};

    if (typeof dto.name === 'string') update.name = dto.name;
    if (typeof dto.phone === 'string' || dto.phone === null) update.phone = dto.phone;
    if (typeof dto.avatarUrl === 'string' || dto.avatarUrl === null) {
      update.avatarUrl = dto.avatarUrl;
    }

    if (options.allowRoleAndStatus) {
      if (typeof dto.role === 'string') update.role = dto.role;
      if (typeof dto.status === 'string') update.status = dto.status;
    }

    return update;
  }

  private async setTenantContext(tenantId: string): Promise<void> {
    await this.db.execute(
      sql`SELECT set_config('app.tenant_id', ${tenantId}, false)`,
    );
  }
}

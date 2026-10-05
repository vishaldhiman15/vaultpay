import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { hashPassword, verifyPassword, generateToken } from '../utils/crypto.js';
import { AuditLog } from '../models/AuditLog.model.js';

export const register = async (req: Request, res: Response) => {
  const { email, phone, password, role, firstName, lastName } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { 
        email, 
        phone: phone || '', 
        passwordHash: hashedPassword, 
        role: role || 'CUSTOMER',
        firstName: firstName || 'User',
        lastName: lastName || ''
      }
    });

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const vpaStr = `${(firstName || 'user').trim().toLowerCase().replace(/\s+/g, '')}${randomSuffix}@vaultpay`;
    
    // Create default account and VPA for the new user
    await prisma.account.create({
      data: {
        userId: user.id,
        accountNumber: Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString(),
        accountType: 'CHECKING',
        currentBalance: 150000.00, // Demo starting balance
        availBalance: 150000.00,
        currency: 'INR',
        status: 'ACTIVE'
      }
    });

    await prisma.userVpa.create({
      data: {
        userId: user.id,
        vpa: vpaStr
      }
    });
    
    await AuditLog.create({ action: 'USER_REGISTERED', userId: user.id, details: { email } }).catch(() => {});
    
    res.status(201).json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email or phone number is already registered' });
    }
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = generateToken({ id: user.id, role: user.role });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    
    await AuditLog.create({ action: 'USER_LOGIN', userId: user.id, details: { ip: req.ip } }).catch(() => {});
    
    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        kycStatus: true,
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Fetch VPA
    const userVpa = await prisma.userVpa.findFirst({ where: { userId: user.id } });
    
    // Convert to frontend User format
    const frontendUser = {
      id: user.id,
      name: `${user.firstName.trim()} ${user.lastName.trim()}`.trim(),
      email: user.email,
      vpa: userVpa?.vpa || `${user.firstName.trim().toLowerCase()}@vaultpay`
    };
    
    res.json({ user: frontendUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

import { Router } from 'express';
import { getAmlReport, uploadKycDocument, getAuditLogs, getAmlAlerts } from '../controllers/compliance.controller.js';
import { authenticate } from '../middleware/auth.js';
import { uploadToCloudinary } from '../lib/cloudinary.js';

const router = Router();

router.use(authenticate);

router.get('/aml-report', getAmlReport);
router.post('/kyc/upload', uploadToCloudinary.single('document'), uploadKycDocument);

// Added for frontend UI Dashboard integration
router.get('/audit-logs', getAuditLogs);
router.get('/alerts', getAmlAlerts);

export default router;

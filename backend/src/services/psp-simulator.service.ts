import crypto from 'crypto';

export class PspSimulatorService {
  static async simulatePayment(transactionId: string, amount: number, vpa: string) {
    const successRate = parseFloat(process.env.PSP_SUCCESS_RATE || '0.9');
    const minDelay = parseInt(process.env.PSP_MIN_DELAY_MS || '3000', 10);
    const maxDelay = parseInt(process.env.PSP_MAX_DELAY_MS || '8000', 10);
    
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    
    setTimeout(async () => {
      const isSuccess = Math.random() < successRate;
      const status = isSuccess ? 'COMPLETED' : 'FAILED';
      const rrn = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
      
      const payload = JSON.stringify({
        transactionId,
        amount,
        vpa,
        status,
        npciTxnId: `NPCI${Date.now()}`,
        bankRrn: rrn
      });
      
      const secret = process.env.PSP_WEBHOOK_SECRET || 'secret';
      const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
      
      try {
        await fetch(`http://localhost:${process.env.PORT || 5000}/api/webhooks/upi`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Signature': signature
          },
          body: payload
        });
      } catch (error) {
        console.error('PSP Simulator Webhook Error:', error);
      }
    }, delay);
  }
}

import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/utils/logger';

export async function reviewWithdrawal(params: {
  withdrawalId: number;
  adminId: number;
  action: 'approve' | 'reject';
  reviewNote?: string;
}) {
  const { withdrawalId, adminId, action, reviewNote } = params;
  logger.info('withdrawal.review.started', { withdrawalId, adminId, action });

  return prisma.$transaction(async (tx) => {
    const withdrawal = await tx.withdrawalRequest.findUnique({
      where: { id: withdrawalId },
      include: {
        vendor: {
          select: { id: true, walletBalance: true },
        },
      },
    });

    if (!withdrawal) {
      logger.warn('withdrawal.review.not_found', { withdrawalId, adminId });
      throw new Error('Withdrawal request not found');
    }

    if (withdrawal.status !== 'PENDING') {
      logger.warn('withdrawal.review.already_reviewed', {
        withdrawalId,
        adminId,
        currentStatus: withdrawal.status,
      });
      throw new Error('Withdrawal request already reviewed');
    }

    if (action === 'approve') {
      if (Number(withdrawal.vendor.walletBalance) < Number(withdrawal.amount)) {
        logger.warn('withdrawal.review.insufficient_vendor_balance', {
          withdrawalId,
          adminId,
          vendorId: withdrawal.vendorId,
          walletBalance: Number(withdrawal.vendor.walletBalance),
          amount: Number(withdrawal.amount),
        });
        throw new Error('Vendor has insufficient wallet balance to approve withdrawal');
      }

      await tx.user.update({
        where: { id: withdrawal.vendorId },
        data: {
          walletBalance: {
            decrement: Number(withdrawal.amount),
          },
        },
      });

      await tx.transaction.create({
        data: {
          userId: withdrawal.vendorId,
          requestId: null,
          amount: Number(withdrawal.amount),
          type: 'WITHDRAWAL',
          description: `Approved withdrawal #${withdrawal.id}`,
        },
      });
    }

    const updated = await tx.withdrawalRequest.update({
      where: { id: withdrawalId },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        reviewNote: reviewNote || null,
        reviewedById: adminId,
        reviewedAt: new Date(),
      },
    });

    await tx.notification.create({
      data: {
        userId: withdrawal.vendorId,
        type: action === 'approve' ? 'WITHDRAWAL_APPROVED' : 'WITHDRAWAL_REJECTED',
        title: action === 'approve' ? 'Withdrawal Approved' : 'Withdrawal Rejected',
        message:
          action === 'approve'
            ? `Withdrawal request #${withdrawal.id} was approved.`
            : `Withdrawal request #${withdrawal.id} was rejected.`,
      },
    });

    logger.info('notification.created', {
      event: `withdrawal.${action === 'approve' ? 'approved' : 'rejected'}`,
      withdrawalId,
      userId: withdrawal.vendorId,
      role: 'VENDOR',
    });

    logger.info('withdrawal.review.completed', {
      withdrawalId,
      adminId,
      status: updated.status,
      vendorId: withdrawal.vendorId,
    });

    return updated;
  });
}

import { Router, Request, Response } from 'express';
import { getSessionUser } from '../../lib/auth/session';
import { submitAssessmentUseCase } from '../../lib/application/submit-assessment.usecase';
import { assessmentRepository } from '../../lib/repositories/assessment.repository';

export const assessmentRouter = Router();

/**
 * POST /api/assessment/submit
 * Obtains authenticated user from session.
 * If genuinely not authenticated, returns:
 * "برای تحلیل باید وارد حساب خودتون بشید"
 */
assessmentRouter.post('/submit', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'برای تحلیل باید وارد حساب خودتون بشید',
      });
    }

    const { answers } = req.body;
    const result = await submitAssessmentUseCase(currentUser.id, answers || {});

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Assessment submit route error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در پردازش ارزیابی.',
    });
  }
});

/**
 * GET /api/assessment/latest
 * Retrieves persistent assessment result and growth profile for authenticated user
 */
assessmentRouter.get('/latest', async (req: Request, res: Response) => {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'برای تحلیل باید وارد حساب خودتون بشید',
      });
    }

    const record = await assessmentRepository.findByUserId(currentUser.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        authenticated: true,
        record: null,
      });
    }

    return res.status(200).json({
      success: true,
      authenticated: true,
      record,
      growthProfile: {
        discipline: record.disciplineScore,
        focus: record.focusScore,
        confidence: record.confidenceScore,
        recommendedPath: record.recommendedPath,
      },
    });
  } catch (error) {
    console.error('Get latest assessment error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطای سرور در دریافت نتایج ارزیابی.',
    });
  }
});

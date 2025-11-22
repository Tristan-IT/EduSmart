import { Router } from 'express';
import {
  bulkCreateNodes,
  bulkUpdateNodes,
  bulkDeleteNodes,
  cloneNode,
  bulkAssignQuizzes,
  bulkReorderNodes,
  importNodesFromTemplate,
} from '../services/bulkOperationsService.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// All routes require authentication and teacher role
const requireTeacher = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'teacher' && req.user?.role !== 'school_owner') {
    return res.status(403).json({
      success: false,
      message: 'Only teachers can perform bulk operations'
    });
  }
  next();
};

router.use(authenticate);
router.use(requireTeacher);

// Bulk operations
router.post('/create', bulkCreateNodes);
router.patch('/update', bulkUpdateNodes);
router.delete('/delete', bulkDeleteNodes);
router.post('/clone', cloneNode);
router.post('/assign-quizzes', bulkAssignQuizzes);
router.patch('/reorder', bulkReorderNodes);
router.post('/import', importNodesFromTemplate);

export default router;

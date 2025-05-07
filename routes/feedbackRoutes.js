import express from 'express';
import upload from "../middlewares/upload.js";
import { createFeedback, getAllFeedbacks, commentOnFeedback, deleteFeedback, getFeedbackById } from '../controllers/feedbackController.js';
import { verifyUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add', upload.single("image"), createFeedback); // user creates feedback
router.get('/', verifyUser, getAllFeedbacks); // admin fetches all feedback
router.put('/:id/comment', commentOnFeedback); // admin comments
router.delete('/:id', verifyUser, deleteFeedback); // 👈 admin deletes feedback
router.get('/:id', verifyUser, getFeedbackById); // Admin can view individual feedback

export default router;


// const getEmployee = async (req, res) => {
//     const {id} = req.params;
//     try {
//         let employee;
//         employee = await Employee.findById({_id: id}).populate('userId', {password: 0}).populate('department')
//         if (!employee) {
//            employee = await Employee.findOne({userId: id}).populate('userId', {password: 0}).populate('department')
//             // return res.status(200).json({ success: true, employee: null, message: "Employee not found" });
//         }
//         return res.status(200).json({success: true, employee})
//     } catch (error) {
//         return res.status(500).json({success: false, error: "get employee server error"})
//     } 
// }
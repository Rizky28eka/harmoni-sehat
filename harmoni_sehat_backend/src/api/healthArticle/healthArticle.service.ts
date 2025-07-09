import HealthArticle, { IHealthArticle } from '../../models/HealthArticle';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateHealthArticleInput, UpdateHealthArticleInput } from './healthArticle.validation';
import Admin from '../../models/Admin';
import Doctor from '../../models/Doctor';

class HealthArticleService {
  async createHealthArticle(userId: string, articleData: CreateHealthArticleInput): Promise<IHealthArticle> {
    // Check if author_id matches the logged-in user's admin/doctor profile
    let authorProfile;
    if (articleData.author_type === 'Admin') {
      authorProfile = await Admin.findOne({ user_id: userId });
    } else if (articleData.author_type === 'Doctor') {
      authorProfile = await Doctor.findOne({ user_id: userId });
    }

    if (!authorProfile || authorProfile._id.toString() !== articleData.author_id) {
      throw new AppError('Unauthorized to create article for this author ID', 403);
    }

    const existingArticle = await HealthArticle.findOne({ slug: articleData.slug });
    if (existingArticle) {
      throw new AppError('Article with this slug already exists', 409);
    }

    const newArticle = await HealthArticle.create(articleData);
    return newArticle;
  }

  async getAllHealthArticles(): Promise<IHealthArticle[]> {
    return HealthArticle.find().populate('author_id');
  }

  async getHealthArticleById(articleId: string): Promise<IHealthArticle | null> {
    if (!Types.ObjectId.isValid(articleId)) {
      throw new AppError('Invalid Health Article ID', 400);
    }
    const article = await HealthArticle.findById(articleId).populate('author_id');
    if (!article) {
      throw new AppError('Health Article not found', 404);
    }
    return article;
  }

  async updateHealthArticle(userId: string, articleId: string, articleData: UpdateHealthArticleInput): Promise<IHealthArticle | null> {
    if (!Types.ObjectId.isValid(articleId)) {
      throw new AppError('Invalid Health Article ID', 400);
    }

    const existingArticle = await HealthArticle.findById(articleId);
    if (!existingArticle) {
      throw new AppError('Health Article not found', 404);
    }

    // Ownership authorization: Only the author or admin can update
    let authorProfile;
    if (existingArticle.author_type === 'Admin') {
      authorProfile = await Admin.findOne({ user_id: userId });
    } else if (existingArticle.author_type === 'Doctor') {
      authorProfile = await Doctor.findOne({ user_id: userId });
    }

    if (!authorProfile || authorProfile._id.toString() !== existingArticle.author_id.toString()) {
      throw new AppError('You are not authorized to update this article.', 403);
    }

    const updatedArticle = await HealthArticle.findByIdAndUpdate(articleId, articleData, { new: true, runValidators: true });
    if (!updatedArticle) {
      throw new AppError('Health Article not found', 404);
    }
    return updatedArticle;
  }

  async deleteHealthArticle(userId: string, articleId: string): Promise<void> {
    if (!Types.ObjectId.isValid(articleId)) {
      throw new AppError('Invalid Health Article ID', 400);
    }

    const existingArticle = await HealthArticle.findById(articleId);
    if (!existingArticle) {
      throw new AppError('Health Article not found', 404);
    }

    // Ownership authorization: Only the author or admin can delete
    let authorProfile;
    if (existingArticle.author_type === 'Admin') {
      authorProfile = await Admin.findOne({ user_id: userId });
    } else if (existingArticle.author_type === 'Doctor') {
      authorProfile = await Doctor.findOne({ user_id: userId });
    }

    if (!authorProfile || authorProfile._id.toString() !== existingArticle.author_id.toString()) {
      throw new AppError('You are not authorized to delete this article.', 403);
    }

    const article = await HealthArticle.findByIdAndDelete(articleId);
    if (!article) {
      throw new AppError('Health Article not found', 404);
    }
  }
}

export default new HealthArticleService();
